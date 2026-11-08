import React, { useState } from "react";
import {
  Character,
  TeamState,
  StateDelta,
  ProjectMilestone,
  UserDossier,
} from "../types";
import {
  Heart,
  ShieldCheck,
  Target,
  Zap,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
  CheckCircle2,
  Clock,
  UserCheck,
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
  scenarioIndex = 1,
}: StatePanelProps) {
  const [activeTab, setActiveTab] = useState<"team" | "project">("team");
  const [expandedChar, setExpandedChar] = useState<string | null>(
    characters[0]?.name || null
  );

  const isSynergyBuff = state.morale >= 75 && state.trust >= 75;
  const isBurnoutDebuff = state.morale < 40;
  const isDangerZone = state.morale <= 15 || state.trust <= 15;

  return (
    <aside className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
      {/* Target Progress Tracker */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-slate-900">
            <Target className="h-4 w-4 text-blue-600" />
            Target Progress
          </span>
          <span className="font-mono text-sm font-bold text-blue-700">
            {state.progress}% / 100%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, state.progress))}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Tuntas saat 100%</span>
          <span>Kalah jika Morale / Trust = 0%</span>
        </div>
      </div>

      {/* Morale and Trust Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Morale gauge */}
        <div
          className={`rounded-md border p-2.5 transition ${
            isDangerZone
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Heart className="h-3.5 w-3.5 text-rose-600" />
              Morale
            </span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-900">
              <span>{state.morale}%</span>
              {delta && delta.morale !== 0 && (
                <span
                  className={`text-[10px] font-bold ${
                    delta.morale > 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {delta.morale > 0 ? `+${delta.morale}` : delta.morale}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-slate-100">
            <div
              className={`h-full transition-all duration-300 ${
                state.morale >= 75
                  ? "bg-emerald-600"
                  : state.morale < 40
                  ? "bg-red-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, state.morale))}%` }}
            />
          </div>
        </div>

        {/* Trust gauge */}
        <div
          className={`rounded-md border p-2.5 transition ${
            isDangerZone
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              Trust
            </span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-900">
              <span>{state.trust}%</span>
              {delta && delta.trust !== 0 && (
                <span
                  className={`text-[10px] font-bold ${
                    delta.trust > 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {delta.trust > 0 ? `+${delta.trust}` : delta.trust}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-slate-100">
            <div
              className={`h-full transition-all duration-300 ${
                state.trust >= 75
                  ? "bg-emerald-600"
                  : state.trust < 40
                  ? "bg-red-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, state.trust))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buff & Debuff Notification Bar */}
      {isSynergyBuff && (
        <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">
          <Zap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Synergy Buff Aktif: Morale &amp; Trust &gt; 75% (+50% Laju Progres)</span>
        </div>
      )}

      {isBurnoutDebuff && (
        <div className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-800">
          <Flame className="h-3.5 w-3.5 text-red-600 shrink-0" />
          <span>Burnout Debuff: Morale &lt; 40% (-50% Penalti Progres)</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`flex-1 rounded py-1 font-semibold transition cursor-pointer ${
            activeTab === "team"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Kondisi Tim ({characters.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`flex-1 rounded py-1 font-semibold transition cursor-pointer ${
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
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : c.fitness.stamina <= 35
                ? "text-red-700 bg-red-50 border-red-200"
                : "text-amber-700 bg-amber-50 border-amber-200";

            return (
              <div
                key={c.name}
                className="overflow-hidden rounded-md border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setExpandedChar(isExpanded ? null : c.name)}
                  className="flex w-full items-center justify-between p-2.5 text-left hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded text-white font-bold text-xs ${
                        c.avatarColor || "bg-slate-700"
                      }`}
                    >
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          · {c.role}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">
                        {c.mood}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold border ${staminaColor}`}
                    >
                      {c.fitness.stamina}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2 text-xs">
                    <div className="rounded border border-slate-200 bg-white p-2 text-slate-700 text-[11px] italic">
                      "{c.fitness.condition}"
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 text-[11px] block">
                        Tanggung Jawab:
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                        {c.jobdesk}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 text-[11px] block">
                        Karakter:
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
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
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : m.status === "blocked"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200";

            return (
              <div
                key={m.id}
                className="rounded-md border border-slate-200 bg-white p-2.5 text-xs space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-900 text-xs">
                    {m.name}
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-semibold border ${statusBadge}`}
                  >
                    {m.progress}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
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
        <div className="mt-auto border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700">
            Peranmu: {userDossier.role}
          </div>
          <p className="mt-0.5 text-slate-600 leading-normal">
            {userDossier.responsibility}
          </p>
        </div>
      )}
    </aside>
  );
}
