import {
  BusinessSimulation,
  Challenge,
  ChallengeTask,
  Competition,
  DataDetectiveMystery,
} from '../types/challenge';
import { executeSQLQuery, SQLQueryResult } from './sqlEngine';
import { executePythonCode, PythonExecutionResult } from './pythonEngine';
import { evaluateFormulaString } from './spreadsheetEngine';

export interface TaskEvaluationResult {
  taskId: string;
  isCorrect: boolean;
  score: number; // 0 - 100 for this task
  feedback: string;
}

export interface ChallengeEvaluationResult {
  isPassed: boolean;
  totalScore: number; // 0 - 100
  feedback: string;
  taskResults: Record<string, TaskEvaluationResult>;
}

export interface SimulationEvaluationResult {
  isPassed: boolean;
  score: number;
  feedback: string;
  rubricBreakdown: {
    analyticalAccuracy: number; // Max 40
    evidenceInterpretation: number; // Max 30
    actionableFeasibility: number; // Max 30
  };
}

export interface DetectiveEvaluationResult {
  isSolved: boolean;
  score: number;
  feedback: string;
}

export async function evaluateChallengeTask(
  task: ChallengeTask,
  userAnswer: any,
  context?: {
    sqlDatabaseId?: 'ecommerce' | 'hr_analytics' | 'saas_metrics';
    sqlResult?: SQLQueryResult;
    pythonResult?: PythonExecutionResult;
  }
): Promise<TaskEvaluationResult> {
  // 1. Multiple Choice Task
  if (task.submissionMode === 'multiple_choice') {
    const selectedIdx = Number(userAnswer);
    const correctIdx = task.correctOptionIndex ?? 0;
    if (Number.isNaN(selectedIdx) || selectedIdx < 0) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: 'No option was selected for this task.',
      };
    }
    const isCorrect = selectedIdx === correctIdx;
    return {
      taskId: task.id,
      isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? 'Correct choice. Your analytical inference is verified.'
        : `Incorrect choice. Option ${correctIdx + 1} best matches the evidence.`,
    };
  }

  // 2. Numeric Value Task
  if (task.submissionMode === 'numeric_value') {
    const cleanNum = Number(String(userAnswer ?? '').replace(/[,$%]/g, '').trim());
    const expected = task.expectedNumericValue ?? 0;
    const tolerance = task.numericTolerance ?? 0.05;

    if (userAnswer === undefined || userAnswer === null || Number.isNaN(cleanNum)) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: 'Please enter a valid numeric calculation.',
      };
    }

    const diff = Math.abs(cleanNum - expected);
    const isCorrect = diff <= tolerance;
    return {
      taskId: task.id,
      isCorrect,
      score: isCorrect ? 100 : Math.max(0, 100 - Math.round((diff / (expected || 1)) * 100)),
      feedback: isCorrect
        ? `Spot on! Calculated value ${cleanNum} matches target (${expected}).`
        : `Calculation mismatch: entered ${cleanNum}, expected ${expected} (tolerance: ±${tolerance}).`,
    };
  }

  // 3. Spreadsheet Formula Task
  if (task.submissionMode === 'spreadsheet_formula') {
    const formulaStr = String(userAnswer ?? '').trim();
    if (!formulaStr.startsWith('=')) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: 'Formula must begin with an equals sign "=" (e.g. =SUM(B2:B10)).',
      };
    }

    const evalRes = evaluateFormulaString(formulaStr, {});
    if (evalRes.errorCode) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: `Spreadsheet formula returned error ${evalRes.errorCode}: ${evalRes.errorHint}`,
      };
    }

    const expected = task.expectedNumericValue;
    if (expected !== undefined) {
      const numVal = Number(evalRes.value);
      const isCorrect = !Number.isNaN(numVal) && Math.abs(numVal - expected) <= (task.numericTolerance ?? 0.05);
      return {
        taskId: task.id,
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedback: isCorrect
          ? `Formula evaluated accurately to ${evalRes.value}.`
          : `Formula evaluated to ${evalRes.value}, but expected ${expected}.`,
      };
    }

    return {
      taskId: task.id,
      isCorrect: true,
      score: 100,
      feedback: `Formula validated cleanly: ${evalRes.value}`,
    };
  }

  // 4. SQL Query Task
  if (task.submissionMode === 'sql_query') {
    const sqlCode = String(userAnswer ?? '').trim();
    if (!sqlCode) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: 'Please enter a SQL query.',
      };
    }

    const dbId = context?.sqlDatabaseId || 'ecommerce';
    const res = context?.sqlResult || (await executeSQLQuery(dbId, sqlCode));

    if (!res.success) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: `SQL Error: ${res.error}${res.errorHint ? ` — ${res.errorHint}` : ''}`,
      };
    }

    if (task.expectedRowCount !== undefined && res.rowCount !== task.expectedRowCount) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 50,
        feedback: `Query returned ${res.rowCount} row(s), but ${task.expectedRowCount} were expected.`,
      };
    }

    if (task.expectedColumns && task.expectedColumns.length > 0) {
      const returnedColsLower = res.columns.map((c) => c.toLowerCase());
      const missingCols = task.expectedColumns.filter(
        (c) => !returnedColsLower.includes(c.toLowerCase())
      );
      if (missingCols.length > 0) {
        return {
          taskId: task.id,
          isCorrect: false,
          score: 60,
          feedback: `Missing expected column(s): ${missingCols.join(', ')}.`,
        };
      }
    }

    return {
      taskId: task.id,
      isCorrect: true,
      score: 100,
      feedback: `Query executed successfully returning ${res.rowCount} validated row(s).`,
    };
  }

  // 5. Python Code Task
  if (task.submissionMode === 'python_code') {
    const pyCode = String(userAnswer ?? '').trim();
    if (!pyCode) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: 'Please enter Python code.',
      };
    }

    const res = context?.pythonResult || (await executePythonCode(pyCode));
    if (!res.success) {
      return {
        taskId: task.id,
        isCorrect: false,
        score: 0,
        feedback: `Python Runtime Error: ${res.error}${res.errorHint ? ` — ${res.errorHint}` : ''}`,
      };
    }

    if (task.expectedOutputContains && task.expectedOutputContains.length > 0) {
      const missingTokens = task.expectedOutputContains.filter(
        (token) => !res.stdout.includes(token)
      );
      if (missingTokens.length > 0) {
        return {
          taskId: task.id,
          isCorrect: false,
          score: 50,
          feedback: `Output missing expected text: ${missingTokens.join(', ')}.`,
        };
      }
    }

    return {
      taskId: task.id,
      isCorrect: true,
      score: 100,
      feedback: 'Python script executed cleanly and produced the expected analytical output.',
    };
  }

  // 6. Structured Rubric / Analytical Text Task
  const text = String(userAnswer ?? '').trim();
  if (text.length < 20) {
    return {
      taskId: task.id,
      isCorrect: false,
      score: 20,
      feedback: 'Analytical response is too brief. Provide a structured explanation citing evidence.',
    };
  }

  const keywords = task.rubricKeywords || [];
  let matchedKw = 0;
  for (const kw of keywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      matchedKw++;
    }
  }

  const kwRatio = keywords.length > 0 ? matchedKw / keywords.length : 1;
  const score = Math.min(100, Math.round(50 + kwRatio * 50));
  const isCorrect = score >= 70;

  return {
    taskId: task.id,
    isCorrect,
    score,
    feedback: isCorrect
      ? `Strong analytical justification (${matchedKw}/${keywords.length} key concepts referenced).`
      : `Reasoning needs more rigor. Mention key factors like: ${keywords.slice(0, 3).join(', ')}.`,
  };
}

