import { GoogleGenAI, Type } from "@google/genai";
import type {
  Scores,
  TeamState,
  HistoryEntry,
  OutcomeCode,
  Dim,
  Scenario,
  ChatMessage,
  Character,
  TurnScientificEvaluation,
  DomainType,
} from "../types.ts";
import { type ScenarioSeed, getScenarioByIndex, SEEDS } from "./seeds.ts";
import {
  EVALUATOR_SYSTEM,
  evaluatorUserPrompt,
  NARRATOR_SYSTEM,
  SCENARIO_GENERATOR_SYSTEM,
  scenarioGeneratorUserPrompt,
  fallbackEval,
  fallbackNarrative,
} from "./prompts.ts";
import { extractTaggedActors } from "./engine.ts";
import { calculateScientificTurnEvaluation } from "./scientificScoring.ts";

/**
 * Model candidates cascade.
 * Primary model: gemini-flash-latest, cascading to gemini-3.1-flash-lite, etc.
 */
export const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
] as const;

export type SupportedModel = (typeof MODEL_CANDIDATES)[number];

let activeModelName: string = MODEL_CANDIDATES[0];
let lastModelUsed: string = MODEL_CANDIDATES[0];
let fallbackModelUsedThisSession = false;

export function getModelStatus() {
  return {
    primary_model: MODEL_CANDIDATES[0],
    active_model: activeModelName,
    last_used_model: lastModelUsed,
    candidate_models: [...MODEL_CANDIDATES],
    fallback_model_used: fallbackModelUsedThisSession,
  };
}

const API_TIMEOUT_MS = 15000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

function extractJson(text: string): any {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in LLM response");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * Executes a Gemini request with automatic multi-model failover.
 * Tries MODEL_CANDIDATES in priority order. If a model encounters 429 quota exhaustion,
 * timeout, or API error, seamlessly switches to the next candidate preserving full context.
 */
async function callWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  config: any,
  operationName: string
): Promise<{ text: string | undefined; modelUsed: string; isFallback: boolean }> {
  let lastErr: any = null;

  for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
    const candidate = MODEL_CANDIDATES[i];
    const isFallback = i > 0;

    try {
      console.log(
        `[Leadr] Invoking ${operationName} with model: ${candidate}${
          isFallback ? " (Automatic Fallback Activated)" : ""
        }`
      );

      const callPromise = ai.models.generateContent({
        model: candidate,
        contents: prompt,
        config,
      });

      const response = await withTimeout(callPromise, API_TIMEOUT_MS, `${operationName} [${candidate}]`);

      lastModelUsed = candidate;
      activeModelName = candidate;
      if (isFallback) {
        fallbackModelUsedThisSession = true;
      }

      return {
        text: response.text,
        modelUsed: candidate,
        isFallback,
      };
    } catch (err: any) {
      lastErr = err;
      console.warn(
        `[Leadr] Candidate ${candidate} encountered issue (${err?.message || err}). Failing over to next model...`
      );
    }
  }

  throw lastErr || new Error("All Gemini candidate models in cascade failed");
}

export interface GeneratedEval {
  scores: Scores;
  rationale: Record<Dim, string>;
  team_reactions: ChatMessage[];
  fallback_used: boolean;
  active_model?: string;
  fallback_model_used?: boolean;
  tagged_actors?: string[];
  scientific_eval: TurnScientificEvaluation;
}

