import type {
  Scores,
  TeamState,
  StateDelta,
  OutcomeCode,
  Dim,
  Character,
  ProjectMilestone,
  HistoryEntry,
  FinalScoreBreakdown,
  RankTier,
  DomainType,
} from "../types.ts";

export const BASE_PROGRESS_PER_INTERACTION = 8;
export const DIMENSIONS: readonly Dim[] = [
  "komunikasi",
  "empati",
  "ketegasan",
  "krisis",
] as const;

export const OUTCOME_TITLES: Record<OutcomeCode, string> = {
  VICTORY_100: "🏆 Kemenangan Penuh: Target 100% Tercapai & Tim Solid",
  COLLAPSE_MORALE_0: "💔 Krisis Fatal: Moral Tim Mencapai 0% (Mental Breakdown)",
  COLLAPSE_TRUST_0: "🚫 Krisis Fatal: Kepercayaan Mencapai 0% (Tim Mengundurkan Diri)",
  SUCCESS_SOLID: "Target Tercapai, Tim Solid",
  DONE_LOW_MORALE: "Target Selesai, Moral Tim Rendah",
  SURVIVED_DELAYED: "Tim Bertahan, Target Tertunda",
  TEAM_COLLAPSED: "Tim Bubar",
};

export function clamp(x: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(x)));
}

/**
 * Formula: (((a + b) / 2) - 5) * 2
 * Resulting delta approx -8 to +10
 */
export function deltaFormula(a: number, b: number): number {
  return Math.round((((a + b) / 2) - 5) * 2);
}

export function calculateDeltas(
  state: TeamState,
  scores: Scores
): {
  dMorale: number;
  dTrust: number;
  dProgress: number;
  buffApplied: boolean;
  debuffApplied: boolean;
  message?: string;
} {
  let dMorale = deltaFormula(scores.empati, scores.komunikasi);
  let dTrust = deltaFormula(scores.komunikasi, scores.ketegasan);
  let baseProgressDelta = deltaFormula(scores.krisis, scores.ketegasan) + BASE_PROGRESS_PER_INTERACTION;

  // Toxic or neglectful answers penalty
  if (scores.empati <= 2) {
    dMorale -= 10;
  }
  if (scores.ketegasan <= 2 && scores.krisis <= 2) {
    dTrust -= 8;
    baseProgressDelta = Math.min(0, baseProgressDelta - 5);
  }

  // Buff & Debuff rules:
  // Buff: When Morale >= 75 AND Trust >= 75 -> +50% progress gain
  const buffApplied = state.morale >= 75 && state.trust >= 75;
  // Debuff: When Morale < 40 -> -50% progress penalty
  const debuffApplied = state.morale < 40;

  let progressMultiplier = 1.0;
  let message = "";

  if (buffApplied) {
    progressMultiplier = 1.5;
    message = "🔥 SYNERGY BUFF AKTIF: Morale & Trust > 75%, laju progres +50% lebih cepat!";
  } else if (debuffApplied) {
    progressMultiplier = 0.5;
    message = "⚠️ BURNOUT DEBUFF AKTIF: Morale < 40%, tim kelelahan sehingga progres melambat 50%!";
  }

  const dProgress = Math.round(baseProgressDelta * progressMultiplier);

  return { dMorale, dTrust, dProgress, buffApplied, debuffApplied, message };
}

export function updateMilestones(
  milestones: ProjectMilestone[],
  totalProgress: number
): ProjectMilestone[] {
  return milestones.map((m, idx) => {
    // Dynamic progressive scaling
    const factor = 1.2 - idx * 0.15;
    const milestoneProgress = clamp(Math.round(totalProgress * factor));
    let status: ProjectMilestone["status"] = "in_progress";
    if (milestoneProgress >= 100) {
      status = "done";
    } else if (milestoneProgress < 30 && totalProgress > 50) {
      status = "blocked";
    }

    return {
      ...m,
      progress: milestoneProgress,
      status,
    };
  });
}

