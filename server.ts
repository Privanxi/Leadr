import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import {
  createSession,
  getSession,
  recordHistory,
  getHistory,
  clearHistory,
} from "./src/server/store.ts";
import {
  getScenarioByIndex,
  DOMAINS,
  DOMAIN_SEEDS,
  getRandomDomain,
} from "./src/server/seeds.ts";
import {
  applyScores,
  decideOutcome,
  averageScores,
  weakestDimension,
  calculateFinalScore,
  OUTCOME_TITLES,
} from "./src/server/engine.ts";
import { aggregateScientificReport } from "./src/server/scientificScoring.ts";
import {
  evaluatePlayerResponse,
  generateOutcomeNarrative,
  getModelStatus,
} from "./src/server/gemini.ts";
import type {
  StartResponse,
  RespondResponse,
  NextResponse,
  ResultResponse,
  DomainType,
  SimulationHistoryRecord,
} from "./src/types.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    const status = getModelStatus();
    res.json({
      ok: true,
      service: "Leadr API",
      gemini_configured: hasKey,
      mode: hasKey ? "gemini" : "heuristic_mock",
      primary_model: status.primary_model,
      active_model: status.active_model,
      candidate_models: status.candidate_models,
      fallback_triggered: status.fallback_model_used,
    });
  });

  // Get available domain tracks
  app.get("/api/domains", (_req: Request, res: Response) => {
    res.json({ domains: DOMAINS });
  });

  // Start new simulation session with randomized or selected domain
  app.post("/api/session/start", async (req: Request, res: Response) => {
    try {
      const requestedDomain = req.body?.domain;
      const validDomain: DomainType =
        requestedDomain &&
        requestedDomain !== "random" &&
        ["tech_startup", "campus_org", "corporate_agency", "social_drama"].includes(requestedDomain)
          ? (requestedDomain as DomainType)
          : getRandomDomain();

      const session = createSession(validDomain);
      session.scenario_index = 1;

      session.current = getScenarioByIndex(1, session.state.characters, session.domain);
      session.state.characters = session.current.characters.map((c) => ({ ...c }));
      session.transcript = session.current.messages.map((m) => ({ ...m }));

      const status = getModelStatus();
      const response: StartResponse = {
        session_id: session.id,
        domain: session.domain,
        scenario: session.current,
        state: session.state,
        userDossier: session.userDossier,
        mode: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" ? "gemini" : "mock",
        active_model: status.active_model,
      };
      res.json(response);
    } catch (err: any) {
      console.error("Error starting session:", err);
      res.status(500).json({ error: "Gagal memulai sesi simulasi" });
    }
  });

  // Respond in current crisis scenario
  app.post("/api/session/:id/respond", async (req: Request, res: Response) => {
    const { id } = req.params;
    const session = getSession(id);
    if (!session) {
      res.status(404).json({ detail: "Sesi tidak ditemukan atau sudah berakhir" });
      return;
    }

    const message = (req.body?.message || "").trim();
    if (!message) {
      res.status(422).json({ detail: "Pesan respons tidak boleh kosong" });
      return;
    }

    if (message.length > 1200) {
      res.status(422).json({ detail: "Pesan melebihi batas 1200 karakter" });
      return;
    }

    session.awaiting_response = true;

    try {
      const seeds = DOMAIN_SEEDS[session.domain] || DOMAIN_SEEDS.tech_startup;
      const seedIndex = (session.scenario_index - 1) % seeds.length;
      const seed = seeds[seedIndex];

      const evaluation = await evaluatePlayerResponse(
        seed,
        session.transcript,
        session.state,
        message
      );

      const { newState, delta, isGameOver, outcomeCode } = applyScores(
        session.state,
        evaluation.scores,
        message
      );

      const avgTurnScore = Number(
        (
          (evaluation.scores.komunikasi +
            evaluation.scores.empati +
            evaluation.scores.ketegasan +
            evaluation.scores.krisis) /
          4
        ).toFixed(1)
      );

      session.history.push({
        scenario_index: session.scenario_index,
        scenario_title: session.current?.title || seed.title,
        domain: session.domain,
        player_message: message,
        scores: evaluation.scores,
        avgScore: avgTurnScore,
        rationale: evaluation.rationale,
        state_after: newState,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scientific_eval: evaluation.scientific_eval,
      });

      // Append to active transcript
      session.transcript.push({
        sender: "Kamu",
        role: "Ketua",
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      session.transcript.push(...evaluation.team_reactions);
      session.state = newState;

      const response: RespondResponse = {
        scores: evaluation.scores,
        rationale: evaluation.rationale,
        team_reactions: evaluation.team_reactions,
        state: newState,
        state_delta: delta,
        is_game_over: isGameOver,
        outcome_code: outcomeCode,
        fallback_used: evaluation.fallback_used,
        active_model: evaluation.active_model,
        fallback_model_used: evaluation.fallback_model_used,
        tagged_actors: evaluation.tagged_actors,
        scientific_eval: evaluation.scientific_eval,
      };

      res.json(response);
    } catch (err: any) {
      console.error("Error processing response:", err);
      res.status(502).json({ detail: "Gagal memproses evaluasi respons kepemimpinan" });
    } finally {
      session.awaiting_response = false;
    }
  });

  // Advance to next crisis event
  app.post("/api/session/:id/next", async (req: Request, res: Response) => {
    const { id } = req.params;
    const session = getSession(id);
    if (!session) {
      res.status(404).json({ detail: "Sesi tidak ditemukan atau sudah berakhir" });
      return;
    }

    try {
      session.scenario_index += 1;
      const nextScenario = getScenarioByIndex(
        session.scenario_index,
        session.state.characters,
        session.domain
      );

      session.current = nextScenario;
      session.state.characters = nextScenario.characters.map((c) => ({ ...c }));
      session.transcript = nextScenario.messages.map((m) => ({ ...m }));

      const response: NextResponse = {
        scenario: nextScenario,
        state: session.state,
      };
      res.json(response);
    } catch (err: any) {
      console.error("Error loading next scenario:", err);
      res.status(500).json({ detail: "Gagal memuat skenario berikutnya" });
    }
  });

  // Final Result endpoint with cumulative scoring & history auto-save
  app.get("/api/session/:id/result", async (req: Request, res: Response) => {
    const { id } = req.params;
    const session = getSession(id);
    if (!session) {
      res.status(404).json({ detail: "Sesi tidak ditemukan atau sudah berakhir" });
      return;
    }

    if (session.result) {
      res.json(session.result);
      return;
    }

    try {
      const outcomeCode = decideOutcome(session.state);
      const outcomeTitle = OUTCOME_TITLES[outcomeCode];
      const avg = averageScores(session.history);
      const weakest = weakestDimension(avg);
      const finalScore = calculateFinalScore(session.state, session.history, session.domain);
      const scientificReport = aggregateScientificReport(session.history);

      const debrief = await generateOutcomeNarrative(
        outcomeCode,
        outcomeTitle,
        session.state,
        session.history,
        avg,
        weakest,
        session.domain
      );

      const finalResult: ResultResponse = {
        session_id: session.id,
        domain: session.domain,
        avg_scores: avg,
        outcome_code: outcomeCode,
        outcome_title: outcomeTitle,
        narrative: debrief.narrative,
        recommendations: debrief.recommendations,
        state: session.state,
        history: session.history,
        totalTurns: session.history.length,
        finalScore,
        scientific_report: scientificReport,
      };

      session.result = finalResult;

      // Automatically store to persistent history log
      const domainMeta = DOMAINS.find((d) => d.id === session.domain);
      const historyRecord: SimulationHistoryRecord = {
        id: session.id,
        date: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        domain: session.domain,
        domainTitle: domainMeta?.title || "Simulasi Kepemimpinan",
        outcomeCode,
        outcomeTitle,
        overallScore: finalScore.overallScore,
        rankTier: finalScore.rankTier,
        rankTitle: finalScore.rankTitle,
        totalTurns: session.history.length,
        avgScores: avg,
        finalProgress: session.state.progress,
        finalMorale: session.state.morale,
        finalTrust: session.state.trust,
        history: session.history,
        narrative: debrief.narrative,
        scientific_report: scientificReport,
      };

      recordHistory(historyRecord);

      res.json(finalResult);
    } catch (err: any) {
      console.error("Error calculating results:", err);
      res.status(500).json({ detail: "Gagal menyusun kesimpulan hasil akhir" });
    }
  });

  // Simulation History endpoints
  app.get("/api/history", (_req: Request, res: Response) => {
    res.json({ history: getHistory() });
  });

  app.delete("/api/history", (_req: Request, res: Response) => {
    clearHistory();
    res.json({ ok: true, message: "Riwayat simulasi berhasil dibersihkan" });
  });

  // Mount Vite or serve static
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Leadr] Server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