export async function evaluateChallenge(
  challenge: Challenge,
  userSubmission: {
    draftCode?: string;
    draftWritten?: string;
    taskAnswers: Record<string, any>;
    sqlResult?: SQLQueryResult;
    pythonResult?: PythonExecutionResult;
  }
): Promise<ChallengeEvaluationResult> {
  const taskResults: Record<string, TaskEvaluationResult> = {};
  let totalScore = 0;

  for (const task of challenge.tasks) {
    let answer = userSubmission.taskAnswers[task.id];
    if (answer === undefined) {
      if (task.submissionMode === 'sql_query') answer = userSubmission.draftCode;
      else if (task.submissionMode === 'python_code') answer = userSubmission.draftCode;
      else if (task.submissionMode === 'structured_rubric') answer = userSubmission.draftWritten;
    }

    const tRes = await evaluateChallengeTask(task, answer, {
      sqlDatabaseId: challenge.sqlDatabaseId,
      sqlResult: userSubmission.sqlResult,
      pythonResult: userSubmission.pythonResult,
    });
    taskResults[task.id] = tRes;
    totalScore += tRes.score;
  }

  const avgScore = challenge.tasks.length > 0 ? Math.round(totalScore / challenge.tasks.length) : 0;
  const isPassed = avgScore >= 70 && Object.values(taskResults).every((t) => t.isCorrect);

  const feedback = isPassed
    ? `Challenge Mastered! You achieved an overall score of ${avgScore}%. Outstanding analytical execution.`
    : `Challenge in progress (${avgScore}%). Review the specific task feedback and hints to resolve discrepancies.`;

  return {
    isPassed,
    totalScore: avgScore,
    feedback,
    taskResults,
  };
}