export function extractTaggedActors(
  message: string,
  characters: Character[] = []
): string[] {
  if (!message) return [];
  const lower = message.toLowerCase();
  const tagged: string[] = [];

  for (const c of characters) {
    const tagPattern = new RegExp(`@${c.name.toLowerCase()}\\b`, "i");
    if (tagPattern.test(lower)) {
      tagged.push(c.name);
    }
  }

  // Also catch generic @word if matches character name
  const allMentions = Array.from(message.matchAll(/@([a-zA-Z0-9_]+)/g)).map((m) => m[1]);
  for (const mention of allMentions) {
    const matched = characters.find(
      (c) => c.name.toLowerCase() === mention.toLowerCase() && !tagged.includes(c.name)
    );
    if (matched) {
      tagged.push(matched.name);
    }
  }

  return tagged;
}

export function updateCharacterStates(
  characters: Character[],
  scores: Scores,
  dMorale: number,
  dTrust: number,
  playerMessage = ""
): Character[] {
  const lowerMsg = playerMessage.toLowerCase();
  const taggedActors = extractTaggedActors(playerMessage, characters);

  return characters.map((c) => {
    let charMorale = clamp(c.morale + dMorale);
    let charStamina = c.fitness.stamina;
    let condition = c.fitness.condition;
    let mood = c.mood;

    const isTagged = taggedActors.includes(c.name);
    const isDirectlyAddressed = isTagged || lowerMsg.includes(c.name.toLowerCase());

    // Positive leadership handling
    if (scores.empati >= 7 || (isDirectlyAddressed && scores.komunikasi >= 7)) {
      // Extra boost if specifically tagged with empathy/communication
      const tagBonus = isTagged ? 5 : 0;
      charStamina = clamp(charStamina + 15 + tagBonus);
      charMorale = clamp(charMorale + 10 + tagBonus);
      mood = "Tenang & Berenergi";
      condition = isTagged
        ? `Di-tag secara khusus oleh ketua: "${c.name} merasa didengar & diprioritaskan"`
        : isDirectlyAddressed
        ? `Mendapat arahan langsung dari ketua: "${c.name} merasa dihargai"`
        : "Beban kerja lebih terkendali, stamina berangsur pulih";
    } else if (scores.empati <= 3) {
      charStamina = clamp(charStamina - 15);
      charMorale = clamp(charMorale - 10);
      mood = "Tertekan & Burnout";
      condition = isTagged
        ? `Di-tag dalam kondisi tertekan tanpa empati yang memadai`
        : "Kelelahan mental meningkat karena minimnya empati";
    } else if (scores.ketegasan >= 7 && scores.krisis >= 7) {
      mood = "Fokus Eksekusi";
      condition = isTagged
        ? `Mendapat penugasan prioritas langsung dari ketua`
        : "Mendapat kepastian prioritas dan batas waktu yang jelas";
    }

    return {
      ...c,
      morale: charMorale,
      mood,
      fitness: {
        ...c.fitness,
        stamina: charStamina,
        condition,
      },
    };
  });
}

export function applyScores(
  state: TeamState,
  scores: Scores,
  playerMessage = ""
): { newState: TeamState; delta: StateDelta; isGameOver: boolean; outcomeCode?: OutcomeCode } {
  const { dMorale, dTrust, dProgress, buffApplied, debuffApplied, message } =
    calculateDeltas(state, scores);

  const newMorale = clamp(state.morale + dMorale, 0, 100);
  const newTrust = clamp(state.trust + dTrust, 0, 100);
  const newProgress = clamp(state.progress + dProgress, 0, 100);

  const updatedCharacters = updateCharacterStates(
    state.characters,
    scores,
    dMorale,
    dTrust,
    playerMessage
  );

  const updatedMilestones = updateMilestones(state.milestones, newProgress);

  const newState: TeamState = {
    morale: newMorale,
    trust: newTrust,
    progress: newProgress,
    buffActive: newMorale >= 75 && newTrust >= 75,
    debuffActive: newMorale < 40,
    characters: updatedCharacters,
    milestones: updatedMilestones,
  };

  const delta: StateDelta = {
    morale: newMorale - state.morale,
    trust: newTrust - state.trust,
    progress: newProgress - state.progress,
    buffApplied,
    debuffApplied,
    message,
  };

  let isGameOver = false;
  let outcomeCode: OutcomeCode | undefined;

  if (newProgress >= 100) {
    isGameOver = true;
    outcomeCode = "VICTORY_100";
  } else if (newMorale <= 0) {
    isGameOver = true;
    outcomeCode = "COLLAPSE_MORALE_0";
  } else if (newTrust <= 0) {
    isGameOver = true;
    outcomeCode = "COLLAPSE_TRUST_0";
  }

  return { newState, delta, isGameOver, outcomeCode };
}

