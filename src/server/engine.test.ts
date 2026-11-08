import test from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  deltaFormula,
  calculateDeltas,
  applyScores,
  decideOutcome,
  averageScores,
  weakestDimension,
  calculateFinalScore,
  extractTaggedActors,
  updateCharacterStates,
} from "./engine.js";
import { getRandomDomain, getScenarioByIndex, DOMAIN_CHARACTERS } from "./seeds.js";
import { TeamState, Scores, Character, ProjectMilestone } from "../types.js";

const sampleCharacters: Character[] = [
  {
    name: "Rani",
    role: "Desain UI/UX",
    jobdesk: "Slicing Figma, Pitch Deck",
    personality: "Introvert, perfectionist, sungkan menolak tugas",
    fitness: { sleepHours: 3, stamina: 35, condition: "Tidur 3 jam, mata sembab" },
    morale: 40,
    mood: "Kelelahan",
  },
  {
    name: "Sekar",
    role: "Humas & Presentasi",
    jobdesk: "Materi Promosi & Q&A Juri",
    personality: "Ekstrovert, perfeksionis, mudah panik jika ada delay",
    fitness: { sleepHours: 6, stamina: 70, condition: "Cemas menjelang demo" },
    morale: 60,
    mood: "Cemas",
  },
];

const sampleMilestones: ProjectMilestone[] = [
  {
    id: "m1",
    name: "UI / UX Onboarding & Dashboard",
    weight: 25,
    progress: 80,
    status: "in_progress",
    assignedTo: "Rani",
    detail: "Tampilan utama prototype",
  },
  {
    id: "m2",
    name: "Modul Pembayaran & API",
    weight: 35,
    progress: 25,
    status: "blocked",
    assignedTo: "Dimas",
    detail: "Stuck karena developer tidak ada kabar",
  },
];

test("calculateDeltas applies +50% BUFF when Morale >= 75 and Trust >= 75", () => {
  const buffState: TeamState = {
    morale: 80,
    trust: 80,
    progress: 50,
    characters: sampleCharacters,
    milestones: sampleMilestones,
  };
  const scores: Scores = { komunikasi: 8, empati: 8, ketegasan: 8, krisis: 8 };
  const deltas = calculateDeltas(buffState, scores);

  assert.equal(deltas.buffApplied, true);
  assert.equal(deltas.debuffApplied, false);
  // Base delta for (8, 8): ((8-5)*2) + 8 = 6 + 8 = 14. With 1.5x buff: 14 * 1.5 = 21
  assert.equal(deltas.dProgress, 21);
});

test("calculateDeltas applies -50% DEBUFF when Morale < 40", () => {
  const debuffState: TeamState = {
    morale: 30,
    trust: 50,
    progress: 40,
    characters: sampleCharacters,
    milestones: sampleMilestones,
  };
  const scores: Scores = { komunikasi: 7, empati: 7, ketegasan: 7, krisis: 7 };
  const deltas = calculateDeltas(debuffState, scores);

  assert.equal(deltas.buffApplied, false);
  assert.equal(deltas.debuffApplied, true);
  // Base delta: ((7-5)*2) + 8 = 4 + 8 = 12. With 0.5x debuff: 12 * 0.5 = 6
  assert.equal(deltas.dProgress, 6);
});

test("applyScores triggers VICTORY_100 when progress reaches 100", () => {
  const state: TeamState = {
    morale: 80,
    trust: 80,
    progress: 90,
    characters: sampleCharacters,
    milestones: sampleMilestones,
  };
  const highScores: Scores = { komunikasi: 9, empati: 9, ketegasan: 9, krisis: 9 };
  const { newState, isGameOver, outcomeCode } = applyScores(state, highScores);

  assert.equal(newState.progress, 100);
  assert.equal(isGameOver, true);
  assert.equal(outcomeCode, "VICTORY_100");
});

test("applyScores triggers COLLAPSE_MORALE_0 when morale drops to 0", () => {
  const state: TeamState = {
    morale: 5,
    trust: 30,
    progress: 40,
    characters: sampleCharacters,
    milestones: sampleMilestones,
  };
  const toxicScores: Scores = { komunikasi: 1, empati: 1, ketegasan: 1, krisis: 1 };
  const { newState, isGameOver, outcomeCode } = applyScores(state, toxicScores);

  assert.equal(newState.morale, 0);
  assert.equal(isGameOver, true);
  assert.equal(outcomeCode, "COLLAPSE_MORALE_0");
});

