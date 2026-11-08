import {
  StartResponse,
  RespondResponse,
  NextResponse,
  ResultResponse,
  DomainType,
  DomainInfo,
  SimulationHistoryRecord,
} from "./types";

const BASE = "/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    const err = new Error(body.detail || body.error || `HTTP ${r.status}`) as Error & {
      status?: number;
    };
    err.status = r.status;
    throw err;
  }
  return r.json();
}

export const api = {
  checkHealth: () =>
    req<{
      ok: boolean;
      gemini_configured: boolean;
      mode: string;
      primary_model?: string;
      active_model?: string;
      candidate_models?: string[];
      fallback_triggered?: boolean;
    }>("/health"),
  getDomains: () => req<{ domains: DomainInfo[] }>("/domains"),
  start: (domain?: DomainType) =>
    req<StartResponse>("/session/start", {
      method: "POST",
      body: JSON.stringify({ domain: domain || "random" }),
    }),
  respond: (id: string, message: string) =>
    req<RespondResponse>(`/session/${id}/respond`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  next: (id: string) => req<NextResponse>(`/session/${id}/next`, { method: "POST" }),
  result: (id: string) => req<ResultResponse>(`/session/${id}/result`),
  getHistory: () => req<{ history: SimulationHistoryRecord[] }>("/history"),
  clearHistory: () => req<{ ok: boolean }>("/history", { method: "DELETE" }),
};
