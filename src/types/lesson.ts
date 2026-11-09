export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptKey: string;
}

export interface CodeExample {
  language: 'sql' | 'python' | 'excel' | 'text';
  code: string;
  explanation: string;
}

export interface PracticalExercise {
  title: string;
  prompt: string;
  language: 'sql' | 'python' | 'excel';
  starterCode: string;
  expectedOutputKeyword: string;
  solutionCode: string;
  hints: string[];
}

export interface Lesson {
  id: string;
  topicId: string;
  domainId: string;
  title: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  xpReward: number;
  overview: string;
  conceptMarkdown: string;
  keyTakeaways: string[];
  codeExample?: CodeExample;
  practicalExercise?: PracticalExercise;
  quiz: QuizQuestion[];
  revisionTopicId?: string;
  revisionReason?: string;
}

export interface LessonAttemptResult {
  lessonId: string;
  scorePercent: number;
  passed: boolean;
  xpAwarded: number;
  isDuplicate: boolean;
  incorrectQuestions: QuizQuestion[];
  needsRevision: boolean;
  revisionTopicId?: string;
  revisionReason?: string;
}
