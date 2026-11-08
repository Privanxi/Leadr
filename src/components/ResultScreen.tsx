import React, { useState } from "react";
import { ResultResponse, OutcomeCode, Dim, DomainType } from "../types";
import RadarCard from "./RadarCard";
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
    badge: "bg-emerald-600 text-white",
    icon: Trophy,
  },
  COLLAPSE_MORALE_0: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-600 text-white",
    icon: AlertTriangle,
  },
  COLLAPSE_TRUST_0: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-600 text-white",
    icon: AlertTriangle,
  },
  SUCCESS_SOLID: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-950",
    badge: "bg-emerald-600 text-white",
    icon: Trophy,
  },
  DONE_LOW_MORALE: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-950",
    badge: "bg-amber-600 text-white",
    icon: AlertTriangle,
  },
  SURVIVED_DELAYED: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-900",
    badge: "bg-slate-700 text-white",
    icon: CheckCircle2,
  },
  TEAM_COLLAPSED: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-950",
    badge: "bg-red-600 text-white",
    icon: AlertTriangle,
  },
};

const TIER_BADGES = {
  S: "bg-slate-900 text-white border-slate-700",
  A: "bg-emerald-700 text-white border-emerald-600",
  B: "bg-blue-700 text-white border-blue-600",
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

  const tierBadgeClass =
    TIER_BADGES[finalScore.rankTier as keyof typeof TIER_BADGES] || TIER_BADGES.B;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Outcome Header Banner */}
        <section
          className={`rounded-lg border p-5 sm:p-6 shadow-2xs ${style.bg} ${style.border}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-bold shadow-2xs ${style.badge}`}
              >
                <OutcomeIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-600 block">
                  Keputusan Akhir Simulasi ({r.totalTurns || r.history.length} Putaran)
                </span>
                <h1 className={`text-xl font-bold sm:text-2xl mt-0.5 ${style.text}`}>
                  {r.outcome_title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <History className="h-3.5 w-3.5 text-slate-600" />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRestart()}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Simulasi Baru</span>
              </button>
            </div>
          </div>

          {/* Final Cumulative Score Box */}
          <div className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-mono text-xl font-bold border ${tierBadgeClass}`}
                >
                  {finalScore.rankTier}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Skor Akhir Akumulasi Kepemimpinan
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {finalScore.rankTitle}
                  </div>
                  <div className="text-xs text-slate-500">
                    Hasil agregat seluruh {r.history.length} skenario krisis yang dihadapi.
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 rounded-md bg-slate-50 px-3.5 py-1.5 border border-slate-200 self-start sm:self-auto font-mono">
                <span className="text-2xl font-bold text-blue-700">
                  {finalScore.overallScore}
                </span>
                <span className="text-xs font-medium text-slate-500">/ 100 PTS</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Summary Gauges */}
          <div className="mt-3 grid grid-cols-3 gap-2.5 rounded-md bg-white p-3 border border-slate-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600">
                <Heart className="h-3 w-3 text-rose-600" />
                <span>Morale Akhir</span>
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {r.state.morale}%
              </div>
              <span className="text-[10px] text-slate-500">
                {r.state.morale <= 0 ? "Mental Breakdown" : r.state.morale >= 75 ? "Optimal" : "Sedang"}
              </span>
            </div>

            <div className="text-center border-x border-slate-200">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600">
                <ShieldCheck className="h-3 w-3 text-amber-600" />
                <span>Trust Akhir</span>
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-slate-900">
                {r.state.trust}%
              </div>
              <span className="text-[10px] text-slate-500">
                {r.state.trust <= 0 ? "Tim Bubar" : r.state.trust >= 75 ? "Tinggi" : "Sedang"}
              </span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600">
                <Target className="h-3 w-3 text-blue-600" />
                <span>Target Progress</span>
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-blue-700">
                {r.state.progress}%
              </div>
              <span className="text-[10px] text-slate-500">
                {r.state.progress >= 100 ? "100% Selesai Tuntas" : "Target 100%"}
              </span>
            </div>
          </div>
        </section>

        {/* Radar & Narrative Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Radar Chart Card */}
          <RadarCard avg={r.avg_scores} />

          {/* AI Narrative & Recommendations Card */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="h-4 w-4 text-slate-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ulasan Reflektif Kepemimpinan
                </h2>
              </div>

              <div className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-700">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                <span>Rekomendasi Tindak Lanjut:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {r.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-slate-700">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Turn-by-Turn History Accordion */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Rincian Keputusan per Putaran ({r.history.length} Catatan)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi transparan bagaimana setiap instruksimu dinilai pada 4 dimensi.
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

              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-md border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx + 1)}
                    className="flex w-full items-center justify-between bg-slate-50 p-3 text-left hover:bg-slate-100/80 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 font-mono text-[11px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {h.scenario_title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Morale: {h.state_after.morale}% | Trust: {h.state_after.trust}% | Progress: {h.state_after.progress}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 border border-slate-200">
                        Skor: {avgScore}/10
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 bg-white p-3.5 space-y-3">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                          Instruksi yang Diberikan:
                        </span>
                        <div className="mt-1 rounded border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium">
                          "{h.player_message}"
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                          Penilaian 4 Dimensi:
                        </span>
                        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                          {(Object.keys(DIM_LABELS) as Dim[]).map((dim) => {
                            const score = h.scores[dim];
                            const rationale = h.rationale[dim] || "Evaluasi terpenuhi.";
                            return (
                              <div
                                key={dim}
                                className="rounded border border-slate-200 bg-slate-50/50 p-2 text-xs"
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-semibold text-slate-800 text-[11px]">
                                    {DIM_LABELS[dim]}
                                  </span>
                                  <span className="font-mono font-bold text-blue-700 text-xs">
                                    {score}/10
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-normal">
                                  {rationale}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3.5 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-800">Arsip Tersimpan:</span> Hasil simulasi
            ini otomatis tersimpan di riwayat kepemimpinan.
          </div>
          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <History className="h-3.5 w-3.5" />
                <span>Buka Dashboard</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onRestart()}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 font-semibold text-white shadow-2xs hover:bg-blue-700 transition cursor-pointer"
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
