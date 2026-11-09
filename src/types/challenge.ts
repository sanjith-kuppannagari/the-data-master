export type ChallengeCategory =
  | 'sql'
  | 'python'
  | 'spreadsheet'
  | 'statistics'
  | 'visualization'
  | 'business_analytics'
  | 'dataset_investigation'
  | 'case_study';

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ChallengeStatus = 'available' | 'in_progress' | 'completed' | 'locked';

export type SubmissionMode =
  | 'sql_query'
  | 'python_code'
  | 'spreadsheet_formula'
  | 'numeric_value'
  | 'multiple_choice'
  | 'structured_rubric';

export interface ChallengeTask {
  id: string;
  order: number;
  prompt: string;
  objective: string;
  submissionMode: SubmissionMode;
  options?: string[];
  correctOptionIndex?: number;
  expectedNumericValue?: number;
  numericTolerance?: number;
  starterCode?: string;
  solutionCode?: string;
  expectedRowCount?: number;
  expectedColumns?: string[];
  expectedOutputContains?: string[];
  rubricKeywords?: string[];
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  domainId: string;
  topicId: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  isCoding: boolean;
  prerequisiteChallengeIds?: string[];
  scenario: string;
  backgroundContext: string;
  datasetName?: string;
  datasetDescription?: string;
  datasetRows?: Record<string, any>[];
  sqlDatabaseId?: 'ecommerce' | 'hr_analytics' | 'saas_metrics';
  tasks: ChallengeTask[];
  hints: string[];
  evaluationCriteria: string;
  explanation: string;
}

export interface ChallengeProgress {
  challengeId: string;
  status: 'in_progress' | 'completed';
  draftCode?: string;
  draftWrittenResponse?: string;
  taskAnswers: Record<string, any>;
  score?: number; // 0 - 100
  feedback?: string;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface BusinessSimulationQuestion {
  id: string;
  question: string;
  objective: string;
  options: string[];
  correctOptionIndex: number;
  rationale: string;
}

export interface BusinessSimulation {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  estimatedMinutes: number;
  businessBackground: string;
  businessObjective: string;
  businessProblem: string;
  availableInformation: string;
  datasetName: string;
  datasetDescription: string;
  datasetRows: Record<string, any>[];
  metricsSummary: Record<string, string | number>;
  investigationTasks: string[];
  decisionQuestions: BusinessSimulationQuestion[];
  recommendationPrompt: string;
  rubricCriteria: {
    analyticalAccuracy: string; // 40%
    evidenceInterpretation: string; // 30%
    actionableFeasibility: string; // 30%
    essentialKeywords: string[];
  };
  solutionExplanation: string;
}

export interface DetectiveClue {
  id: number;
  title: string;
  sourceType: string;
  content: string;
  relevance: 'High' | 'Medium' | 'Low / Red Herring';
  isRedHerring: boolean;
  hint: string;
}

export interface DetectiveQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  deductionHint: string;
}

export interface DataDetectiveMystery {
  id: string;
  caseFileNumber: string;
  title: string;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  estimatedMinutes: number;
  caseSummary: string;
  incidentTimestamp: string;
  suspectTheories: string[];
  clues: DetectiveClue[];
  evidenceDatasetName: string;
  evidenceDatasetRows: Record<string, any>[];
  investigationQuestions: DetectiveQuestion[];
  verdictOptions: string[];
  correctVerdictIndex: number;
  forensicExplanation: string;
}

export interface CompetitionLeaderboardEntry {
  rank: number;
  participantName: string;
  avatar: string;
  score: number;
  submittedAt: string;
  badge: string;
  isCurrentUser: boolean;
}

export interface Competition {
  id: string;
  title: string;
  type: 'individual' | 'weekly' | 'monthly';
  tier: 'beginner' | 'advanced';
  status: 'active' | 'upcoming' | 'completed';
  description: string;
  domainName: string;
  deadlineIso: string;
  xpReward: number;
  datasetContext: string;
  problemStatement: string;
  scoringCriteria: string[];
  requiredDeliverables: string[];
  leaderboard: CompetitionLeaderboardEntry[];
}
