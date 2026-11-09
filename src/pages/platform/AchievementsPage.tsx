import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { calculateLevelInfo, LEVEL_THRESHOLDS } from '../../services/gamification';
import { evaluateUserAchievements, EvaluatedAchievement } from '../../services/achievementEngine';
import {
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Flame,
  Shield,
  Target,
  Layers,
  Search,
  FolderGit2,
  Users,
  Sparkles,
  BookOpen,
  Terminal,
  Swords,
  Briefcase,
} from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const levelInfo = calculateLevelInfo(user.xp);
  const achievements = evaluateUserAchievements(user);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'streak', label: 'Consistency' },
    { id: 'learning', label: 'Learning' },
    { id: 'mastery', label: 'Mastery' },
    { id: 'challenge', label: 'Challenges' },
  ];

  const filteredAchievements = achievements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    return true;
  });

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-lime" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-cyan" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-lime" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-orange" />;
      case 'Milestone':
        return <Target className="w-5 h-5 text-cyan" />;
      case 'Target':
        return <Target className="w-5 h-5 text-lime" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-lime" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan" />;
      case 'Swords':
        return <Swords className="w-5 h-5 text-orange" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-lime" />;
      case 'Search':
        return <Search className="w-5 h-5 text-cyan" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-5 h-5 text-lime" />;
      case 'Users':
        return <Users className="w-5 h-5 text-cyan" />;
      default:
        return <Award className="w-5 h-5 text-lime" />;
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Achievements & Gamification' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-orange/10 text-orange border border-orange/30">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-orange">
              Milestone Recognition
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Badges & Level Milestones
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Transparent gamification rewarding verifiable analytical milestones: query precision, streak resilience, problem solving, and public portfolio authoring.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-charcoal p-3 rounded-xl border border-charcoal-border text-xs font-mono">
          <Zap className="w-4 h-4 text-lime fill-lime" />
          <span>
            Current: <strong className="text-lime">{user.xp} XP</strong> (Level {levelInfo.level})
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-soft-ivory font-bold">{unlockedCount}/{totalCount} Badges</span>
        </div>
      </div>

      {/* Level Ladder Card */}
      <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-lime" />
            <h2 className="text-sm font-bold text-soft-ivory uppercase tracking-wider font-mono">
              Level Progression Tier (1 — 10)
            </h2>
          </div>
          <span className="text-xs font-mono text-lime">
            {levelInfo.xpNeededForNext} XP to Level {levelInfo.level + 1}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          {LEVEL_THRESHOLDS.map(lvl => {
            const isReached = user.xp >= lvl.minXP;
            const isCurrent = levelInfo.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-lime/10 border-lime text-soft-ivory ring-1 ring-lime/40'
                    : isReached
                    ? 'bg-midnight/70 border-lime/30 text-slate-300'
                    : 'bg-midnight/30 border-charcoal-border text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-lime">LVL {lvl.level}</span>
                  {isReached && <CheckCircle2 className="w-3.5 h-3.5 text-lime" />}
                </div>
                <div className="text-[11px] font-semibold truncate text-slate-200">{lvl.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{lvl.minXP} XP</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-lime text-midnight border-lime font-bold shadow-sm'
                : 'bg-charcoal border-charcoal-border text-slate-300 hover:border-slate-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(ach => {
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm space-y-3 ${
                ach.isUnlocked
                  ? 'bg-charcoal border-lime/40 shadow-sm'
                  : 'bg-charcoal/60 border-charcoal-border opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      ach.isUnlocked
                        ? 'bg-midnight border-lime/40'
                        : 'bg-midnight/40 border-charcoal-border opacity-60'
                    }`}
                  >
                    {ach.isUnlocked ? (
                      getAchievementIcon(ach.icon)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-lime">
                      +{ach.xpReward} XP
                    </span>
                    <Badge variant={ach.isUnlocked ? 'lime' : 'neutral'} size="sm">
                      {ach.isUnlocked ? 'Unlocked' : 'In Progress'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-sm font-bold tracking-tight ${
                      ach.isUnlocked ? 'text-soft-ivory' : 'text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Criteria */}
              <div className="space-y-2 pt-2 border-t border-charcoal-border/50">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Condition: {ach.criteria}</span>
                  <span className={`font-bold ${ach.isUnlocked ? 'text-lime' : 'text-slate-500'}`}>
                    {ach.progressPercent}%
                  </span>
                </div>
                <ProgressBar
                  value={ach.progressPercent}
                  variant={ach.isUnlocked ? 'lime' : 'cyan'}
                  size="sm"
                />
                {ach.unlockedAt && (
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-lime" /> Unlocked{' '}
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
