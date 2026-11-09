import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface VisualizationWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

const DEFAULT_VIZ_DATA = [
  { month: '2025-01', revenue_usd: 42000, active_accounts: 110, churn_rate: 2.1 },
  { month: '2025-02', revenue_usd: 46500, active_accounts: 118, churn_rate: 1.9 },
  { month: '2025-03', revenue_usd: 51200, active_accounts: 129, churn_rate: 1.8 },
  { month: '2025-04', revenue_usd: 49800, active_accounts: 127, churn_rate: 2.3 },
  { month: '2025-05', revenue_usd: 58400, active_accounts: 142, churn_rate: 1.6 },
  { month: '2025-06', revenue_usd: 64900, active_accounts: 156, churn_rate: 1.5 },
];

export const VisualizationWorkspace: React.FC<VisualizationWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const dataRows = useMemo(
    () =>
      exercise?.datasetContext && exercise.datasetContext.length > 0
        ? exercise.datasetContext
        : DEFAULT_VIZ_DATA,
    [exercise]
  );

  const availableKeys = useMemo(
    () => (dataRows.length > 0 ? Object.keys(dataRows[0]) : ['month', 'revenue_usd']),
    [dataRows]
  );

  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'scatter'>('bar');
  const [xKey, setXKey] = useState<string>(availableKeys[0] || 'month');
  const [yKey, setYKey] = useState<string>(availableKeys[1] || 'revenue_usd');
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const keys =
      exercise?.datasetContext && exercise.datasetContext.length > 0
        ? Object.keys(exercise.datasetContext[0])
        : ['month', 'revenue_usd'];
    setXKey(keys[0] || 'month');
    setYKey(keys[1] || 'revenue_usd');
    setChartType('bar');
    setSelectedOption(-1);
    setGradeResult(null);
    setStartTime(Date.now());
  }, [exercise?.id]);

  const handleSubmit = () => {
    if (!exercise) return;
    const grade = evaluatePracticeExercise(exercise, {
      chartConfig: { chartType, xKey, yKey },
      selectedOptionIndex: selectedOption,
    });
    setGradeResult(grade);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onAttemptComplete?.(grade, elapsed);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart Encoding Controls */}
        <div className="lg:col-span-4 bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BarChart3 className="w-4 h-4 text-[#C6F36B]" />
            <span className="font-display text-sm font-bold text-[#F5F3EA]">
              Visual Encoding Controls
            </span>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1.5">
              Chart Type (Visual Mark)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'bar', label: 'Bar Chart' },
                  { id: 'line', label: 'Line Chart' },
                  { id: 'area', label: 'Area Chart' },
                  { id: 'scatter', label: 'Scatter Plot' },
                ] as const
              ).map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setChartType(ct.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    chartType === ct.id
                      ? 'bg-[#C6F36B]/20 border-[#C6F36B] text-[#C6F36B]'
                      : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1">
              X-Axis Field (Dimension)
            </label>
            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA]"
            >
              {availableKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1">
              Y-Axis Field (Measure)
            </label>
            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA]"
            >
              {availableKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {exercise?.inputMode === 'chart_builder' && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Submit Chart Configuration
            </button>
          )}
        </div>

        {/* Right Live Chart Canvas & Critique Options */}
        <div className="lg:col-span-8 bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              Live Rendered Canvas ({chartType.toUpperCase()} • {xKey} vs {yKey})
            </span>
            <span className="text-[11px] font-mono text-[#9BA3B4]">
              Zero-Baseline Enforced
            </span>
          </div>

          <div className="h-[260px] w-full bg-[#101827] border border-white/10 rounded-xl p-3">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={dataRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                  <XAxis dataKey={xKey} stroke="#9BA3B4" fontSize={11} />
                  <YAxis stroke="#9BA3B4" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171C26',
                      borderColor: '#ffffff20',
                      color: '#F5F3EA',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey={yKey} fill="#C6F36B" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={dataRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                  <XAxis dataKey={xKey} stroke="#9BA3B4" fontSize={11} />
                  <YAxis stroke="#9BA3B4" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171C26',
                      borderColor: '#ffffff20',
                      color: '#F5F3EA',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={yKey}
                    stroke="#75D6D0"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#C6F36B' }}
                  />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={dataRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                  <XAxis dataKey={xKey} stroke="#9BA3B4" fontSize={11} />
                  <YAxis stroke="#9BA3B4" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171C26',
                      borderColor: '#ffffff20',
                      color: '#F5F3EA',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={yKey}
                    stroke="#75D6D0"
                    fill="#75D6D0"
                    fillOpacity={0.25}
                  />
                </AreaChart>
              ) : (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                  <XAxis dataKey={xKey} name={xKey} stroke="#9BA3B4" fontSize={11} />
                  <YAxis dataKey={yKey} name={yKey} stroke="#9BA3B4" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171C26',
                      borderColor: '#ffffff20',
                      color: '#F5F3EA',
                      fontSize: '12px',
                    }}
                  />
                  <Scatter data={dataRows} fill="#FFAA73" />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>

          {exercise?.inputMode === 'multiple_choice' && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-[#F5F3EA]">
                Visual Integrity & Chart Critique Decision:
              </div>
              <div className="space-y-2">
                {(exercise.options || []).map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all ${
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
                className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Submit Critique
              </button>
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
                ? 'Visual Encoding Verified!'
                : 'Visual Encoding Feedback — Logged in Mistake Journal'}
            </div>
            <p className="text-[#F5F3EA]/90">{gradeResult.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
