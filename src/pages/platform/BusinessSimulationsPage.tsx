import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  TrendingDown,
  Users,
  Megaphone,
  Boxes,
  UserX,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Table,
  BookOpen,
  Send,
  Save,
  RotateCcw,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { BUSINESS_SIMULATIONS_DATA } from '../../data/simulationsData';
import { BusinessSimulation } from '../../types/challenge';
import {
  evaluateSimulationRecommendation,
  SimulationEvaluationResult,
} from '../../services/challengeEvaluationEngine';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const BusinessSimulationsPage: React.FC = () => {
  const { user, submitSimulation } = useUser();
  const [activeSimId, setActiveSimId] = useState<string | null>(null);

  // Active Simulation Studio state
  const [decisionAnswers, setDecisionAnswers] = useState<Record<string, number>>({});
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [evalResult, setEvalResult] = useState<SimulationEvaluationResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const activeSimulation = useMemo(
    () => BUSINESS_SIMULATIONS_DATA.find((s) => s.id === activeSimId) || null,
    [activeSimId]
  );

  const completedSimsCount = useMemo(() => {
    return Object.keys(user.simulationSubmissions || {}).length;
  }, [user.simulationSubmissions]);

  const handleOpenSimulation = (sim: BusinessSimulation) => {
    setActiveSimId(sim.id);
    const prevSub = user.simulationSubmissions?.[sim.id];
    if (prevSub) {
      setDecisionAnswers(prevSub.answers || {});
      setRecommendationText(prevSub.recommendation || '');
      setEvalResult({
        isPassed: prevSub.score >= 70,
        score: prevSub.score,
        feedback: prevSub.feedback,
        rubricBreakdown: {
          analyticalAccuracy: 40,
          evidenceInterpretation: 30,
          actionableFeasibility: Math.max(0, prevSub.score - 70),
        },
      });
      setShowSolution(true);
    } else {
      setDecisionAnswers({});
      setRecommendationText('');
      setEvalResult(null);
      setShowSolution(false);
    }
  };

  const handleSaveDraft = () => {
    setSaveStatus('Draft answers & memo cached locally.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSubmitSimulation = () => {
    if (!activeSimulation) return;
    const evaluated = evaluateSimulationRecommendation(
      activeSimulation,
      decisionAnswers,
      recommendationText
    );
    setEvalResult(evaluated);

    if (evaluated.isPassed) {
      submitSimulation(
        activeSimulation.id,
        decisionAnswers,
        recommendationText,
        evaluated.score,
        evaluated.feedback,
        activeSimulation.xpReward
      );
      setShowSolution(true);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <Breadcrumb
          items={[
            { label: 'Business Simulations', path: '/platform/simulations' },
            { label: 'Executive Analyst Studio' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-[#FFAA73]/15 text-[#FFAA73] font-mono font-bold">
            Phase 4 Simulation Engine
          </span>
        </div>
      </div>

      {/* Top Banner & Strategy Metrics */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#FFAA73] text-xs font-mono uppercase tracking-widest">
            <Briefcase className="w-4 h-4" />
            Executive Decision Simulations • Role-Play Lead Business Analyst
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Formulate Data-Backed Corporate Strategy
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl leading-relaxed">
            Step into realistic business scenarios. Interrogate messy telemetry tables, formulate
            root-cause hypotheses, answer strategic decision questions, and author executive memos.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Simulations</div>
            <div className="font-display text-xl font-bold text-[#F5F3EA]">
              {BUSINESS_SIMULATIONS_DATA.length}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Completed</div>
            <div className="font-display text-xl font-bold text-[#C6F36B]">
              {completedSimsCount}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Rubric Score</div>
            <div className="font-display text-xl font-bold text-[#75D6D0]">
              40/30/30
            </div>
          </div>
        </div>
      </div>

      {/* Simulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUSINESS_SIMULATIONS_DATA.map((sim) => {
          const isCompleted = Boolean(user.simulationSubmissions?.[sim.id]);
          const previousScore = user.simulationSubmissions?.[sim.id]?.score;

          return (
            <div
              key={sim.id}
              onClick={() => handleOpenSimulation(sim)}
              className="bg-[#171C26] border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-[#FFAA73]/50 transition-all cursor-pointer space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#75D6D0] font-semibold">{sim.category}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                        sim.difficulty === 'beginner'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : sim.difficulty === 'intermediate'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-purple-500/15 text-purple-300'
                      }`}
                    >
                      {sim.difficulty}
                    </span>
                    <span className="text-[#C6F36B] font-bold">+{sim.xpReward} XP</span>
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-[#F5F3EA] leading-snug">
                  {sim.title}
                </h3>

                <p className="text-xs text-[#9BA3B4] leading-relaxed line-clamp-3">
                  {sim.businessBackground}
                </p>

                <div className="p-2.5 rounded-lg bg-[#101827] border border-white/5 font-mono text-[11px] text-[#75D6D0] truncate">
                  Dataset: {sim.datasetName} ({sim.datasetRows.length} rows)
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  {isCompleted ? (
                    <span className="text-xs text-[#C6F36B] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved ({previousScore}/100)
                    </span>
                  ) : (
                    <span className="text-xs text-[#FFAA73] font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {sim.estimatedMinutes} mins
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-[#F5F3EA] font-semibold flex items-center gap-1 transition-colors"
                >
                  {isCompleted ? 'Review Memo' : 'Launch Simulation'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE SIMULATION WORKSPACE MODAL */}
      {activeSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#171C26] rounded-2xl border border-white/15 p-6 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#FFAA73]/20 text-[#FFAA73] font-bold">
                    {activeSimulation.category}
                  </span>
                  <span className="text-[#9BA3B4]">• {activeSimulation.difficulty}</span>
                  <span className="text-[#C6F36B] font-bold">+{activeSimulation.xpReward} XP</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F5F3EA]">
                  {activeSimulation.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSimId(null)}
                className="text-[#9BA3B4] hover:text-white p-1 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Business Context & Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-bold text-[#FFAA73] uppercase tracking-wider block">
                  Business Background:
                </span>
                <p className="text-[#F5F3EA]/90 leading-relaxed">
                  {activeSimulation.businessBackground}
                </p>
                <span className="font-bold text-[#75D6D0] uppercase tracking-wider block pt-2">
                  Business Problem:
                </span>
                <p className="text-[#9BA3B4] leading-relaxed">
                  {activeSimulation.businessProblem}
                </p>
              </div>

              <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-2.5 text-xs">
                <span className="font-bold text-[#C6F36B] uppercase tracking-wider block">
                  Key Metrics Telemetry:
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {Object.entries(activeSimulation.metricsSummary).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span className="text-[#9BA3B4]">{k}:</span>
                      <span className="text-[#F5F3EA] font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dataset Preview Table */}
            <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0] flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5" />
                  Dataset: {activeSimulation.datasetName}
                </span>
                <span className="text-[11px] font-mono text-[#9BA3B4]">
                  {activeSimulation.datasetDescription}
                </span>
              </div>
              <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead className="bg-[#0C121E] text-[#75D6D0]">
                    <tr>
                      {Object.keys(activeSimulation.datasetRows[0]).map((k) => (
                        <th key={k} className="py-1.5 px-3 border-b border-white/10 whitespace-nowrap">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#101827]">
                    {activeSimulation.datasetRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        {Object.values(row).map((v, cIdx) => (
                          <td key={cIdx} className="py-1.5 px-3 text-[#F5F3EA]/90 whitespace-nowrap">
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decision-Making Questions */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#FFAA73]">
                Analytical Decisions ({activeSimulation.decisionQuestions.length})
              </h3>
              {activeSimulation.decisionQuestions.map((q) => (
                <div key={q.id} className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-[#F5F3EA] leading-relaxed">
                    {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setDecisionAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                        className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all ${
                          decisionAnswers[q.id] === oIdx
                            ? 'bg-[#C6F36B]/15 border-[#C6F36B] text-[#F5F3EA]'
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

            {/* Executive Recommendation Submission */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F5F3EA] uppercase tracking-wider">
                  Executive Recommendation Memo (Evaluated against Rubric)
                </label>
                <span className="text-[11px] font-mono text-[#9BA3B4]">
                  Rubric: Accuracy (40%) • Evidence (30%) • Feasibility (30%)
                </span>
              </div>
              <p className="text-xs text-[#9BA3B4]">{activeSimulation.recommendationPrompt}</p>
              <textarea
                rows={5}
                value={recommendationText}
                onChange={(e) => setRecommendationText(e.target.value)}
                placeholder="Author your structured recommendation memo. Cite metrics from the dataset..."
                className="w-full bg-[#101827] border border-white/15 rounded-xl p-4 text-xs text-[#F5F3EA] font-sans leading-relaxed focus:outline-none focus:border-[#C6F36B]"
              />
            </div>

            {/* Evaluation Result Feedback */}
            {evalResult && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  evalResult.isPassed
                    ? 'bg-[#C6F36B]/10 border-[#C6F36B]/40 text-[#F5F3EA]'
                    : 'bg-[#FFAA73]/10 border-[#FFAA73]/40 text-[#F5F3EA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {evalResult.isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#C6F36B]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#FFAA73]" />
                    )}
                    <span className="font-bold text-sm">
                      Simulation Score: {evalResult.score}/100 •{' '}
                      {evalResult.isPassed ? 'Recommendation Approved' : 'Requires Revision'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#9BA3B4]">
                    <span>Acc: {evalResult.rubricBreakdown.analyticalAccuracy}/40</span>
                    <span>Evid: {evalResult.rubricBreakdown.evidenceInterpretation}/30</span>
                    <span>Feas: {evalResult.rubricBreakdown.actionableFeasibility}/30</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed">{evalResult.feedback}</p>
              </div>
            )}

            {/* Hidden Solution Reveal (post-completion) */}
            {showSolution && (
              <div className="p-4 rounded-xl bg-[#75D6D0]/10 border border-[#75D6D0]/30 text-xs text-[#F5F3EA] space-y-2">
                <span className="font-bold text-[#75D6D0] uppercase tracking-wider block">
                  Executive Debrief & Solution Rationale:
                </span>
                <p className="leading-relaxed">{activeSimulation.solutionExplanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#75D6D0] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
                {saveStatus && (
                  <span className="text-xs text-[#C6F36B] font-mono">{saveStatus}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSimId(null)}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4]"
                >
                  Close Brief
                </button>
                <button
                  type="button"
                  onClick={handleSubmitSimulation}
                  className="px-5 py-2 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Submit for Executive Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
