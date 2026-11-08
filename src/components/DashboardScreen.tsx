import React, { useState } from "react";
import {
  SimulationHistoryRecord,
  DomainType,
  Dim,
} from "../types";
import {
  Trophy,
  History,
  TrendingUp,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Award,
  Inbox,
  ArrowLeft,
  Calendar,
  UserCheck,
} from "lucide-react";
import RadarCard from "./RadarCard";
import {
  aggregateScientificReport,
  calculateScientificTurnEvaluation,
} from "../server/scientificScoring";

interface DashboardScreenProps {
  history: SimulationHistoryRecord[];
  onStartNew: (domain?: DomainType) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const TIER_COLORS = {
  S: "bg-slate-900 text-white border-slate-800",
  A: "bg-blue-600 text-white border-blue-600",
  B: "bg-slate-700 text-white border-slate-600",
  C: "bg-amber-700 text-white border-amber-600",
  D: "bg-red-700 text-white border-red-600",
};

export default function DashboardScreen({
  history,
  onStartNew,
  onClearHistory,
  onClose,
}: DashboardScreenProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHistory =
    selectedDomain === "all"
      ? history
      : history.filter((h) => h.domain === selectedDomain);

  const totalSessions = history.length;
  const victoriesCount = history.filter((h) => h.outcomeCode === "VICTORY_100").length;
  const winRate = totalSessions > 0 ? Math.round((victoriesCount / totalSessions) * 100) : 0;

  const avgOverallScore =
    totalSessions > 0
      ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / totalSessions)
      : 0;

  const avgScoresAll: Record<Dim, number> = {
    komunikasi: 0,
    empati: 0,
    ketegasan: 0,
    krisis: 0,
  };

  if (totalSessions > 0) {
    (["komunikasi", "empati", "ketegasan", "krisis"] as Dim[]).forEach((dim) => {
      const sum = history.reduce((acc, h) => acc + (h.avgScores[dim] || 5), 0);
      avgScoresAll[dim] = Number((sum / totalSessions).toFixed(1));
    });
  }

