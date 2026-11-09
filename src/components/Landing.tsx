import React from "react";
import { DomainType } from "../types";
import { DOMAINS } from "../server/seeds";
import {
  ArrowRight,
  TrendingUp,
  Flame,
  AlertTriangle,
  History,
  Dices,
  Terminal,
  Code,
  Users,
  Briefcase,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface LandingProps {
  onStart: (domain?: DomainType) => void;
  isLoading: boolean;
  error: string | null;
  onOpenDashboard?: () => void;
  historyCount?: number;
}

const DOMAIN_ICONS: Record<DomainType, React.ComponentType<{ className?: string }>> = {
  tech_startup: Code,
  campus_org: Users,
  corporate_agency: Briefcase,
  social_drama: ShieldAlert,
};

export default function Landing({
  onStart,
  isLoading,
  error,
  onOpenDashboard,
  historyCount = 0,
}: LandingProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Docked Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white font-bold type-body">
              L
            </div>
            <div className="flex items-center gap-2">
              <span className="type-subhead text-slate-900">Leadr</span>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="hidden sm:inline-block type-meta font-medium text-slate-600">
                Simulasi Kepemimpinan &amp; Krisis Organisasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 type-meta font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-600 transition cursor-pointer"
              >
                <History className="h-3.5 w-3.5 text-slate-600" />
                <span>Dashboard</span>
                {historyCount > 0 && (
                  <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono type-meta font-bold text-slate-800">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onStart()}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 type-meta font-semibold text-white shadow-2xs hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Dices className="h-3.5 w-3.5" />
              <span>{isLoading ? "Memproses..." : "Acak Domain"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-10">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 type-meta font-semibold text-slate-700 shadow-2xs">
            <Terminal className="h-3.5 w-3.5 text-blue-600" />
            <span>Interactive Crisis Decision Simulator</span>
          </div>

          <h1 className="type-heading sm:text-3xl text-slate-900">
            Pimpin Tim Menuju Target 100%, Tanpa Mengorbankan Rekan Kerja.
          </h1>

          <p className="type-body text-slate-600 max-w-2xl mx-auto">
            Sebagai Ketua Tim, kamu dihadapkan pada skenario krisis organisasi nyata.
            Pilih domain krisis yang ingin kamu hadapi di bawah, atau gunakan mode acak.
            Keputusanmu akan dinilai secara objektif pada 4 dimensi kepemimpinan.
          </p>

          {/* Primary Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStart()}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 type-body font-semibold text-white shadow-2xs hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Dices className="h-4 w-4" />
              <span>{isLoading ? "Memuat Skenario..." : "Mulai Domain Acak (Random)"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 type-body font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 transition cursor-pointer"
              >
                <History className="h-4 w-4 text-slate-600" />
                <span>Lihat Evaluasi Sebelumnya ({historyCount})</span>
              </button>
            )}
          </div>

          <p className="type-meta font-medium text-slate-600">
            Kondisi Selesai: Progres 100% · Kegagalan Kritis: Morale atau Trust mencapai 0%
          </p>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 type-meta font-medium text-red-800 text-left"
            >
              {error}
            </div>
          )}
        </section>

        {/* Domain Selection Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200 pb-3">
            <div>
              <h2 className="type-subhead text-slate-900">
                Pilih Domain Skenario Krisis
              </h2>
              <p className="type-meta text-slate-600 mt-0.5">
                Pilih domain spesifik untuk langsung menghadapi dinamika krisis tertentu, atau gunakan opsi acak.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onStart()}
                disabled={isLoading}
                className="type-meta inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer"
              >
                <Dices className="h-3.5 w-3.5 text-blue-600" />
                <span>Acak Saja</span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map((domain) => {
              const IconComp = DOMAIN_ICONS[domain.id] || Sparkles;

              return (
                <article
                  key={domain.id}
                  className="surface-card flex flex-col justify-between rounded-lg p-5 hover:border-blue-300 hover:shadow-xs transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 type-meta font-semibold uppercase tracking-wide text-slate-700">
                        {domain.badge}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                        <IconComp className="h-4 w-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="type-subhead text-slate-900 group-hover:text-blue-600 transition">
                        {domain.title}
                      </h3>
                      {domain.tagline && (
                        <p className="type-meta font-medium text-slate-500 mt-0.5 line-clamp-1">
                          {domain.tagline}
                        </p>
                      )}
                      <p className="mt-2 type-meta text-slate-600 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onStart(domain.id)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-md bg-white border border-slate-300 px-3 py-2 type-meta font-semibold text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                    >
                      <span>Pilih Domain Ini</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Core Rules Section */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-4">
            <div className="flex items-center gap-2 text-slate-900 type-subhead">
              <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Synergy Buff (+50% Laju)</span>
            </div>
            <p className="mt-1.5 type-meta text-slate-600">
              Jika <strong>Morale &gt;= 75%</strong> dan <strong>Trust &gt;= 75%</strong>, koordinasi
              tim optimal dan peningkatan progres proyek bertambah 50% lebih cepat.
            </p>
          </div>

          <div className="surface-card p-4">
            <div className="flex items-center gap-2 text-slate-900 type-subhead">
              <Flame className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Burnout Debuff (-50% Penalti)</span>
            </div>
            <p className="mt-1.5 type-meta text-slate-600">
              Jika <strong>Morale &lt; 40%</strong>, tim mengalami kelelahan mental akut dan laju
              penyelesaian proyek melambat 50%.
            </p>
          </div>

          <div className="surface-card p-4">
            <div className="flex items-center gap-2 text-slate-900 type-subhead">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>Kegagalan Fatal (0%)</span>
            </div>
            <p className="mt-1.5 type-meta text-slate-600">
              Jika <strong>Morale mencapai 0%</strong> (Mental Breakdown) atau{" "}
              <strong>Trust mencapai 0%</strong> (Tim Bubar), simulasi langsung berakhir.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
