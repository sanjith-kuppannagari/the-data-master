import { UserProfile } from '../types/user';
import { MissionGoal } from '../types/mission';

/**
 * Builds dynamic daily and weekly missions evaluated against the user's live profile
 */
export const evaluateUserMissions = (user: UserProfile): MissionGoal[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  const claimed = new Set(user.claimedMissionIds || []);

  const practiceAttempts = user.practiceAttempts || [];
  const completedLessons = user.completedLessonIds || [];
  const mistakes = user.mistakeRecords || [];
  const simulations = user.simulationSubmissions || {};
  const projects = user.portfolioProjects || [];

  // 1. Daily: Practice attempts today
  const attemptsToday = practiceAttempts.filter(a => a.timestamp.startsWith(todayStr) && a.isCorrect).length;

  // 2. Daily: Lessons completed
  const lessonsCount = completedLessons.length;

  // 3. Daily: Mistake resolution
  const resolvedMistakesCount = mistakes.filter(m => m.reviewStatus === 'resolved').length;

  // 4. Weekly: Challenges or simulations
  const challengesCount = (user.completedChallengeIds || []).length + Object.keys(simulations).length;

  // 5. Weekly: Portfolio case studies published
  const publishedProjectsCount = projects.filter(p => p.status === 'published').length;

  // 6. Weekly: Tracked practice minutes
  const totalTrackedMinutes = Math.round(
    practiceAttempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0) / 60
  );

  const missions: MissionGoal[] = [
    // DAILY MISSIONS
    {
      id: `daily-lesson-${todayStr}`,
      title: 'Daily Curriculum Advance',
      description: 'Complete 1 bite-sized lesson in any academy domain.',
      cadence: 'daily',
      category: 'lesson',
      targetCount: 1,
      currentCount: Math.min(1, lessonsCount),
      xpReward: 30,
      completed: lessonsCount >= 1,
      claimed: claimed.has(`daily-lesson-${todayStr}`),
      expiresAt: `${todayStr}T23:59:59Z`,
      actionUrl: '/platform/academies',
      actionLabel: 'Browse Academies',
    },
    {
      id: `daily-practice-${todayStr}`,
      title: 'Practice Arena Drill',
      description: 'Solve 3 hands-on practice exercises correctly.',
      cadence: 'daily',
      category: 'exercise',
      targetCount: 3,
      currentCount: Math.min(3, attemptsToday),
      xpReward: 45,
      completed: attemptsToday >= 3,
      claimed: claimed.has(`daily-practice-${todayStr}`),
      expiresAt: `${todayStr}T23:59:59Z`,
      actionUrl: '/platform/practice',
      actionLabel: 'Enter Arena',
    },
    {
      id: `daily-revision-${todayStr}`,
      title: 'Resilient Revision',
      description: 'Revisit your Mistake Journal and resolve 1 flagged error.',
      cadence: 'daily',
      category: 'revision',
      targetCount: 1,
      currentCount: Math.min(1, resolvedMistakesCount),
      xpReward: 35,
      completed: resolvedMistakesCount >= 1,
      claimed: claimed.has(`daily-revision-${todayStr}`),
      expiresAt: `${todayStr}T23:59:59Z`,
      actionUrl: '/platform/mistakes',
      actionLabel: 'Review Mistakes',
    },

    // WEEKLY MISSIONS
    {
      id: 'weekly-simulation-sprint',
      title: 'Executive Crisis Resolution',
      description: 'Submit an executive decision memo for any business simulation.',
      cadence: 'weekly',
      category: 'challenge',
      targetCount: 1,
      currentCount: Math.min(1, challengesCount),
      xpReward: 100,
      completed: challengesCount >= 1,
      claimed: claimed.has('weekly-simulation-sprint'),
      expiresAt: 'End of Week',
      actionUrl: '/platform/simulations',
      actionLabel: 'View Simulations',
    },
    {
      id: 'weekly-portfolio-milestone',
      title: 'Portfolio Showcase',
      description: 'Author and publish 1 verified analytical project case study.',
      cadence: 'weekly',
      category: 'project',
      targetCount: 1,
      currentCount: Math.min(1, publishedProjectsCount),
      xpReward: 120,
      completed: publishedProjectsCount >= 1,
      claimed: claimed.has('weekly-portfolio-milestone'),
      expiresAt: 'End of Week',
      actionUrl: '/platform/portfolio',
      actionLabel: 'Open Studio',
    },
    {
      id: 'weekly-time-commitment',
      title: 'Consistency Mastery',
      description: 'Log at least 60 verified minutes across exercises and workspaces.',
      cadence: 'weekly',
      category: 'exercise',
      targetCount: 60,
      currentCount: Math.min(60, totalTrackedMinutes),
      xpReward: 75,
      completed: totalTrackedMinutes >= 60,
      claimed: claimed.has('weekly-time-commitment'),
      expiresAt: 'End of Week',
      actionUrl: '/platform/practice',
      actionLabel: 'Practice Now',
    },
  ];

  return missions;
};