  const rankOrder = ["S", "A", "B", "C", "D"];
  const bestRank =
    totalSessions > 0
      ? rankOrder.find((r) => history.some((h) => h.rankTier === r)) || "C"
      : "-";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="type-meta flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 transition"
              title="Kembali"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-600" />
              <span>Kembali</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="type-body flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
                L
              </span>
              <h1 className="type-subhead text-slate-900 flex items-center gap-2">
                <span>Dashboard &amp; Riwayat Kepemimpinan</span>
                <span className="type-meta rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                  {totalSessions} Sesi
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalSessions > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="type-meta flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 font-semibold text-red-700 hover:bg-red-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-red-600 transition"
                title="Hapus riwayat simulasi"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Riwayat</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onStartNew()}
              className="type-meta flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 font-semibold text-white hover:bg-blue-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Mulai Simulasi Baru</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="surface-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="type-meta font-semibold text-slate-600">Total Simulasi</span>
              <History className="h-4 w-4 text-blue-600" />
            </div>
            <div className="type-heading mt-2 text-slate-900 font-mono">
              {totalSessions}
            </div>
            <p className="type-meta mt-0.5 text-slate-600">Skenario krisis dimainkan</p>
          </div>

          <div className="surface-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="type-meta font-semibold text-slate-600">Rata-rata Skor</span>
              <TrendingUp className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="type-heading mt-2 text-slate-900 font-mono">
              {avgOverallScore}
              <span className="type-meta font-normal text-slate-600"> / 100</span>
            </div>
            <p className="type-meta mt-0.5 text-slate-600">Komposit keputusan &amp; hasil</p>
          </div>

          <div className="surface-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="type-meta font-semibold text-slate-600">Tingkat Kemenangan</span>
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <div className="type-heading mt-2 text-slate-900 font-mono">
              {winRate}%
            </div>
            <p className="type-meta mt-0.5 text-slate-600">
              {victoriesCount} dari {totalSessions} sukses 100%
            </p>
          </div>

          <div className="surface-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="type-meta font-semibold text-slate-600">Rank Tertinggi</span>
              <Award className="h-4 w-4 text-slate-700" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="type-heading text-slate-900 font-mono">Tier {bestRank}</span>
              {bestRank !== "-" && (
                <span
                  className={`type-meta rounded-sm px-2 py-0.5 font-bold uppercase border ${
                    TIER_COLORS[bestRank as keyof typeof TIER_COLORS] || ""
                  }`}
                >
                  {bestRank}
                </span>
              )}
            </div>
            <p className="type-meta mt-0.5 text-slate-600">Pencapaian kepemimpinan</p>
          </div>
        </div>

        {/* Radar & Overview Analytics */}
        {totalSessions > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            <RadarCard avg={avgScoresAll} />

            <div className="surface-card flex flex-col justify-between rounded-lg p-6">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <h2 className="type-subhead text-slate-900">
                    Karakteristik &amp; Profil Kepemimpinan Kumulatif
                  </h2>
                </div>

                <div className="type-body mt-4 space-y-3 text-slate-700">
                  <p>
                    Berdasarkan rekam jejak pada <b>{totalSessions} sesi simulasi</b>, rata-rata
                    skor kepemimpinanmu adalah <b>{avgOverallScore}/100</b>.
                  </p>
                  <p>
                    Kamu telah membuktikan kemampuan mengarahkan tim dalam kondisi krisis bertekanan
                    tinggi. Terus latih empati aktif terhadap kelelahan anggota dan keberanian
                    mengambil keputusan tegas tanpa menunda.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-slate-50 p-4 border border-slate-200">
                <span className="type-meta font-bold text-slate-900 block mb-1">
                  Krisis Tak Terduga Menanti:
                </span>
                <p className="type-meta text-slate-700 mb-3">
                  Sistem mengacak secara otomatis antara <b>Tech Startup</b>, <b>Organisasi Kampus / BEM</b>,{" "}
                  <b>Corporate Agency</b>, atau <b>Drama Sosial (Skandal Kas)</b> dengan latar aktor dinamis.
                </p>
                <button
                  type="button"
                  onClick={() => onStartNew()}
                  className="type-meta rounded-md bg-blue-600 px-3.5 py-2 font-semibold text-white hover:bg-blue-700 cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Mulai Simulasi Baru (Domain Acak)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="surface-card rounded-lg p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              <Inbox className="h-6 w-6" />
            </div>
            <h2 className="type-subhead mt-4 text-slate-900">
              Belum Ada Riwayat Simulasi
            </h2>
            <p className="type-body mt-1 text-slate-600 max-w-md mx-auto">
              Mulai sesi pertamamu sekarang. Hadapi krisis anggota ghosting, burnout tim, atau drama
              sosial untuk mencatat evaluasi kepemimpinan pertamamu.
            </p>
            <button
              type="button"
              onClick={() => onStartNew()}
              className="type-meta mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Mulai Sesi Simulasi Sekarang</span>
            </button>
          </div>
        )}

        {/* History List Section */}
        {totalSessions > 0 && (
          <section className="surface-card rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="type-subhead text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  <span>Daftar Sesi Simulasi &amp; Rekam Evaluasi ({filteredHistory.length})</span>
                </h2>
                <p className="type-meta text-slate-600">
                  Klik pada sesi untuk melihat rincian keputusan, balasan tim, dan rasionale penilai.
                </p>
              </div>

              {/* Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filter Riwayat Berdasarkan Domain"
                className="flex flex-wrap gap-1.5"
              >
                {[
                  { id: "all", label: "Semua Domain" },
                  { id: "tech_startup", label: "Tech Startup" },
                  { id: "campus_org", label: "Kampus / BEM" },
                  { id: "corporate_agency", label: "Korporat" },
                  { id: "social_drama", label: "Drama Sosial" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedDomain === tab.id}
                    onClick={() => setSelectedDomain(tab.id)}
                    className={`type-meta rounded-md px-2.5 py-1.5 font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
                      selectedDomain === tab.id
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="type-body font-medium text-slate-700">
                  Belum ada riwayat sesi pada filter domain ini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const tierClass =
                    TIER_COLORS[item.rankTier as keyof typeof TIER_COLORS] || TIER_COLORS.C;

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-md border border-slate-200 transition hover:border-slate-300"
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex w-full items-center justify-between bg-slate-50 p-4 text-left transition hover:bg-slate-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`type-subhead flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono border ${tierClass}`}
                          >
                            {item.rankTier}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="type-body font-semibold text-slate-900">
                                {item.outcomeTitle}
                              </span>
                              {item.domain === "social_drama" && (
                                <span className="type-meta rounded-sm border border-red-200 bg-red-50 px-1.5 py-0.5 font-semibold text-red-700">
                                  Rare Crisis
                                </span>
                              )}
                            </div>
                            <div className="type-meta flex items-center gap-2 mt-0.5 text-slate-600">
                              <span>{item.domainTitle}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.date}
                              </span>
                              <span>·</span>
                              <span>{item.totalTurns} Putaran</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <div className="type-body font-mono font-bold text-slate-900">
                              Skor: {item.overallScore}/100
                            </div>
                            <div className="type-meta text-slate-600">
                              Progres: {item.finalProgress}% | Morale: {item.finalMorale}%
                            </div>
                          </div>

                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (() => {
                        const sciReport =
                          item.scientific_report || aggregateScientificReport(item.history);
                        return (
                        <div className="border-t border-slate-200 bg-white p-4 sm:p-5 space-y-4">
                          {/* Narrative summary */}
                          <div className="type-body rounded-md bg-slate-50 p-3.5 text-slate-800 border border-slate-200">
                            <span className="type-meta font-bold text-slate-900 block mb-1">
                              Ulasan Reflektif Akhir:
                            </span>
                            <p>{item.narrative}</p>
                          </div>

                          {/* Supplementary Scientific Summary (Walsh et al., 2025 & Arthur et al., 2003/2008) */}
                          <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="type-meta font-bold text-slate-900">
                                Evaluasi Ilmiah Tambahan (Walsh et al., 2025 &amp; Arthur et al., 2003/2008)
                              </span>
                              <span className="type-meta rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono font-bold text-blue-700">
                                Indeks BARS: {sciReport.overall_bars_score}/100
                              </span>
                            </div>
                            <p className="type-meta text-slate-700">
                              {sciReport.construct_validity_note} ({sciReport.total_positive_indicators} indikator positif, {sciReport.total_negative_indicators} indikator negatif).
                            </p>
                          </div>

                          {/* Turn-by-turn log */}
                          <div>
                            <span className="type-meta font-bold text-slate-900 block mb-2">
                              Rincian Keputusan per Skenario:
                            </span>
                            <div className="space-y-2.5">
                              {item.history.map((h, idx) => {
                                const turnSci =
                                  h.scientific_eval ||
                                  sciReport.turn_evaluations[idx] ||
                                  calculateScientificTurnEvaluation(
                                    `SCN_0${h.scenario_index || idx + 1}`,
                                    h.player_message
                                  );
                                const detected = turnSci.extracted_features.filter((f) => f.present);
                                return (
                                <div
                                  key={idx}
                                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="type-meta font-semibold text-slate-900">
                                      {h.scenario_title}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="type-meta rounded-sm border border-slate-200 bg-white px-2 py-0.5 font-mono font-semibold text-slate-800">
                                        BARS: {turnSci.composite_bars_score}/100
                                      </span>
                                      <span className="type-meta rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono font-bold text-blue-700">
                                        Skor: {h.avgScore}/10
                                      </span>
                                    </div>
                                  </div>
                                  <div className="type-body text-slate-800 bg-white p-2.5 rounded-md border border-slate-200 font-medium mb-2">
                                    &ldquo;{h.player_message}&rdquo;
                                  </div>
                                  <div className="type-meta grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                                    <div>
                                      <span className="font-semibold text-slate-900">Komunikasi:</span>{" "}
                                      {h.scores.komunikasi}/10 ({h.rationale.komunikasi})
                                    </div>
                                    <div>
                                      <span className="font-semibold text-slate-900">Empati:</span>{" "}
                                      {h.scores.empati}/10 ({h.rationale.empati})
                                    </div>
                                    <div>
                                      <span className="font-semibold text-slate-900">Ketegasan:</span>{" "}
                                      {h.scores.ketegasan}/10 ({h.rationale.ketegasan})
                                    </div>
                                    <div>
                                      <span className="font-semibold text-slate-900">Krisis:</span>{" "}
                                      {h.scores.krisis}/10 ({h.rationale.krisis})
                                    </div>
                                  </div>
                                  {detected.length > 0 && (
                                    <div className="mt-2 border-t border-slate-200 pt-2 flex flex-wrap gap-1.5">
                                      {detected.map((f) => (
                                        <span
                                          key={f.indicator_id}
                                          className={`type-meta rounded-sm border px-1.5 py-0.5 font-mono ${
                                            f.polarity === "positive"
                                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                              : "border-red-200 bg-red-50 text-red-800"
                                          }`}
                                        >
                                          {f.indicator_id} ({f.weight > 0 ? `+${f.weight}` : f.weight})
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
