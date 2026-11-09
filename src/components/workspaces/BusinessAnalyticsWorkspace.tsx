import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Table2,
  BookOpen,
} from 'lucide-react';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface BusinessAnalyticsWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

export const BusinessAnalyticsWorkspace: React.FC<BusinessAnalyticsWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const [numericAnswer, setNumericAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [executiveMemo, setExecutiveMemo] = useState<string>('');
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [showDerivation, setShowDerivation] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setNumericAnswer('');
    setSelectedOption(-1);
    setExecutiveMemo('');
    setGradeResult(null);
    setShowDerivation(false);
    setStartTime(Date.now());
  }, [exercise?.id]);

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

  const contextRows = exercise?.datasetContext || [];
  const contextCols = contextRows.length > 0 ? Object.keys(contextRows[0]) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Telemetry & KPI Reference Table */}
        <div className="lg:col-span-5 bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Table2 className="w-4 h-4 text-[#C6F36B]" />
            <span className="font-display text-sm font-bold text-[#F5F3EA]">
              Scenario Telemetry & KPI Formulas
            </span>
          </div>

          {contextRows.length > 0 && (
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="bg-[#101827]">
                  <tr>
                    {contextCols.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-[#75D6D0] font-semibold border-b border-white/10"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0C121E]">
                  {contextRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {contextCols.map((col) => (
                        <td key={col} className="px-3 py-2 text-[#F5F3EA]/90">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-2 text-[11px] font-mono text-[#F5F3EA]/85">
            <div className="text-[#FFAA73] font-bold">Core Commercial Formulas</div>
            <div>• NRR % = ((Start + Expansion - Contraction - Churn) / Start) × 100</div>
            <div>• CAC = Acquisition Spend / New Customers Acquired</div>
            <div>• Gross Margin LTV = ARPU × Gross Margin % × Avg Lifespan</div>
            <div>• Gross Margin % = ((Revenue - COGS) / Revenue) × 100</div>
          </div>
        </div>

        {/* Right Decision & Calculation Workspace */}
        <div className="lg:col-span-7 bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#75D6D0]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0]">
                Business KPI & Analytical Decision Board
              </span>
            </div>
            {exercise?.stepByStepDerivation && (
              <button
                type="button"
                onClick={() => setShowDerivation(!showDerivation)}
                className="text-xs text-[#9BA3B4] hover:text-[#C6F36B] flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {showDerivation ? 'Hide Steps' : 'Show Solution Steps'}
              </button>
            )}
          </div>

          {exercise?.inputMode === 'numeric_input' ? (
            <div className="space-y-3">
              <label className="text-xs font-medium text-[#F5F3EA] block">
                Enter your calculated KPI / metric value:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={numericAnswer}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  placeholder="Enter numeric value (e.g. 110, 4, 3100)"
                  className="flex-1 bg-[#101827] border border-white/15 rounded-lg px-4 py-2.5 text-sm font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Validate KPI
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

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1">
                  Optional Executive Notes & Hypothesis Scratchpad
                </label>
                <textarea
                  value={executiveMemo}
                  onChange={(e) => setExecutiveMemo(e.target.value)}
                  rows={2}
                  placeholder="Document your root-cause hypothesis or business recommendation..."
                  className="w-full bg-[#101827] border border-white/15 rounded-lg p-2.5 text-xs text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Submit Recommendation
              </button>
            </div>
          )}

          {showDerivation && exercise?.stepByStepDerivation && (
            <div className="bg-[#101827] border border-white/10 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-[#C6F36B]">
                Step-by-Step KPI Derivation
              </div>
              {exercise.stepByStepDerivation.map((s, i) => (
                <div key={i} className="text-xs font-mono text-[#F5F3EA]/90">
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                ? 'Commercial Reasoning Verified!'
                : 'Reasoning Feedback — Logged in Mistake Journal'}
            </div>
            <p className="text-[#F5F3EA]/90">{gradeResult.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