test("calculateFinalScore properly computes composite score and rank tier", () => {
  const victoryState: TeamState = {
    morale: 90,
    trust: 90,
    progress: 100,
    characters: sampleCharacters,
    milestones: sampleMilestones,
  };
  const history = [
    {
      scenario_index: 1,
      scenario_title: "Skenario 1",
      player_message: "Mari kita bagi tugas dengan jelas",
      scores: { komunikasi: 9, empati: 9, ketegasan: 9, krisis: 9 },
      avgScore: 9,
      rationale: {},
      state_after: victoryState,
      timestamp: "10:00",
    },
  ];
  const finalScore = calculateFinalScore(victoryState, history, "tech_startup");
  assert.equal(finalScore.rankTier, "S");
  assert.ok(finalScore.overallScore >= 90);
  assert.equal(finalScore.scenarioScores.length, 1);
});

test("getRandomDomain returns valid domains and getScenarioByIndex evolves actor personalities", () => {
  const d = getRandomDomain();
  assert.ok(["tech_startup", "campus_org", "corporate_agency", "social_drama"].includes(d));

  // Test that scenario 2 has evolved personality compared to scenario 1
  const baseChars = DOMAIN_CHARACTERS.tech_startup;
  const s1 = getScenarioByIndex(1, baseChars, "tech_startup");
  const s2 = getScenarioByIndex(2, baseChars, "tech_startup");

  const raniS1 = s1.characters.find((c: any) => c.name === "Rani");
  const raniS2 = s2.characters.find((c: any) => c.name === "Rani");

  assert.ok(raniS1 && raniS2);
  assert.notEqual(raniS1.personality, raniS2.personality);
  assert.notEqual(raniS1.mood, raniS2.mood);
});

test("extractTaggedActors correctly identifies @mentions of actors", () => {
  const msg = "@Rani kamu istirahat dulu, @Sekar tolong koordinasi sama panitia";
  const tagged = extractTaggedActors(msg, sampleCharacters);
  assert.deepEqual(tagged, ["Rani", "Sekar"]);

  // Test updateCharacterStates gives tagged actor condition message
  const updated = updateCharacterStates(sampleCharacters, { komunikasi: 8, empati: 8, ketegasan: 7, krisis: 7 }, 5, 5, msg);
  const rani = updated.find((c: any) => c.name === "Rani");
  assert.ok(rani?.fitness.condition.includes("Di-tag secara khusus oleh ketua"));
});

test("getScenarioByIndex populates Football Manager archetypes and dilemmas", () => {
  const baseChars = DOMAIN_CHARACTERS.tech_startup;
  const s1 = getScenarioByIndex(1, baseChars, "tech_startup");
  assert.equal(s1.archetypeCode, "FM-06");
  assert.equal(s1.archetype, "The Social Loafer / Free Rider");
  assert.ok(s1.dilemmaSummary && s1.dilemmaSummary.length > 20);

  const corpChars = DOMAIN_CHARACTERS.corporate_agency;
  const s4Corp = getScenarioByIndex(4, corpChars, "corporate_agency");
  assert.equal(s4Corp.archetypeCode, "FM-01");
  assert.equal(s4Corp.archetype, "The Prima Donna Outlier");
  assert.ok(s4Corp.dilemmaSummary && s4Corp.dilemmaSummary.length > 20);
});

test("social_drama scenarios maintain strict narrative continuity for the 15 million fund", () => {
  const socialChars = DOMAIN_CHARACTERS.social_drama;
  const s1 = getScenarioByIndex(1, socialChars, "social_drama");
  const s2 = getScenarioByIndex(2, socialChars, "social_drama");
  const s3 = getScenarioByIndex(3, socialChars, "social_drama");

  // Verify that Skenario 1, 2, and 3 consistently refer to department advance fund
  assert.ok(s1.context.toLowerCase().includes("departemen"));
  assert.ok(s2.context.toLowerCase().includes("departemen"));
  assert.ok(s2.messages[0].text.toLowerCase().includes("departemen"));
  assert.ok(s3.context.toLowerCase().includes("departemen"));

  // Ensure contradictory excuse (e.g. ibunya sakit / UKT pribadi) does not appear in scenario 2
  assert.equal(s2.context.toLowerCase().includes("ibunya sakit"), false);
  assert.equal(s2.messages[0].text.toLowerCase().includes("ibuku kemarin harus operasi"), false);
});



