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
  ShieldCheck,
  Heart,
  Target,
  Inbox,
  ArrowLeft,
  Calendar,
  Layers,
  Flame,
  FileText,
  UserCheck,
} from "lucide-react";
import RadarCard from "./RadarCard";

interface DashboardScreenProps {
  history: SimulationHistoryRecord[];
  onStartNew: (domain?: DomainType) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const TIER_COLORS = {
  S: "bg-slate-900 text-white border-slate-800",
  A: "bg-blue-600 text-white border-blue-500",
  B: "bg-slate-700 text-white border-slate-600",
  C: "bg-amber-700 text-white border-amber-600",
  D: "bg-rose-700 text-white border-rose-600",
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

  // Compute aggregate metrics
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

  // Highest rank achieved
  const rankOrder = ["S", "A", "B", "C", "D"];
  const bestRank =
    totalSessions > 0
      ? rankOrder.find((r) => history.some((h) => h.rankTier === r)) || "C"
      : "-";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Kembali"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-black text-sm">
                L
              </span>
              <div>
                <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Dashboard &amp; Riwayat Kepemimpinan</span>
                  <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    {totalSessions} Sesi
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalSessions > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-600"
                title="Hapus riwayat simulasi"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Riwayat</span>
              </button>
            )}

            <button
              onClick={() => onStartNew()}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-98 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
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
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Simulasi</span>
              <History className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
              {totalSessions}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Skenario krisis dimainkan</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Rata-rata Skor</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
              {avgOverallScore}
              <span className="text-xs font-normal text-slate-400"> / 100</span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Komposit keputusan &amp; hasil</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tingkat Kemenangan</span>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
              {winRate}%
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">{victoriesCount} dari {totalSessions} sukses 100%</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Rank Tertinggi</span>
              <Award className="h-4 w-4 text-slate-700" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">Tier {bestRank}</span>
              {bestRank !== "-" && (
                <span
                  className={`rounded px-2 py-0.5 text-xs font-black uppercase border ${
                    TIER_COLORS[bestRank as keyof typeof TIER_COLORS] || ""
                  }`}
                >
                  {bestRank}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Pencapaian kepemimpinan</p>
          </div>
        </div>

        {/* Radar & Overview Analytics */}
        {totalSessions > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            <RadarCard avg={avgScoresAll} />

            <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Karakteristik &amp; Profil Kepemimpinan Kumulatif
                  </h2>
                </div>

                <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
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

              <div className="mt-6 rounded-md bg-blue-50/80 p-4 border border-blue-100">
                <span className="text-xs font-bold text-blue-900 block mb-1">
                  Krisis Tak Terduga Menanti:
                </span>
                <p className="text-[11px] text-blue-700 leading-normal mb-3">
                  Sistem mengacak secara otomatis antara <b>Tech Startup</b>, <b>Organisasi Kampus / BEM</b>,{" "}
                  <b>Corporate Agency</b>, atau <b>Drama Sosial (Skandal Kas)</b> dengan latar aktor dinamis.
                </p>
                <button
                  onClick={() => onStartNew()}
                  className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-98 cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Mulai Simulasi Baru (Domain Acak)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <Inbox className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              Belum Ada Riwayat Simulasi
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Mulai sesi pertamamu sekarang. Hadapi krisis anggota ghosting, burnout tim, atau drama
              sosial untuk mencatat evaluasi kepemimpinan pertamamu.
            </p>
            <button
              onClick={() => onStartNew()}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Mulai Sesi Simulasi Sekarang</span>
            </button>
          </div>
        )}

        {/* History List Section */}
        {totalSessions > 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  <span>Daftar Sesi Simulasi &amp; Rekam Evaluasi ({filteredHistory.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Klik pada sesi untuk melihat rincian keputusan, balasan tim, dan rasionale penilai.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: "all", label: "Semua Domain" },
                  { id: "tech_startup", label: "💻 Tech" },
                  { id: "campus_org", label: "🏛️ Kampus" },
                  { id: "corporate_agency", label: "💼 Korporat" },
                  { id: "social_drama", label: "🔥 Drama Sosial" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedDomain(tab.id)}
                    className={`rounded-md px-2.5 py-1 font-medium transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
                      selectedDomain === tab.id
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((item) => {
                const isExpanded = expandedId === item.id;
                const tierClass =
                  TIER_COLORS[item.rankTier as keyof typeof TIER_COLORS] || TIER_COLORS.C;

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-lg border border-slate-200 transition hover:border-slate-300"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex w-full items-center justify-between bg-slate-50/70 p-4 text-left transition hover:bg-slate-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-base font-black border ${tierClass}`}
                        >
                          {item.rankTier}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {item.outcomeTitle}
                            </span>
                            {item.domain === "social_drama" && (
                              <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.2 text-[10px] font-bold text-rose-700">
                                Rare
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
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
                          <div className="font-mono text-sm font-black text-slate-900">
                            Skor: {item.overallScore}/100
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Progres: {item.finalProgress}% | Morale: {item.finalMorale}%
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-white p-4 sm:p-5 space-y-4">
                        {/* Narrative summary */}
                        <div className="rounded-md bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-1">
                            Ulasan Reflektif Akhir:
                          </span>
                          <p>{item.narrative}</p>
                        </div>

                        {/* Turn-by-turn log */}
                        <div>
                          <span className="text-xs font-bold text-slate-800 block mb-2">
                            Rincian Keputusan per Skenario:
                          </span>
                          <div className="space-y-2.5">
                            {item.history.map((h, idx) => (
                              <div
                                key={idx}
                                className="rounded-md border border-slate-200 bg-slate-50/60 p-3 text-xs"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-semibold text-slate-800">
                                    {h.scenario_title}
                                  </span>
                                  <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700">
                                    Skor: {h.avgScore}/10
                                  </span>
                                </div>
                                <div className="text-slate-600 bg-white p-2 rounded border border-slate-200 font-medium text-[11px] mb-2">
                                  &ldquo;{h.player_message}&rdquo;
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                                  <div>
                                    <span className="font-semibold text-slate-700">Komunikasi:</span>{" "}
                                    {h.scores.komunikasi}/10 ({h.rationale.komunikasi})
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Empati:</span>{" "}
                                    {h.scores.empati}/10 ({h.rationale.empati})
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Ketegasan:</span>{" "}
                                    {h.scores.ketegasan}/10 ({h.rationale.ketegasan})
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Krisis:</span>{" "}
                                    {h.scores.krisis}/10 ({h.rationale.krisis})
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
