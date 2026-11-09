import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  Sparkles,
  Filter,
  Brain,
  ArrowRight,
  Clock,
  Target,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { generateSmartRevisionPlan } from '../../services/revisionEngine';

export const MistakeJournalPage: React.FC = () => {
  const { user, updateMistakeStatus } = useUser();

  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'needs_review' | 'marked_for_revision' | 'resolved'
  >('all');

  const mistakes = user.mistakeRecords || [];
  const smartRevisionList = useMemo(() => generateSmartRevisionPlan(user), [user]);

  const availableDomains = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of mistakes) {
      map.set(m.domainId, m.domainName);
    }
    return Array.from(map.entries());
  }, [mistakes]);

  const availableCategories = useMemo(
    () => Array.from(new Set(mistakes.map((m) => m.errorCategory))),
    [mistakes]
  );

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (domainFilter !== 'all' && m.domainId !== domainFilter) return false;
      if (categoryFilter !== 'all' && m.errorCategory !== categoryFilter) return false;
      if (statusFilter !== 'all' && m.reviewStatus !== statusFilter) return false;
      return true;
    });
  }, [mistakes, domainFilter, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const unresolved = mistakes.filter((m) => m.reviewStatus !== 'resolved').length;
    const marked = mistakes.filter(
      (m) => m.reviewStatus === 'marked_for_revision'
    ).length;
    const resolved = mistakes.filter((m) => m.reviewStatus === 'resolved').length;
    const resolutionRate =
      mistakes.length > 0 ? Math.round((resolved / mistakes.length) * 100) : 100;
    return { unresolved, marked, resolved, resolutionRate };
  }, [mistakes]);

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner & Metrics */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#FFAA73] text-xs font-mono uppercase tracking-widest">
            <Brain className="w-4 h-4" />
            Mistake Journal & Dynamic Smart Revision Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Turn Analytical Errors Into Permanent Mastery
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl">
            Every incorrect SQL query, Python script, spreadsheet formula, or statistical calculation
            is automatically logged with root-cause diagnostics and prioritized by Smart Revision.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Needs Review</div>
            <div className="font-display text-xl font-bold text-[#FFAA73]">
              {stats.unresolved}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Flagged</div>
            <div className="font-display text-xl font-bold text-[#75D6D0]">
              {stats.marked}
            </div>
          </div>
          <div className="bg-[#101827] border border-white/10 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-[#9BA3B4] uppercase">Resolved</div>
            <div className="font-display text-xl font-bold text-[#C6F36B]">
              {stats.resolved} ({stats.resolutionRate}%)
            </div>
          </div>
        </div>
      </div>

      {/* SMART REVISION ENGINE RECOMMENDATIONS */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C6F36B]" />
            <h2 className="font-display text-base font-bold text-[#F5F3EA]">
              Smart Revision Queue (Prioritized by Real Activity & Error Patterns)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#9BA3B4]">
            {smartRevisionList.length} priority topic(s) identified
          </span>
        </div>

        {smartRevisionList.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#9BA3B4]">
            All practiced topics are above mastery threshold with zero unresolved mistakes!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartRevisionList.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-[#101827] border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.urgency === 'high'
                          ? 'bg-[#FFAA73]/20 text-[#FFAA73]'
                          : item.urgency === 'medium'
                          ? 'bg-[#75D6D0]/20 text-[#75D6D0]'
                          : 'bg-white/10 text-[#9BA3B4]'
                      }`}
                    >
                      {item.urgency} Priority ({item.priorityScore}/100)
                    </span>
                    {item.inLearningPath && (
                      <span className="text-[10px] font-mono text-[#C6F36B] flex items-center gap-1">
                        <Target className="w-3 h-3" /> In Path
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] text-[#9BA3B4]">{item.domainName}</div>
                    <div className="font-display text-sm font-bold text-[#F5F3EA]">
                      {item.topicTitle}
                    </div>
                  </div>

                  <div className="bg-[#0C121E] border border-white/5 rounded-lg p-2.5 text-xs text-[#F5F3EA]/85 leading-relaxed">
                    <span className="text-[#75D6D0] font-semibold">Why Recommended: </span>
                    {item.reason}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#9BA3B4]">
                    Accuracy: {item.accuracyPercent}% • Mistakes: {item.mistakeCount}
                  </span>
                  {item.recommendedExerciseIds[0] && (
                    <Link
                      to={`/platform/practice?exerciseId=${item.recommendedExerciseIds[0]}`}
                      className="px-3 py-1.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-[11px] font-bold text-[#101827] flex items-center gap-1 transition-colors"
                    >
                      Practice Now <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MISTAKE JOURNAL FILTER BAR & RECORDS */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#75D6D0]" />
            <h2 className="font-display text-base font-bold text-[#F5F3EA]">
              Detailed Mistake Journal ({filteredMistakes.length} records)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
            >
              <option value="all">All Domains / Skills</option>
              {availableDomains.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
            >
              <option value="all">All Error Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
            >
              <option value="all">All Statuses</option>
              <option value="needs_review">Needs Review</option>
              <option value="marked_for_revision">Marked for Revision</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9BA3B4]">
            No mistake records match the current filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((m) => (
              <div
                key={m.id}
                className="bg-[#101827] border border-white/10 rounded-xl p-5 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#FFAA73]/15 text-[#FFAA73] font-mono font-semibold">
                        {m.errorCategory}
                      </span>
                      <span className="text-[#75D6D0] font-mono">{m.domainName}</span>
                      <span className="text-[#9BA3B4]">• {m.topicTitle}</span>
                      <span className="text-[11px] font-mono text-[#9BA3B4] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {m.attemptDate} ({m.attemptCount} attempt
                        {m.attemptCount > 1 ? 's' : ''})
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#F5F3EA]">
                      {m.exerciseTitle}
                    </h3>
                  </div>

                  {/* Status & Action Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        m.reviewStatus === 'resolved'
                          ? 'bg-[#C6F36B]/20 text-[#C6F36B]'
                          : m.reviewStatus === 'marked_for_revision'
                          ? 'bg-[#75D6D0]/20 text-[#75D6D0]'
                          : 'bg-[#FFAA73]/20 text-[#FFAA73]'
                      }`}
                    >
                      {m.reviewStatus === 'resolved' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </>
                      ) : m.reviewStatus === 'marked_for_revision' ? (
                        <>
                          <Bookmark className="w-3.5 h-3.5" /> Marked for Revision
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> Needs Review
                        </>
                      )}
                    </span>

                    {m.reviewStatus !== 'marked_for_revision' &&
                      m.reviewStatus !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() =>
                            updateMistakeStatus(m.id, 'marked_for_revision')
                          }
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#75D6D0] flex items-center gap-1 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5" /> Flag for Revision
                        </button>
                      )}

                    {m.reviewStatus !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => updateMistakeStatus(m.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#C6F36B] flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}

                    <Link
                      to={`/platform/practice?exerciseId=${m.exerciseId}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reattempt Exercise
                    </Link>
                  </div>
                </div>

                {/* Submitted vs Expected Answer Diff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold">
                      Your Submitted Answer
                    </div>
                    <pre className="text-[#F5F3EA]/90 whitespace-pre-wrap overflow-x-auto">
                      {m.submittedAnswer}
                    </pre>
                  </div>

                  <div className="bg-[#C6F36B]/10 border border-[#C6F36B]/25 rounded-lg p-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-[#C6F36B] font-bold">
                      Expected / Verified Solution
                    </div>
                    <pre className="text-[#F5F3EA]/90 whitespace-pre-wrap overflow-x-auto">
                      {m.expectedAnswer}
                    </pre>
                  </div>
                </div>

                {/* Root-Cause Explanation */}
                <div className="bg-[#0C121E] border border-white/10 rounded-lg p-3.5 text-xs text-[#F5F3EA]/90 leading-relaxed">
                  <span className="font-bold text-[#75D6D0] mr-1.5">
                    Diagnostic Explanation:
                  </span>
                  {m.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
