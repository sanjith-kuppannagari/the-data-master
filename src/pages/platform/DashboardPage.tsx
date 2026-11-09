import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { calculateLevelInfo } from '../../services/gamification';
import { INITIAL_DAILY_MISSIONS, INITIAL_ACHIEVEMENTS } from '../../data/sampleData';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatCard } from '../../components/common/StatCard';
import {
  Flame,
  Zap,
  Target,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
  ChevronRight,
  Compass,
  Briefcase,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, completeActivity } = useUser();
  const levelInfo = calculateLevelInfo(user.xp);

  const completedCount = user.completedTopicIds.length;
  const totalTopics = CURRICULUM_DOMAINS.reduce((acc, d) => acc + d.topics.length, 0);
  const overallProgressPercent = Math.round((completedCount / totalTopics) * 100);

  // Resume target
  const resumeDomain = CURRICULUM_DOMAINS[1]; // SQL & Database Management
  const resumeTopic = resumeDomain.topics[2]; // Aggregations, Grouping & Multi-Table Joins

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal-border pb-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-lime/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                Welcome back, {user.name}
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
              Command Station // Target Role:{' '}
              <span className="text-lime font-mono font-medium">{user.targetRole}</span>
            </p>
          </div>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 bg-charcoal-surface p-2 rounded-xl border border-charcoal-border">
          <div className="px-3 py-1.5 rounded-lg bg-midnight text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange fill-orange" />
            <span>{user.currentStreak} Day Streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-midnight text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-lime fill-lime" />
            <span>{user.xp} XP (Lvl {levelInfo.level})</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Level"
          value={`Lvl ${levelInfo.level}`}
          sublabel={levelInfo.title}
          accentColor="lime"
          icon={<Zap className="w-5 h-5" />}
        />
        <StatCard
          label="Total XP"
          value={user.xp}
          sublabel={`${levelInfo.xpNeededForNext} XP to Level ${levelInfo.level + 1}`}
          accentColor="lime"
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          label="Consecutive Streak"
          value={`${user.currentStreak} Days`}
          sublabel={`Longest record: ${user.longestStreak} days`}
          accentColor="orange"
          icon={<Flame className="w-5 h-5" />}
        />
        <StatCard
          label="Syllabus Mastery"
          value={`${overallProgressPercent}%`}
          sublabel={`${completedCount} of ${totalTopics} topics completed`}
          accentColor="cyan"
          icon={<Compass className="w-5 h-5" />}
        />
      </div>

      {/* Primary 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Continue Learning + Learning Journey + Daily Missions */}
        <div className="lg:col-span-8 space-y-6">
          {/* CONTINUE LEARNING */}
          <Card variant="bordered" className="p-6 bg-charcoal-surface border-charcoal-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="text-lime uppercase font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Resume Learning
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est. {resumeTopic.estimatedMinutes} mins
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {resumeDomain.name}
                </span>
                <span className="text-slate-600">•</span>
                <PriorityBadge level={resumeDomain.defaultPriority} />
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                {resumeTopic.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {resumeTopic.description}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Module Progress</span>
                <span className="text-lime font-bold">40% Completed</span>
              </div>
              <ProgressBar value={40} variant="lime" size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/platform/lab">
                <Button variant="primary" size="md" icon={<Play className="w-4 h-4 fill-midnight" />}>
                  Resume Activity
                </Button>
              </Link>
              <Link to={`/academies/${resumeDomain.slug}`}>
                <Button variant="secondary" size="md">
                  View Syllabus Module
                </Button>
              </Link>
            </div>
          </Card>

          {/* DAILY MISSIONS */}
          <Card variant="bordered" className="p-6 bg-charcoal-surface">
            <div className="flex items-center justify-between mb-4 border-b border-charcoal-border pb-3">
              <div>
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-lime" />
                  Daily Data Missions
                </h3>
                <p className="text-xs text-slate-400">
                  Daily activities aligned with your learning goals. Complete to extend streak and earn XP.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Resets in 7h 14m
              </span>
            </div>

            <div className="space-y-3">
              {INITIAL_DAILY_MISSIONS.map(mission => (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    mission.completed
                      ? 'bg-midnight/40 border-charcoal-border/70 opacity-75'
                      : 'bg-midnight border-charcoal-border hover:border-lime/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-bold text-white">
                        {mission.title}
                      </span>
                      {mission.completed && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime/10 text-lime font-bold">
                          DONE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mission.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                      <span>{mission.estimatedMinutes} mins</span>
                      <span className="text-lime font-semibold">+{mission.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {mission.completed ? (
                      <span className="text-xs font-mono text-lime font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Finished
                      </span>
                    ) : (
                      <Link to={mission.actionUrl}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                          iconPosition="right"
                          onClick={() => {
                            completeActivity('mission', mission.id, mission.xpReward);
                          }}
                        >
                          Start Mission
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* LEARNING JOURNEY OVERVIEW */}
          <Card variant="bordered" className="p-6 bg-charcoal-surface">
            <div className="flex items-center justify-between mb-4 border-b border-charcoal-border pb-3">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  My Learning Journey Roadmap
                </h3>
                <p className="text-xs text-slate-400">
                  Customized path: {user.selectedDomainIds.length} active domains selected.
                </p>
              </div>
              <Link to="/platform/journey">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                  Manage Path
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {CURRICULUM_DOMAINS.filter(d => user.selectedDomainIds.includes(d.id))
                .slice(0, 4)
                .map(domain => (
                  <Link key={domain.id} to={`/academies/${domain.slug}`}>
                    <div className="p-3.5 rounded-xl bg-midnight border border-charcoal-border hover:border-lime/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          DOMAIN {domain.number.toString().padStart(2, '0')}
                        </span>
                        <PriorityBadge level={domain.defaultPriority} size="sm" />
                      </div>
                      <h4 className="font-heading font-bold text-white truncate mb-1">
                        {domain.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{domain.topics.length} topics</span>
                        <span className="text-lime flex items-center gap-0.5">
                          View <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Recommendation + Weekly Progress + Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* RECOMMENDED NEXT STEP */}
          <Card variant="bordered" className="p-5 bg-charcoal-surface border-lime/30">
            <div className="flex items-center gap-2 text-xs font-mono text-lime font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              RECOMMENDED NEXT STEP
            </div>
            <h4 className="text-base font-heading font-bold text-white mb-1">
              Join the Weekly Churn Simulation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Based on your completed SQL topics, tackle the B2B SaaS Churn Investigation to apply multi-table window functions to customer cancellation patterns.
            </p>
            <Link to="/platform/simulations">
              <Button variant="primary" size="sm" className="w-full justify-center">
                Launch Simulation
              </Button>
            </Link>
          </Card>

          {/* WEEKLY ACTIVITY PROGRESS */}
          <Card variant="bordered" className="p-5 bg-charcoal-surface space-y-4">
            <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan" />
              Weekly Commitment
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Goal: 180 mins / week</span>
                <span className="text-cyan font-bold">120 / 180 min</span>
              </div>
              <ProgressBar value={66} variant="cyan" size="md" />
            </div>

            {/* Daily activity dots */}
            <div className="pt-2 flex items-center justify-between text-center font-mono text-[10px]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isActive = idx < 6; // Active for 6 days
                return (
                  <div key={day} className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-lime text-midnight'
                          : 'bg-midnight text-slate-500 border border-charcoal-border'
                      }`}
                    >
                      {isActive ? '✓' : ''}
                    </div>
                    <span className="text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ACHIEVEMENTS SNAPSHOT */}
          <Card variant="bordered" className="p-5 bg-charcoal-surface space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-charcoal-border">
              <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange" />
                Achievements
              </h4>
              <Link to="/platform/achievements" className="text-xs text-lime font-mono hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {INITIAL_ACHIEVEMENTS.slice(0, 3).map(ach => (
                <div key={ach.id} className="flex items-center gap-3 p-2 rounded-lg bg-midnight border border-charcoal-border">
                  <div className={`p-2 rounded-lg ${ach.unlockedAt ? 'bg-lime/10 text-lime' : 'bg-charcoal-elevated text-slate-500'}`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-heading font-bold text-white truncate">{ach.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{ach.description}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-lime">+{ach.xpReward} XP</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
