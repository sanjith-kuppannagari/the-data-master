import React, { useEffect, useState } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  Table2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Key,
  Clock,
} from 'lucide-react';
import {
  executeSQLQuery,
  getDatabaseSchema,
  resetSQLDatabase,
  SQLDatabaseMeta,
  SQLQueryResult,
} from '../../services/sqlEngine';
import { PracticeExercise } from '../../types/practice';
import { evaluatePracticeExercise, ExerciseGradeResult } from '../../data/practiceExercises';

interface SQLWorkspaceProps {
  exercise?: PracticeExercise;
  onAttemptComplete?: (grade: ExerciseGradeResult, timeSpentSeconds: number) => void;
}

export const SQLWorkspace: React.FC<SQLWorkspaceProps> = ({
  exercise,
  onAttemptComplete,
}) => {
  const [activeDbId, setActiveDbId] = useState<'ecommerce' | 'hr_analytics' | 'saas_metrics'>(
    exercise?.sqlDatabaseId || 'ecommerce'
  );
  const [schemaMeta, setSchemaMeta] = useState<SQLDatabaseMeta | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [sqlCode, setSqlCode] = useState<string>(
    exercise?.starterCode ||
      `SELECT c.region, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS revenue\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY c.region\nORDER BY revenue DESC;`
  );
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [gradeResult, setGradeResult] = useState<ExerciseGradeResult | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (exercise) {
      const dbId = exercise.sqlDatabaseId || 'ecommerce';
      setActiveDbId(dbId);
      setSqlCode(exercise.starterCode || '');
      setQueryResult(null);
      setGradeResult(null);
      setStartTime(Date.now());
    }
  }, [exercise?.id]);

  useEffect(() => {
    let mounted = true;
    getDatabaseSchema(activeDbId).then((meta) => {
      if (mounted) {
        setSchemaMeta(meta);
        if (meta.tables.length > 0) {
          setExpandedTable(meta.tables[0].name);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [activeDbId]);

  const handleRunQuery = async () => {
    setIsRunning(true);
    setGradeResult(null);
    const res = await executeSQLQuery(activeDbId, sqlCode);
    setQueryResult(res);
    if (res.modifiedRows > 0) {
      const updatedMeta = await getDatabaseSchema(activeDbId);
      setSchemaMeta(updatedMeta);
    }
    setIsRunning(false);
  };

  const handleValidateExercise = async () => {
    if (!exercise) return;
    setIsRunning(true);
    const res = await executeSQLQuery(activeDbId, sqlCode);
    setQueryResult(res);
    setIsRunning(false);

    const grade = evaluatePracticeExercise(exercise, {
      sqlCode,
      sqlResult: res,
    });
    setGradeResult(grade);
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    onAttemptComplete?.(grade, elapsed);
  };

  const handleResetCode = () => {
    setSqlCode(
      exercise?.starterCode ||
        `SELECT * FROM ${schemaMeta?.tables[0]?.name || 'orders'} LIMIT 10;`
    );
    setQueryResult(null);
    setGradeResult(null);
  };

  const handleResetDb = async () => {
    await resetSQLDatabase(activeDbId);
    const meta = await getDatabaseSchema(activeDbId);
    setSchemaMeta(meta);
    setQueryResult(null);
    setGradeResult(null);
  };

  const handlePreviewTable = async (tableName: string) => {
    const previewQuery = `SELECT * FROM ${tableName} LIMIT 8;`;
    setSqlCode(previewQuery);
    setIsRunning(true);
    const res = await executeSQLQuery(activeDbId, previewQuery);
    setQueryResult(res);
    setIsRunning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Schema & Database Inspector */}
      <div className="lg:col-span-4 bg-[#171C26] border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#C6F36B]" />
            <span className="font-display text-sm font-bold text-[#F5F3EA]">
              SQLite WASM Schema
            </span>
          </div>
          <button
            onClick={handleResetDb}
            title="Reset database tables to clean default rows"
            className="text-xs text-[#9BA3B4] hover:text-[#C6F36B] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset DB
          </button>
        </div>

        {/* Database Selector */}
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#9BA3B4] block mb-1.5">
            Active Relational Database
          </label>
          <select
            value={activeDbId}
            onChange={(e) =>
              setActiveDbId(e.target.value as 'ecommerce' | 'hr_analytics' | 'saas_metrics')
            }
            disabled={Boolean(exercise?.sqlDatabaseId)}
            className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
          >
            <option value="ecommerce">ecommerce (Customers, Products, Orders, Items)</option>
            <option value="hr_analytics">hr_analytics (Departments, Employees)</option>
            <option value="saas_metrics">saas_metrics (Accounts, Monthly Telemetry)</option>
          </select>
          {schemaMeta && (
            <p className="text-[11px] text-[#9BA3B4] mt-1.5 leading-relaxed">
              {schemaMeta.description}
            </p>
          )}
        </div>

        {/* Tables & Columns Inspector */}
        <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
          {schemaMeta?.tables.map((tbl) => {
            const isExpanded = expandedTable === tbl.name;
            return (
              <div
                key={tbl.name}
                className="bg-[#101827]/90 border border-white/10 rounded-lg overflow-hidden"
              >
                <div
                  onClick={() => setExpandedTable(isExpanded ? null : tbl.name)}
                  className="w-full px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Table2 className="w-3.5 h-3.5 text-[#75D6D0]" />
                    <span className="font-mono text-xs font-semibold text-[#F5F3EA]">
                      {tbl.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#9BA3B4]">
                      {tbl.rowCount} rows
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewTable(tbl.name);
                    }}
                    className="text-[10px] text-[#75D6D0] hover:underline"
                  >
                    Preview
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-3 py-2 border-t border-white/5 space-y-1 bg-[#0C121E]">
                    {tbl.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-[11px] font-mono py-0.5"
                      >
                        <span className="flex items-center gap-1.5 text-[#F5F3EA]/90">
                          {col.pk && <Key className="w-3 h-3 text-[#FFAA73]" />}
                          {col.name}
                        </span>
                        <span className="text-[#9BA3B4] text-[10px]">{col.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Editor & Query Results */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-[#171C26] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#101827] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6F36B]" />
              <span className="font-mono text-xs text-[#F5F3EA]">
                query_editor.sql ({activeDbId})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCode}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Query
              </button>
              <button
                type="button"
                onClick={handleRunQuery}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-lg bg-[#75D6D0]/20 border border-[#75D6D0]/40 hover:bg-[#75D6D0]/30 text-xs font-semibold text-[#75D6D0] flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? 'Executing...' : 'Run SQL'}
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
            value={sqlCode}
            onChange={(e) => setSqlCode(e.target.value)}
            rows={7}
            spellCheck={false}
            placeholder="Write your SQLite query here (e.g. SELECT * FROM orders LIMIT 10;)"
            className="w-full bg-[#0C121E] text-[#F5F3EA] font-mono text-xs p-4 leading-relaxed focus:outline-none resize-y"
          />
        </div>

        {/* Exercise Grade Feedback Banner */}
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
                  ? 'SQL Exercise Passed!'
                  : 'Validation Needs Adjustment — Recorded in Mistake Journal'}
              </div>
              <p className="text-[#F5F3EA]/90 leading-relaxed">{gradeResult.feedback}</p>
            </div>
          </div>
        )}

        {/* Query Results / Error Output */}
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#9BA3B4]">
              Query Output & Result Set
            </span>
            {queryResult && (
              <span className="text-[11px] font-mono text-[#9BA3B4] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#75D6D0]" />
                {queryResult.executionTimeMs} ms •{' '}
                {queryResult.success ? `${queryResult.rowCount} row(s)` : 'Query Error'}
              </span>
            )}
          </div>

          {!queryResult && (
            <div className="py-10 text-center text-xs text-[#9BA3B4]">
              Click <span className="text-[#75D6D0] font-semibold">Run SQL</span> to execute your
              query against the live in-browser SQLite engine.
            </div>
          )}

          {queryResult && !queryResult.success && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-red-300 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                SQL Execution Error: {queryResult.error}
              </div>
              {queryResult.errorHint && (
                <div className="text-xs text-[#F5F3EA]/90 bg-[#101827]/80 p-3 rounded border border-white/10">
                  <span className="text-[#FFAA73] font-semibold">Debugging Hint: </span>
                  {queryResult.errorHint}
                </div>
              )}
            </div>
          )}

          {queryResult && queryResult.success && queryResult.isEmptyResult && (
            <div className="bg-[#101827] border border-white/10 rounded-lg p-4 text-xs text-[#9BA3B4]">
              <span className="text-[#75D6D0] font-semibold">Query executed cleanly: </span>
              {queryResult.modifiedRows > 0
                ? `${queryResult.modifiedRows} row(s) modified in ${activeDbId}.`
                : '0 rows matched your filter criteria (Empty Result Set — no syntax errors).'}
            </div>
          )}

          {queryResult && queryResult.success && queryResult.columns.length > 0 && (
            <div className="overflow-x-auto max-h-[320px] border border-white/10 rounded-lg">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="bg-[#101827] sticky top-0">
                  <tr>
                    {queryResult.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 text-[#75D6D0] font-semibold border-b border-white/10 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0C121E]">
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/5">
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-2 text-[#F5F3EA]/90 whitespace-nowrap"
                        >
                          {val === null ? (
                            <span className="text-[#9BA3B4] italic">NULL</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
