import React from "react";
import { DomainType } from "../types";
import { DOMAINS } from "../server/seeds";
import {
  Users,
  ArrowRight,
  TrendingUp,
  Flame,
  AlertTriangle,
  History,
  Dices,
  Shield,
  Layers,
  Activity,
  Terminal,
} from "lucide-react";

interface LandingProps {
  onStart: (domain?: DomainType) => void;
  isLoading: boolean;
  error: string | null;
  modeInfo?: { gemini_configured: boolean; mode: string } | null;
  onOpenDashboard?: () => void;
  historyCount?: number;
}

export default function Landing({
  onStart,
  isLoading,
  error,
  modeInfo,
  onOpenDashboard,
  historyCount = 0,
}: LandingProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-sm">
              L
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 text-sm">
                Leadr
              </span>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                Simulasi Kepemimpinan & Krisis Organisasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
              >
                <History className="h-3.5 w-3.5 text-slate-600" />
                <span>Dashboard</span>
                {historyCount > 0 && (
                  <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-700">
                    {historyCount}
                  </span>
                )}
              </button>
            )}


            <button
              type="button"
              onClick={() => onStart()}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition cursor-pointer"
            >
              <Dices className="h-3.5 w-3.5" />
              <span>{isLoading ? "Memproses..." : "Mulai Simulasi"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs">
            <Terminal className="h-3.5 w-3.5 text-blue-600" />
            <span>Interactive Crisis Decision Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Pimpin Tim Menuju Target 100%, <br />
            Tanpa Mengorbankan Rekan Kerja.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sebagai Ketua Tim, kamu akan dihadapkan pada skenario krisis organisasi tak terduga.
            Karakteristik dan kondisi rekan tim berubah dinamis di setiap tahap.
            Terapkan ketegasan, dengarkan dengan empati, dan kelola konflik sebelum moral tim kolaps.
          </p>

          {/* Primary Call to Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStart()}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition cursor-pointer"
            >
              <Dices className="h-4 w-4" />
              <span>{isLoading ? "Mengacak Skenario..." : "Mulai Skenario Acak"}</span>
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </button>

            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <History className="h-4 w-4 text-slate-500" />
                <span>Lihat Evaluasi Sebelumnya ({historyCount})</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Kondisi Selesai: Progres 100% · Kegagalan Kritis: Morale atau Trust mencapai 0%
          </p>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 text-left">
              {error}
            </div>
          )}
        </div>

        {/* 4 Crisis Domains Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Lingkup Krisis yang Diacak Otomatis:
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              4 Skenario Domain
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                        domain.isRare
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {domain.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {domain.isRare ? "~22%" : "Acak"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {domain.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Karakter:
                  </span>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Kepribadian &amp; stamina berkembang di tiap tahap
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Rules Section */}
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Synergy Buff (+50% Laju)</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Jika <b>Morale &gt;= 75%</b> dan <b>Trust &gt;= 75%</b>, koordinasi tim optimal dan
              peningkatan progres proyek bertambah 50% lebih cepat.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
              <Flame className="h-4 w-4 text-amber-600" />
              <span>Burnout Debuff (-50% Penalti)</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Jika <b>Morale &lt; 40%</b>, tim mengalami kelelahan mental akut dan laju penyelesaian
              proyek melambat 50%.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Kegagalan Fatal (0%)</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Jika <b>Morale mencapai 0%</b> (Mental Breakdown) atau <b>Trust mencapai 0%</b> (Tim
              Bubar), simulasi langsung berakhir dengan kegagalan.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
