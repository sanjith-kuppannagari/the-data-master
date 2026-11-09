import { UserProfile } from '../types/user';
import { CURRICULUM_DOMAINS } from '../data/curriculum';
import {
  DomainSkillAnalytics,
  ActivityTimelineItem,
  UserAnalyticsSummary,
  AnalyticsFilterOptions,
} from '../types/analytics';

/**
 * Filter activities by date range
 */
const isWithinDateRange = (timestamp: string, dateRange?: 'all_time' | 'last_30_days' | 'last_7_days'): boolean => {
  if (!dateRange || dateRange === 'all_time') return true;
  const time = new Date(timestamp).getTime();
  const now = Date.now();
  const daysDiff = (now - time) / (1000 * 60 * 60 * 24);

  if (dateRange === 'last_7_days') return daysDiff <= 7;
  if (dateRange === 'last_30_days') return daysDiff <= 30;
  return true;
};

/**
 * Calculates complete authentic analytics summary from user records
 */
export const calculateUserAnalytics = (
  user: UserProfile,
  filter?: AnalyticsFilterOptions
): UserAnalyticsSummary => {
  const dateRange = filter?.dateRange || 'all_time';

  // 1. Practice Attempts Filtered
  const allAttempts = user.practiceAttempts || [];
  const filteredAttempts = allAttempts.filter(att => {
    if (!isWithinDateRange(att.timestamp, dateRange)) return false;
    if (filter?.domainId && att.domainId !== filter.domainId) return false;
    return true;
  });

  const exercisesAttemptedCount = filteredAttempts.length;
  const exercisesSolvedCount = filteredAttempts.filter(a => a.isCorrect).length;
  const overallAccuracyRate =
    exercisesAttemptedCount > 0 ? Math.round((exercisesSolvedCount / exercisesAttemptedCount) * 100) : 0;

  // Tracked time from practice
  let totalTimeTrackedSeconds = filteredAttempts.reduce(
    (acc, att) => acc + (att.timeSpentSeconds || 0),
    0
  );

  // 2. Completed Lessons
  const completedLessonIds = user.completedLessonIds || [];
  const lessonsCompletedCount = completedLessonIds.length;

  // 3. Challenges & Simulations
  const completedChallengeIds = user.completedChallengeIds || [];
  const simulationSubmissions = user.simulationSubmissions || {};
  const detectiveProgress = user.detectiveProgress || {};
  const competitionSubmissions = user.competitionSubmissions || {};

  const simulationsSolvedCount = Object.values(simulationSubmissions).filter(s => s.score >= 70).length;
  const detectiveSolvedCount = Object.values(detectiveProgress).filter(d => d.isSolved).length;
  const competitionsCount = Object.keys(competitionSubmissions).length;

  const challengesCompletedCount =
    completedChallengeIds.length + simulationsSolvedCount + detectiveSolvedCount + competitionsCount;

  // Add time for challenges
  if (user.challengeProgress) {
    Object.values(user.challengeProgress).forEach(cp => {
      totalTimeTrackedSeconds += cp.timeSpentSeconds || 0;
    });
  }

  // 4. Portfolio Projects
  const portfolioProjects = user.portfolioProjects || [];
  const projectsPublishedCount = portfolioProjects.filter(p => p.status === 'published').length;
  const projectsTotalCount = portfolioProjects.length;

  // 5. Mistakes Journal Analytics
  const mistakeRecords = user.mistakeRecords || [];
  const mistakesLoggedCount = mistakeRecords.length;
  const mistakesResolvedCount = mistakeRecords.filter(m => m.reviewStatus === 'resolved').length;
  const mistakeResolutionRate =
    mistakesLoggedCount > 0 ? Math.round((mistakesResolvedCount / mistakesLoggedCount) * 100) : 0;

  // 6. Domain-by-Domain Analytics
  const domainAnalytics: DomainSkillAnalytics[] = CURRICULUM_DOMAINS.map(domain => {
    const domainAttempts = filteredAttempts.filter(
      a => a.domainId === domain.id || a.domainId === domain.slug
    );
    const domainAttemptCount = domainAttempts.length;
    const domainCorrectCount = domainAttempts.filter(a => a.isCorrect).length;
    const domainAccuracy =
      domainAttemptCount > 0 ? Math.round((domainCorrectCount / domainAttemptCount) * 100) : 0;

    const domainTime = domainAttempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);

    const topicsTotal = domain.topics.length;
    const topicsCompleted = domain.topics.filter(t =>
      (user.completedTopicIds || []).includes(t.id)
    ).length;

    // Areas of difficulty
    const unresolvedDomainMistakes = mistakeRecords
      .filter(
        m =>
          (m.domainId === domain.id || m.domainId === domain.slug) &&
          m.reviewStatus !== 'resolved'
      )
      .map(m => m.topicTitle);
    const areasOfDifficulty = Array.from(new Set(unresolvedDomainMistakes));

    // Next recommended step
    const uncompletedTopic = domain.topics.find(
      t => !(user.completedTopicIds || []).includes(t.id)
    );
    const nextRecommendedStep = unresolvedDomainMistakes.length > 0
      ? `Revise: ${unresolvedDomainMistakes[0]}`
      : uncompletedTopic
      ? `Study: ${uncompletedTopic.title}`
      : 'All topics mastered! Try the domain business simulation';

    // Transparent formula: 40% topics completion + 30% exercise accuracy + 30% challenge/project proof
    const completionFactor = topicsTotal > 0 ? (topicsCompleted / topicsTotal) * 40 : 0;
    const accuracyFactor = domainAttemptCount > 0 ? (domainAccuracy / 100) * 30 : 0;
    const proofFactor = (completedChallengeIds.length > 0 || projectsPublishedCount > 0) ? 30 : 10;
    const masteryScore = Math.min(100, Math.round(completionFactor + accuracyFactor + proofFactor));

    return {
      domainId: domain.id,
      domainName: domain.name,
      classification: domain.classification,
      priorityLevel: domain.defaultPriority,
      topicsTotal,
      topicsCompleted,
      exercisesAttempted: domainAttemptCount,
      exercisesCorrect: domainCorrectCount,
      accuracyRate: domainAccuracy,
      timeSpentSeconds: domainTime,
      masteryScore,
      areasOfDifficulty,
      nextRecommendedStep,
    };
  });

  // 7. Recent Chronological Timeline
  const timeline: ActivityTimelineItem[] = [];

  // Practice attempts in timeline
  filteredAttempts.forEach(att => {
    const domainObj = CURRICULUM_DOMAINS.find(d => d.id === att.domainId || d.slug === att.domainId);
    timeline.push({
      id: att.id,
      type: 'exercise',
      title: `Practice Exercise (${att.exerciseType.toUpperCase()})`,
      domainName: domainObj?.name || 'Practice Arena',
      timestamp: att.timestamp,
      details: att.isCorrect
        ? `Solved correctly in ${att.timeSpentSeconds || 45}s`
        : 'Attempted in practice arena',
      timeSpentSeconds: att.timeSpentSeconds,
      status: att.isCorrect ? 'completed' : 'failed',
    });
  });

  // Simulations in timeline
  Object.entries(simulationSubmissions).forEach(([simId, sub]) => {
    if (isWithinDateRange(sub.completedAt, dateRange)) {
      timeline.push({
        id: `sim-${simId}`,
        type: 'simulation',
        title: `Business Simulation: ${simId}`,
        domainName: 'Business Analytics',
        timestamp: sub.completedAt,
        details: `Scored ${sub.score}% on executive diagnostic memo`,
        score: sub.score,
        status: sub.score >= 70 ? 'completed' : 'failed',
      });
    }
  });

  // Projects in timeline
  portfolioProjects.forEach(proj => {
    if (isWithinDateRange(proj.updatedAt, dateRange)) {
      timeline.push({
        id: proj.id,
        type: 'project',
        title: proj.title,
        domainName: proj.domainName,
        timestamp: proj.updatedAt,
        details: proj.status === 'published' ? 'Published analytical case study' : 'Saved project draft',
        status: proj.status === 'published' ? 'completed' : 'in_progress',
      });
    }
  });

  // Sort timeline newest first
  timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // 8. Weekly Activity Distribution (Past 7 Days)
  const weeklyDistribution: { day: string; date: string; activitiesCount: number; minutesTracked: number }[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = daysOfWeek[d.getDay()];

    const dayAttempts = allAttempts.filter(a => a.timestamp.startsWith(dateStr));
    const dayActivitiesCount = dayAttempts.length;
    const dayMinutes = Math.round(
      dayAttempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0) / 60
    );

    weeklyDistribution.push({
      day: dayLabel,
      date: dateStr,
      activitiesCount: dayActivitiesCount,
      minutesTracked: dayMinutes,
    });
  }

  // 9. Accuracy Trends (Last 10 attempts rolling)
  const accuracyTrends: { date: string; cumulativeAccuracy: number; rollingAttempts: number }[] = [];
  let runningCorrect = 0;
  let runningTotal = 0;

  filteredAttempts.forEach(att => {
    runningTotal++;
    if (att.isCorrect) runningCorrect++;

    accuracyTrends.push({
      date: new Date(att.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      cumulativeAccuracy: Math.round((runningCorrect / runningTotal) * 100),
      rollingAttempts: runningTotal,
    });
  });

  return {
    totalXP: user.xp,
    level: user.level,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lessonsCompletedCount,
    exercisesAttemptedCount,
    exercisesSolvedCount,
    overallAccuracyRate,
    challengesCompletedCount,
    projectsPublishedCount,
    projectsTotalCount,
    totalTimeTrackedSeconds,
    mistakesLoggedCount,
    mistakesResolvedCount,
    mistakeResolutionRate,
    domainAnalytics,
    recentActivity: timeline.slice(0, 20),
    weeklyActivityDistribution: weeklyDistribution,
    accuracyTrends: accuracyTrends.slice(-15),
  };
};