export async function evaluatePlayerResponse(
  seed: ScenarioSeed,
  transcript: ChatMessage[],
  state: TeamState,
  message: string
): Promise<GeneratedEval> {
  const tagged_actors = extractTaggedActors(message, state.characters);
  const scenarioId = `SCN_${seed.archetypeCode || "01"}_${seed.domain.toUpperCase()}`;
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = fallbackEval(message, state.characters, seed.domain, { morale: state.morale, trust: state.trust });
    const scientific_eval = calculateScientificTurnEvaluation(scenarioId, message);
    return {
      ...fallback,
      fallback_used: true,
      active_model: "heuristic_mock",
      fallback_model_used: false,
      tagged_actors,
      scientific_eval,
    };
  }

  try {
    const prompt = evaluatorUserPrompt(seed, transcript, state, message);
    const config = {
      systemInstruction: EVALUATOR_SYSTEM,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              komunikasi: { type: Type.INTEGER, description: "1-10" },
              empati: { type: Type.INTEGER, description: "1-10" },
              ketegasan: { type: Type.INTEGER, description: "1-10" },
              krisis: { type: Type.INTEGER, description: "1-10" },
            },
            required: ["komunikasi", "empati", "ketegasan", "krisis"],
          },
          rationale: {
            type: Type.OBJECT,
            properties: {
              komunikasi: { type: Type.STRING },
              empati: { type: Type.STRING },
              ketegasan: { type: Type.STRING },
              krisis: { type: Type.STRING },
            },
            required: ["komunikasi", "empati", "ketegasan", "krisis"],
          },
          team_reactions: {
            type: Type.ARRAY,
            description: "2-3 natural team member replies in chat conversing with leader and each other",
            items: {
              type: Type.OBJECT,
              properties: {
                sender: { type: Type.STRING },
                role: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ["sender", "text"],
            },
          },
          extracted_features: {
            type: Type.ARRAY,
            description: "Walsh et al. (2025) binary behavioral feature indicators detected in leader response",
            items: {
              type: Type.OBJECT,
              properties: {
                indicator_id: { type: Type.STRING },
                present: { type: Type.BOOLEAN },
                evidence: { type: Type.STRING, nullable: true },
              },
              required: ["indicator_id", "present"],
            },
          },
        },
        required: ["scores", "rationale", "team_reactions"],
      },
    };

    const { text, modelUsed, isFallback } = await callWithModelFallback(
      ai,
      prompt,
      config,
      "Gemini evaluation"
    );

    const parsed = text ? extractJson(text) : null;
    if (!parsed || !parsed.scores) {
      throw new Error("Invalid output format from Gemini");
    }

    const scores: Scores = {
      komunikasi: Math.max(1, Math.min(10, Math.round(Number(parsed.scores.komunikasi) || 5))),
      empati: Math.max(1, Math.min(10, Math.round(Number(parsed.scores.empati) || 5))),
      ketegasan: Math.max(1, Math.min(10, Math.round(Number(parsed.scores.ketegasan) || 5))),
      krisis: Math.max(1, Math.min(10, Math.round(Number(parsed.scores.krisis) || 5))),
    };

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const team_reactions: ChatMessage[] = Array.isArray(parsed.team_reactions)
      ? parsed.team_reactions.map((r: any) => ({
          sender: String(r.sender || "Anggota Tim"),
          role: String(r.role || ""),
          text: String(r.text || ""),
          timestamp: now,
          taggedActors: tagged_actors,
        }))
      : [];

    const scientific_eval = calculateScientificTurnEvaluation(
      scenarioId,
      message,
      Array.isArray(parsed.extracted_features) ? parsed.extracted_features : undefined
    );

    return {
      scores,
      rationale: parsed.rationale || {},
      team_reactions,
      fallback_used: false,
      active_model: modelUsed,
      fallback_model_used: isFallback,
      tagged_actors,
      scientific_eval,
    };
  } catch (err: any) {
    console.warn("[Leadr] All Gemini models failed, falling back to heuristic:", err?.message || err);
    const fallback = fallbackEval(message, state.characters, seed.domain, { morale: state.morale, trust: state.trust });
    const scientific_eval = calculateScientificTurnEvaluation(scenarioId, message);
    return {
      ...fallback,
      fallback_used: true,
      active_model: "heuristic_mock",
      fallback_model_used: false,
      tagged_actors,
      scientific_eval,
    };
  }
}

