import React, { useState } from "react";
import { ResultResponse, OutcomeCode, Dim, DomainType } from "../types";
import RadarCard from "./RadarCard";
import {
  aggregateScientificReport,
  calculateScientificTurnEvaluation,
} from "../server/scientificScoring";
import {
  Trophy,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Heart,
  ShieldCheck,
  Target,
  FileText,
  History,
  CheckCircle2,
  Scale,
  Check,
  X,
} from "lucide-react";

interface ResultScreenProps {
  r: ResultResponse;
  onRestart: (domain?: DomainType) => void;
  onOpenDashboard?: () => void;
}

const OUTCOME_STYLES: Record<
  OutcomeCode,
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  VICTORY_100: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-950",
    badge: "bg-emerald-700 text-white",
    icon: Trophy,
  },
  COLLAPSE_MORALE_0: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-700 text-white",
    icon: AlertTriangle,
  },
  COLLAPSE_TRUST_0: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-700 text-white",
    icon: AlertTriangle,
  },
  SUCCESS_SOLID: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-950",
    badge: "bg-emerald-700 text-white",
    icon: Trophy,
  },
  DONE_LOW_MORALE: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-950",
    badge: "bg-amber-700 text-white",
    icon: AlertTriangle,
  },
  SURVIVED_DELAYED: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-900",
    badge: "bg-slate-800 text-white",
    icon: CheckCircle2,
  },
  TEAM_COLLAPSED: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-700 text-white",
    icon: AlertTriangle,
  },
};

const TIER_BADGES = {
  S: "bg-slate-900 text-white border-slate-800",
  A: "bg-blue-600 text-white border-blue-600",
  B: "bg-slate-700 text-white border-slate-600",
  C: "bg-amber-700 text-white border-amber-600",
  D: "bg-red-700 text-white border-red-600",
};

const DIM_LABELS: Record<Dim, string> = {
  komunikasi: "Komunikasi",
  empati: "Empati / EQ",
  ketegasan: "Ketegasan",
  krisis: "Krisis & Solusi",
};

