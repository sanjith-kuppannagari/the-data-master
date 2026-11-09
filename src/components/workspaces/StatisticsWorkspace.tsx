import React, { useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sigma,
  BookOpen,
} from 'lucide-react';
import {
  calculateConfidenceInterval,
  calculateDescriptiveStats,
  calculateZScore,
} from '../../services/statisticsEngine';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface StatisticsWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

export const StatisticsWorkspace: React.FC<StatisticsWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const [sampleInput, setSampleInput] = useState<string>('12, 15, 18, 22, 25, 28, 190');
  const [zTargetX, setZTargetX] = useState<string>('625');
  const [zMean, setZMean] = useState<string>('500');
  const [zStd, setZStd] = useState<string>('50');

  const [numericAnswer, setNumericAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [showDerivation, setShowDerivation] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setNumericAnswer('');
    setSelectedOption(-1);
    setGradeResult(null);
    setShowDerivation(false);
    setStartTime(Date.now());

    if (exercise?.datasetContext && exercise.datasetContext.length > 0) {
      const keys = Object.keys(exercise.datasetContext[0]);
      const numKey = keys.find(
        (k) => k !== 'day' && k !== 'deal_id' && typeof exercise.datasetContext![0][k] === 'number'
      );
      if (numKey) {
        const series = exercise.datasetContext.map((r) => r[numKey]).join(', ');
        setSampleInput(series);
      }
    }
  }, [exercise?.id]);

  const parsedSeries = useMemo(() => {
    return sampleInput
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
  }, [sampleInput]);

  const statsSummary = useMemo(
    () => calculateDescriptiveStats(parsedSeries),
    [parsedSeries]
  );

  const ci95 = useMemo(
    () =>
      calculateConfidenceInterval(
        statsSummary.mean,
        statsSummary.sampleStdDev,
        statsSummary.count,
        0.95
      ),
    [statsSummary]
  );

  const computedZ = useMemo(
    () =>
      calculateZScore(
        Number(zTargetX) || 0,
        Number(zMean) || 0,
        Number(zStd) || 1
      ),
    [zTargetX, zMean, zStd]
  );

  const handleSubmit = () => {
    if (!exercise) return;
    const grade = evaluatePracticeExercise(exercise, {
      numericInput: numericAnswer,
      selectedOptionIndex: selectedOption,
    });
    setGradeResult(grade);
    setShowDerivation(true);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onAttemptComplete?.(grade, elapsed);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Interactive Statistical Calculator */}
      <div className="lg:col-span-5 bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sigma className="w-4 h-4 text-[#C6F36B]" />
          <span className="font-display text-sm font-bold text-[#F5F3EA]">
            Live Statistical Workbench
          </span>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1">
            Sample Observations (Comma-Separated Numbers)
          </label>
          <input
            type="text"
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
            className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
          />
        </div>

        {/* Computed Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">Sample Mean (x̄)</div>
            <div className="text-sm font-bold text-[#C6F36B]">{statsSummary.mean}</div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">Median (P50)</div>
            <div className="text-sm font-bold text-[#75D6D0]">{statsSummary.median}</div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">Sample Std Dev (s)</div>
            <div className="text-sm font-bold text-[#F5F3EA]">{statsSummary.sampleStdDev}</div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">Sample Variance (s²)</div>
            <div className="text-sm font-bold text-[#F5F3EA]">{statsSummary.sampleVariance}</div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">Q1 / Q3</div>
            <div className="text-xs font-bold text-[#F5F3EA]">
              {statsSummary.q1} / {statsSummary.q3}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-lg p-2.5">
            <div className="text-[10px] text-[#9BA3B4]">IQR (Q3 - Q1)</div>
            <div className="text-sm font-bold text-[#FFAA73]">{statsSummary.iqr}</div>
          </div>
        </div>

        <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-1 text-[11px] font-mono">
          <div className="text-[#9BA3B4]">
            95% Confidence Interval:{' '}
            <span className="text-[#75D6D0]">
              [{ci95.lowerBound}, {ci95.upperBound}]
            </span>
          </div>
          <div className="text-[#9BA3B4]">
            Tukey Outlier Fences:{' '}
            <span className="text-[#F5F3EA]">
              [{statsSummary.lowerOutlierFence}, {statsSummary.upperOutlierFence}]
            </span>
          </div>
          <div className="text-[#9BA3B4]">
            Detected Outliers:{' '}
            <span className="text-[#FFAA73]">
              {statsSummary.outliers.length > 0 ? statsSummary.outliers.join(', ') : 'None'}
            </span>
          </div>
        </div>

        {/* Z-Score Mini Solver */}
        <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-2">
          <div className="text-xs font-bold text-[#F5F3EA] flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-[#75D6D0]" />
            Z-Score Standardizer: Z = (x - μ) / σ
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-[#9BA3B4]">Value (x)</label>
              <input
                type="number"
                value={zTargetX}
                onChange={(e) => setZTargetX(e.target.value)}
                className="w-full bg-[#0C121E] border border-white/15 rounded px-2 py-1 text-xs text-[#F5F3EA]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#9BA3B4]">Mean (μ)</label>
              <input
                type="number"
                value={zMean}
                onChange={(e) => setZMean(e.target.value)}
                className="w-full bg-[#0C121E] border border-white/15 rounded px-2 py-1 text-xs text-[#F5F3EA]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#9BA3B4]">Std Dev (σ)</label>
              <input
                type="number"
                value={zStd}
                onChange={(e) => setZStd(e.target.value)}
                className="w-full bg-[#0C121E] border border-white/15 rounded px-2 py-1 text-xs text-[#F5F3EA]"
              />
            </div>
          </div>
          <div className="text-xs font-mono text-[#C6F36B]">
            Computed Z-Score: <span className="font-bold">{computedZ}</span>
          </div>
        </div>
      </div>

      {/* Right Exercise Solver & Derivation */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0]">
              Statistical Analysis Submission
            </span>
            {exercise?.stepByStepDerivation && (
              <button
                type="button"
                onClick={() => setShowDerivation(!showDerivation)}
                className="text-xs text-[#9BA3B4] hover:text-[#C6F36B] flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showDerivation ? 'Hide Derivation' : 'Show Formula Steps'}
              </button>
            )}
          </div>

          {exercise?.inputMode === 'numeric_input' ? (
            <div className="space-y-3">
              <label className="text-xs text-[#F5F3EA] font-medium block">
                Enter your calculated numeric result:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={numericAnswer}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  placeholder="e.g. 22 or 2.5"
                  className="flex-1 bg-[#101827] border border-white/15 rounded-lg px-4 py-2.5 text-sm font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Submit Calculation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {(exercise?.options || []).map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                      selectedOption === idx
                        ? 'bg-[#C6F36B]/15 border-[#C6F36B] text-[#F5F3EA]'
                        : 'bg-[#101827] border-white/10 text-[#F5F3EA]/85 hover:border-white/25'
                    }`}
                  >
                    <span className="font-mono font-bold text-[#75D6D0] mr-2">
                      [{String.fromCharCode(65 + idx)}]
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Validate Conclusion
              </button>
            </div>
          )}
        </div>

        {/* Grade Result */}
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
                  ? 'Statistical Analysis Verified!'
                  : 'Calculation / Interpretation Logged in Mistake Journal'}
              </div>
              <p className="text-[#F5F3EA]/90">{gradeResult.feedback}</p>
            </div>
          </div>
        )}

        {/* Step-by-Step Mathematical Derivation */}
        {showDerivation && exercise?.stepByStepDerivation && (
          <div className="bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-[#C6F36B] uppercase tracking-wider">
              Step-by-Step Mathematical Derivation
            </div>
            <ol className="space-y-1.5 text-xs font-mono text-[#F5F3EA]/90">
              {exercise.stepByStepDerivation.map((step, i) => (
                <li key={i} className="bg-[#101827] p-2.5 rounded border border-white/5">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
