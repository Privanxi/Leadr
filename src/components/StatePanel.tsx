import React, { useState } from "react";
import {
  Character,
  TeamState,
  StateDelta,
  UserDossier,
} from "../types";
import {
  Heart,
  ShieldCheck,
  Target,
  Zap,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StatePanelProps {
  state: TeamState;
  delta: StateDelta | null;
  characters: Character[];
  userDossier?: UserDossier;
  scenarioIndex?: number;
}

export default function StatePanel({
  state,
  delta,
  characters,
  userDossier,
}: StatePanelProps) {
  const [activeTab, setActiveTab] = useState<"team" | "project">("team");
  const [expandedChar, setExpandedChar] = useState<string | null>(
    characters[0]?.name || null
  );

  const isSynergyBuff = state.morale >= 75 && state.trust >= 75;
  const isBurnoutDebuff = state.morale < 40;
  const isDangerZone = state.morale <= 15 || state.trust <= 15;

  return (
    <aside
      aria-label="Panel Status Tim dan Target Proyek"
      className="surface-card flex flex-col gap-3 rounded-lg p-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"
    >
      {/* Target Progress Tracker */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="type-meta flex items-center gap-1.5 font-semibold text-slate-900">
            <Target className="h-4 w-4 text-blue-600" />
            Target Progress
          </span>
          <span className="type-body font-mono font-bold text-blue-600">
            {state.progress}% / 100%
          </span>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={state.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-slate-200"
        >
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, state.progress))}%` }}
          />
        </div>

        <div className="type-meta mt-2 flex items-center justify-between text-slate-600">
          <span>Tuntas saat 100%</span>
          <span>Gagal jika Morale / Trust = 0%</span>
        </div>
      </div>

      {/* Morale and Trust Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {/* Morale gauge */}
        <div
          className={`rounded-md border p-3 transition ${
            isDangerZone
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="type-meta flex items-center gap-1 font-semibold text-slate-700">
              <Heart className="h-3.5 w-3.5 text-red-600" />
              Morale
            </span>
            <div className="flex items-center gap-1 font-mono text-slate-900">
              <span className="type-body font-bold">{state.morale}%</span>
              {delta && delta.morale !== 0 && (
                <span
                  className={`type-meta font-bold ${
                    delta.morale > 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {delta.morale > 0 ? `+${delta.morale}` : delta.morale}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-slate-100">
            <div
              className={`h-full transition-all duration-300 ${
                state.morale >= 75
                  ? "bg-emerald-600"
                  : state.morale < 40
                  ? "bg-red-600"
                  : "bg-amber-600"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, state.morale))}%` }}
            />
          </div>
        </div>

        {/* Trust gauge */}
        <div
          className={`rounded-md border p-3 transition ${
            isDangerZone
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="type-meta flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              Trust
            </span>
            <div className="flex items-center gap-1 font-mono text-slate-900">
              <span className="type-body font-bold">{state.trust}%</span>
              {delta && delta.trust !== 0 && (
                <span
                  className={`type-meta font-bold ${
                    delta.trust > 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {delta.trust > 0 ? `+${delta.trust}` : delta.trust}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-slate-100">
            <div
              className={`h-full transition-all duration-300 ${
                state.trust >= 75
                  ? "bg-emerald-600"
                  : state.trust < 40
                  ? "bg-red-600"
                  : "bg-amber-600"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, state.trust))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buff & Debuff Notification Bar */}
      {isSynergyBuff && (
        <div className="type-meta flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-900">
          <Zap className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>Synergy Buff Aktif: Morale &amp; Trust &gt; 75% (+50% Laju Progres)</span>
        </div>
      )}

      {isBurnoutDebuff && (
        <div className="type-meta flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-900">
          <Flame className="h-3.5 w-3.5 text-red-700 shrink-0" />
          <span>Burnout Debuff: Morale &lt; 40% (-50% Penalti Progres)</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div
        role="tablist"
        aria-label="Navigasi Detail Tim dan Deliverable"
        className="flex rounded-md border border-slate-200 bg-slate-100 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "team"}
          onClick={() => setActiveTab("team")}
          className={`type-meta flex-1 rounded-sm py-1.5 font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
            activeTab === "team"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Kondisi Tim ({characters.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "project"}
          onClick={() => setActiveTab("project")}
          className={`type-meta flex-1 rounded-sm py-1.5 font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
            activeTab === "project"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Status Deliverable
        </button>
      </div>

      {/* Tab 1: Characters Roster */}
      {activeTab === "team" && (
        <div className="space-y-2">
          {characters.map((c) => {
            const isExpanded = expandedChar === c.name;
            const staminaColor =
              c.fitness.stamina >= 70
                ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                : c.fitness.stamina <= 35
                ? "text-red-800 bg-red-50 border-red-200"
                : "text-amber-800 bg-amber-50 border-amber-200";

            return (
              <div
                key={c.name}
                className="overflow-hidden rounded-md border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedChar(isExpanded ? null : c.name)}
                  className="flex w-full items-center justify-between p-2.5 text-left hover:bg-slate-50 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`type-meta flex h-7 w-7 items-center justify-center rounded-md text-white font-bold ${
                        c.avatarColor || "bg-slate-800"
                      }`}
                    >
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="type-meta font-bold text-slate-900">
                          {c.name}
                        </span>
                        <span className="type-meta text-slate-600">
                          · {c.role}
                        </span>
                      </div>
                      <span className="type-meta block font-medium text-slate-700">
                        {c.mood}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`type-meta rounded-sm px-1.5 py-0.5 font-mono font-semibold border ${staminaColor}`}
                    >
                      {c.fitness.stamina}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-600" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="type-meta rounded-sm border border-slate-200 bg-white p-2 text-slate-800">
                      &ldquo;{c.fitness.condition}&rdquo;
                    </div>

                    <div>
                      <span className="type-meta font-semibold text-slate-900 block">
                        Tanggung Jawab:
                      </span>
                      <p className="type-meta text-slate-700 mt-0.5">
                        {c.jobdesk}
                      </p>
                    </div>

                    <div>
                      <span className="type-meta font-semibold text-slate-900 block">
                        Karakter:
                      </span>
                      <p className="type-meta text-slate-700 mt-0.5">
                        {c.personality}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Project Milestones */}
      {activeTab === "project" && (
        <div className="space-y-2">
          {state.milestones.map((m) => {
            const statusBadge =
              m.status === "done"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : m.status === "blocked"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200";

            return (
              <div
                key={m.id}
                className="rounded-md border border-slate-200 bg-white p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="type-meta font-semibold text-slate-900">
                    {m.name}
                  </div>
                  <span
                    className={`type-meta rounded-sm px-1.5 py-0.5 font-mono font-semibold border ${statusBadge}`}
                  >
                    {m.progress}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-sm bg-slate-100">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
                  />
                </div>

                <div className="type-meta flex items-center justify-between text-slate-600">
                  <span>PIC: {m.assignedTo}</span>
                  <span>Bobot: {m.weight}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Dossier Summary Footer */}
      {userDossier && (
        <div className="mt-auto border-t border-slate-200 pt-3">
          <div className="type-meta font-semibold text-slate-900">
            Peranmu: {userDossier.role}
          </div>
          <p className="type-meta mt-0.5 text-slate-600">
            {userDossier.responsibility}
          </p>
        </div>
      )}
    </aside>
  );
}
