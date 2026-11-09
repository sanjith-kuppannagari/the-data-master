import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FunctionSquare,
  ArrowUpDown,
} from 'lucide-react';
import { evaluateFullGrid } from '../../services/spreadsheetEngine';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface SpreadsheetWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E'];
const ROW_COUNT = 8;

const DEFAULT_SANDBOX_GRID: Record<string, string | number> = {
  A1: 'Channel',
  B1: 'Spend ($)',
  C1: 'Revenue ($)',
  D1: 'ROAS',
  E1: 'Status',
  A2: 'Paid Search',
  B2: 12500,
  C2: 53280,
  D2: '=ROUND(C2/B2, 2)',
  E2: '=IF(D2>=3, "High ROI", "Review")',
  A3: 'LinkedIn Ads',
  B3: 18000,
  C3: 66240,
  D3: '=ROUND(C3/B3, 2)',
  E3: '=IF(D3>=3, "High ROI", "Review")',
  A4: 'Display Ads',
  B4: 8400,
  C4: 15120,
  D4: '=ROUND(C4/B4, 2)',
  E4: '=IF(D4>=3, "High ROI", "Review")',
  A5: 'Total',
  B5: '=SUM(B2:B4)',
  C5: '=SUM(C2:C4)',
  D5: '=ROUND(C5/B5, 2)',
};

