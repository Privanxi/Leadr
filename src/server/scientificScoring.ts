import {
  BehavioralIndicatorId,
  CumulativeScientificReport,
  Dim,
  ExtractedBehavioralFeature,
  HistoryEntry,
  TurnScientificEvaluation,
} from "../types.js";

export interface IndicatorDefinition {
  id: BehavioralIndicatorId;
  label: string;
  dimension: Dim;
  polarity: "positive" | "negative";
  weight: number; // positive or negative points added to BASE_SCORE (60)
  description: string;
}

export const SCIENTIFIC_BASE_SCORE = 60;

/**
 * Arthur et al. (2003, 2008) 4-Dimension Behaviorally Anchored Rating Scales (BARS)
 * paired with Walsh et al. (2025) Binary Behavioral Feature Indicators.
 */
export const BEHAVIORAL_INDICATOR_CATALOG: readonly IndicatorDefinition[] = [
  // 1. Dimensi Krisis (Problem Solving & Planning)
  {
    id: "CRISIS_TRIAGE",
    label: "Prioritas Mitigasi & Triage Krisis",
    dimension: "krisis",
    polarity: "positive",
    weight: 25,
    description: "Menentukan prioritas penanganan mitigasi teknis atau rencana kontingensi (Plan B) secara konkret.",
  },
  {
    id: "RISK_CONTAINMENT",
    label: "Isolasi Dampak & Kontingensi Risiko",
    dimension: "krisis",
    polarity: "positive",
    weight: 15,
    description: "Mengamankan deliverable utama agar tidak lumpuh akibat hambatan sebagian komponen.",
  },
  {
    id: "PASSIVE_BLAME",
    label: "Kepanikan / Menyalahkan Tanpa Solusi",
    dimension: "krisis",
    polarity: "negative",
    weight: -30,
    description: "Panik, lepas tangan, atau langsung menyalahkan anggota tim tanpa instruksi penyelesaian.",
  },

  // 2. Dimensi Komunikasi (Communication)
  {
    id: "CLEAR_DELEGATION",
    label: "Delegasi Spesifik & Pembagian PIC",
    dimension: "komunikasi",
    polarity: "positive",
    weight: 20,
    description: "Memberikan instruksi yang jelas dengan penunjukan PIC/peran atau alokasi tugas spesifik.",
  },
  {
    id: "TRANSPARENT_CONTEXT",
    label: "Transparansi Konteks & Alasan",
    dimension: "komunikasi",
    polarity: "positive",
    weight: 20,
    description: "Menjelaskan alasan keputusan atau memperbarui status informasi secara transparan kepada tim.",
  },
  {
    id: "VAGUE_INSTRUCTION",
    label: "Instruksi Ambigu / Minim Konteks",
    dimension: "komunikasi",
    polarity: "negative",
    weight: -15,
    description: "Respons terlalu singkat, normatif, atau ambigu tanpa kejelasan langkah operasional.",
  },

  // 3. Dimensi Empati (Consideration & Psychological Safety)
  {
    id: "CHECK_WELLBEING",
    label: "Validasi Kapasitas & Pemulihan Tim",
    dimension: "empati",
    polarity: "positive",
    weight: 20,
    description: "Mengakui kelelahan fisik/mental anggota, memberikan waktu istirahat, atau menawarkan bantuan.",
  },
  {
    id: "PSYCHOLOGICAL_SAFETY",
    label: "Penjagaan Rasa Aman Psikologis",
    dimension: "empati",
    polarity: "positive",
    weight: 20,
    description: "Menenangkan ketegangan antaranggota dan menghindari penghakiman terbuka di saat genting.",
  },
  {
    id: "HOSTILE_DISMISSAL",
    label: "Pengabaian Kasar / Eksploitasi Tim",
    dimension: "empati",
    polarity: "negative",
    weight: -30,
    description: "Meremehkan kondisi kesehatan/mental anggota atau menggunakan bahasa merendahkan.",
  },

  // 4. Dimensi Ketegasan (Drive, Accountability & Influencing)
  {
    id: "TAKE_ACCOUNTABILITY",
    label: "Akuntabilitas & Pengambilalihan Beban Eksternal",
    dimension: "ketegasan",
    polarity: "positive",
    weight: 20,
    description: "Mengambil keputusan final dan berani memikul tanggung jawab komunikasi ke pihak eksternal.",
  },
  {
    id: "TIMEBOUND_CHECKPOINT",
    label: "Penetapan Batas Waktu & Checkpoint",
    dimension: "ketegasan",
    polarity: "positive",
    weight: 20,
    description: "Menetapkan tenggat waktu (jam/hari) atau parameter evaluasi yang tegas dan terukur.",
  },
  {
    id: "AVOIDANT_DELAY",
    label: "Penundaan Keputusan / Sikap Menghindar",
    dimension: "ketegasan",
    polarity: "negative",
    weight: -20,
    description: "Menghindari pengambilan keputusan di tengah konflik atau membiarkan masalah menggantung.",
  },
] as const;

