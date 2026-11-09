import React, { useMemo, useState } from 'react';
import {
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  Filter,
  Lightbulb,
  BookOpen,
  Calendar,
  Users,
  Save,
  Send,
  AlertCircle,
  HelpCircle,
  Code2,
  Table,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { CHALLENGES_DATA } from '../../data/challengesData';
import { COMPETITIONS_DATA } from '../../data/competitionsData';
import {
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
} from '../../types/challenge';
import {
  evaluateChallenge,
  evaluateCompetitionEntry,
  ChallengeEvaluationResult,
} from '../../services/challengeEvaluationEngine';
import { Breadcrumb } from '../../components/common/Breadcrumb';

const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  sql: 'SQL Query',
  python: 'Python Scripting',
  spreadsheet: 'Spreadsheet Model',
  statistics: 'Statistical Inference',
  visualization: 'BI & Storytelling',
  business_analytics: 'Business Analytics',
  dataset_investigation: 'Dataset Investigation',
  case_study: 'Real-World Case Study',
};

export const ChallengesPage: React.FC = () => {
  const { user, saveChallengeDraft, submitChallenge, submitCompetitionEntry } = useUser();
  const [activeTab, setActiveTab] = useState<'challenges' | 'competitions'>('challenges');

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | ChallengeStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Active Challenge Modal / Workspace state
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userDraftCode, setUserDraftCode] = useState<string>('');
  const [userDraftWritten, setUserDraftWritten] = useState<string>('');
  const [taskAnswers, setTaskAnswers] = useState<Record<string, any>>({});
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<ChallengeEvaluationResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);

  // Active Competition state
  const [selectedCompId, setSelectedCompId] = useState<string>(COMPETITIONS_DATA[0].id);
  const [competitionEntryText, setCompetitionEntryText] = useState<string>('');
  const [compFeedback, setCompFeedback] = useState<string | null>(null);

  // Compute challenge statuses for the user
  const challengeStatusMap = useMemo(() => {
    const map = new Map<string, ChallengeStatus>();
    const completedSet = new Set(user.completedChallengeIds || []);
    const progressMap = user.challengeProgress || {};

    for (const ch of CHALLENGES_DATA) {
      if (completedSet.has(ch.id) || progressMap[ch.id]?.status === 'completed') {
        map.set(ch.id, 'completed');
      } else if (progressMap[ch.id]?.status === 'in_progress') {
        map.set(ch.id, 'in_progress');
      } else if (ch.prerequisiteChallengeIds && ch.prerequisiteChallengeIds.length > 0) {
        const allPrereqsMet = ch.prerequisiteChallengeIds.every((pid) => completedSet.has(pid));
        map.set(ch.id, allPrereqsMet ? 'available' : 'locked');
      } else {
        map.set(ch.id, 'available');
      }
    }
    return map;
  }, [user.completedChallengeIds, user.challengeProgress]);

  // Overall Challenge Metrics
  const metrics = useMemo(() => {
    let availableCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let lockedCount = 0;

    for (const ch of CHALLENGES_DATA) {
      const st = challengeStatusMap.get(ch.id) || 'available';
      if (st === 'completed') completedCount++;
      else if (st === 'in_progress') inProgressCount++;
      else if (st === 'locked') lockedCount++;
      else availableCount++;
    }

    return { availableCount, inProgressCount, completedCount, lockedCount };
  }, [challengeStatusMap]);

  // Filtered challenges list
  const filteredChallenges = useMemo(() => {
    return CHALLENGES_DATA.filter((ch) => {
      const st = challengeStatusMap.get(ch.id) || 'available';
      if (statusFilter !== 'all' && st !== statusFilter) return false;
      if (categoryFilter !== 'all' && ch.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && ch.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [challengeStatusMap, statusFilter, categoryFilter, difficultyFilter]);

  // Open Challenge Workspace
  const handleOpenChallenge = (ch: Challenge) => {
    const st = challengeStatusMap.get(ch.id);
    if (st === 'locked') return;

    setSelectedChallenge(ch);
    const existingProg = user.challengeProgress?.[ch.id];
    setUserDraftCode(existingProg?.draftCode || ch.tasks.find((t) => t.starterCode)?.starterCode || '');
    setUserDraftWritten(existingProg?.draftWrittenResponse || '');
    setTaskAnswers(existingProg?.taskAnswers || {});
    setRevealedHintIndex(-1);
    setShowExplanation(false);
    setEvaluationFeedback(
      existingProg?.score !== undefined
        ? {
            isPassed: existingProg.status === 'completed',
            totalScore: existingProg.score,
            feedback: existingProg.feedback || 'Previously completed challenge.',
            taskResults: {},
          }
        : null
    );
  };

  // Save Progress draft
  const handleSaveDraft = () => {
    if (!selectedChallenge) return;
    saveChallengeDraft(selectedChallenge.id, userDraftCode, userDraftWritten, taskAnswers, 60);
    setSaveStatusMsg('Progress & draft saved! You can resume anytime.');
    setTimeout(() => setSaveStatusMsg(null), 3000);
  };

  // Submit Challenge for Evaluation
  const handleSubmitChallenge = async () => {
    if (!selectedChallenge) return;
    setIsEvaluating(true);

    const evalResult = await evaluateChallenge(selectedChallenge, {
      draftCode: userDraftCode,
      draftWritten: userDraftWritten,
      taskAnswers,
    });

    setEvaluationFeedback(evalResult);
    setIsEvaluating(false);

    if (evalResult.isPassed) {
      submitChallenge(
        selectedChallenge.id,
        evalResult.totalScore,
        evalResult.feedback,
        selectedChallenge.xpReward,
        taskAnswers,
        180
      );
      setShowExplanation(true);
    }
  };

  // Submit Competition Entry
  const activeComp = useMemo(
    () => COMPETITIONS_DATA.find((c) => c.id === selectedCompId) || COMPETITIONS_DATA[0],
    [selectedCompId]
  );

  const handleCompetitionSubmit = () => {
    if (!competitionEntryText.trim()) return;
    const res = evaluateCompetitionEntry(activeComp, competitionEntryText);
    submitCompetitionEntry(activeComp.id, competitionEntryText, res.score, activeComp.xpReward);
    setCompFeedback(res.feedback);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <Breadcrumb
          items={[
            { label: 'Challenges & Competitions', path: '/platform/challenges' },
            { label: activeTab === 'challenges' ? 'Challenge Library' : 'Community Competitions' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-[#FFAA73]/15 text-[#FFAA73] font-mono font-bold">
            Phase 4 Challenge Engine
          </span>
        </div>
      </div>

      {/* Top Banner & Metrics */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#FFAA73] text-xs font-mono uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            Rigorous Analytical Challenges & Verified Competitions
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Solve Complex Industry Scenarios
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl leading-relaxed">
            Test yourself on authentic datasets across SQL, Python, Excel, Statistics, Visualisation,
            and Business Strategy with transparent criteria and progress persistence.
          </p>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-4 gap-2.5 shrink-0">
          <div className="bg-[#101827] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Available</div>
            <div className="font-display text-lg font-bold text-[#75D6D0]">
              {metrics.availableCount}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">In Progress</div>
            <div className="font-display text-lg font-bold text-[#FFAA73]">
              {metrics.inProgressCount}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Completed</div>
            <div className="font-display text-lg font-bold text-[#C6F36B]">
              {metrics.completedCount}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
            <div className="text-[10px] text-[#9BA3B4] uppercase font-mono">Locked</div>
            <div className="font-display text-lg font-bold text-[#9BA3B4]">
              {metrics.lockedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-[#171C26] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'challenges'
                ? 'bg-[#FFAA73] text-[#101827] font-bold'
                : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Individual Challenges ({CHALLENGES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('competitions')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'competitions'
                ? 'bg-[#FFAA73] text-[#101827] font-bold'
                : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Community Competitions & Leaderboards
          </button>
        </div>
      </div>

      {activeTab === 'challenges' ? (
        <div className="space-y-6">
          {/* Challenge Filter Bar */}
          <div className="bg-[#171C26] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F5F3EA]">
              <Filter className="w-4 h-4 text-[#75D6D0]" />
              <span>Filter Challenges ({filteredChallenges.length} matching)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="locked">Locked</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
              >
                <option value="all">All 8 Challenge Types</option>
                {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChallenges.map((ch) => {
              const status = challengeStatusMap.get(ch.id) || 'available';
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in_progress';
              const savedProg = user.challengeProgress?.[ch.id];

              return (
                <div
                  key={ch.id}
                  className={`bg-[#171C26] border rounded-xl p-5 flex flex-col justify-between transition-all ${
                    isLocked
                      ? 'border-white/5 opacity-60 bg-[#121620]'
                      : 'border-white/10 hover:border-[#FFAA73]/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#75D6D0] font-semibold">
                        {CATEGORY_LABELS[ch.category]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                            ch.difficulty === 'beginner'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : ch.difficulty === 'intermediate'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-purple-500/15 text-purple-300'
                          }`}
                        >
                          {ch.difficulty}
                        </span>
                        <span className="text-[#C6F36B] font-bold">+{ch.xpReward} XP</span>
                      </div>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#F5F3EA] leading-snug">
                      {ch.title}
                    </h3>

                    <p className="text-xs text-[#9BA3B4] leading-relaxed line-clamp-3">
                      {ch.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#9BA3B4] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {ch.estimatedMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{ch.tasks.length} Task(s)</span>
                    </div>

                    {isLocked && ch.prerequisiteChallengeIds && (
                      <div className="p-2 rounded bg-white/5 border border-white/5 text-[11px] text-[#9BA3B4] flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#FFAA73]" />
                        <span>Prerequisite: Complete {ch.prerequisiteChallengeIds.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                    <div>
                      {isCompleted && (
                        <span className="text-xs text-[#C6F36B] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed ({savedProg?.score ?? 100}%)
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-xs text-[#FFAA73] font-semibold flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> In Progress (Draft Saved)
                        </span>
                      )}
                      {status === 'available' && (
                        <span className="text-xs text-[#75D6D0] font-semibold">Available</span>
                      )}
                      {isLocked && (
                        <span className="text-xs text-[#9BA3B4] font-semibold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleOpenChallenge(ch)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        isLocked
                          ? 'bg-white/5 text-[#9BA3B4] cursor-not-allowed'
                          : isCompleted
                          ? 'bg-white/10 hover:bg-white/20 text-[#F5F3EA]'
                          : isInProgress
                          ? 'bg-[#FFAA73] hover:bg-[#ff9c5a] text-[#101827]'
                          : 'bg-[#C6F36B] hover:bg-[#b5e555] text-[#101827]'
                      }`}
                    >
                      {isCompleted ? 'Review' : isInProgress ? 'Resume Challenge' : 'Enter Challenge'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Community Competitions View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Tournament Selector & Submission Portal */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#FFAA73] font-bold">
                    Official Analytical Tournaments
                  </span>
                  <span className="text-xs text-[#C6F36B] font-mono">Verified Scoring</span>
                </div>

                <div className="flex gap-2">
                  {COMPETITIONS_DATA.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCompId(c.id);
                        setCompFeedback(null);
                      }}
                      className={`flex-1 p-3 rounded-lg border text-left transition-colors ${
                        selectedCompId === c.id
                          ? 'bg-[#FFAA73]/15 border-[#FFAA73] text-[#F5F3EA]'
                          : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono text-[#75D6D0]">
                        {c.type} • {c.tier} tier
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{c.title}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-2.5 text-xs">
                  <h3 className="font-display font-bold text-sm text-[#F5F3EA]">
                    {activeComp.title}
                  </h3>
                  <p className="text-[#9BA3B4] leading-relaxed">{activeComp.description}</p>
                  <div className="pt-2 border-t border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-[#9BA3B4]">
                      <span>Tournament Deadline:</span>
                      <span className="text-[#FFAA73] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {activeComp.deadlineIso.split('T')[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#9BA3B4]">
                      <span>Prize Allocation:</span>
                      <span className="text-[#C6F36B]">+{activeComp.xpReward} XP & Placement Badge</span>
                    </div>
                    <div className="text-[#75D6D0] pt-1">
                      Dataset: {activeComp.datasetContext}
                    </div>
                  </div>
                </div>

                {/* Submission Form */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold text-[#F5F3EA] block">
                    Submit Tournament Analytical Deliverable & Method:
                  </label>
                  <textarea
                    rows={4}
                    value={competitionEntryText}
                    onChange={(e) => setCompetitionEntryText(e.target.value)}
                    placeholder="Enter your complete methodology, calculated KPIs (e.g. margin, retention, CAC/LTV), and strategic takeaways..."
                    className="w-full bg-[#101827] border border-white/15 rounded-lg p-3 text-xs text-[#F5F3EA] font-mono leading-relaxed focus:outline-none focus:border-[#FFAA73]"
                  />
                  <button
                    type="button"
                    onClick={handleCompetitionSubmit}
                    className="w-full py-2.5 rounded-lg bg-[#FFAA73] hover:bg-[#ff9c5a] text-xs font-bold text-[#101827] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Submit Official Competition Entry
                  </button>
                  {compFeedback && (
                    <div className="p-3 bg-[#C6F36B]/15 border border-[#C6F36B]/40 rounded-lg text-xs text-[#F5F3EA]">
                      {compFeedback}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Verified Leaderboard */}
            <div className="lg:col-span-6 bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#C6F36B]" />
                  <span className="font-display text-sm font-bold text-[#F5F3EA]">
                    Verified Leaderboard ({activeComp.title})
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#9BA3B4]">
                  Fair, unmanipulated rankings
                </span>
              </div>

              {/* User Current Submission (if submitted) */}
              {user.competitionSubmissions?.[activeComp.id] && (
                <div className="bg-[#C6F36B]/15 border border-[#C6F36B]/40 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#C6F36B]">Rank #1</span>
                    <div>
                      <div className="text-xs font-bold text-[#F5F3EA]">{user.name} (You)</div>
                      <div className="text-[10px] text-[#9BA3B4]">
                        Submitted {user.competitionSubmissions[activeComp.id].submittedAt.split('T')[0]}
                      </div>
                    </div>
                  </div>
                  <div className="font-display text-lg font-bold text-[#C6F36B]">
                    {user.competitionSubmissions[activeComp.id].score}/100
                  </div>
                </div>
              )}

              {/* Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9BA3B4] bg-[#101827]">
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3">Participant</th>
                      <th className="py-2.5 px-3">Division Badge</th>
                      <th className="py-2.5 px-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeComp.leaderboard.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-white/5">
                        <td className="py-2.5 px-3 font-bold text-[#FFAA73]">#{entry.rank}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={entry.avatar}
                              alt={entry.participantName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-bold text-[#F5F3EA]">
                              {entry.participantName}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#75D6D0]">
                            {entry.badge}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#C6F36B]">
                          {entry.score}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL CHALLENGE WORKSPACE MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#171C26] rounded-2xl border border-white/15 p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#FFAA73]/20 text-[#FFAA73] font-bold">
                    {CATEGORY_LABELS[selectedChallenge.category]}
                  </span>
                  <span className="text-[#9BA3B4]">• {selectedChallenge.difficulty}</span>
                  <span className="text-[#C6F36B] font-bold">+{selectedChallenge.xpReward} XP</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F5F3EA]">
                  {selectedChallenge.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="text-[#9BA3B4] hover:text-white p-1 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Scenario & Context Card */}
            <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-bold text-[#FFAA73] uppercase tracking-wider block mb-1">
                  Business Scenario:
                </span>
                <p className="text-[#F5F3EA]/90">{selectedChallenge.scenario}</p>
              </div>

              <div>
                <span className="font-bold text-[#75D6D0] uppercase tracking-wider block mb-1">
                  Background Context:
                </span>
                <p className="text-[#9BA3B4]">{selectedChallenge.backgroundContext}</p>
              </div>

              {selectedChallenge.datasetRows && selectedChallenge.datasetRows.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="font-bold text-[#F5F3EA] flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-[#75D6D0]" />
                    Dataset Preview ({selectedChallenge.datasetName || 'Supporting Data'}):
                  </span>
                  <div className="overflow-x-auto border border-white/10 rounded-lg">
                    <table className="w-full text-left border-collapse font-mono text-[11px]">
                      <thead className="bg-[#0C121E] text-[#75D6D0]">
                        <tr>
                          {Object.keys(selectedChallenge.datasetRows[0]).map((k) => (
                            <th key={k} className="py-1 px-2 border-b border-white/10">
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#101827]">
                        {selectedChallenge.datasetRows.map((r, i) => (
                          <tr key={i}>
                            {Object.values(r).map((v, j) => (
                              <td key={j} className="py-1 px-2 text-[#F5F3EA]/80">
                                {String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Tasks & Submission Inputs */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#75D6D0]">
                Challenge Tasks & Deliverables ({selectedChallenge.tasks.length})
              </h3>

              {selectedChallenge.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#FFAA73]">
                      Task {task.order}: {task.objective}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#9BA3B4]">
                      {task.submissionMode}
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F3EA]">{task.prompt}</p>

                  {/* Submission Inputs by Mode */}
                  {task.submissionMode === 'multiple_choice' && task.options && (
                    <div className="space-y-2 pt-1">
                      {task.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setTaskAnswers((prev) => ({ ...prev, [task.id]: oIdx }))
                          }
                          className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all ${
                            taskAnswers[task.id] === oIdx
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
                  )}

                  {task.submissionMode === 'numeric_value' && (
                    <input
                      type="text"
                      value={taskAnswers[task.id] ?? ''}
                      onChange={(e) =>
                        setTaskAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))
                      }
                      placeholder="Enter calculated numerical result..."
                      className="w-full bg-[#171C26] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                    />
                  )}

                  {task.submissionMode === 'spreadsheet_formula' && (
                    <input
                      type="text"
                      value={taskAnswers[task.id] ?? task.starterCode ?? ''}
                      onChange={(e) =>
                        setTaskAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))
                      }
                      placeholder="e.g. =B3*(C3+D3)"
                      className="w-full bg-[#171C26] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                    />
                  )}

                  {task.submissionMode === 'sql_query' && (
                    <textarea
                      rows={5}
                      value={userDraftCode || task.starterCode || ''}
                      onChange={(e) => setUserDraftCode(e.target.value)}
                      placeholder="Write your SQLite query here..."
                      className="w-full bg-[#0C121E] border border-white/15 rounded-lg p-3 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                    />
                  )}

                  {task.submissionMode === 'python_code' && (
                    <textarea
                      rows={5}
                      value={userDraftCode || task.starterCode || ''}
                      onChange={(e) => setUserDraftCode(e.target.value)}
                      placeholder="Write Python code here..."
                      className="w-full bg-[#0C121E] border border-white/15 rounded-lg p-3 text-xs font-mono text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                    />
                  )}

                  {task.submissionMode === 'structured_rubric' && (
                    <textarea
                      rows={4}
                      value={userDraftWritten}
                      onChange={(e) => setUserDraftWritten(e.target.value)}
                      placeholder="State your structured justification citing specific metric evidence..."
                      className="w-full bg-[#171C26] border border-white/15 rounded-lg p-3 text-xs text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Progressive Hints */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRevealedHintIndex((prev) =>
                      Math.min(selectedChallenge.hints.length - 1, prev + 1)
                    )
                  }
                  disabled={revealedHintIndex >= selectedChallenge.hints.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-[#FFAA73]/15 border border-[#FFAA73]/30 hover:bg-[#FFAA73]/25 disabled:opacity-40 text-xs text-[#FFAA73] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Reveal Hint ({revealedHintIndex + 1}/{selectedChallenge.hints.length})
                </button>

                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showExplanation ? 'Hide Explanation' : 'View Full Solution'}
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#9BA3B4]">
                Criteria: {selectedChallenge.evaluationCriteria}
              </span>
            </div>

            {revealedHintIndex >= 0 && (
              <div className="space-y-1.5">
                {selectedChallenge.hints.slice(0, revealedHintIndex + 1).map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#FFAA73]/10 border border-[#FFAA73]/20 text-xs text-[#F5F3EA]"
                  >
                    <span className="font-bold text-[#FFAA73]">Hint {i + 1}: </span>
                    {h}
                  </div>
                ))}
              </div>
            )}

            {showExplanation && (
              <div className="p-4 rounded-xl bg-[#75D6D0]/10 border border-[#75D6D0]/30 text-xs text-[#F5F3EA] space-y-2">
                <span className="font-bold text-[#75D6D0]">Comprehensive Solution:</span>
                <p className="leading-relaxed">{selectedChallenge.explanation}</p>
              </div>
            )}

            {/* Evaluation Result Feedback Banner */}
            {evaluationFeedback && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  evaluationFeedback.isPassed
                    ? 'bg-[#C6F36B]/10 border-[#C6F36B]/40 text-[#F5F3EA]'
                    : 'bg-[#FFAA73]/10 border-[#FFAA73]/40 text-[#F5F3EA]'
                }`}
              >
                {evaluationFeedback.isPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#C6F36B] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#FFAA73] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="font-bold">
                    Score: {evaluationFeedback.totalScore}/100 •{' '}
                    {evaluationFeedback.isPassed ? 'Mastery Verified' : 'Needs Adjustment'}
                  </div>
                  <p>{evaluationFeedback.feedback}</p>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#75D6D0] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Draft & Resume Later
                </button>
                {saveStatusMsg && (
                  <span className="text-xs text-[#C6F36B] font-mono">{saveStatusMsg}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4]"
                >
                  Exit
                </button>
                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={handleSubmitChallenge}
                  className="px-5 py-2 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  {isEvaluating ? 'Evaluating...' : 'Submit Challenge for Evaluation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
