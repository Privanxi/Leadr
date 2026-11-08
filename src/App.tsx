import React, { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import {
  ChatMessage,
  ResultResponse,
  Scenario,
  TeamState,
  RespondResponse,
  StateDelta,
  UserDossier,
  DomainType,
  SimulationHistoryRecord,
} from "./types";
import Landing from "./components/Landing";
import ChatPanel from "./components/ChatPanel";
import StatePanel from "./components/StatePanel";
import ResultScreen from "./components/ResultScreen";
import DashboardScreen from "./components/DashboardScreen";
import { ArrowLeft, Loader2, History, RotateCcw } from "lucide-react";

type Screen = "landing" | "sim" | "loadingResult" | "result" | "dashboard";
type Phase = "idle" | "evaluating" | "reacted" | "loadingNext";

function playTone(type: "pop" | "chime" | "warning" | "buff") {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "pop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "chime") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "buff") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(739.99, now + 0.08); // F#5
      osc.frequency.setValueAtTime(880.0, now + 0.16); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.24); // D6
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "warning") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio errors
  }
}

const LOCAL_STORAGE_HISTORY_KEY = "leadr_sim_history_v1";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [sid, setSid] = useState("");
  const [currentDomain, setCurrentDomain] = useState<DomainType>("tech_startup");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [userDossier, setUserDossier] = useState<UserDossier | undefined>(undefined);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<TeamState | null>(null);
  const [delta, setDelta] = useState<StateDelta | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isGameOver, setIsGameOver] = useState(false);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modeInfo, setModeInfo] = useState<{ gemini_configured: boolean; mode: string } | null>(null);
  const [activeModel, setActiveModel] = useState<string>("gemini-3.8-flash");
  const [fallbackModelUsed, setFallbackModelUsed] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<SimulationHistoryRecord[]>([]);

  // Load history from server and localStorage
  const refreshHistory = useCallback(async () => {
    try {
      const serverRes = await api.getHistory();
      if (serverRes && Array.isArray(serverRes.history)) {
        setHistoryRecords(serverRes.history);
        try {
          localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(serverRes.history));
        } catch {}
      }
    } catch {
      // Fallback to localStorage if server history is empty or unreachable
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
        if (local) {
          setHistoryRecords(JSON.parse(local));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    api.checkHealth()
      .then((h) => {
        setModeInfo({ gemini_configured: h.gemini_configured, mode: h.mode });
        if (h.active_model) setActiveModel(h.active_model);
        if (h.fallback_triggered) setFallbackModelUsed(true);
      })
      .catch(() => {});
    refreshHistory();
  }, [refreshHistory]);

  const handleErr = (e: any) => {
    console.error("App error:", e);
    const msg =
      e?.status === 404
        ? "Sesi simulasi telah berakhir atau server di-restart. Silakan mulai ulang sesi."
        : e?.message || "Terjadi kendala pada sistem. Silakan coba kembali.";
    setError(msg);
  };

  const startSimulation = useCallback(
    async (domain?: DomainType) => {
      setError(null);
      setLoading(true);
      try {
        const res = await api.start(domain);
        setSid(res.session_id);
        setCurrentDomain(res.domain);
        setScenario(res.scenario);
        setUserDossier(res.userDossier);
        setChat(res.scenario.messages);
        setState(res.state);
        setDelta(null);
        setPhase("idle");
        setIsGameOver(false);
        setScreen("sim");
        if (res.active_model) setActiveModel(res.active_model);
        if (soundEnabled) playTone("pop");
      } catch (e) {
        handleErr(e);
      } finally {
        setLoading(false);
      }
    },
    [soundEnabled]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autostart") === "1" && screen === "landing") {
      startSimulation();
    }
  }, [startSimulation, screen]);

  const sendResponse = async (text: string) => {
    setError(null);
    setPhase("evaluating");

    const playerMsg: ChatMessage = {
      sender: "Kamu",
      role: "Ketua",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChat((prev) => [...prev, playerMsg]);
    if (soundEnabled) playTone("pop");

    try {
      const res: RespondResponse = await api.respond(sid, text);
      setChat((prev) => [...prev, ...res.team_reactions]);
      setState(res.state);
      setDelta(res.state_delta);
      setIsGameOver(res.is_game_over);
      setPhase("reacted");
      if (res.active_model) setActiveModel(res.active_model);
      if (res.fallback_model_used) setFallbackModelUsed(true);

      if (soundEnabled) {
        if (res.state.buffActive) {
          playTone("buff");
        } else if (res.state.debuffActive || res.state.morale <= 15) {
          playTone("warning");
        } else {
          playTone("chime");
        }
      }
    } catch (e) {
      handleErr(e);
      setPhase("idle");
    }
  };

  const proceedNext = async () => {
    setError(null);
    try {
      if (isGameOver) {
        setScreen("loadingResult");
        if (soundEnabled) playTone("chime");
        const res = await api.result(sid);
        setResult(res);
        setScreen("result");
        refreshHistory();
      } else {
        setPhase("loadingNext");
        const next = await api.next(sid);
        setScenario(next.scenario);
        setChat(next.scenario.messages);
        setDelta(null);
        setPhase("idle");
        if (soundEnabled) playTone("pop");
      }
    } catch (e) {
      handleErr(e);
      setPhase("reacted");
      setScreen("sim");
    }
  };

  const handleRestart = (domain?: DomainType) => {
    setScreen("landing");
    setSid("");
    setScenario(null);
    setChat([]);
    setState(null);
    setResult(null);
    setDelta(null);
    setIsGameOver(false);
    setError(null);
    if (domain) {
      startSimulation(domain);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.clearHistory();
    } catch {}
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch {}
    setHistoryRecords([]);
  };

  if (screen === "landing") {
    return (
      <Landing
        onStart={startSimulation}
        isLoading={loading}
        error={error}
        modeInfo={modeInfo}
        onOpenDashboard={() => setScreen("dashboard")}
        historyCount={historyRecords.length}
      />
    );
  }

  if (screen === "dashboard") {
    return (
      <DashboardScreen
        history={historyRecords}
        onStartNew={(domain) => {
          setScreen("landing");
          startSimulation(domain || "tech_startup");
        }}
        onClearHistory={handleClearHistory}
        onClose={() => setScreen("landing")}
      />
    );
  }

  if (screen === "loadingResult") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h2 className="mt-4 text-base font-bold text-slate-900">
          Menyusun Evaluasi Kepemimpinan &amp; Akumulasi Skor...
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Menganalisis pencapaian target 100% progres, akumulasi skor skenario, dan radar 4 dimensi.
        </p>
      </div>
    );
  }

  if (screen === "result" && result) {
    return (
      <ResultScreen
        r={result}
        onRestart={handleRestart}
        onOpenDashboard={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
      {/* Top Navbar Bar */}
      <nav className="border-b border-slate-200 bg-white px-4 py-2.5 shadow-2xs sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRestart()}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 transition"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-600" />
              <span>Kembali</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-black text-sm text-white">
                L
              </span>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                Leadr
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">·</span>
              <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                Target: 100% Progres | Jaga Morale &amp; Trust &gt; 0%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScreen("dashboard")}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Buka Dashboard Riwayat"
            >
              <History className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Simulation Layout */}
      {state && (
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-[1fr_340px]">
          <ChatPanel
            scenario={scenario}
            messages={chat}
            phase={phase}
            isGameOver={isGameOver}
            error={error}
            activeModel={activeModel}
            fallbackModelUsed={fallbackModelUsed}
            onSend={sendResponse}
            onProceed={proceedNext}
          />

          <StatePanel
            state={state}
            delta={delta}
            characters={state.characters}
            userDossier={userDossier}
            scenarioIndex={scenario?.index || 1}
          />
        </div>
      )}
    </div>
  );
}
