import type {
  TeamState,
  Scenario,
  HistoryEntry,
  ResultResponse,
  ChatMessage,
  UserDossier,
  DomainType,
  SimulationHistoryRecord,
} from "../types.ts";
import {
  DOMAIN_CHARACTERS,
  DOMAIN_MILESTONES,
  USER_DOSSIERS,
} from "./seeds.ts";

export interface Session {
  id: string;
  domain: DomainType;
  state: TeamState;
  scenario_index: number;
  current: Scenario | null;
  transcript: ChatMessage[];
  history: HistoryEntry[];
  awaiting_response: boolean;
  result: ResultResponse | null;
  userDossier: UserDossier;
  created_at: number;
}

const SESSION_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours
const SESSIONS = new Map<string, Session>();
const SIMULATION_HISTORY: SimulationHistoryRecord[] = [];

function gc(): void {
  const now = Date.now();
  for (const [id, session] of SESSIONS.entries()) {
    if (now - session.created_at > SESSION_TTL_MS) {
      SESSIONS.delete(id);
    }
  }
}

export function createSession(domain: DomainType = "tech_startup"): Session {
  gc();
  const id = Math.random().toString(36).substring(2, 14);

  const initialChars = (DOMAIN_CHARACTERS[domain] || DOMAIN_CHARACTERS.tech_startup).map((c) => ({
    ...c,
    fitness: { ...c.fitness },
  }));

  const initialMilestones = (DOMAIN_MILESTONES[domain] || DOMAIN_MILESTONES.tech_startup).map((m) => ({
    ...m,
  }));

  const userDossier = { ...(USER_DOSSIERS[domain] || USER_DOSSIERS.tech_startup) };

  const session: Session = {
    id,
    domain,
    state: {
      morale: 55,
      trust: 60,
      progress: 25,
      buffActive: false,
      debuffActive: false,
      characters: initialChars,
      milestones: initialMilestones,
    },
    scenario_index: 1,
    current: null,
    transcript: [],
    history: [],
    awaiting_response: false,
    result: null,
    userDossier,
    created_at: Date.now(),
  };

  SESSIONS.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return SESSIONS.get(id);
}

export function deleteSession(id: string): void {
  SESSIONS.delete(id);
}

export function recordHistory(record: SimulationHistoryRecord): void {
  // Keep newest first, max 50 records
  SIMULATION_HISTORY.unshift(record);
  if (SIMULATION_HISTORY.length > 50) {
    SIMULATION_HISTORY.pop();
  }
}

export function getHistory(): SimulationHistoryRecord[] {
  return [...SIMULATION_HISTORY];
}

export function clearHistory(): void {
  SIMULATION_HISTORY.length = 0;
}
