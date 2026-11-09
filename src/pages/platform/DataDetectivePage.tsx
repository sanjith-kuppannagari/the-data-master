import React, { useMemo, useState } from 'react';
import {
  Search,
  FileSearch,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Eye,
  Table,
  BookOpen,
  Sparkles,
  RotateCcw,
  Clock,
  Compass,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { DATA_DETECTIVE_MYSTERIES } from '../../data/detectiveData';
import { DataDetectiveMystery } from '../../types/challenge';
import {
  evaluateDetectiveMystery,
  DetectiveEvaluationResult,
} from '../../services/challengeEvaluationEngine';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const DataDetectivePage: React.FC = () => {
  const { user, submitDetectiveVerdict } = useUser();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DATA_DETECTIVE_MYSTERIES[0].id);

  // Active Case Investigation state
  const [revealedClueIds, setRevealedClueIds] = useState<number[]>([1]);
  const [investigationAnswers, setInvestigationAnswers] = useState<Record<string, number>>({});
  const [selectedVerdictIndex, setSelectedVerdictIndex] = useState<number>(-1);
  const [activeClueIndex, setActiveClueIndex] = useState<number>(0);
  const [evalResult, setEvalResult] = useState<DetectiveEvaluationResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const activeMystery: DataDetectiveMystery = useMemo(() => {
    return (
      DATA_DETECTIVE_MYSTERIES.find((m) => m.id === selectedCaseId) ||
      DATA_DETECTIVE_MYSTERIES[0]
    );
  }, [selectedCaseId]);

  const solvedCasesCount = useMemo(() => {
    return Object.values(user.detectiveProgress || {}).filter((p) => p.isSolved).length;
  }, [user.detectiveProgress]);

  const handleSelectCase = (mystery: DataDetectiveMystery) => {
    setSelectedCaseId(mystery.id);
    const existing = user.detectiveProgress?.[mystery.id];
    if (existing) {
      setRevealedClueIds(existing.discoveredClueIds || [1]);
      setInvestigationAnswers(existing.answers || {});
      setSelectedVerdictIndex(mystery.verdictOptions.indexOf(existing.verdictSubmitted));
      setEvalResult({
        isSolved: existing.isSolved,
        score: existing.isSolved ? 100 : 50,
        feedback: existing.isSolved
          ? 'Case previously resolved! Forensic verdict verified against audit logs.'
          : 'Case under ongoing investigation.',
      });
      setShowExplanation(existing.isSolved);
    } else {
      setRevealedClueIds([1]);
      setInvestigationAnswers({});
      setSelectedVerdictIndex(-1);
      setActiveClueIndex(0);
      setEvalResult(null);
      setShowExplanation(false);
    }
  };

  const handleRevealNextClue = () => {
    const unrevealed = activeMystery.clues.find((c) => !revealedClueIds.includes(c.id));
    if (unrevealed) {
      setRevealedClueIds((prev) => [...prev, unrevealed.id]);
      const nextIdx = activeMystery.clues.findIndex((c) => c.id === unrevealed.id);
      setActiveClueIndex(nextIdx);
    }
  };

  const handleSubmitVerdict = () => {
    if (selectedVerdictIndex < 0) return;
    const evaluated = evaluateDetectiveMystery(
      activeMystery,
      investigationAnswers,
      selectedVerdictIndex
    );
    setEvalResult(evaluated);

    const verdictText = activeMystery.verdictOptions[selectedVerdictIndex];
    submitDetectiveVerdict(
      activeMystery.id,
      revealedClueIds,
      investigationAnswers,
      verdictText,
      evaluated.isSolved,
      activeMystery.xpReward
    );

    if (evaluated.isSolved) {
      setShowExplanation(true);
    }
  };

  const activeClue = activeMystery.clues[activeClueIndex] || activeMystery.clues[0];

  return (
    <div className="space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <Breadcrumb
          items={[
            { label: 'Data Detective', path: '/platform/detective' },
            { label: 'Forensic Investigation Bureau' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-[#75D6D0]/15 text-[#75D6D0] font-mono font-bold">
            Phase 4 Detective Engine
          </span>
        </div>
      </div>

      {/* Top Banner & Bureau Telemetry */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#75D6D0] text-xs font-mono uppercase tracking-widest">
            <Search className="w-4 h-4" />
            Data Detective Bureau • Forensic Telemetry Investigations
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Uncover Anomalies Behind the Numbers
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl leading-relaxed">
            Interrogate system audit logs, inspect raw transaction dumps, eliminate clever red
            herrings, and deduce the root cause behind perplexing analytical mysteries.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Open Cases</div>
            <div className="font-display text-xl font-bold text-[#75D6D0]">
              {DATA_DETECTIVE_MYSTERIES.length}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Solved</div>
            <div className="font-display text-xl font-bold text-[#C6F36B]">
              {solvedCasesCount}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Forensic Tier</div>
            <div className="font-display text-xl font-bold text-[#FFAA73]">
              Senior
            </div>
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DATA_DETECTIVE_MYSTERIES.map((m) => {
          const isSelected = m.id === activeMystery.id;
          const isSolved = user.detectiveProgress?.[m.id]?.isSolved;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelectCase(m)}
              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-[#75D6D0]/15 border-[#75D6D0] text-[#F5F3EA]'
                  : 'bg-[#171C26] border-white/10 hover:border-white/25 text-[#F5F3EA]/90'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#FFAA73] font-bold">{m.caseFileNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      m.difficulty === 'beginner'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : m.difficulty === 'intermediate'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-purple-500/15 text-purple-300'
                    }`}
                  >
                    {m.difficulty}
                  </span>
                </div>
                <div className="font-display text-sm font-bold leading-snug">{m.title}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                <span className="text-[#9BA3B4]">{m.clues.length} Clues</span>
                {isSolved ? (
                  <span className="text-[#C6F36B] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                ) : (
                  <span className="text-[#C6F36B]">+{m.xpReward} XP</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Detective Bureau Workbench: Dossier & Clue Interrogation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Dossier & Clue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-3">
              <span className="text-[#FFAA73] font-bold uppercase">
                {activeMystery.caseFileNumber} Dossier
              </span>
              <span className="text-[#C6F36B] font-bold">+{activeMystery.xpReward} XP</span>
            </div>

            <h2 className="font-display text-xl font-bold text-[#F5F3EA]">
              {activeMystery.title}
            </h2>

            <p className="text-xs text-[#9BA3B4] leading-relaxed">
              {activeMystery.caseSummary}
            </p>

            <div className="bg-[#101827] border border-white/10 rounded-lg p-3 space-y-2 text-xs">
              <span className="font-bold text-[#75D6D0] uppercase tracking-wider block">
                Primary Suspect Theories:
              </span>
              <ul className="space-y-1 text-[#F5F3EA]/85 list-disc list-inside text-[11px]">
                {activeMystery.suspectTheories.map((theory, i) => (
                  <li key={i}>{theory}</li>
                ))}
              </ul>
            </div>

            {/* Clue Navigation Strip */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9BA3B4] uppercase font-bold">
                  Evidence Clues ({revealedClueIds.length}/{activeMystery.clues.length})
                </span>
                {revealedClueIds.length < activeMystery.clues.length && (
                  <button
                    type="button"
                    onClick={handleRevealNextClue}
                    className="text-[11px] text-[#75D6D0] hover:underline flex items-center gap-1 font-bold"
                  >
                    + Unlock Next Clue
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {activeMystery.clues.map((clue, idx) => {
                  const isRevealed = revealedClueIds.includes(clue.id);
                  const isCurrent = activeClueIndex === idx;

                  return (
                    <button
                      key={clue.id}
                      type="button"
                      disabled={!isRevealed}
                      onClick={() => setActiveClueIndex(idx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                        !isRevealed
                          ? 'bg-[#101827]/40 border-white/5 text-[#9BA3B4]/50 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-[#75D6D0]/15 border-[#75D6D0] text-[#F5F3EA] font-semibold'
                          : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {isRevealed ? clue.title : `Clue #${clue.id} (Locked)`}
                      </span>
                      {isRevealed && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                            clue.isRedHerring
                              ? 'bg-[#FFAA73]/15 text-[#FFAA73]'
                              : 'bg-emerald-500/15 text-emerald-300'
                          }`}
                        >
                          {clue.relevance}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Clue Examination Workbench & Verdict Portal */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase text-[#75D6D0] flex items-center gap-1.5 font-bold">
                <FileSearch className="w-4 h-4" />
                Evidence Inspection Workbench
              </span>
              <span className="text-[11px] font-mono text-[#9BA3B4]">
                Source: {activeClue.sourceType}
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-[#F5F3EA]">
              {activeClue.title}
            </h3>

            <div className="p-4 rounded-xl bg-[#0C121E] border border-white/10 font-mono text-xs text-[#F5F3EA]/90 leading-relaxed">
              {activeClue.content}
            </div>

            <div className="p-3 rounded-lg bg-[#75D6D0]/10 border border-[#75D6D0]/30 text-xs text-[#F5F3EA] flex items-start gap-2">
              <Compass className="w-4 h-4 text-[#75D6D0] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#75D6D0]">Detective Hint: </span>
                {activeClue.hint}
              </div>
            </div>

            {/* Evidence Dataset Sample */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFAA73] flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5" />
                  Forensic Dataset: {activeMystery.evidenceDatasetName}
                </span>
                <span className="font-mono text-[10px] text-[#9BA3B4]">4 Sample Rows</span>
              </div>
              <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead className="bg-[#101827] text-[#75D6D0]">
                    <tr>
                      {Object.keys(activeMystery.evidenceDatasetRows[0]).map((k) => (
                        <th key={k} className="py-1 px-2.5 border-b border-white/10 whitespace-nowrap">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0C121E]">
                    {activeMystery.evidenceDatasetRows.map((r, i) => (
                      <tr key={i}>
                        {Object.values(r).map((val, j) => (
                          <td key={j} className="py-1 px-2.5 text-[#F5F3EA]/90 whitespace-nowrap">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Intermediate Deduction Questions */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0] block">
                Intermediate Forensic Questions ({activeMystery.investigationQuestions.length})
              </span>
              {activeMystery.investigationQuestions.map((q) => (
                <div key={q.id} className="bg-[#101827] border border-white/10 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#F5F3EA]">{q.question}</div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() =>
                          setInvestigationAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                        }
                        className={`w-full text-left p-2.5 rounded-lg border text-xs leading-relaxed transition-all ${
                          investigationAnswers[q.id] === oIdx
                            ? 'bg-[#75D6D0]/15 border-[#75D6D0] text-[#F5F3EA]'
                            : 'bg-[#171C26] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2 text-[#75D6D0]">
                          [{String.fromCharCode(65 + oIdx)}]
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Forensic Verdict Portal */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA73] block">
                Deliver Your Forensic Verdict:
              </span>
              <div className="space-y-2">
                {activeMystery.verdictOptions.map((verdict, vIdx) => (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => setSelectedVerdictIndex(vIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                      selectedVerdictIndex === vIdx
                        ? 'bg-[#C6F36B]/15 border-[#C6F36B] text-[#F5F3EA]'
                        : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
                    }`}
                  >
                    <span className="font-mono font-bold mr-2 text-[#C6F36B]">
                      [Verdict {vIdx + 1}]
                    </span>
                    {verdict}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation Result */}
            {evalResult && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  evalResult.isSolved
                    ? 'bg-[#C6F36B]/10 border-[#C6F36B]/40 text-[#F5F3EA]'
                    : 'bg-[#FFAA73]/10 border-[#FFAA73]/40 text-[#F5F3EA]'
                }`}
              >
                {evalResult.isSolved ? (
                  <CheckCircle2 className="w-5 h-5 text-[#C6F36B] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#FFAA73] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="font-bold">
                    Forensic Verdict Result: {evalResult.score}/100 •{' '}
                    {evalResult.isSolved ? 'Case Solved!' : 'Unresolved Verdict'}
                  </div>
                  <p>{evalResult.feedback}</p>
                </div>
              </div>
            )}

            {/* Full Explanation on Solved Case */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-[#75D6D0]/10 border border-[#75D6D0]/30 text-xs text-[#F5F3EA] space-y-2">
                <span className="font-bold text-[#75D6D0] uppercase tracking-wider block">
                  Official Bureau Case Resolution Dossier:
                </span>
                <p className="leading-relaxed">{activeMystery.forensicExplanation}</p>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#9BA3B4]">
                Carefully interrogate all clues before sealing your conclusion.
              </span>
              <button
                type="button"
                onClick={handleSubmitVerdict}
                className="px-5 py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Submit Forensic Verdict
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