export function decideOutcome(state: TeamState): OutcomeCode {
  if (state.morale <= 0) return "COLLAPSE_MORALE_0";
  if (state.trust <= 0) return "COLLAPSE_TRUST_0";
  if (state.progress >= 100) return "VICTORY_100";

  if (state.morale < 25 || state.trust < 25) {
    return "TEAM_COLLAPSED";
  }
  if (state.progress >= 80 && state.morale >= 60) {
    return "SUCCESS_SOLID";
  }
  if (state.progress >= 80) {
    return "DONE_LOW_MORALE";
  }
  return "SURVIVED_DELAYED";
}

export function averageScores(
  history: Array<{ scores: Scores }>
): Record<Dim, number> {
  const n = Math.max(1, history.length);
  const result: Record<Dim, number> = {
    komunikasi: 0,
    empati: 0,
    ketegasan: 0,
    krisis: 0,
  };

  for (const dim of DIMENSIONS) {
    const sum = history.reduce((acc, h) => acc + (h.scores[dim] || 5), 0);
    result[dim] = Number((sum / n).toFixed(1));
  }

  return result;
}

export function weakestDimension(avg: Record<Dim, number>): Dim {
  let lowestDim: Dim = "komunikasi";
  let lowestVal = Infinity;
  for (const dim of DIMENSIONS) {
    if (avg[dim] < lowestVal) {
      lowestVal = avg[dim];
      lowestDim = dim;
    }
  }
  return lowestDim;
}

/**
 * Calculates final accumulated score across all scenarios played.
 * Yields overallScore (0-100), RankTier (S, A, B, C, D), and scenario breakdown.
 */
export function calculateFinalScore(
  state: TeamState,
  history: HistoryEntry[],
  domain: DomainType
): FinalScoreBreakdown {
  const avg = averageScores(history);
  const avg10 = (avg.komunikasi + avg.empati + avg.ketegasan + avg.krisis) / 4; // 1-10 scale

  // Base score from decision quality (scaled to 60%)
  const decisionBase = avg10 * 6; // 6 - 60 pts

  // Outcome score based on team state & progress (scaled to 40%)
  const progressPts = (state.progress / 100) * 20; // 0 - 20 pts
  const moralePts = (state.morale / 100) * 10;     // 0 - 10 pts
  const trustPts = (state.trust / 100) * 10;       // 0 - 10 pts

  let overall = Math.round(decisionBase + progressPts + moralePts + trustPts);
  if (state.morale <= 0 || state.trust <= 0) {
    overall = Math.min(overall, 48); // fatal collapse cap
  }
  overall = clamp(overall, 10, 100);

  let rankTier: RankTier = "C";
  let rankTitle = "Reactive Taskmaster";

  if (overall >= 90) {
    rankTier = "S";
    rankTitle = "Grand Orchestrator & Empathic Strategist";
  } else if (overall >= 80) {
    rankTier = "A";
    rankTitle = "Resilient Crisis Commander";
  } else if (overall >= 70) {
    rankTier = "B";
    rankTitle = "Adaptive Problem Solver";
  } else if (overall >= 55) {
    rankTier = "C";
    rankTitle = "Reactive Coordinator";
  } else {
    rankTier = "D";
    rankTitle = "Crisis Casualty";
  }

  const scenarioScores = history.map((h) => ({
    scenario_index: h.scenario_index,
    scenario_title: h.scenario_title,
    domain: h.domain || domain,
    player_message: h.player_message,
    scores: h.scores,
    avgScore: Number(
      ((h.scores.komunikasi + h.scores.empati + h.scores.ketegasan + h.scores.krisis) / 4).toFixed(1)
    ),
    rationale: h.rationale,
    scientific_eval: h.scientific_eval,
  }));

  return {
    overallScore: overall,
    rankTier,
    rankTitle,
    scenarioScores,
    cumulativeMetrics: {
      totalTurns: history.length,
      avgKomunikasi: avg.komunikasi,
      avgEmpati: avg.empati,
      avgKetegasan: avg.ketegasan,
      avgKrisis: avg.krisis,
      finalProgress: state.progress,
      finalMorale: state.morale,
      finalTrust: state.trust,
    },
  };
}
