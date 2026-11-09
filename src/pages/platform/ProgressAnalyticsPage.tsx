import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { calculateLevelInfo } from '../../services/gamification';
import { calculateUserAnalytics } from '../../services/analyticsEngine';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { SkillProgressionView } from '../../components/analytics/SkillProgressionView';
import {
  LineChart as LineChartIcon,
  Clock,
  Zap,
  Flame,
  Target,
  TrendingUp,
  BarChart2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Trophy,
  Filter,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ProgressAnalyticsPage: React.FC = () => {
  const { user } = useUser();
  const [dateRange, setDateRange] = useState<'all_time' | 'last_30_days' | 'last_7_days'>('all_time');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'timeline'>('overview');

  const levelInfo = calculateLevelInfo(user.xp);

  // Compute authentic analytics
  const analytics = useMemo(() => {
    return calculateUserAnalytics(user, {
      dateRange,
      domainId: selectedDomainId === 'all' ? undefined : selectedDomainId,
    });
  }, [user, dateRange, selectedDomainId]);

  // Radar data (top 6 or 8 domains for clean radar rendering)
  const radarData = useMemo(() => {
    return analytics.domainAnalytics.slice(0, 8).map(d => ({
      domain: d.domainName.split(' ')[0] + ' ' + (d.domainName.split(' ')[1] || ''),
      mastery: d.masteryScore,
      accuracy: d.accuracyRate,
    }));
  }, [analytics.domainAnalytics]);

  // Formatted learning time
  const totalHours = Math.floor(analytics.totalTimeTrackedSeconds / 3600);
  const totalMins = Math.round((analytics.totalTimeTrackedSeconds % 3600) / 60);
  const formattedTime =
    analytics.totalTimeTrackedSeconds === 0
      ? '0m (untimed)'
      : totalHours > 0
      ? `${totalHours}h ${totalMins}m`
      : `${totalMins}m`;

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Progress & Analytics' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <LineChartIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-lime">
              Verified Learning Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Personal Performance Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Real performance telemetry derived from verified query executions, practice attempts, challenge rubrics, and mistake resolution logs.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-charcoal border border-charcoal-border text-xs">
            <button
              onClick={() => setDateRange('all_time')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                dateRange === 'all_time'
                  ? 'bg-midnight text-lime font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('last_30_days')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                dateRange === 'last_30_days'
                  ? 'bg-midnight text-lime font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateRange('last_7_days')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                dateRange === 'last_7_days'
                  ? 'bg-midnight text-lime font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 7 Days
            </button>
          </div>

          <select
            value={selectedDomainId}
            onChange={e => setSelectedDomainId(e.target.value)}
            className="bg-charcoal border border-charcoal-border rounded-xl px-3 py-1.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
          >
            <option value="all">All Domains (15)</option>
            {CURRICULUM_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Practice Accuracy</span>
            <Target className="w-4 h-4 text-lime" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {analytics.overallAccuracyRate}%
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {analytics.exercisesSolvedCount} solved / {analytics.exercisesAttemptedCount} attempted
          </p>
        </div>

        {/* Card 2: Lessons Completed */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Lessons Finished</span>
            <CheckCircle2 className="w-4 h-4 text-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {analytics.lessonsCompletedCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Across 15 academies
          </p>
        </div>

        {/* Card 3: Tracked Time */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Tracked Practice</span>
            <Clock className="w-4 h-4 text-orange" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {formattedTime}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Verified stopwatch time
          </p>
        </div>

        {/* Card 4: Challenges Completed */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Challenges Solved</span>
            <Trophy className="w-4 h-4 text-lime" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {analytics.challengesCompletedCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Simulations & sprints
          </p>
        </div>

        {/* Card 5: Mistake Resolution */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Mistakes Revised</span>
            <AlertCircle className="w-4 h-4 text-orange" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {analytics.mistakeResolutionRate}%
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {analytics.mistakesResolvedCount} / {analytics.mistakesLoggedCount} resolved
          </p>
        </div>

        {/* Card 6: Portfolio Projects */}
        <div className="p-4 rounded-2xl bg-charcoal border border-charcoal-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Published Projects</span>
            <FolderGit2 className="w-4 h-4 text-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-soft-ivory">
            {analytics.projectsPublishedCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {analytics.projectsTotalCount} total in studio
          </p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-1 border-b border-charcoal-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Performance Telemetry & Charts
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'skills'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          15-Domain Skill Progression
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Chronological Activity Ledger ({analytics.recentActivity.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Domain Competency Radar (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-charcoal border border-charcoal-border flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-charcoal-border pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-lime" />
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                      Analytical Competency Radar
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Mastery Index (0-100)</span>
                </div>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                  Synthesizes topic completions, exercise accuracy, and challenge submissions across core disciplines.
                </p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#262D3D" />
                    <PolarAngleAxis dataKey="domain" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis stroke="#334155" domain={[0, 100]} />
                    <Radar
                      name="Mastery"
                      dataKey="mastery"
                      stroke="#C6F36B"
                      fill="#C6F36B"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Accuracy"
                      dataKey="accuracy"
                      stroke="#75D6D0"
                      fill="#75D6D0"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono border-t border-charcoal-border/50">
                <span className="flex items-center gap-1.5 text-lime">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime" /> Mastery Index
                </span>
                <span className="flex items-center gap-1.5 text-cyan">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan" /> Exercise Accuracy
                </span>
              </div>
            </div>

            {/* Weekly Activity Volume & Accuracy Trends (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Weekly Activity Distribution Bar Chart */}
              <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan" />
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                      Past 7 Days Activity & Practice Minutes
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Daily Volume</span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.weeklyActivityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                      <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171C26',
                          borderColor: '#262D3D',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="activitiesCount" name="Activities" fill="#C6F36B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="minutesTracked" name="Minutes" fill="#75D6D0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Accuracy Trendline */}
              <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-lime" />
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                      Cumulative Exercise Accuracy Trendline
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Rolling Attempts</span>
                </div>

                <div className="h-44 w-full">
                  {analytics.accuracyTrends.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                      No longitudinal practice attempts recorded yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.accuracyTrends}>
                        <defs>
                          <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C6F36B" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#C6F36B" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#171C26',
                            borderColor: '#262D3D',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeAccuracy"
                          name="Cumulative Accuracy %"
                          stroke="#C6F36B"
                          fillOpacity={1}
                          fill="url(#accuracyGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKILL PROGRESSION VIEW */}
      {activeTab === 'skills' && (
        <SkillProgressionView domainAnalytics={analytics.domainAnalytics} />
      )}

      {/* TAB 3: RECENT CHRONOLOGICAL LEDGER */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
              Chronological Audit Trail ({analytics.recentActivity.length} Events)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Verified Activity Ledger</span>
          </div>

          {analytics.recentActivity.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center font-mono">
              No learning activity recorded within the selected date range.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.recentActivity.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-midnight/60 border border-charcoal-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.status === 'completed'
                          ? 'bg-lime'
                          : item.status === 'failed'
                          ? 'bg-orange'
                          : 'bg-cyan'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-soft-ivory">{item.title}</span>
                        <Badge variant="cyan" size="sm">
                          {item.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{item.details}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px] text-slate-400">
                    <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                    {item.timeSpentSeconds && (
                      <span className="text-slate-500">{item.timeSpentSeconds}s elapsed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