export function evaluateSimulationRecommendation(
  simulation: BusinessSimulation,
  answers: Record<string, any>,
  recommendationText: string
): SimulationEvaluationResult {
  // 1. Analytical Accuracy (40%): multiple-choice decision questions
  let correctDecisions = 0;
  for (const q of simulation.decisionQuestions) {
    if (Number(answers[q.id]) === q.correctOptionIndex) {
      correctDecisions++;
    }
  }
  const decRatio = simulation.decisionQuestions.length > 0 ? correctDecisions / simulation.decisionQuestions.length : 1;
  const analyticalAccuracy = Math.round(decRatio * 40);

  // 2. Evidence Interpretation (30%): metrics and quantitative grounding
  const text = (recommendationText || '').toLowerCase();
  const essentialKeywords = simulation.rubricCriteria.essentialKeywords || [];
  let foundKeywords = 0;
  for (const kw of essentialKeywords) {
    if (text.includes(kw.toLowerCase())) {
      foundKeywords++;
    }
  }
  const kwRatio = essentialKeywords.length > 0 ? Math.min(1, foundKeywords / Math.min(essentialKeywords.length, 3)) : 1;
  const evidenceInterpretation = Math.round(kwRatio * 30);

  // 3. Actionable Feasibility (30%): structured recommendation length and clarity
  const words = text.trim().split(/\s+/).filter(Boolean);
  let actionableFeasibility = 0;
  if (words.length >= 60) actionableFeasibility = 30;
  else if (words.length >= 35) actionableFeasibility = 22;
  else if (words.length >= 15) actionableFeasibility = 14;
  else actionableFeasibility = 6;

  const totalScore = analyticalAccuracy + evidenceInterpretation + actionableFeasibility;
  const isPassed = totalScore >= 70;

  const feedback = isPassed
    ? `Executive Recommendation Approved (${totalScore}/100). You identified the root cause and proposed a defensible, data-backed operational intervention.`
    : `Recommendation needs refinement (${totalScore}/100). Ensure you answer all decision questions correctly and ground your memo in specific dataset metrics (e.g. ${essentialKeywords.slice(0, 3).join(', ')}).`;

  return {
    isPassed,
    score: totalScore,
    feedback,
    rubricBreakdown: {
      analyticalAccuracy,
      evidenceInterpretation,
      actionableFeasibility,
    },
  };
}

export function evaluateDetectiveMystery(
  mystery: DataDetectiveMystery,
  answers: Record<string, any>,
  verdictIndex: number
): DetectiveEvaluationResult {
  let correctAnswers = 0;
  for (const q of mystery.investigationQuestions) {
    if (Number(answers[q.id]) === q.correctOptionIndex) {
      correctAnswers++;
    }
  }

  const qRatio = mystery.investigationQuestions.length > 0
    ? correctAnswers / mystery.investigationQuestions.length
    : 1;

  const isVerdictCorrect = verdictIndex === mystery.correctVerdictIndex;

  let score = Math.round(qRatio * 50);
  if (isVerdictCorrect) score += 50;

  const isSolved = isVerdictCorrect && qRatio >= 0.65;

  const feedback = isSolved
    ? `Case Solved! (${score}/100). You identified the true system anomaly, eliminated the red herrings, and delivered the correct forensic conclusion.`
    : !isVerdictCorrect
    ? `Case Unresolved (${score}/100). The forensic verdict submitted does not match the system audit logs. Interrogate the evidence clues more closely.`
    : `Partial deduction (${score}/100). Your final verdict is right, but some intermediate forensic deductions were incorrect. Review the investigation clues.`;

  return {
    isSolved,
    score,
    feedback,
  };
}

export function evaluateCompetitionEntry(
  competition: Competition,
  submissionText: string
): { score: number; feedback: string } {
  const text = (submissionText || '').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 15) {
    return {
      score: 40,
      feedback: 'Submission is too brief. Provide detailed methodology, metric calculations, and strategic takeaways.',
    };
  }

  // Evaluate based on depth, analytical terminology, and criteria coverage
  let bonus = 0;
  const terms = [
    'margin',
    'retention',
    'cohort',
    'growth',
    'cost',
    'revenue',
    'forecast',
    'anomaly',
    'p-value',
    'cac',
    'ltv',
    'threshold',
    'order',
    'analysis',
  ];
  for (const t of terms) {
    if (text.toLowerCase().includes(t)) bonus += 4;
  }

  const baseScore = Math.min(65, 52 + Math.round((wordCount / 50) * 18));
  const finalScore = Math.min(98, baseScore + Math.min(30, bonus));

  return {
    score: finalScore,
    feedback: `Official Entry Scored: ${finalScore}/100. Evaluated against ${competition.title} criteria. Leaderboard ranking updated.`,
  };
}
