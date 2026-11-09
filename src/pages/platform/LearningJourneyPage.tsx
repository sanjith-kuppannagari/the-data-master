import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { generateLearningPath } from '../../services/pathGenerator';
import { getLessonsByTopicId } from '../../data/lessons';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  Milestone as MilestoneIcon,
  Check,
  Plus,
  Play,
  Clock,
  Sparkles,
  BookOpen,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  Target,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LearningJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, toggleDomainSelection, resetProgress } = useUser();
  const [selectedMilestoneTab, setSelectedMilestoneTab] = useState<number>(1);

  // Generate personalized learning path dynamically from user profile
  const path = useMemo(() => {
    return generateLearningPath({
      userId: user.id,
      targetRole: user.targetRole,
      primaryGoals: user.primaryGoals,
      selectedDomainIds: user.selectedDomainIds,
      experienceLevel: user.experienceLevel,
      dailyCommitmentMinutes: user.dailyCommitmentMinutes,
      completedTopicIds: user.completedTopicIds,
    });
  }, [user]);

  const activeMilestone = path.milestones.find(m => m.number === selectedMilestoneTab) || path.milestones[0];

  return (
    <div className="space-y-8 pb-20 font-sans">
      <Breadcrumb items={[{ label: 'My Learning Journey' }]} />

      {/* Header Banner */}
      <div className="relative rounded-2xl bg-charcoal-surface border border-charcoal-border p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
                <MilestoneIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">
                Personalised Learning Roadmap
              </span>
              <Badge variant="lime">{user.targetRole}</Badge>
              <Badge variant="neutral">{user.experienceLevel}</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Your Tailored Path to Mastery
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Generated from your selected domains and goals. Topics are structured into 4 milestones respecting strict curriculum prerequisites.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lime" />
                Est. {path.totalEstimatedDays} days @ {path.dailyCommitmentMinutes} min/day
              </span>
              <span>•</span>
              <span className="text-slate-200 font-semibold">
                {path.completedTopicsCount} of {path.allTopicsCount} topics verified ({path.progressPercent}%)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0">
            <Link to="/onboarding">
              <Button variant="secondary" size="sm" icon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
                Reconfigure Goals
              </Button>
            </Link>
            <Link to="/academies">
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Browse 15 Academies
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overall Roadmap Progress Strip */}
      <Card variant="bordered" className="p-5 bg-charcoal-surface border-charcoal-border space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-semibold">
            Overall Roadmap Completion
          </span>
          <span className="text-lime font-bold">{path.progressPercent}% Completed</span>
        </div>
        <ProgressBar value={path.progressPercent} variant="lime" size="md" />
      </Card>

      {/* 4 Milestones Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {path.milestones.map(m => {
          const isSelected = selectedMilestoneTab === m.number;

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMilestoneTab(m.number)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white shadow-[0_0_20px_rgba(198,243,107,0.15)]'
                  : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className={isSelected ? 'text-lime font-bold' : 'text-slate-400'}>
                    STAGE {m.number}
                  </span>
                  {m.progressPercent === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-lime" />
                  ) : m.isUnlocked ? (
                    <span className="text-[10px] font-mono text-slate-400">{m.progressPercent}%</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <h3 className="font-heading font-bold text-sm text-white mb-1 line-clamp-1">
                  {m.title}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {m.targetFocus}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-charcoal-border/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{m.items.length} topics</span>
                <span>~{m.estimatedHours} hrs</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Milestone Detailed Topics */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-border pb-3">
          <div>
            <span className="text-xs font-mono uppercase text-lime font-bold">
              Milestone {activeMilestone.number}: {activeMilestone.title}
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeMilestone.description}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeMilestone.items.filter(i => i.isCompleted).length} of {activeMilestone.items.length} completed
          </span>
        </div>

        <div className="space-y-4">
          {activeMilestone.items.map((item, idx) => {
            const lessons = getLessonsByTopicId(item.topic.id);
            const primaryLesson = lessons.length > 0 ? lessons[0] : null;

            return (
              <Card
                key={`${item.domain.id}-${item.topic.id}`}
                variant="bordered"
                className={`p-6 border-charcoal-border transition-all ${
                  item.isCompleted
                    ? 'bg-charcoal-surface/60 border-lime/30'
                    : 'bg-charcoal-surface hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        {item.domain.name}
                      </span>
                      <PriorityBadge level={item.domain.defaultPriority} />
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          item.importance === 'essential'
                            ? 'bg-lime/20 text-lime border border-lime/30'
                            : item.importance === 'recommended'
                            ? 'bg-cyan/10 text-cyan border border-cyan/30'
                            : 'bg-charcoal-elevated text-slate-400'
                        }`}
                      >
                        {item.importance}
                      </span>
                      <Badge variant={item.topic.difficulty === 'beginner' ? 'lime' : item.topic.difficulty === 'intermediate' ? 'cyan' : 'orange'}>
                        {item.topic.difficulty}
                      </Badge>
                      {item.isCompleted && (
                        <span className="text-[11px] font-mono text-lime font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-heading font-bold text-white">
                      {item.topic.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {item.topic.description}
                    </p>

                    {/* Prerequisites alert if missing */}
                    {!item.prerequisitesMet && item.missingPrerequisites.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-orange/10 border border-orange/30 text-xs text-orange font-mono flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Prerequisite foundational topics recommended first: {item.missingPrerequisites.join(', ')}</span>
                      </div>
                    )}

                    {/* Subtopics snapshot */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.topic.subtopics.slice(0, 3).map((st, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight border border-charcoal-border text-slate-400"
                        >
                          {st}
                        </span>
                      ))}
                      {item.topic.subtopics.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-500 self-center">
                          +{item.topic.subtopics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex sm:flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.estimatedMinutes} mins
                    </span>

                    {primaryLesson ? (
                      <Link to={`/platform/lessons/${primaryLesson.id}`}>
                        <Button
                          variant={item.isCompleted ? 'secondary' : 'primary'}
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5 fill-current" />}
                        >
                          {item.isCompleted ? 'Review Lesson' : 'Launch Lesson'}
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/platform/lab">
                        <Button variant="secondary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
                          Launch in Lab
                        </Button>
                      </Link>
                    )}

                    <Link
                      to={`/academies/${item.domain.slug}`}
                      className="text-[11px] font-mono text-slate-400 hover:text-lime underline"
                    >
                      Academy Overview →
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