export default function ResultScreen({
  r,
  onRestart,
  onOpenDashboard,
}: ResultScreenProps) {
  const [openScenario, setOpenScenario] = useState<number | null>(1);
  const style = OUTCOME_STYLES[r.outcome_code] || OUTCOME_STYLES.SURVIVED_DELAYED;
  const OutcomeIcon = style.icon;

  const toggleAccordion = (index: number) => {
    setOpenScenario(openScenario === index ? null : index);
  };

  const paragraphs = r.narrative.split("\n\n").filter(Boolean);
  const finalScore = r.finalScore || {
    overallScore: Math.round(
      ((r.avg_scores.komunikasi +
        r.avg_scores.empati +
        r.avg_scores.ketegasan +
        r.avg_scores.krisis) /
        4) *
        10
    ),
    rankTier: "B" as const,
    rankTitle: "Adaptive Problem Solver",
    scenarioScores: [],
    cumulativeMetrics: {
      totalTurns: r.totalTurns,
      avgKomunikasi: r.avg_scores.komunikasi,
      avgEmpati: r.avg_scores.empati,
      avgKetegasan: r.avg_scores.ketegasan,
      avgKrisis: r.avg_scores.krisis,
      finalProgress: r.state.progress,
      finalMorale: r.state.morale,
      finalTrust: r.state.trust,
    },
  };

  const scientificReport = r.scientific_report || aggregateScientificReport(r.history);

  const tierBadgeClass =
    TIER_BADGES[finalScore.rankTier as keyof typeof TIER_BADGES] || TIER_BADGES.B;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Outcome Header Banner */}
        <section
          className={`rounded-lg border p-5 sm:p-6 ${style.bg} ${style.border}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-bold ${style.badge}`}
              >
                <OutcomeIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="type-meta font-mono font-semibold uppercase tracking-wider text-slate-700 block">
                  Keputusan Akhir Simulasi ({r.totalTurns || r.history.length} Putaran)
                </span>
                <h1 className={`type-heading mt-0.5 ${style.text}`}>
                  {r.outcome_title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="type-meta inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <History className="h-3.5 w-3.5 text-slate-700" />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRestart()}
                className="type-meta inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 font-semibold text-white hover:bg-blue-700 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Simulasi Baru</span>
              </button>
            </div>
          </div>

          {/* Final Cumulative Score Box */}
          <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`type-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-mono border ${tierBadgeClass}`}
                >
                  {finalScore.rankTier}
                </div>
                <div>
                  <div className="type-meta font-semibold uppercase tracking-wider text-slate-600">
                    Skor Akhir Akumulasi Kepemimpinan
                  </div>
                  <div className="type-subhead text-slate-900">
                    {finalScore.rankTitle}
                  </div>
                  <div className="type-meta text-slate-600">
                    Hasil agregat seluruh {r.history.length} skenario krisis yang dihadapi.
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 rounded-md bg-slate-50 px-3.5 py-2 border border-slate-200 self-start sm:self-auto font-mono">
                <span className="type-heading text-blue-600">
                  {finalScore.overallScore}
                </span>
                <span className="type-meta font-medium text-slate-600">/ 100 PTS</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Summary Gauges */}
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-md bg-white p-3 border border-slate-200">
            <div className="text-center">
              <div className="type-meta flex items-center justify-center gap-1 font-semibold text-slate-700">
                <Heart className="h-3.5 w-3.5 text-red-600" />
                <span>Morale Akhir</span>
              </div>
              <div className="type-subhead mt-1 font-mono text-slate-900">
                {r.state.morale}%
              </div>
              <span className="type-meta text-slate-600">
                {r.state.morale <= 0 ? "Mental Breakdown" : r.state.morale >= 75 ? "Optimal" : "Sedang"}
              </span>
            </div>

            <div className="text-center border-x border-slate-200">
              <div className="type-meta flex items-center justify-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Trust Akhir</span>
              </div>
              <div className="type-subhead mt-1 font-mono text-slate-900">
                {r.state.trust}%
              </div>
              <span className="type-meta text-slate-600">
                {r.state.trust <= 0 ? "Tim Bubar" : r.state.trust >= 75 ? "Tinggi" : "Sedang"}
              </span>
            </div>

            <div className="text-center">
              <div className="type-meta flex items-center justify-center gap-1 font-semibold text-slate-700">
                <Target className="h-3.5 w-3.5 text-blue-600" />
                <span>Target Progress</span>
              </div>
              <div className="type-subhead mt-1 font-mono text-blue-600">
                {r.state.progress}%
              </div>
              <span className="type-meta text-slate-600">
                {r.state.progress >= 100 ? "100% Selesai Tuntas" : "Target 100%"}
              </span>
            </div>
          </div>
        </section>

        {/* Radar & Narrative Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <RadarCard avg={r.avg_scores} />

          {/* AI Narrative & Recommendations Card */}
          <div className="surface-card flex flex-col justify-between rounded-lg p-5">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <FileText className="h-4 w-4 text-slate-700" />
                <h2 className="type-subhead text-slate-900">
                  Ulasan Reflektif Kepemimpinan
                </h2>
              </div>

              <div className="type-body mt-3 space-y-2.5 text-slate-700">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-3">
              <div className="type-meta flex items-center gap-1.5 font-semibold text-slate-900 mb-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                <span>Rekomendasi Tindak Lanjut:</span>
              </div>
              <ul className="type-meta space-y-1.5 text-slate-700">
                {r.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-slate-900">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Supplementary Scientific Evaluation Section: BARS & Feature Extraction */}
        <section
          aria-label="Evaluasi Ilmiah Tambahan (BARS & Feature-Extraction)"
          className="surface-card rounded-lg p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="type-subhead text-slate-900">
                    Evaluasi Ilmiah Tambahan (BARS &amp; Feature-Extraction)
                  </h2>
                </div>
                <p className="type-meta text-slate-600 mt-0.5">
                  Analisis dimensi kepemimpinan objektif berbasis ekstraksi indikator perilaku eksplisit.
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono self-start sm:self-auto">
              <span className="type-meta font-semibold text-slate-600 mr-1">Indeks BARS:</span>
              <span className="type-heading text-blue-600">
                {scientificReport.overall_bars_score}
              </span>
              <span className="type-meta font-medium text-slate-600">/ 100</span>
            </div>
          </div>

          {/* 4-Dimension Dimension Matrix */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {(["krisis", "komunikasi", "empati", "ketegasan"] as Dim[]).map((dim) => {
              const val = scientificReport.dimension_averages[dim];
              const diff = val - scientificReport.base_score;
              return (
                <div
                  key={dim}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="type-meta font-semibold text-slate-700">
                    {DIM_LABELS[dim]}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between font-mono">
                    <span className="type-subhead text-slate-900">{val}/100</span>
                    <span
                      className={`type-meta font-bold ${
                        diff > 0
                          ? "text-emerald-700"
                          : diff < 0
                          ? "text-red-700"
                          : "text-slate-600"
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff === 0 ? "Base" : diff}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-slate-200">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Construct Validity & Indicator Summary */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="type-meta font-semibold text-slate-900 block mb-1">
                Validitas Konstruk Matriks 4 Dimensi
              </span>
              <p className="type-meta text-slate-700">
                {scientificReport.construct_validity_note}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-3">
              <span className="type-meta font-semibold text-slate-900 block mb-1">
                Audit Ekstraksi Fitur Perilaku
              </span>
              <div className="flex items-center gap-4 mt-1">
                <span className="type-meta inline-flex items-center gap-1 font-mono font-semibold text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                  {scientificReport.total_positive_indicators} Indikator Positif Terbukti
                </span>
                <span className="type-meta inline-flex items-center gap-1 font-mono font-semibold text-red-700">
                  <X className="h-3.5 w-3.5" />
                  {scientificReport.total_negative_indicators} Indikator Negatif Terdeteksi
                </span>
              </div>
              <p className="type-meta text-slate-600 mt-1">
                Menghindari bias panjang kalimat/kosakata; poin hanya diberikan jika ditemukan bukti perilaku operasional.
              </p>
            </div>
          </div>
        </section>

        {/* Turn-by-Turn History Accordion */}
        <section className="surface-card rounded-lg p-5">
          <div className="mb-4">
            <h2 className="type-subhead text-slate-900">
              Rincian Keputusan per Putaran ({r.history.length} Catatan)
            </h2>
            <p className="type-meta text-slate-600 mt-0.5">
              Evaluasi transparan bagaimana setiap instruksimu dinilai pada 4 dimensi beserta ekstraksi fitur perilaku BARS.
            </p>
          </div>

          <div className="space-y-2.5">
            {r.history.map((h, idx) => {
              const isOpen = openScenario === idx + 1;
              const avgScore = (
                (h.scores.komunikasi +
                  h.scores.empati +
                  h.scores.ketegasan +
                  h.scores.krisis) /
                4
              ).toFixed(1);

              const turnSci =
                h.scientific_eval ||
                scientificReport.turn_evaluations[idx] ||
                calculateScientificTurnEvaluation(
                  `SCN_0${h.scenario_index || idx + 1}`,
                  h.player_message
                );

              const activeFeatures = turnSci.extracted_features.filter((f) => f.present);

              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-md border border-slate-200"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleAccordion(idx + 1)}
                    className="flex w-full items-center justify-between bg-slate-50 p-3 text-left hover:bg-slate-100 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="type-meta flex h-6 w-6 items-center justify-center rounded-sm bg-slate-900 font-mono font-bold text-white">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="type-body font-semibold text-slate-900">
                          {h.scenario_title}
                        </div>
                        <div className="type-meta text-slate-600 font-mono">
                          Morale: {h.state_after.morale}% | Trust: {h.state_after.trust}% | Progress: {h.state_after.progress}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="type-meta hidden sm:inline-block rounded-sm bg-blue-50 px-2 py-0.5 font-mono font-semibold text-blue-700 border border-blue-200">
                        BARS: {turnSci.composite_bars_score}/100
                      </span>
                      <span className="type-meta rounded-sm bg-white px-2 py-0.5 font-mono font-semibold text-slate-900 border border-slate-200">
                        Skor: {avgScore}/10
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 bg-white p-4 space-y-4">
                      <div>
                        <span className="type-meta font-semibold uppercase tracking-wider text-slate-600 block">
                          Instruksi yang Diberikan:
                        </span>
                        <div className="type-body mt-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-900 font-medium">
                          &ldquo;{h.player_message}&rdquo;
                        </div>
                      </div>

                      <div>
                        <span className="type-meta font-semibold uppercase tracking-wider text-slate-600 block">
                          Penilaian 4 Dimensi:
                        </span>
                        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                          {(Object.keys(DIM_LABELS) as Dim[]).map((dim) => {
                            const score = h.scores[dim];
                            const rationale = h.rationale[dim] || "Evaluasi terpenuhi.";
                            return (
                              <div
                                key={dim}
                                className="rounded-md border border-slate-200 bg-slate-50 p-2.5"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="type-meta font-semibold text-slate-900">
                                    {DIM_LABELS[dim]}
                                  </span>
                                  <span className="type-meta font-mono font-bold text-blue-600">
                                    {score}/10
                                  </span>
                                </div>
                                <p className="type-meta text-slate-700">
                                  {rationale}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Turn-level Scientific Feature Extraction (BARS & Feature Extraction) */}
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <span className="type-meta font-semibold text-slate-900">
                            Audit Indikator Perilaku
                          </span>
                          <span className="type-meta font-mono font-semibold text-blue-700">
                            Skor BARS Putaran: {turnSci.composite_bars_score}/100 (Base {turnSci.base_score})
                          </span>
                        </div>

                        {activeFeatures.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {activeFeatures.map((feat) => (
                              <div
                                key={feat.indicator_id}
                                className={`rounded-sm border p-2 ${
                                  feat.polarity === "positive"
                                    ? "border-emerald-200 bg-emerald-50/70"
                                    : "border-red-200 bg-red-50/70"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="type-meta font-mono font-bold text-slate-900">
                                    {feat.indicator_id}
                                  </span>
                                  <span
                                    className={`type-meta font-mono font-bold ${
                                      feat.weight > 0 ? "text-emerald-700" : "text-red-700"
                                    }`}
                                  >
                                    {feat.weight > 0 ? `+${feat.weight}` : feat.weight} pts ({DIM_LABELS[feat.dimension]})
                                  </span>
                                </div>
                                <div className="type-meta font-semibold text-slate-800 mt-0.5">
                                  {feat.label}
                                </div>
                                {feat.evidence && (
                                  <div className="type-meta text-slate-600 mt-0.5">
                                    Bukti: &ldquo;{feat.evidence}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="type-meta text-slate-600">
                            Tidak ada indikator spesifik tambahan yang terdeteksi; skor dimensi menggunakan Base ({turnSci.base_score}/100).
                          </p>
                        )}

                        {turnSci.objective_feedback.length > 0 && (
                          <div className="border-t border-slate-200 pt-2">
                            <span className="type-meta font-semibold text-slate-900 block mb-1">
                              Umpan Balik Obyektif Deterministik:
                            </span>
                            <ul className="type-meta space-y-1 text-slate-700">
                              {turnSci.objective_feedback.map((fb, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-1.5">
                                  <span className="font-mono font-bold text-slate-700">·</span>
                                  <span>{fb}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="surface-card flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg p-4">
          <div className="type-meta text-slate-700">
            <span className="font-semibold text-slate-900">Arsip Tersimpan:</span> Hasil simulasi
            ini otomatis tersimpan di riwayat kepemimpinan.
          </div>
          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="type-meta flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <History className="h-3.5 w-3.5" />
                <span>Buka Dashboard</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onRestart()}
              className="type-meta flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Mulai Skenario Acak Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