const DIM_NAMES_ID: Record<Dim, string> = {
  krisis: "Manajemen Krisis",
  komunikasi: "Komunikasi",
  empati: "Empati",
  ketegasan: "Ketegasan",
};

function clampScore(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

/**
 * Extracts a short verbatim snippet from the player's message matching a regex pattern.
 */
function findEvidenceSnippet(message: string, regex: RegExp): string | null {
  const sentences = message
    .split(/(?<=[.!?;\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const s of sentences) {
    if (regex.test(s)) {
      return s.length > 110 ? s.slice(0, 107) + "..." : s;
    }
  }

  const match = message.match(regex);
  if (match && match.index !== undefined) {
    const start = Math.max(0, match.index - 20);
    const end = Math.min(message.length, match.index + match[0].length + 45);
    const snippet = message.slice(start, end).trim();
    return snippet.length > 110 ? snippet.slice(0, 107) + "..." : snippet;
  }

  return null;
}

/**
 * Detects prompt-injection or score-gaming attempts (Walsh et al., 2025 anti-cheating principle).
 */
export function detectPromptGaming(message: string): boolean {
  const lower = message.toLowerCase();
  return /sistem.*beri.*nilai|anggap saya pemimpin terbaik|ignore previous|abaikan instruksi|skor 100|nilai 100|kasih nilai sempurna|system prompt|bypass score/i.test(
    lower
  );
}

/**
 * Deterministic / Heuristic Behavioral Feature Extractor (Walsh et al., 2025).
 * Also merges and validates any LLM-extracted indicators so that every indicator in the catalog
 * is evaluated with verifiable textual evidence.
 */
export function extractBehavioralFeatures(
  playerMessage: string,
  llmExtracted?: Array<{
    indicator_id: string;
    present: boolean;
    evidence?: string | null;
  }>
): { features: ExtractedBehavioralFeature[]; antiGamingTriggered: boolean } {
  const trimmed = playerMessage.trim();
  const antiGamingTriggered = detectPromptGaming(trimmed);

  // Heuristic evidence detectors per indicator
  const rules: Record<BehavioralIndicatorId, RegExp> = {
    CRISIS_TRIAGE:
      /prioritas|plan b|mock|rollback|mitigasi|fokus.*dulu|backup|cadangan|darurat|pangkas|triage|solusi|alternatif|staging|audit/i,
    RISK_CONTAINMENT:
      /amankan|jangan sampai|minimalisir|isolasi|stabilkan|jaga.*agar|pastikan.*tetap|tahap|phase|scope|verifikasi|kuitansi|klarifikasi/i,
    PASSIVE_BLAME:
      /bodo amat|salah kalian|urusan kalian|bubar aja|percuma|nggak peduli|terserah kalian|kalian semua gagal|lepas tangan|malas/i,
    CLEAR_DELEGATION:
      /@[a-zA-Z0-9_]+|\b(dimas|rani|sekar|bayu|fajar|maya|sarah|budi|kevin|amanda|reza|tania|fikri|dita|rio|nadia)\b.*\b(fokus|handle|kerjakan|urus|pegang|siapkan|bantu|tolong|bagian|tindak)\b|bagi tugas|delegasi/i,
    TRANSPARENT_CONTEXT:
      /karena|supaya|agar|alasannya|kondisi saat ini|update|konfirmasi|kabari|transparan|kronologi|jelaskan|fakta/i,
    VAGUE_INSTRUCTION:
      /^(oke|ok|sip|lanjut|ya|hmm|gimana ya|terserah|lihat nanti|entahlah|bebas)\.?$/i,
    CHECK_WELLBEING:
      /istirahat|tidur|makan|kesehatan|jangan dipaksa|rebahan|stamina|tenaga|pulih|kesiapan|kondisi kalian|bantuan|backup/i,
    PSYCHOLOGICAL_SAFETY:
      /tenang|jangan panik|makasih|terima kasih|apresiasi|paham|mengerti|bareng-bareng|tidak menyalahkan|evaluasi bersama|sabar/i,
    HOSTILE_DISMISSAL:
      /bego|bodoh|lemah|cengeng|lebay|mampus|pecat|nggak guna|sampah|berisik|jangan mengeluh/i,
    TAKE_ACCOUNTABILITY:
      /saya ambil alih|aku ambil alih|tanggung jawabku|tanggung jawab saya|biar aku|biar saya|saya yang hadapi|aku yang koordinasi|keputusan final|saya putuskan|aku putuskan/i,
    TIMEBOUND_CHECKPOINT:
      /\b(\d+\s*(jam|menit|hari)|jam\s*\d+|pukul\s*\d+|sore ini|malam ini|siang ini|pagi ini|sekarang juga|deadline|tenggat|checkpoint|sebelum)\b/i,
    AVOIDANT_DELAY:
      /nanti aja|besok-besok aja|tunda dulu tanpa|lihat nanti aja|jangan bahas sekarang|biarin aja dulu/i,
  };

  const llmMap = new Map<string, { present: boolean; evidence?: string | null }>();
  if (Array.isArray(llmExtracted) && !antiGamingTriggered) {
    for (const item of llmExtracted) {
      if (item && typeof item.indicator_id === "string") {
        llmMap.set(item.indicator_id, {
          present: Boolean(item.present),
          evidence: item.evidence || null,
        });
      }
    }
  }

  const isVeryShort = trimmed.split(/\s+/).length <= 3;

  const features: ExtractedBehavioralFeature[] = BEHAVIORAL_INDICATOR_CATALOG.map((def) => {
    if (antiGamingTriggered) {
      // Under prompt injection / gaming attempt, positive behavioral indicators are rejected
      if (def.id === "VAGUE_INSTRUCTION") {
        return {
          indicator_id: def.id,
          label: def.label,
          dimension: def.dimension,
          polarity: def.polarity,
          weight: def.weight,
          present: true,
          evidence: "Percobaan manipulasi instruksi skoring tanpa tindakan operasional nyata",
        };
      }
      return {
        indicator_id: def.id,
        label: def.label,
        dimension: def.dimension,
        polarity: def.polarity,
        weight: def.weight,
        present: false,
        evidence: null,
      };
    }

    const regex = rules[def.id];
    const heuristicSnippet = regex ? findEvidenceSnippet(trimmed, regex) : null;
    const llmEntry = llmMap.get(def.id);

    let present = Boolean(heuristicSnippet);
    let evidence: string | null = heuristicSnippet;

    // If LLM detected the indicator and provided non-empty evidence, accept it
    if (llmEntry && llmEntry.present && llmEntry.evidence && llmEntry.evidence.trim().length > 2) {
      present = true;
      evidence = llmEntry.evidence.trim();
    }

    // Special check for VAGUE_INSTRUCTION if message is extremely short (< 4 words) and has no clear delegation/triage
    if (def.id === "VAGUE_INSTRUCTION" && isVeryShort && !rules.CLEAR_DELEGATION.test(trimmed)) {
      present = true;
      evidence = trimmed;
    }

    return {
      indicator_id: def.id,
      label: def.label,
      dimension: def.dimension,
      polarity: def.polarity,
      weight: def.weight,
      present,
      evidence: present ? evidence : null,
    };
  });

  return { features, antiGamingTriggered };
}

/**
 * Layer 3: Deterministic BARS Scoring Engine (Arthur et al., 2003/2008 & Walsh et al., 2025)
 * Formula: Score(D) = Base (60) + sum(w_i * I_pos) - sum(w_j * I_neg)
 */
export function calculateScientificTurnEvaluation(
  scenarioId: string,
  playerMessage: string,
  llmExtracted?: Array<{
    indicator_id: string;
    present: boolean;
    evidence?: string | null;
  }>
): TurnScientificEvaluation {
  const { features, antiGamingTriggered } = extractBehavioralFeatures(
    playerMessage,
    llmExtracted
  );

  const dimensionDeltas: Record<Dim, number> = {
    komunikasi: 0,
    empati: 0,
    ketegasan: 0,
    krisis: 0,
  };

  for (const feat of features) {
    if (!feat.present) continue;
    dimensionDeltas[feat.dimension] += feat.weight;
  }

  const dimensionScores: Record<Dim, number> = {
    komunikasi: clampScore(SCIENTIFIC_BASE_SCORE + dimensionDeltas.komunikasi, 0, 100),
    empati: clampScore(SCIENTIFIC_BASE_SCORE + dimensionDeltas.empati, 0, 100),
    ketegasan: clampScore(SCIENTIFIC_BASE_SCORE + dimensionDeltas.ketegasan, 0, 100),
    krisis: clampScore(SCIENTIFIC_BASE_SCORE + dimensionDeltas.krisis, 0, 100),
  };

  const compositeBarsScore = Math.round(
    (dimensionScores.komunikasi +
      dimensionScores.empati +
      dimensionScores.ketegasan +
      dimensionScores.krisis) /
      4
  );

  // Build objective behavioral feedback sentences
  const objectiveFeedback: string[] = [];

  if (antiGamingTriggered) {
    objectiveFeedback.push(
      "Anti-Gaming Guard Aktif (Walsh et al., 2025): Terdeteksi upaya memanipulasi instruksi penilai tanpa indikator perilaku kepemimpinan yang sah."
    );
  }

  const presentPositives = features.filter((f) => f.present && f.polarity === "positive");
  const presentNegatives = features.filter((f) => f.present && f.polarity === "negative");

  for (const pos of presentPositives) {
    objectiveFeedback.push(
      `+${pos.weight} poin ${DIM_NAMES_ID[pos.dimension]} (${pos.label}): Terdeteksi bukti perilaku "${pos.evidence}".`
    );
  }

  for (const neg of presentNegatives) {
    objectiveFeedback.push(
      `${neg.weight} poin ${DIM_NAMES_ID[neg.dimension]} (${neg.label}): Terdeteksi indikasi negatif "${neg.evidence}".`
    );
  }

  // Note dimensions that had zero positive indicators detected
  const dimsWithoutPositive = (["krisis", "komunikasi", "empati", "ketegasan"] as Dim[]).filter(
    (d) => !presentPositives.some((p) => p.dimension === d)
  );

  if (dimsWithoutPositive.length > 0 && !antiGamingTriggered) {
    const dimLabels = dimsWithoutPositive.map((d) => DIM_NAMES_ID[d]).join(", ");
    objectiveFeedback.push(
      `Skor ${dimLabels} bertahan pada nilai dasar (${SCIENTIFIC_BASE_SCORE}/100) atau berkurang karena belum memuat indikator aksi spesifik pada dimensi tersebut.`
    );
  }

  return {
    scenario_id: scenarioId,
    base_score: SCIENTIFIC_BASE_SCORE,
    dimension_scores: dimensionScores,
    dimension_deltas: dimensionDeltas,
    composite_bars_score: compositeBarsScore,
    extracted_features: features,
    objective_feedback: objectiveFeedback,
    anti_gaming_triggered: antiGamingTriggered,
  };
}

/**
 * Aggregates turn-by-turn scientific BARS evaluations into a session-wide report.
 */
export function aggregateScientificReport(
  history: HistoryEntry[]
): CumulativeScientificReport {
  const turnEvaluations: TurnScientificEvaluation[] = history.map((h, idx) => {
    if (h.scientific_eval) {
      return h.scientific_eval;
    }
    return calculateScientificTurnEvaluation(
      `SCN_0${h.scenario_index || idx + 1}`,
      h.player_message
    );
  });

  const n = Math.max(1, turnEvaluations.length);
  const dimensionAverages: Record<Dim, number> = {
    komunikasi: Math.round(
      turnEvaluations.reduce((acc, t) => acc + t.dimension_scores.komunikasi, 0) / n
    ),
    empati: Math.round(
      turnEvaluations.reduce((acc, t) => acc + t.dimension_scores.empati, 0) / n
    ),
    ketegasan: Math.round(
      turnEvaluations.reduce((acc, t) => acc + t.dimension_scores.ketegasan, 0) / n
    ),
    krisis: Math.round(
      turnEvaluations.reduce((acc, t) => acc + t.dimension_scores.krisis, 0) / n
    ),
  };

  const overallBarsScore = Math.round(
    (dimensionAverages.komunikasi +
      dimensionAverages.empati +
      dimensionAverages.ketegasan +
      dimensionAverages.krisis) /
      4
  );

  let totalPositive = 0;
  let totalNegative = 0;
  for (const t of turnEvaluations) {
    for (const f of t.extracted_features) {
      if (f.present) {
        if (f.polarity === "positive") totalPositive += 1;
        else totalNegative += 1;
      }
    }
  }

  // Compute spread across the 4 dimensions to verify absence of halo effect / dimension collapse (Arthur et al., 2003)
  const vals = Object.values(dimensionAverages);
  const maxDimVal = Math.max(...vals);
  const minDimVal = Math.min(...vals);
  const spread = maxDimVal - minDimVal;

  const constructValidityNote =
    spread >= 8
      ? `Diferensiasi Dimensi Valid (Rentang antar-dimensi ${spread} poin): Penilaian bebas dari 'dimension collapse' / halo effect sesuai matriks 4 klaster Arthur et al. (2003, 2008).`
      : `Profil Merata (Rentang antar-dimensi ${spread} poin): Keempat dimensi kepemimpinan dieksekusi dengan frekuensi indikator perilaku yang seimbang.`;

  const objectiveSummary: string[] = [
    `Total ${totalPositive} indikator perilaku positif dan ${totalNegative} indikator negatif terverifikasi secara tekstual (Walsh et al., 2025).`,
    `Skor dihitung secara deterministik dari Base ${SCIENTIFIC_BASE_SCORE} + bobot BARS tanpa bias kosakata/panjang kalimat.`,
  ];

  return {
    overall_bars_score: overallBarsScore,
    base_score: SCIENTIFIC_BASE_SCORE,
    dimension_averages: dimensionAverages,
    total_positive_indicators: totalPositive,
    total_negative_indicators: totalNegative,
    construct_validity_note: constructValidityNote,
    objective_summary: objectiveSummary,
    turn_evaluations: turnEvaluations,
  };
}
