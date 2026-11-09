import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDomainBySlug } from '../../data/curriculum';
import { useUser } from '../../context/UserContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ClassificationBadge, PriorityBadge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  Check,
  Plus,
  Play,
  Terminal,
  Clock,
  Zap,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const DomainDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, toggleDomainSelection, completeTopic } = useUser();

  const domain = getDomainBySlug(slug || '');

  if (!domain) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-heading font-bold text-white">Academy Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested domain identifier does not match any of the 15 authoritative syllabus academies.
        </p>
        <Link to="/academies">
          <Button variant="primary" size="sm">
            Return to Academies Directory
          </Button>
        </Link>
      </div>
    );
  }

  const isSelected = user.selectedDomainIds.includes(domain.id);
  const totalSubtopics = domain.topics.reduce((acc, t) => acc + t.subtopics.length, 0);

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb
        items={[
          { label: 'Academies', path: '/academies' },
          { label: domain.name },
        ]}
      />

      {/* Header Banner */}
      <div className="relative rounded-2xl bg-charcoal-surface border border-charcoal-border p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                ACADEMY {domain.number.toString().padStart(2, '0')}
              </span>
              <PriorityBadge level={domain.defaultPriority} />
              <ClassificationBadge classification={domain.classification} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              {domain.name}
            </h1>

            <p className="text-base text-slate-200 font-heading font-medium">
              {domain.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {domain.description}
            </p>

            {/* Tools Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono uppercase text-slate-400">Official Tools:</span>
              {domain.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-midnight border border-charcoal-border text-xs font-mono text-lime font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => toggleDomainSelection(domain.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold flex items-center justify-center gap-2 border transition-all ${
                isSelected
                  ? 'bg-lime/20 text-lime border-lime/40 hover:bg-lime/30'
                  : 'bg-charcoal-elevated text-slate-200 border-charcoal-border hover:border-slate-400'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Your Journey</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to My Journey</span>
                </>
              )}
            </button>

            <Link to="/platform/lab">
              <Button
                variant="primary"
                size="md"
                icon={<Terminal className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Launch Learning Lab
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Domain Overview: Objectives & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <Card variant="bordered" className="p-6 space-y-4">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime" />
            Learning Objectives
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            {domain.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-lime font-mono font-bold text-xs shrink-0">{idx + 1}.</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prerequisites & Recommended Projects */}
        <Card variant="bordered" className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-cyan" />
              Prerequisites
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {domain.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-charcoal-border">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-2">
              <FolderGit2 className="w-4 h-4 text-orange" />
              Recommended Capstone Projects
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              {domain.recommendedProjects.map((proj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange font-mono">→</span>
                  <span className="text-slate-200">{proj}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Complete Topic and Subtopic Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-tight">
              Complete Topic & Subtopic Hierarchy
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {domain.topics.length} module topics • {totalSubtopics} authoritative subtopics
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {domain.topics.map((topic, topicIdx) => {
            const isCompleted = user.completedTopicIds.includes(topic.id);

            return (
              <Card
                key={topic.id}
                variant="bordered"
                className={`p-6 border-charcoal-border transition-all ${
                  isCompleted ? 'border-lime/40 bg-charcoal-surface/60' : 'bg-charcoal-surface'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-lime">
                        TOPIC {topicIdx + 1}
                      </span>
                      <Badge variant={topic.difficulty === 'beginner' ? 'lime' : topic.difficulty === 'intermediate' ? 'cyan' : 'orange'}>
                        {topic.difficulty}
                      </Badge>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-lime px-2 py-0.5 rounded bg-lime/10">
                          <Check className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {topic.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {topic.estimatedMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-lime font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      +{topic.xpReward} XP
                    </span>
                    <button
                      onClick={() => completeTopic(topic.id, topic.xpReward)}
                      disabled={isCompleted}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-lime/20 text-lime cursor-default'
                          : 'bg-lime text-midnight hover:bg-lime-glow font-bold'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Completed'}
                    </button>
                  </div>
                </div>

                {/* Subtopics Listing */}
                <div className="pt-3 border-t border-charcoal-border/70">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    Subtopics & Practical Concepts:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {topic.subtopics.map((subtopic, subIdx) => (
                      <div
                        key={subIdx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-midnight/70 border border-charcoal-border text-slate-300 font-sans"
                      >
                        <span className="text-lime font-mono text-[11px] mt-0.5">▪</span>
                        <span className="leading-relaxed">{subtopic}</span>
                      </div>
                    ))}
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
