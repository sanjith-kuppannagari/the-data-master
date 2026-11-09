export type ExerciseType =
  | 'sql'
  | 'python'
  | 'spreadsheet'
  | 'statistics'
  | 'visualization'
  | 'business_kpi'
  | 'dataset_investigation'
  | 'analytical_reasoning';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ErrorCategory =
  | 'SQL Query & Syntax'
  | 'Python Logic & Runtime'
  | 'Spreadsheet Formula'
  | 'Statistical Calculation'
  | 'Chart & Visual Encoding'
  | 'Business KPI Reasoning'
  | 'Conceptual Misconception';

export interface SpreadsheetCellData {
  row: number;
  col: string; // 'A', 'B', 'C', etc.
  raw: string; // raw input e.g. "=SUM(B2:B5)" or "1200"
  value: string | number | boolean | null;
}

export interface PracticeExercise {
  id: string;
  title: string;
  domainId: string;
  topicId: string;
  subtopic: string;
  type: ExerciseType;
  isCoding: boolean;
  difficulty: ExerciseDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  objective: string;
  scenario: string;
  instructions: string[];
  evaluationCriteria: string;
  hints: string[];
  explanation: string;

  // For SQL exercises
  sqlDatabaseId?: 'ecommerce' | 'hr_analytics' | 'saas_metrics';
  starterCode?: string;
  solutionCode?: string;
  expectedColumns?: string[];
  expectedRowCount?: number;
  expectedFirstRowValues?: (string | number)[];
  requiredSqlKeywords?: string[];

  // For Python exercises
  expectedStdoutContains?: string[];
  requiredPythonTokens?: string[];

  // For Spreadsheet exercises
  initialGrid?: Record<string, string | number>; // e.g. { A1: 'Product', B1: 'Sales', A2: 'Laptop', B2: 1200 }
  targetCell?: string; // e.g. 'B6' or 'D2'
  expectedCellValue?: number | string;
  requiredFormulaFunction?: string; // e.g. 'SUM', 'AVERAGE', 'IF', 'XLOOKUP'

  // For Statistics / Business / Viz / Reasoning exercises (structured & numerical)
  datasetContext?: Record<string, string | number>[];
  inputMode?: 'multiple_choice' | 'numeric_input' | 'chart_builder';
  options?: string[];
  correctOptionIndex?: number;
  expectedNumericAnswer?: number;
  numericTolerance?: number; // e.g. 0.05
  stepByStepDerivation?: string[];

  // For Chart Builder exercises
  recommendedChartType?: 'bar' | 'line' | 'area' | 'scatter' | 'pie';
  recommendedXKey?: string;
  recommendedYKey?: string;
}

export interface PracticeAttempt {
  id: string;
  exerciseId: string;
  domainId: string;
  topicId: string;
  exerciseType: ExerciseType;
  isCorrect: boolean;
  submittedAnswer: string;
  timestamp: string;
  timeSpentSeconds?: number;
}

export interface MistakeRecord {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  domainId: string;
  domainName: string;
  topicId: string;
  topicTitle: string;
  exerciseType: ExerciseType;
  submittedAnswer: string;
  expectedAnswer: string;
  errorCategory: ErrorCategory;
  explanation: string;
  attemptDate: string;
  attemptCount: number;
  reviewStatus: 'needs_review' | 'marked_for_revision' | 'resolved';
  resolvedAt?: string;
}

export interface RevisionRecommendation {
  id: string;
  topicId: string;
  topicTitle: string;
  domainId: string;
  domainName: string;
  priorityScore: number; // 0-100
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  mistakeCount: number;
  accuracyPercent: number;
  recommendedExerciseIds: string[];
  inLearningPath: boolean;
}

export interface DatasetColumnProfile {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'date';
  totalCount: number;
  missingCount: number;
  missingPercent: number;
  uniqueCount: number;
  sampleValues: (string | number | boolean | null)[];
}

export interface NumericColumnStats {
  column: string;
  count: number;
  missing: number;
  mean: number;
  median: number;
  mode: number | null;
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
}

export interface PlaygroundDataset {
  id: string;
  name: string;
  source: string;
  description: string;
  isUploaded: boolean;
  uploadedAt?: string;
  domainTag: string;
  rows: Record<string, any>[];
}

export interface SavedFinding {
  id: string;
  datasetId: string;
  datasetName: string;
  title: string;
  observation: string;
  metricSummary?: string;
  createdAt: string;
}