export const SpreadsheetWorkspace: React.FC<SpreadsheetWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const [rawGrid, setRawGrid] = useState<Record<string, string | number>>(
    exercise?.initialGrid ? { ...exercise.initialGrid } : { ...DEFAULT_SANDBOX_GRID }
  );
  const [selectedCell, setSelectedCell] = useState<string>(
    exercise?.targetCell || 'B6'
  );
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const initial = exercise?.initialGrid
      ? { ...exercise.initialGrid }
      : { ...DEFAULT_SANDBOX_GRID };
    setRawGrid(initial);
    const target = exercise?.targetCell || 'B5';
    setSelectedCell(target);
    setFormulaInput(String(initial[target] ?? ''));
    setGradeResult(null);
    setStartTime(Date.now());
  }, [exercise?.id]);

  const evaluatedGrid = useMemo(
    () => evaluateFullGrid(rawGrid, COLS, ROW_COUNT),
    [rawGrid]
  );

  const handleSelectCell = (ref: string) => {
    setSelectedCell(ref);
    setFormulaInput(String(rawGrid[ref] ?? ''));
  };

  const handleFormulaChange = (val: string) => {
    setFormulaInput(val);
    setRawGrid((prev) => ({
      ...prev,
      [selectedCell]: val,
    }));
  };

  const handleReset = () => {
    const initial = exercise?.initialGrid
      ? { ...exercise.initialGrid }
      : { ...DEFAULT_SANDBOX_GRID };
    setRawGrid(initial);
    const target = exercise?.targetCell || 'B5';
    setSelectedCell(target);
    setFormulaInput(String(initial[target] ?? ''));
    setGradeResult(null);
  };

  const handleSortDataRowsByColB = () => {
    // Sorts rows 2..5 by column B numeric value (when rows aren't summary rows)
    const dataRows = [2, 3, 4, 5].filter((r) => {
      const aVal = String(rawGrid[`A${r}`] ?? '');
      return aVal !== '' && !/total|average/i.test(aVal);
    });
    const extracted = dataRows.map((r) => {
      const rowData: Record<string, string | number> = {};
      for (const c of COLS) {
        rowData[c] = rawGrid[`${c}${r}`] ?? '';
      }
      const numB = Number(evaluatedGrid[`B${r}`]?.value ?? 0);
      return { rowData, numB };
    });

    extracted.sort((a, b) => (sortAsc ? a.numB - b.numB : b.numB - a.numB));
    const nextGrid = { ...rawGrid };
    dataRows.forEach((r, idx) => {
      for (const c of COLS) {
        nextGrid[`${c}${r}`] = extracted[idx].rowData[c];
      }
    });
    setRawGrid(nextGrid);
    setSortAsc(!sortAsc);
  };

  const handleValidate = () => {
    if (!exercise) return;
    const grade = evaluatePracticeExercise(exercise, {
      spreadsheetGridEval: evaluatedGrid,
      spreadsheetRawGrid: rawGrid,
    });
    setGradeResult(grade);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onAttemptComplete?.(grade, elapsed);
  };

  const activeCellEval = evaluatedGrid[selectedCell];

  return (
    <div className="space-y-4">
      <div className="bg-[#171C26] border border-white/10 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-[#101827] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#C6F36B]" />
            <span className="font-display text-xs font-bold text-[#F5F3EA]">
              Interactive Spreadsheet Engine
            </span>
            {exercise?.targetCell && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#C6F36B]/15 text-[#C6F36B] font-mono">
                Target Cell: {exercise.targetCell}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSortDataRowsByColB}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort Col B
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Sheet
            </button>
            {exercise && (
              <button
                type="button"
                onClick={handleValidate}
                className="px-3.5 py-1.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Validate Formula
              </button>
            )}
          </div>
        </div>

        {/* Formula Bar */}
        <div className="px-4 py-2.5 bg-[#0C121E] border-b border-white/10 flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 rounded bg-[#171C26] border border-white/15 font-mono text-xs font-bold text-[#75D6D0] min-w-[48px] text-center">
            {selectedCell}
          </div>
          <div className="flex items-center gap-1 text-[#9BA3B4] font-mono text-xs px-1">
            <FunctionSquare className="w-4 h-4 text-[#FFAA73]" />
            <span>fx</span>
          </div>
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => handleFormulaChange(e.target.value)}
            placeholder='Enter value or formula (e.g. =SUM(B2:B5), =IF(B4>=C4, "Met", "Missed"), =XLOOKUP(E2, A2:A5, C2:C5))'
            className="flex-1 bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
          />
          <div className="flex items-center gap-1">
            {['=SUM(', '=AVERAGE(', '=IF(', '=SUMIF(', '=XLOOKUP('].map((fn) => (
              <button
                key={fn}
                type="button"
                onClick={() => handleFormulaChange(fn)}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-[#75D6D0]"
              >
                {fn}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Error Diagnostic Strip */}
        {activeCellEval?.errorCode && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 flex items-center gap-2 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-mono font-bold">{activeCellEval.errorCode}:</span>
            <span>{activeCellEval.errorHint}</span>
          </div>
        )}

        {/* Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#101827] border-b border-white/10">
                <th className="w-10 py-2 text-center text-[#9BA3B4] border-r border-white/10">
                  #
                </th>
                {COLS.map((c) => (
                  <th
                    key={c}
                    className="py-2 px-3 text-center text-[#75D6D0] font-bold border-r border-white/10 min-w-[130px]"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROW_COUNT }, (_, idx) => idx + 1).map((r) => (
                <tr key={r} className="border-b border-white/5">
                  <td className="py-2 text-center text-[#9BA3B4] bg-[#101827] border-r border-white/10 font-semibold">
                    {r}
                  </td>
                  {COLS.map((c) => {
                    const ref = `${c}${r}`;
                    const isSelected = selectedCell === ref;
                    const isTarget = exercise?.targetCell === ref;
                    const cellRes = evaluatedGrid[ref];
                    const rawVal = rawGrid[ref];
                    const isHeader = r === 1;

                    return (
                      <td
                        key={ref}
                        onClick={() => handleSelectCell(ref)}
                        className={`px-3 py-2 border-r border-white/10 cursor-pointer transition-colors relative ${
                          isSelected
                            ? 'bg-[#C6F36B]/15 outline outline-2 outline-[#C6F36B]'
                            : isTarget
                            ? 'bg-[#75D6D0]/10'
                            : isHeader
                            ? 'bg-[#101827]/70 font-bold text-[#F5F3EA]'
                            : 'bg-[#0C121E] hover:bg-white/5 text-[#F5F3EA]/90'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 min-h-[20px]">
                          <span
                            className={
                              cellRes?.errorCode
                                ? 'text-red-400 font-bold'
                                : cellRes?.isFormula
                                ? 'text-[#C6F36B]'
                                : ''
                            }
                          >
                            {cellRes?.value !== undefined ? String(cellRes.value) : ''}
                          </span>
                          {String(rawVal || '').startsWith('=') && (
                            <span className="text-[9px] px-1 rounded bg-white/5 text-[#9BA3B4]">
                              fx
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exercise Validation Feedback */}
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
                ? 'Spreadsheet Exercise Passed!'
                : 'Formula Needs Adjustment — Recorded in Mistake Journal'}
            </div>
            <p className="text-[#F5F3EA]/90">{gradeResult.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
