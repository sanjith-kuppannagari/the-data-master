import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Swords,
  Filter,
  Shuffle,
  Timer,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Code2,
  Award,
  RotateCcw,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { PRACTICE_EXERCISES, ExerciseGradeResult } from '../../data/practiceExercises';
import { ExerciseDifficulty, ExerciseType, PracticeExercise } from '../../types/practice';
import { SQLWorkspace } from '../../components/workspaces/SQLWorkspace';
import { PythonWorkspace } from '../../components/workspaces/PythonWorkspace';
import { SpreadsheetWorkspace } from '../../components/workspaces/SpreadsheetWorkspace';
import { StatisticsWorkspace } from '../../components/workspaces/StatisticsWorkspace';
import { VisualizationWorkspace } from '../../components/workspaces/VisualizationWorkspace';
import { BusinessAnalyticsWorkspace } from '../../components/workspaces/BusinessAnalyticsWorkspace';

const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  sql: 'SQL Query',
  python: 'Python',
  spreadsheet: 'Spreadsheet',
  statistics: 'Statistics',
  visualization: 'Data Visualization',
  business_kpi: 'Business KPI',
  dataset_investigation: 'Dataset Investigation',
  analytical_reasoning: 'Analytical Reasoning',
};

export const PracticeArenaPage: React.FC = () => {
  const { user, recordPracticeAttempt } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [codingFilter, setCodingFilter] = useState<'all' | 'coding' | 'non_coding'>('all');
  const [onlyMyLearningPath, setOnlyMyLearningPath] = useState<boolean>(false);

  // Active exercise & session state
  const [activeExerciseId, setActiveExerciseId] = useState<string>(
    searchParams.get('exerciseId') || PRACTICE_EXERCISES[0].id
  );
  const [mixedSessionIds, setMixedSessionIds] = useState<string[] | null>(null);
  const [revealedHintCount, setRevealedHintCount] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Timed Drill Mode
  const [timedModeActive, setTimedModeActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);

  useEffect(() => {
    const paramExId = searchParams.get('exerciseId');
    if (paramExId && PRACTICE_EXERCISES.some((e) => e.id === paramExId)) {
      setActiveExerciseId(paramExId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!timedModeActive) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timedModeActive]);

  const attempts = user.practiceAttempts || [];
  const mistakes = user.mistakeRecords || [];

  // Overall Practice Accuracy Metrics
  const arenaStats = useMemo(() => {
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const accuracy =
      totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    const masteredIds = new Set(
      attempts.filter((a) => a.isCorrect).map((a) => a.exerciseId)
    );
    const unresolvedMistakeIds = new Set(
      mistakes.filter((m) => m.reviewStatus !== 'resolved').map((m) => m.exerciseId)
    );
    return {
      totalAttempts,
      accuracy,
      masteredCount: masteredIds.size,
      masteredIds,
      unresolvedMistakeIds,
    };
  }, [attempts, mistakes]);

  // Topic options based on selected domain filter
  const availableTopics = useMemo(() => {
    if (selectedDomainFilter === 'all') {
      return CURRICULUM_DOMAINS.flatMap((d) => d.topics);
    }
    const dom = CURRICULUM_DOMAINS.find((d) => d.id === selectedDomainFilter);
    return dom ? dom.topics : [];
  }, [selectedDomainFilter]);

  // Filtered Exercises
  const filteredExercises = useMemo(() => {
    let list = PRACTICE_EXERCISES;

    if (mixedSessionIds) {
      return mixedSessionIds
        .map((id) => list.find((e) => e.id === id))
        .filter((e): e is PracticeExercise => Boolean(e));
    }

    if (onlyMyLearningPath && user.selectedDomainIds.length > 0) {
      const pathSet = new Set(user.selectedDomainIds);
      list = list.filter((e) => pathSet.has(e.domainId));
    }

    if (selectedDomainFilter !== 'all') {
      list = list.filter((e) => e.domainId === selectedDomainFilter);
    }
    if (selectedTopicFilter !== 'all') {
      list = list.filter((e) => e.topicId === selectedTopicFilter);
    }
    if (selectedTypeFilter !== 'all') {
      list = list.filter((e) => e.type === selectedTypeFilter);
    }
    if (selectedDifficultyFilter !== 'all') {
      list = list.filter((e) => e.difficulty === selectedDifficultyFilter);
    }
    if (codingFilter === 'coding') {
      list = list.filter((e) => e.isCoding);
    } else if (codingFilter === 'non_coding') {
      list = list.filter((e) => !e.isCoding);
    }

    return list;
  }, [
    mixedSessionIds,
    onlyMyLearningPath,
    user.selectedDomainIds,
    selectedDomainFilter,
    selectedTopicFilter,
    selectedTypeFilter,
    selectedDifficultyFilter,
    codingFilter,
  ]);

  const activeExercise: PracticeExercise = useMemo(() => {
    return (
      PRACTICE_EXERCISES.find((e) => e.id === activeExerciseId) ||
      filteredExercises[0] ||
      PRACTICE_EXERCISES[0]
    );
  }, [activeExerciseId, filteredExercises]);

  const activeDomain = useMemo(
    () => CURRICULUM_DOMAINS.find((d) => d.id === activeExercise.domainId),
    [activeExercise]
  );

  const activeTopic = useMemo(
    () => activeDomain?.topics.find((t) => t.id === activeExercise.topicId),
    [activeDomain, activeExercise]
  );

  const handleSelectExercise = (ex: PracticeExercise) => {
    setActiveExerciseId(ex.id);
    setRevealedHintCount(0);
    setShowExplanation(false);
    setSearchParams({ exerciseId: ex.id });
    if (timedModeActive) {
      setSecondsRemaining(ex.estimatedMinutes * 60);
    }
  };

  const handleStartMixedSession = () => {
    const pathSet = new Set(user.selectedDomainIds);
    const pool =
      pathSet.size > 0
        ? PRACTICE_EXERCISES.filter((e) => pathSet.has(e.domainId))
        : PRACTICE_EXERCISES;
    const source = pool.length >= 5 ? pool : PRACTICE_EXERCISES;

    // Pick a diverse 5-exercise mix across different exercise types
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    const chosen: PracticeExercise[] = [];
    const usedTypes = new Set<string>();

    for (const ex of shuffled) {
      if (!usedTypes.has(ex.type) && chosen.length < 5) {
        chosen.push(ex);
        usedTypes.add(ex.type);
      }
    }
    for (const ex of shuffled) {
      if (chosen.length < 5 && !chosen.some((c) => c.id === ex.id)) {
        chosen.push(ex);
      }
    }

    const ids = chosen.map((c) => c.id);
    setMixedSessionIds(ids);
    if (ids.length > 0) {
      handleSelectExercise(chosen[0]);
    }
  };

  const handleToggleTimedDrill = () => {
    const next = !timedModeActive;
    setTimedModeActive(next);
    if (next) {
      setSecondsRemaining(activeExercise.estimatedMinutes * 60);
    }
  };

  const handleAttemptComplete = (
    grade: ExerciseGradeResult,
    timeSpentSeconds: number
  ) => {
    recordPracticeAttempt({
      exerciseId: activeExercise.id,
      exerciseTitle: activeExercise.title,
      domainId: activeExercise.domainId,
      domainName: activeDomain?.name || 'Data Analytics',
      topicId: activeExercise.topicId,
      topicTitle: activeTopic?.title || activeExercise.subtopic,
      exerciseType: activeExercise.type,
      isCorrect: grade.isCorrect,
      submittedAnswer: grade.submittedSummary,
      expectedAnswer: grade.expectedSummary,
      errorCategory: grade.errorCategory,
      explanation: activeExercise.explanation,
      xpReward: activeExercise.xpReward,
      timeSpentSeconds,
    });
    setShowExplanation(true);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Arena Header & Performance Telemetry */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#C6F36B] text-xs font-mono uppercase tracking-widest">
            <Swords className="w-4 h-4" />
            Interactive Practice Arena • 8 Specialized Workspaces
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Hands-On Analytical Execution & Skill Verification
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl">
            Practice real SQL queries, Python scripts, Excel formulas, statistical derivations,
            interactive charts, and commercial KPI diagnostics with instant verification.
          </p>
        </div>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Mastered</div>
            <div className="font-display text-xl font-bold text-[#C6F36B]">
              {arenaStats.masteredCount}/{PRACTICE_EXERCISES.length}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Accuracy</div>
            <div className="font-display text-xl font-bold text-[#75D6D0]">
              {arenaStats.accuracy}%
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Attempts</div>
            <div className="font-display text-xl font-bold text-[#F5F3EA]">
              {arenaStats.totalAttempts}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter & Session Control Bar */}
      <div className="bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F5F3EA]">
            <Filter className="w-4 h-4 text-[#75D6D0]" />
            <span>Filter Practice Exercises ({filteredExercises.length} available)</span>
            {mixedSessionIds && (
              <span className="px-2 py-0.5 rounded bg-[#C6F36B]/20 text-[#C6F36B] font-mono text-[11px]">
                Mixed 5-Drill Sprint Active
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyMyLearningPath(!onlyMyLearningPath)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                onlyMyLearningPath
                  ? 'bg-[#75D6D0]/20 border-[#75D6D0] text-[#75D6D0]'
                  : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              My Learning Path Domains
            </button>

            <button
              type="button"
              onClick={handleStartMixedSession}
              className="px-3 py-1.5 rounded-lg bg-[#C6F36B]/15 border border-[#C6F36B]/40 hover:bg-[#C6F36B]/25 text-xs font-semibold text-[#C6F36B] flex items-center gap-1.5 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Mixed-Practice Session (5)
            </button>

            {mixedSessionIds && (
              <button
                type="button"
                onClick={() => setMixedSessionIds(null)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4]"
              >
                Exit Mixed Sprint
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleTimedDrill}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                timedModeActive
                  ? 'bg-[#FFAA73]/20 border-[#FFAA73] text-[#FFAA73]'
                  : 'bg-[#101827] border-white/10 text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              {timedModeActive ? `Timer: ${formatTimer(secondsRemaining)}` : 'Timed Drill Mode'}
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Domain Filter */}
          <select
            value={selectedDomainFilter}
            onChange={(e) => {
              setSelectedDomainFilter(e.target.value);
              setSelectedTopicFilter('all');
              setMixedSessionIds(null);
            }}
            className="bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
          >
            <option value="all">All Curriculum Domains (15)</option>
            {CURRICULUM_DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                D{d.number}: {d.name}
              </option>
            ))}
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopicFilter}
            onChange={(e) => {
              setSelectedTopicFilter(e.target.value);
              setMixedSessionIds(null);
            }}
            className="bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
          >
            <option value="all">All Topics ({availableTopics.length})</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {/* Exercise Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => {
              setSelectedTypeFilter(e.target.value);
              setMixedSessionIds(null);
            }}
            className="bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
          >
            <option value="all">All 8 Exercise Types</option>
            {Object.entries(EXERCISE_TYPE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => {
              setSelectedDifficultyFilter(e.target.value);
              setMixedSessionIds(null);
            }}
            className="bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Coding vs Non-Coding Filter */}
          <select
            value={codingFilter}
            onChange={(e) => {
              setCodingFilter(e.target.value as 'all' | 'coding' | 'non_coding');
              setMixedSessionIds(null);
            }}
            className="bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
          >
            <option value="all">Coding & Non-Coding</option>
            <option value="coding">Coding Only (SQL & Python)</option>
            <option value="non_coding">Non-Coding (Sheets, Stats, Viz, KPI)</option>
          </select>
        </div>
      </div>

      {/* Main Arena Layout: Left Exercise Selector + Right Active Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Exercise Browser List */}
        <div className="xl:col-span-3 bg-[#171C26] border border-white/10 rounded-xl p-3.5 space-y-2.5 max-h-[820px] overflow-y-auto">
          <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9BA3B4]">
              Exercise Queue ({filteredExercises.length})
            </span>
            <Link
              to="/platform/mistakes"
              className="text-[11px] text-[#FFAA73] hover:underline flex items-center gap-1"
            >
              Mistakes ({arenaStats.unresolvedMistakeIds.size})
            </Link>
          </div>

          {filteredExercises.map((ex) => {
            const isSelected = ex.id === activeExercise.id;
            const isMastered = arenaStats.masteredIds.has(ex.id);
            const hasUnresolvedMistake = arenaStats.unresolvedMistakeIds.has(ex.id);

            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelectExercise(ex)}
                className={`w-full text-left p-3 rounded-xl border transition-all space-y-1.5 ${
                  isSelected
                    ? 'bg-[#C6F36B]/15 border-[#C6F36B] text-[#F5F3EA]'
                    : 'bg-[#101827] border-white/10 hover:border-white/25 text-[#F5F3EA]/90'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#75D6D0]">
                    {EXERCISE_TYPE_LABELS[ex.type]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        ex.difficulty === 'beginner'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : ex.difficulty === 'intermediate'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-purple-500/15 text-purple-300'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                    {isMastered && (
                      <span title="Mastered">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C6F36B]" />
                      </span>
                    )}
                    {!isMastered && hasUnresolvedMistake && (
                      <span title="Needs Review in Mistake Journal">
                        <AlertCircle className="w-3.5 h-3.5 text-[#FFAA73]" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold leading-snug">{ex.title}</div>

                <div className="flex items-center justify-between text-[10px] text-[#9BA3B4]">
                  <span>{ex.subtopic}</span>
                  <span className="font-mono text-[#C6F36B]">+{ex.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Exercise Brief + Interactive Workspace */}
        <div className="xl:col-span-9 space-y-5">
          {/* Exercise Brief Card */}
          <div className="bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#75D6D0]/15 text-[#75D6D0] font-mono font-semibold">
                  {EXERCISE_TYPE_LABELS[activeExercise.type]}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 text-[#F5F3EA] font-mono">
                  {activeDomain?.name || activeExercise.domainId}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9BA3B4]" />
                <span className="text-[#9BA3B4]">{activeExercise.subtopic}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-[#9BA3B4]">
                  {activeExercise.isCoding ? 'Coding Workspace' : 'Non-Coding Analytical'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#C6F36B] flex items-center gap-1">
                  <Award className="w-4 h-4" /> +{activeExercise.xpReward} XP
                </span>
                {arenaStats.masteredIds.has(activeExercise.id) && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#C6F36B]/20 text-[#C6F36B] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mastered (Retry Mode)
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#F5F3EA]">
                {activeExercise.title}
              </h2>
              <p className="text-xs text-[#75D6D0] mt-1 font-medium">
                Objective: {activeExercise.objective}
              </p>
            </div>

            <div className="bg-[#101827] border border-white/10 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="text-[#F5F3EA] leading-relaxed">
                <span className="font-bold text-[#FFAA73] uppercase tracking-wider mr-1.5">
                  Business Scenario:
                </span>
                {activeExercise.scenario}
              </div>

              <div className="space-y-1 pt-1">
                <div className="font-bold text-[#9BA3B4] uppercase tracking-wider text-[11px]">
                  Instructions:
                </div>
                <ul className="space-y-1 text-[#F5F3EA]/90 list-disc list-inside">
                  {activeExercise.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Progressive Hints & Full Explanation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRevealedHintCount((prev) =>
                      Math.min(activeExercise.hints.length, prev + 1)
                    )
                  }
                  disabled={revealedHintCount >= activeExercise.hints.length}
                  className="px-3 py-1.5 rounded-lg bg-[#FFAA73]/15 border border-[#FFAA73]/30 hover:bg-[#FFAA73]/25 disabled:opacity-50 text-xs font-semibold text-[#FFAA73] flex items-center gap-1.5 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Reveal Hint ({revealedHintCount}/{activeExercise.hints.length})
                </button>

                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#9BA3B4] hover:text-[#F5F3EA] flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showExplanation ? 'Hide Explanation' : 'View Analytical Explanation'}
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#9BA3B4]">
                Evaluation: {activeExercise.evaluationCriteria}
              </span>
            </div>

            {revealedHintCount > 0 && (
              <div className="space-y-1.5">
                {activeExercise.hints.slice(0, revealedHintCount).map((hint, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFAA73]/10 border border-[#FFAA73]/30 rounded-lg px-3.5 py-2 text-xs text-[#F5F3EA]"
                  >
                    <span className="font-bold text-[#FFAA73]">Hint {idx + 1}: </span>
                    {hint}
                  </div>
                ))}
              </div>
            )}

            {showExplanation && (
              <div className="bg-[#75D6D0]/10 border border-[#75D6D0]/30 rounded-lg p-3.5 text-xs text-[#F5F3EA] space-y-1.5">
                <div className="font-bold text-[#75D6D0]">
                  Complete Analytical Explanation:
                </div>
                <p className="leading-relaxed">{activeExercise.explanation}</p>
                {activeExercise.solutionCode && (
                  <pre className="bg-[#0C121E] p-3 rounded border border-white/10 font-mono text-[11px] text-[#C6F36B] overflow-x-auto mt-2">
                    {activeExercise.solutionCode}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Specialized Workspace Renderer */}
          {activeExercise.type === 'sql' && (
            <SQLWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {activeExercise.type === 'python' && (
            <PythonWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {activeExercise.type === 'spreadsheet' && (
            <SpreadsheetWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {activeExercise.type === 'statistics' && (
            <StatisticsWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {activeExercise.type === 'visualization' && (
            <VisualizationWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {(activeExercise.type === 'business_kpi' ||
            activeExercise.type === 'dataset_investigation' ||
            activeExercise.type === 'analytical_reasoning') && (
            <BusinessAnalyticsWorkspace
              exercise={activeExercise}
              onAttemptComplete={handleAttemptComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