export async function generateOutcomeNarrative(
  code: OutcomeCode,
  title: string,
  state: TeamState,
  history: HistoryEntry[],
  avg: Record<Dim, number>,
  weakest: Dim,
  domain: any = "tech_startup"
): Promise<{ narrative: string; recommendations: string[]; modelUsed?: string }> {
  const fallback = fallbackNarrative(code, weakest, domain);
  const ai = getGeminiClient();
  if (!ai) {
    return fallback;
  }

  try {
    const prompt = `Outcome: ${code} - ${title}
State Akhir: Morale ${state.morale}%, Trust ${state.trust}%, Progress ${state.progress}%
Rata-rata Skor: Komunikasi ${avg.komunikasi}, Empati ${avg.empati}, Ketegasan ${avg.ketegasan}, Krisis ${avg.krisis}
Dimensi Terlemah: ${weakest}
Total Putaran Keputusan: ${history.length} kali.
Tulis narasi reflektif 2 paragraf dan 3 rekomendasi aksi nyata.`;

    const config = {
      systemInstruction: NARRATOR_SYSTEM,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["narrative", "recommendations"],
      },
    };

    const { text, modelUsed } = await callWithModelFallback(
      ai,
      prompt,
      config,
      "Gemini narrator"
    );

    const parsed = text ? extractJson(text) : null;
    if (parsed && parsed.narrative && Array.isArray(parsed.recommendations)) {
      return {
        narrative: parsed.narrative,
        recommendations: parsed.recommendations.slice(0, 3),
        modelUsed,
      };
    }
  } catch (err: any) {
    console.warn("[Leadr] Narrator fell back to template:", err?.message || err);
  }

  return fallback;
}


export async function generateDynamicScenario(
  domain: DomainType,
  scenarioIndex: number,
  state: TeamState,
  history: HistoryEntry[],
  characters: Character[]
): Promise<Scenario | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const prompt = scenarioGeneratorUserPrompt(domain, scenarioIndex, state, history, characters);
    const config = {
      systemInstruction: SCENARIO_GENERATOR_SYSTEM,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          archetype: { type: Type.STRING },
          archetypeCode: { type: Type.STRING },
          dilemmaSummary: { type: Type.STRING },
          timeRemaining: { type: Type.STRING },
          urgency: { type: Type.STRING },
          context: { type: Type.STRING },
          messages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sender: { type: Type.STRING },
                role: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ["sender", "text"],
            },
          },
          characterVariations: {
            type: Type.OBJECT,
            description: "Optional character condition updates",
          },
        },
        required: ["title", "dilemmaSummary", "timeRemaining", "urgency", "context", "messages"],
      },
    };

    const { text } = await callWithModelFallback(
      ai,
      prompt,
      config,
      "Gemini dynamic scenario generation"
    );

    if (!text) return null;
    const parsed = extractJson(text);
    if (!parsed || !parsed.title || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return null;
    }

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const formattedMessages: ChatMessage[] = parsed.messages.map((m: any) => ({
      sender: String(m.sender || "Rekan Tim"),
      role: m.role ? String(m.role) : undefined,
      text: String(m.text || ""),
      timestamp: now,
    }));

    const evolvedCharacters = characters.map((c) => {
      const variation = parsed.characterVariations?.[c.name];
      if (variation) {
        return {
          ...c,
          personality: variation.personality || c.personality,
          mood: variation.mood || c.mood,
          fitness: {
            ...c.fitness,
            condition: variation.condition || c.fitness.condition,
            stamina: variation.staminaDelta !== undefined
              ? Math.max(0, Math.min(100, c.fitness.stamina + variation.staminaDelta))
              : c.fitness.stamina,
          },
        };
      }
      return { ...c };
    });

    const urgencyVal: "Kritis" | "Tinggi" | "Sedang" =
      parsed.urgency === "Kritis" || parsed.urgency === "Sedang" ? parsed.urgency : "Tinggi";

    return {
      index: scenarioIndex,
      domain,
      title: String(parsed.title),
      archetype: parsed.archetype ? String(parsed.archetype) : "Dinamika Operasional & Tekanan Target",
      archetypeCode: parsed.archetypeCode ? String(parsed.archetypeCode) : `FM-DYN-${scenarioIndex}`,
      dilemmaSummary: String(parsed.dilemmaSummary),
      timeRemaining: String(parsed.timeRemaining),
      context: String(parsed.context),
      urgency: urgencyVal,
      messages: formattedMessages,
      characters: evolvedCharacters,
    };
  } catch (err: any) {
    console.warn(`[Leadr] Dynamic scenario generation skipped (${err?.message || err}). Menggunakan seed alur.`);
    return null;
  }
}