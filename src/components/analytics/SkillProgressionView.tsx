import React, { useState } from 'react';
import { DomainSkillAnalytics } from '../../types/analytics';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import {
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillProgressionViewProps {
  domainAnalytics: DomainSkillAnalytics[];
}

export const SkillProgressionView: React.FC<SkillProgressionViewProps> = ({ domainAnalytics }) => {
  const navigate = useNavigate();
  const [filterClassification, setFilterClassification] = useState<string>('all');

  const classifications = Array.from(new Set(domainAnalytics.map(d => d.classification)));

  const filtered = domainAnalytics.filter(d => {
    if (filterClassification !== 'all' && d.classification !== filterClassification) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Classification Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-charcoal-border pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-soft-ivory">
            15 Domain Mastery Progression
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Classification:</span>
          <select
            value={filterClassification}
            onChange={e => setFilterClassification(e.target.value)}
            className="bg-midnight border border-charcoal-border rounded-lg px-2.5 py-1 text-xs text-soft-ivory focus:outline-none focus:border-lime"
          >
            <option value="all">All Classifications</option>
            {classifications.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(domain => {
          const hasTimeTracked = domain.timeSpentSeconds > 0;
          const minutesTracked = Math.round(domain.timeSpentSeconds / 60);

          return (
            <div
              key={domain.domainId}
              className="p-5 rounded-2xl bg-charcoal border border-charcoal-border hover:border-slate-500 transition-all flex flex-col justify-between shadow-sm space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      {domain.classification}
                    </span>
                    <h4 className="text-sm font-bold text-soft-ivory tracking-tight">
                      {domain.domainName}
                    </h4>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {domain.priorityLevel}
                  </Badge>
                </div>

                {/* Mastery Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Mastery Index:</span>
                    <span className="font-bold text-lime">{domain.masteryScore}%</span>
                  </div>
                  <ProgressBar value={domain.masteryScore} variant="lime" size="sm" />
                </div>

                {/* Submetrics row */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-charcoal-border/50 text-[11px] font-mono">
                  <div className="bg-midnight/60 p-2 rounded-lg border border-charcoal-border">
                    <span className="text-slate-400 block text-[10px]">Curriculum Topics</span>
                    <span className="font-bold text-soft-ivory">
                      {domain.topicsCompleted} / {domain.topicsTotal}
                    </span>
                  </div>
                  <div className="bg-midnight/60 p-2 rounded-lg border border-charcoal-border">
                    <span className="text-slate-400 block text-[10px]">Practice Accuracy</span>
                    <span
                      className={`font-bold ${
                        domain.exercisesAttempted === 0
                          ? 'text-slate-500'
                          : domain.accuracyRate >= 70
                          ? 'text-lime'
                          : 'text-orange'
                      }`}
                    >
                      {domain.exercisesAttempted === 0 ? 'No attempts' : `${domain.accuracyRate}% (${domain.exercisesCorrect}/${domain.exercisesAttempted})`}
                    </span>
                  </div>
                </div>

                {/* Areas of Difficulty */}
                {domain.areasOfDifficulty.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-orange flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Area of Difficulty:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {domain.areasOfDifficulty.map(diff => (
                        <span
                          key={diff}
                          className="px-2 py-0.5 rounded bg-orange/10 border border-orange/30 text-[10px] text-orange font-mono"
                        >
                          {diff}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-lime" /> Zero active errors logged
                  </div>
                )}
              </div>

              {/* Card Footer: Next Step */}
              <div className="pt-3 border-t border-charcoal-border/70 flex items-center justify-between text-xs">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{hasTimeTracked ? `${minutesTracked}m tracked` : '0m tracked'}</span>
                </div>

                <button
                  onClick={() => navigate('/platform/practice')}
                  className="text-lime hover:underline font-medium text-xs flex items-center gap-1"
                >
                  Practice →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
