import React, { useEffect, useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  Code2,
  Layers,
} from 'lucide-react';
import { executePythonCode, PythonExecutionResult } from '../../services/pythonEngine';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface PythonWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

export const PythonWorkspace: React.FC<PythonWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const [pyCode, setPyCode] = useState<string>(
    exercise?.starterCode ||
      `# Preloaded analytical helpers: np, DataFrame, orders_data, employees_data\ndf = DataFrame(orders_data)\nprint("Orders Shape:", df.shape)\nprint("\\nRegional Revenue Summary:")\nprint(df.groupby_agg('region', 'revenue', 'sum'))`
  );
  const [execResult, setExecResult] = useState<PythonExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (exercise) {
      setPyCode(exercise.starterCode || '');
      setExecResult(null);
      setGradeResult(null);
      setStartTime(Date.now());
    }
  }, [exercise?.id]);

  const handleRunPython = async () => {
    setIsRunning(true);
    setGradeResult(null);
    const res = await executePythonCode(pyCode);
    setExecResult(res);
    setIsRunning(false);
  };

  const handleValidateExercise = async () => {
    if (!exercise) return;
    setIsRunning(true);
    const res = await executePythonCode(pyCode);
    setExecResult(res);
    setIsRunning(false);

    const grade = evaluatePracticeExercise(exercise, {
      pythonCode: pyCode,
      pythonResult: res,
    });
    setGradeResult(grade);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onAttemptComplete?.(grade, elapsed);
  };

  const handleReset = () => {
    setPyCode(
      exercise?.starterCode ||
        `df = DataFrame(orders_data)\nprint(df.describe('revenue'))`
    );
    setExecResult(null);
    setGradeResult(null);
  };

  const insertSnippet = (snippet: string) => {
    setPyCode((prev) => `${prev.trim()}\n\n${snippet}\n`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Preloaded Analytics Environment Reference */}
      <div className="lg:col-span-4 bg-[#171C26] border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Layers className="w-4 h-4 text-[#C6F36B]" />
          <span className="font-display text-sm font-bold text-[#F5F3EA]">
            Python Analytics Environment
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-1.5">
            <div className="font-mono text-[#75D6D0] font-semibold flex items-center justify-between">
              <span>orders_data (8 rows)</span>
              <button
                type="button"
                onClick={() =>
                  insertSnippet(`df = DataFrame(orders_data)\nprint(df.head(5))`)
                }
                className="text-[10px] text-[#C6F36B] hover:underline"
              >
                + Insert
              </button>
            </div>
            <p className="text-[11px] text-[#9BA3B4] font-mono">
              order_id, region, category, units, revenue, cost, profit
            </p>
          </div>

          <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-1.5">
            <div className="font-mono text-[#75D6D0] font-semibold flex items-center justify-between">
              <span>employees_data (6 rows)</span>
              <button
                type="button"
                onClick={() =>
                  insertSnippet(
                    `emp_df = DataFrame(employees_data)\nprint(emp_df.groupby_agg('dept', 'salary', 'mean'))`
                  )
                }
                className="text-[10px] text-[#C6F36B] hover:underline"
              >
                + Insert
              </button>
            </div>
            <p className="text-[11px] text-[#9BA3B4] font-mono">
              emp_id, name, dept, salary, tenure_yrs, rating
            </p>
          </div>

          <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-2">
            <div className="font-mono text-[#FFAA73] font-semibold">
              Preloaded Modules & Methods
            </div>
            <ul className="space-y-1 text-[11px] font-mono text-[#F5F3EA]/85">
              <li>• np.mean(arr), np.median(arr)</li>
              <li>• np.std(arr), np.var(arr)</li>
              <li>• np.percentile(arr, q), np.iqr(arr)</li>
              <li>• np.corrcoef(x, y)</li>
              <li>• DataFrame(rows).describe(col)</li>
              <li>• df.groupby_agg(by, col, fn)</li>
              <li>• df.filter_eq(col, val)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Code Editor & Console */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-[#171C26] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#101827] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#C6F36B]" />
              <span className="font-mono text-xs text-[#F5F3EA]">
                analysis_script.py (Skulpt Python Runtime)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleRunPython}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-lg bg-[#75D6D0]/20 border border-[#75D6D0]/40 hover:bg-[#75D6D0]/30 text-xs font-semibold text-[#75D6D0] flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? 'Running...' : 'Run Python'}
              </button>
              {exercise && (
                <button
                  type="button"
                  onClick={handleValidateExercise}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Validate & Submit
                </button>
              )}
            </div>
          </div>

          <textarea
            value={pyCode}
            onChange={(e) => setPyCode(e.target.value)}
            rows={9}
            spellCheck={false}
            placeholder="Write Python code here..."
            className="w-full bg-[#0C121E] text-[#F5F3EA] font-mono text-xs p-4 leading-relaxed focus:outline-none resize-y"
          />
        </div>

        {/* Grade Banner */}
        {gradeResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              gradeResult.isCorrect
                ? 'bg-[#C6F36B]/10 border-[#C6F36B]/40 text-[#F5F3EA]'
                : 'bg-[#FFAA73]/10 border-[#FFAA73]/40 text-[#F5F3EA]'
            }`}
          >
            {gradeResult.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-[#C6F36B] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#FFAA73] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs">
              <div className="font-bold">
                {gradeResult.isCorrect
                  ? 'Python Exercise Passed!'
                  : 'Validation Needs Adjustment — Recorded in Mistake Journal'}
              </div>
              <p className="text-[#F5F3EA]/90 whitespace-pre-wrap">{gradeResult.feedback}</p>
            </div>
          </div>
        )}

        {/* Standard Output / Runtime Error Console */}
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#75D6D0]" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#9BA3B4]">
                Python Standard Output Console
              </span>
            </div>
            {execResult && (
              <span className="text-[11px] font-mono text-[#9BA3B4] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#75D6D0]" />
                {execResult.executionTimeMs} ms
              </span>
            )}
          </div>

          {!execResult && (
            <div className="py-8 text-center text-xs text-[#9BA3B4]">
              Click <span className="text-[#75D6D0] font-semibold">Run Python</span> to execute
              your script in the isolated browser runtime.
            </div>
          )}

          {execResult && !execResult.success && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-red-300 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {execResult.error}
              </div>
              {execResult.errorHint && (
                <div className="text-xs text-[#F5F3EA]/90 bg-[#101827]/80 p-3 rounded border border-white/10">
                  <span className="text-[#FFAA73] font-semibold">Debugging Hint: </span>
                  {execResult.errorHint}
                </div>
              )}
              {execResult.stdout && (
                <pre className="bg-[#0C121E] p-3 rounded text-xs font-mono text-[#F5F3EA]/80 overflow-x-auto">
                  {execResult.stdout}
                </pre>
              )}
            </div>
          )}

          {execResult && execResult.success && (
            <pre className="bg-[#0C121E] border border-white/10 rounded-lg p-4 text-xs font-mono text-[#C6F36B] overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[110px]">
              {execResult.stdout || '# Script finished with no print() output.'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
