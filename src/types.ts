export type Dim = "komunikasi" | "empati" | "ketegasan" | "krisis";

export type Scores = Record<Dim, number>;

export type DomainType = "tech_startup" | "campus_org" | "corporate_agency" | "social_drama";

export interface DomainInfo {
  id: DomainType;
  title: string;
  tagline: string;
  badge: string;
  icon: string;
  description: string;
  isRare?: boolean;
}

export interface CharacterFitness {
  sleepHours: number;
  stamina: number; // 0-100
  condition: string; // e.g. "Tidur 3 jam, mata sembab, burnout berat"
}

export interface Character {
  name: string;
  role: string;
  jobdesk: string;
  personality: string;
  fitness: CharacterFitness;
  morale: number; // 0-100 individual morale
  mood: string;
  avatarColor?: string;
}

export interface UserDossier {
  name: string;
  role: string;
  domain: DomainType;
  jobdesk: string;
  responsibility: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  weight: number; // contribution to total progress
  progress: number; // 0-100%
  status: "done" | "in_progress" | "blocked" | "pending";
  assignedTo: string;
  detail: string;
}

export interface TeamState {
  morale: number; // 0-100
  trust: number; // 0-100
  progress: number; // 0-100 (Objective: Reach 100%)
  buffActive?: boolean; // Morale >= 75 && Trust >= 75 (+50% progress multiplier)
  debuffActive?: boolean; // Morale < 40 (-50% progress multiplier)
  characters: Character[];
  milestones: ProjectMilestone[];
}

export interface StateDelta {
  morale: number;
  trust: number;
  progress: number;
  buffApplied?: boolean;
  debuffApplied?: boolean;
  message?: string;
}

export interface ChatMessage {
  id?: string;
  sender: string;
  role?: string;
  text: string;
  timestamp?: string;
  sentiment?: "positive" | "negative" | "neutral" | "question";
  taggedActors?: string[];
}

export interface Scenario {
  id?: string;
  index: number;
  domain: DomainType;
  title: string;
  archetype?: string; // Football Manager conflict archetype title
  archetypeCode?: string; // e.g. "FM-01" to "FM-15"
  dilemmaSummary?: string; // Core leadership dilemma
  timeRemaining: string; // e.g. "H-2 Demo Day (40 Jam Tersisa)"
  context: string;
  urgency: "Kritis" | "Tinggi" | "Sedang";
  messages: ChatMessage[];
  characters: Character[];
  suggestedAction?: string;
  isRare?: boolean;
}

/**
 * Scientific Behavioral Indicator (Walsh et al., 2025 & Arthur et al., 2003/2008)
 * Used purely as an additional objective evaluation layer.
 */
export type BehavioralIndicatorId =
  | "CRISIS_TRIAGE"
  | "RISK_CONTAINMENT"
  | "PASSIVE_BLAME"
  | "CLEAR_DELEGATION"
  | "TRANSPARENT_CONTEXT"
  | "VAGUE_INSTRUCTION"
  | "CHECK_WELLBEING"
  | "PSYCHOLOGICAL_SAFETY"
  | "HOSTILE_DISMISSAL"
  | "TAKE_ACCOUNTABILITY"
  | "TIMEBOUND_CHECKPOINT"
  | "AVOIDANT_DELAY";

export interface ExtractedBehavioralFeature {
  indicator_id: BehavioralIndicatorId;
  label: string;
  dimension: Dim;
  polarity: "positive" | "negative";
  weight: number; // e.g., +25, +20, -30, -15
  present: boolean;
  evidence: string | null;
}

export interface TurnScientificEvaluation {
  scenario_id: string;
  base_score: number; // Default 60
  dimension_scores: Record<Dim, number>; // 0-100 deterministic score per dimension
  dimension_deltas: Record<Dim, number>; // net +/- from extracted indicators
  composite_bars_score: number; // 0-100 average across the 4 Arthur et al. dimensions
  extracted_features: ExtractedBehavioralFeature[];
  objective_feedback: string[];
  anti_gaming_triggered?: boolean;
}

export interface CumulativeScientificReport {
  overall_bars_score: number; // 0-100 deterministic composite
  base_score: number;
  dimension_averages: Record<Dim, number>; // 0-100 per dimension
  total_positive_indicators: number;
  total_negative_indicators: number;
  construct_validity_note: string;
  objective_summary: string[];
  turn_evaluations: TurnScientificEvaluation[];
}

export interface StartResponse {
  session_id: string;
  domain: DomainType;
  scenario: Scenario;
  state: TeamState;
  userDossier: UserDossier;
  mode?: "gemini" | "mock";
  active_model?: string;
}

export interface RespondResponse {
  scores: Scores;
  rationale: Record<string, string>;
  team_reactions: ChatMessage[];
  state: TeamState;
  state_delta: StateDelta;
  is_game_over: boolean;
  outcome_code?: OutcomeCode;
  fallback_used: boolean;
  active_model?: string;
  fallback_model_used?: boolean;
  tagged_actors?: string[];
  scientific_eval?: TurnScientificEvaluation;
}

export interface NextResponse {
  scenario: Scenario;
  state: TeamState;
}

export interface HistoryEntry {
  scenario_index: number;
  scenario_title: string;
  domain?: DomainType;
  player_message: string;
  scores: Scores;
  avgScore: number;
  rationale: Record<string, string>;
  state_after: TeamState;
  timestamp: string;
  scientific_eval?: TurnScientificEvaluation;
}

export type OutcomeCode =
  | "VICTORY_100" // Progress reached 100%
  | "COLLAPSE_MORALE_0" // Morale reached 0%
  | "COLLAPSE_TRUST_0" // Trust reached 0%
  | "SUCCESS_SOLID"
  | "DONE_LOW_MORALE"
  | "SURVIVED_DELAYED"
  | "TEAM_COLLAPSED";

export type RankTier = "S" | "A" | "B" | "C" | "D";

export interface FinalScoreBreakdown {
  overallScore: number; // 0-100 composite score
  rankTier: RankTier;
  rankTitle: string;
  scenarioScores: Array<{
    scenario_index: number;
    scenario_title: string;
    domain: DomainType;
    player_message: string;
    scores: Scores;
    avgScore: number;
    rationale: Record<string, string>;
    scientific_eval?: TurnScientificEvaluation;
  }>;
  cumulativeMetrics: {
    totalTurns: number;
    avgKomunikasi: number;
    avgEmpati: number;
    avgKetegasan: number;
    avgKrisis: number;
    finalProgress: number;
    finalMorale: number;
    finalTrust: number;
  };
}

export interface ResultResponse {
  session_id?: string;
  domain: DomainType;
  avg_scores: Record<Dim, number>;
  outcome_code: OutcomeCode;
  outcome_title: string;
  narrative: string;
  recommendations: string[];
  state: TeamState;
  history: HistoryEntry[];
  totalTurns: number;
  finalScore: FinalScoreBreakdown;
  scientific_report?: CumulativeScientificReport;
}

export interface SimulationHistoryRecord {
  id: string;
  date: string;
  domain: DomainType;
  domainTitle: string;
  outcomeCode: OutcomeCode;
  outcomeTitle: string;
  overallScore: number;
  rankTier: RankTier;
  rankTitle: string;
  totalTurns: number;
  avgScores: Record<Dim, number>;
  finalProgress: number;
  finalMorale: number;
  finalTrust: number;
  history: HistoryEntry[];
  narrative: string;
  scientific_report?: CumulativeScientificReport;
}
