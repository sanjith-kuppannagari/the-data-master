import assert from 'node:assert/strict';
import { UserProfile } from '../types/user';
import { calculateUserAnalytics } from '../services/analyticsEngine';
import { buildCalendarMonthData, getDayActivity } from '../services/calendarEngine';
import { syncInAppNotifications } from '../services/notificationEngine';
import { ADVANCED_ACHIEVEMENTS } from '../data/achievementsData';
import { evaluateUserAchievements } from '../services/achievementEngine';
import { evaluateUserMissions } from '../services/missionEngine';
import {
  interpretRuntimeError,
  explainAnalyticalConcept,
  getProgressiveHint,
} from '../services/learningAssistantEngine';
import { generatePersonalizedRecommendations } from '../services/recommendationEngine';
import { evaluateXPReward } from '../services/gamification';

// Helper to create a clean mock user profile for testing
function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'usr_phase6_test',
    email: 'test@datamaster.io',
    name: 'Ada Lovelace',
    role: 'Analytics Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Analytics Engineer passionate about data architectures',
    targetRole: 'Data Analyst',
    experienceLevel: 'Intermediate',
    dailyCommitmentMinutes: 30,
    learningStyles: ['Hands-on exercises', 'Real-world datasets'],
    primaryGoals: ['Master SQL & Python', 'Build executive portfolio'],
    selectedDomainIds: ['domain-1', 'domain-2', 'domain-3'],
    completedTopicIds: ['d2-t1', 'd2-t2'],
    completedActivityIds: [],
    xp: 450,
    level: 3,
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      enableAIAssistant: true,
      soundEffects: true,
      weeklyGoalMinutes: 180,
      isPortfolioPublic: true,
    },
    completedLessonIds: ['lesson-sql-01', 'lesson-sql-02', 'lesson-py-01'],
    completedChallengeIds: ['challenge-sql-01'],
    challengeProgress: {
      'challenge-sql-01': {
        challengeId: 'challenge-sql-01',
        status: 'completed',
        taskAnswers: {},
        timeSpentSeconds: 600,
        score: 90,
      },
    },
    practiceAttempts: [
      {
        id: 'att-1',
        exerciseId: 'ex-sql-01',
        domainId: 'domain-2',
        topicId: 'd2-t2',
        exerciseType: 'sql',
        isCorrect: true,
        submittedAnswer: 'SELECT * FROM users;',
        timestamp: new Date().toISOString(), // Today
        timeSpentSeconds: 120,
      },
      {
        id: 'att-2',
        exerciseId: 'ex-sql-02',
        domainId: 'domain-2',
        topicId: 'd2-t2',
        exerciseType: 'sql',
        isCorrect: true,
        submittedAnswer: 'SELECT id FROM users;',
        timestamp: new Date().toISOString(), // Today
        timeSpentSeconds: 180,
      },
      {
        id: 'att-3',
        exerciseId: 'ex-py-01',
        domainId: 'domain-3',
        topicId: 'd3-t1',
        exerciseType: 'python',
        isCorrect: false,
        submittedAnswer: 'df.groupby("x")',
        timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        timeSpentSeconds: 300,
      },
    ],
    mistakeRecords: [
      {
        id: 'mistake-01',
        exerciseId: 'ex-py-01',
        exerciseTitle: 'GroupBy Aggregation Drill',
        exerciseType: 'python',
        topicId: 'd3-t1',
        topicTitle: 'Pandas GroupBy & Aggregations',
        domainId: 'domain-3',
        domainName: 'Python Programming & Data Analytics',
        submittedAnswer: 'df.groupby("x")',
        expectedAnswer: 'df.groupby("x").agg({"y": "mean"})',
        errorCategory: 'Python Logic & Runtime',
        explanation: 'SyntaxError: unexpected EOF while parsing - missing closing aggregation call',
        attemptDate: new Date().toISOString(),
        attemptCount: 2,
        reviewStatus: 'needs_review',
      },
    ],
    simulationSubmissions: {
      'sim-churn-01': {
        answers: {},
        recommendation: 'Identified key cohort churn drivers in enterprise tier.',
        score: 85,
        feedback: 'Solid analysis',
        completedAt: new Date().toISOString(),
      },
    },
    detectiveProgress: {},
    competitionSubmissions: {},
    portfolioProjects: [
      {
        id: 'proj-01',
        userId: 'usr_phase6_test',
        authorName: 'Ada Lovelace',
        title: 'B2B Sales Pipeline Diagnostic',
        shortDescription: 'Analytical breakdown of enterprise sales funnel.',
        domainId: 'domain-2',
        domainName: 'SQL & Database Management',
        projectType: 'coding',
        problemStatement: 'Sales cycle elongated by 45% in Q3.',
        businessContext: 'Enterprise B2B pipeline conversion slowdown.',
        datasetInfo: { name: 'B2B CRM Pipeline' },
        tools: ['PostgreSQL', 'Metabase'],
        methodology: 'Cohorted pipeline velocity using SQL window functions.',
        analysisAndFindings: 'Bottleneck discovered at contract signature stage.',
        visualizations: [],
        conclusionsAndRecommendations: 'Implement auto-approval tier below $10,000 ARR.',
        skillsDemonstrated: ['SQL', 'Funnel Analysis'],
        learningOutcomes: ['Cohorted analysis'],
        status: 'published',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 4,
      },
    ],
    plannedSessions: [],
    notifications: [],
    notificationPreferences: {
      streakReminders: true,
      revisionAlerts: true,
      challengeUpdates: true,
      teamNotifications: true,
      achievementPops: true,
    },
    claimedMissionIds: [],
    unlockedAchievementIds: [],
    teams: [],
    ...overrides,
  };
}

async function runPhase6Tests() {
  console.log('=============================================================');
  console.log('RUNNING PHASE 6 AUTOMATED VERIFICATION SUITE');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Analytics Engine & Accurate Telemetry Calculations
  // ---------------------------------------------------------------------------
  console.log('1. Testing Analytics Engine Metrics & Filtering...');
  const user = createMockUser();

  // Test All-Time Analytics
  const allTimeStats = calculateUserAnalytics(user, { dateRange: 'all_time' });
  assert.equal(allTimeStats.exercisesAttemptedCount, 3, 'Must count 3 all-time practice attempts');
  assert.equal(allTimeStats.exercisesSolvedCount, 2, 'Must count 2 correct practice attempts');
  assert.equal(allTimeStats.overallAccuracyRate, 67, 'Accuracy rate must be 2/3 = 67%');
  assert.equal(allTimeStats.lessonsCompletedCount, 3, 'Must match completed lessons count');
  assert.equal(allTimeStats.challengesCompletedCount, 2, 'Must count 1 challenge + 1 simulation (score >= 70)');
  assert.equal(allTimeStats.projectsPublishedCount, 1, 'Must count 1 published portfolio project');
  assert.equal(allTimeStats.mistakesLoggedCount, 1, 'Must count 1 logged mistake');
  assert.equal(allTimeStats.mistakesResolvedCount, 0, 'No mistakes resolved initially');
  assert.equal(allTimeStats.mistakeResolutionRate, 0, 'Mistake resolution rate must be 0%');

  // Tracked time: 120 + 180 + 300 (practice) + 600 (challenge) = 1200 seconds
  assert.equal(allTimeStats.totalTimeTrackedSeconds, 1200, 'Total time must accurately sum practice and challenge duration');

  // Test Date Range Filter: Last 7 Days (excludes att-3 from 40 days ago)
  const last7Stats = calculateUserAnalytics(user, { dateRange: 'last_7_days' });
  assert.equal(last7Stats.exercisesAttemptedCount, 2, 'Last 7 days must only include recent 2 attempts');
  assert.equal(last7Stats.exercisesSolvedCount, 2, 'Both recent attempts were correct');
  assert.equal(last7Stats.overallAccuracyRate, 100, 'Recent accuracy must be 100%');

  // Test Domain Filter
  const pythonStats = calculateUserAnalytics(user, { dateRange: 'all_time', domainId: 'domain-3' });
  assert.equal(pythonStats.exercisesAttemptedCount, 1, 'Python domain has 1 attempt');
  assert.equal(pythonStats.exercisesSolvedCount, 0, 'Python attempt was incorrect');
  assert.equal(pythonStats.overallAccuracyRate, 0, 'Python accuracy must be 0%');

  // Test Domain Analytics Array
  assert.ok(allTimeStats.domainAnalytics.length > 0, 'Must produce domain-level breakdown');
  const sqlDomain = allTimeStats.domainAnalytics.find(d => d.domainId === 'domain-2');
  assert.ok(sqlDomain, 'SQL domain analytics must exist');
  assert.equal(sqlDomain.exercisesAttempted, 2);
  assert.equal(sqlDomain.exercisesCorrect, 2);
  assert.equal(sqlDomain.accuracyRate, 100);
  assert.ok(sqlDomain.masteryScore > 0, 'Mastery score must be calculated transparently');

  console.log('   ✓ Analytics metrics, date filtering, domain filtering, and mastery scoring verified.');

  // ---------------------------------------------------------------------------
  // 2. Learning Calendar & Activity Mapping
  // ---------------------------------------------------------------------------
  console.log('2. Testing Learning Calendar & Activity Ledger...');
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const calendarData = buildCalendarMonthData(user, currentYear, currentMonth);
  assert.equal(calendarData.year, currentYear);
  assert.equal(calendarData.month, currentMonth);
  assert.ok(calendarData.days.length % 7 === 0, 'Calendar grid must be a multiple of 7 (complete weeks)');
  assert.ok(calendarData.days.length >= 28 && calendarData.days.length <= 42, 'Grid length must be 28, 35, or 42');

  // Check today activity
  const todayStr = now.toISOString().split('T')[0];
  const todayCell = calendarData.days.find(d => d.date === todayStr);
  assert.ok(todayCell, 'Today cell must be present in calendar data');
  assert.equal(todayCell.isToday, true, 'isToday must be true for today');
  assert.equal(todayCell.activity.exercisesAttempted, 2, 'Today should record 2 practice attempts');
  assert.equal(todayCell.activity.challengesCompleted, 1, 'Today should record 1 completed simulation');
  assert.ok(todayCell.activity.hasActivity, 'hasActivity flag must be true');

  // Test getDayActivity directly
  const dayAct = getDayActivity(todayStr, user);
  assert.equal(dayAct.date, todayStr);
  assert.equal(dayAct.exercisesAttempted, 2);
  assert.equal(dayAct.challengesCompleted, 1);
  assert.equal(dayAct.projectsWorked, 1);
  assert.equal(dayAct.revisionReminders.length, 1); // 1 unresolved mistake today

  // Test planned sessions inside calendar
  const userWithPlanned = createMockUser({
    plannedSessions: [
      {
        id: 'plan-1',
        date: todayStr,
        title: 'Window Functions Drill',
        targetMinutes: 45,
        domainId: 'domain-2',
        domainName: 'SQL & Database Management',
        completed: false,
        notes: 'Practice running totals',
        createdAt: new Date().toISOString(),
      },
    ],
  });
  const dayActWithPlan = getDayActivity(todayStr, userWithPlanned);
  assert.equal(dayActWithPlan.plannedSessions.length, 1, 'Must register planned session on target date');
  assert.equal(dayActWithPlan.plannedSessions[0].title, 'Window Functions Drill');

  console.log('   ✓ Calendar grid generation, day ledger metrics, and planned sessions verified.');

  // ---------------------------------------------------------------------------
  // 3. In-App Notification System & Synchronization
  // ---------------------------------------------------------------------------
  console.log('3. Testing In-App Notification System...');
  const userForNotifs = createMockUser({
    currentStreak: 5,
    xp: 600, // Level 3 (350-650), next level at 650 (xpNeeded = 50 <= 80 triggers level notification)
  });

  const generatedNotifs = syncInAppNotifications(userForNotifs);
  assert.ok(generatedNotifs.length >= 3, 'Must trigger streak, revision, and level-up notifications');

  const streakNotif = generatedNotifs.find(n => n.type === 'learning_reminder');
  assert.ok(streakNotif, 'Must generate streak reminder');
  assert.ok(streakNotif.title.includes('5-Day Streak'), 'Must reflect current streak count');

  const revisionNotif = generatedNotifs.find(n => n.type === 'revision_recommendation');
  assert.ok(revisionNotif, 'Must generate revision notification for pending mistake');

  const levelNotif = generatedNotifs.find(n => n.type === 'achievement_unlock');
  assert.ok(levelNotif, 'Must generate level proximity notification when near level threshold');

  // Test Idempotency / No Duplicates on re-sync
  const userWithExistingNotifs = createMockUser({
    notifications: generatedNotifs,
  });
  const reSyncedNotifs = syncInAppNotifications(userWithExistingNotifs);
  assert.equal(reSyncedNotifs.length, generatedNotifs.length, 'Re-syncing notifications must not produce duplicate IDs');

  // Test Notification Preferences Filtering
  const userMuted = createMockUser({
    notificationPreferences: {
      streakReminders: false,
      revisionAlerts: false,
      challengeUpdates: false,
      teamNotifications: false,
      achievementPops: false,
    },
  });
  const mutedNotifs = syncInAppNotifications(userMuted);
  assert.equal(mutedNotifs.filter(n => n.type === 'learning_reminder').length, 0, 'Muted streak reminders must not appear');
  assert.equal(mutedNotifs.filter(n => n.type === 'revision_recommendation').length, 0, 'Muted revision alerts must not appear');

  console.log('   ✓ Notification generation, proximity triggers, idempotency, and preferences verified.');

  // ---------------------------------------------------------------------------
  // 4. Advanced Achievement System (16+ Verifiable Badges)
  // ---------------------------------------------------------------------------
  console.log('4. Testing Advanced Achievement Registry & Evaluation...');
  assert.ok(ADVANCED_ACHIEVEMENTS.length >= 16, `Must have at least 16 achievements, found ${ADVANCED_ACHIEVEMENTS.length}`);

  // Verify categories distribution
  const categories = new Set(ADVANCED_ACHIEVEMENTS.map(a => a.category));
  assert.ok(categories.has('learning'), 'Must include learning category');
  assert.ok(categories.has('streak'), 'Must include streak category');
  assert.ok(categories.has('mastery'), 'Must include mastery category');
  assert.ok(categories.has('challenge'), 'Must include challenge category');

  // Evaluate against user state
  const evaluatedAchievements = evaluateUserAchievements(user);
  assert.equal(evaluatedAchievements.length, ADVANCED_ACHIEVEMENTS.length);

  // 'ach-first-query' should be unlocked (user solved SQL exercise)
  const firstQueryAch = evaluatedAchievements.find(a => a.id === 'ach-first-query');
  assert.ok(firstQueryAch);
  assert.equal(firstQueryAch.isUnlocked, true, 'First query achievement must unlock when SQL practice completed');

  // 'ach-first-step' should be unlocked (completedLessonIds.length > 0)
  const firstStepAch = evaluatedAchievements.find(a => a.id === 'ach-first-step');
  assert.ok(firstStepAch);
  assert.equal(firstStepAch.isUnlocked, true, 'First step achievement must unlock when lesson completed');

  // 'ach-streak-week' should be locked (user streak is 5 < 7)
  const weekStreakAch = evaluatedAchievements.find(a => a.id === 'ach-streak-week');
  assert.ok(weekStreakAch);
  assert.equal(weekStreakAch.isUnlocked, false, '7-day streak must remain locked at 5 days');
  assert.equal(weekStreakAch.progressPercent, 71, '5/7 days is 71% progress');

  // Verify anti-duplicate XP awards logic
  const txId = 'usr_test:challenge:ach-first-query';
  const completedActivities = [txId];
  const duplicateReward = evaluateXPReward('usr_test', 'challenge', 'ach-first-query', 25, completedActivities, false);
  assert.equal(duplicateReward.xpAwarded, 0, 'Duplicate achievement unlock must award 0 XP');
  assert.equal(duplicateReward.isDuplicate, true, 'Duplicate flag must be true');

  console.log('   ✓ 16+ achievements registry, dynamic criteria evaluation, and anti-duplicate XP verified.');

  // ---------------------------------------------------------------------------
  // 5. Daily & Weekly Missions Engine
  // ---------------------------------------------------------------------------
  console.log('5. Testing Daily & Weekly Missions Generation & Evaluation...');
  const missions = evaluateUserMissions(user);
  assert.ok(missions.length >= 6, 'Must generate daily and weekly missions');

  const dailyMissions = missions.filter(m => m.cadence === 'daily');
  const weeklyMissions = missions.filter(m => m.cadence === 'weekly');
  assert.ok(dailyMissions.length >= 3, 'Must have at least 3 daily missions');
  assert.ok(weeklyMissions.length >= 3, 'Must have at least 3 weekly missions');

  // Today's user solved 2 practice exercises, so daily practice target of 3 should have count 2
  const todayStrDaily = now.toISOString().split('T')[0];
  const practiceMission = dailyMissions.find(m => m.id === `daily-practice-${todayStrDaily}`);
  assert.ok(practiceMission, 'Daily practice mission must exist for today');
  assert.equal(practiceMission.currentCount, 2, 'Must record 2 correct attempts today');
  assert.equal(practiceMission.targetCount, 3, 'Target must be 3');
  assert.equal(practiceMission.completed, false, 'Not completed yet (2 < 3)');

  // Completed lesson mission
  const lessonMission = dailyMissions.find(m => m.id === `daily-lesson-${todayStrDaily}`);
  assert.ok(lessonMission);
  assert.equal(lessonMission.completed, true, 'Lesson mission completed since user completed lessons');

  // Test anti-duplicate mission claim guard
  const userWithClaimed = createMockUser({
    claimedMissionIds: [`daily-lesson-${todayStrDaily}`],
  });
  const missionsWithClaimed = evaluateUserMissions(userWithClaimed);
  const claimedLessonMission = missionsWithClaimed.find(m => m.id === `daily-lesson-${todayStrDaily}`);
  assert.ok(claimedLessonMission);
  assert.equal(claimedLessonMission.claimed, true, 'Claimed mission must reflect claimed: true');

  // Gamification reward evaluation for mission claim
  const missionActKey = `daily-lesson-${todayStrDaily}`;
  const missionTxId = `usr_test:mission:${missionActKey}`;
  const claimedActivities = [missionTxId];
  const dupeMissionReward = evaluateXPReward('usr_test', 'mission', missionActKey, 30, claimedActivities, false);
  assert.equal(dupeMissionReward.xpAwarded, 0, 'Re-claiming mission must yield 0 XP');
  assert.equal(dupeMissionReward.isDuplicate, true, 'Duplicate prevention triggered');

  console.log('   ✓ Daily/weekly missions generation, target progression, and anti-duplicate claiming verified.');

  // ---------------------------------------------------------------------------
  // 6. Contextual Learning Assistant Engine
  // ---------------------------------------------------------------------------
  console.log('6. Testing Contextual Learning Assistant...');

  // SQL GROUP BY Mismatch Error Interpretation
  const sqlGroupByErr = interpretRuntimeError('column "orders.amount" must appear in the GROUP BY clause or be used in an aggregate function', 'sql');
  assert.equal(sqlGroupByErr.source, 'local_pedagogical_engine');
  assert.ok(sqlGroupByErr.topic.includes('GROUP BY'));
  assert.ok(sqlGroupByErr.actionableSteps.length >= 2, 'Must provide structured actionable steps');
  assert.ok(sqlGroupByErr.codeExample, 'Must provide code example for syntax correction');

  // SQL Syntax Error Interpretation
  const sqlSyntaxErr = interpretRuntimeError('syntax error at or near "FROM"', 'sql');
  assert.ok(sqlSyntaxErr.topic.includes('Syntax'));
  assert.ok(sqlSyntaxErr.actionableSteps.some(s => s.includes('clause execution order')));

  // Python KeyError Interpretation
  const pyKeyErr = interpretRuntimeError('KeyError: "churn_rate" not found in axis', 'python');
  assert.ok(pyKeyErr.topic.includes('KeyError'));
  assert.ok(pyKeyErr.actionableSteps.some(s => s.includes('df.columns')));

  // Concept Explanations
  const windowConcept = explainAnalyticalConcept('window function');
  assert.ok(windowConcept.explanation.includes('window function'));
  assert.ok(windowConcept.actionableSteps.length >= 2);
  assert.ok(windowConcept.codeExample?.includes('OVER (PARTITION BY'));

  const simpsonConcept = explainAnalyticalConcept('simpson\'s paradox');
  assert.ok(simpsonConcept.explanation.includes('confounding') || simpsonConcept.explanation.includes('reverses'));

  // Progressive Hints (No direct answers leaked)
  const hint1 = getProgressiveHint(1, 'SQL Self Joins');
  const hint2 = getProgressiveHint(2, 'SQL Self Joins');
  const hint3 = getProgressiveHint(3, 'SQL Self Joins');
  assert.ok(hint1.includes('Hint 1 (Conceptual Orientation)'));
  assert.ok(hint2.includes('Hint 2 (Syntactic Structure)'));
  assert.ok(hint3.includes('Hint 3 (Forensic Diagnostic)'));
  assert.ok(!hint1.includes('SELECT'), 'Hint 1 must not contain raw solution code');

  console.log('   ✓ Local pedagogical engine runtime error interpretation, concept explanations, and 3-level progressive hints verified.');

  // ---------------------------------------------------------------------------
  // 7. Transparent Personalized Recommendations Engine
  // ---------------------------------------------------------------------------
  console.log('7. Testing Personalized Recommendations Engine...');
  const recs = generatePersonalizedRecommendations(user);
  assert.ok(recs.length > 0, 'Must generate recommendations for active user');

  // Rule 1: High Urgency Revision due to unresolved mistake
  const revisionRec = recs.find(r => r.type === 'revision');
  assert.ok(revisionRec, 'Must recommend revision when user has unresolved mistakes in journal');
  assert.equal(revisionRec.priority, 'high');
  assert.ok(revisionRec.reason.includes('unresolved mistake'), 'Must transparently explain trigger reason');

  // Rule 2: Low-Accuracy Domain recommendation test
  const userWithLowAcc = createMockUser({
    practiceAttempts: [
      {
        id: 'att-fail-1',
        exerciseId: 'ex-py-1',
        domainId: 'domain-3',
        topicId: 'd3-t1',
        exerciseType: 'python',
        isCorrect: false,
        submittedAnswer: '',
        timestamp: new Date().toISOString(),
        timeSpentSeconds: 60,
      },
      {
        id: 'att-fail-2',
        exerciseId: 'ex-py-2',
        domainId: 'domain-3',
        topicId: 'd3-t1',
        exerciseType: 'python',
        isCorrect: false,
        submittedAnswer: '',
        timestamp: new Date().toISOString(),
        timeSpentSeconds: 60,
      },
    ],
  });
  const lowAccRecs = generatePersonalizedRecommendations(userWithLowAcc);
  const drillRec = lowAccRecs.find(r => r.type === 'exercise');
  assert.ok(drillRec, 'Must recommend practice drill when domain accuracy is under 65%');
  assert.ok(drillRec.reason.includes('mastery threshold'), 'Must mention mastery threshold');

  // Rule 3: Next Topic on Career Path
  const topicRec = recs.find(r => r.type === 'lesson');
  assert.ok(topicRec, 'Must recommend next uncompleted topic on career path');
  assert.ok(topicRec.reason.includes('learning path'), 'Must explain correlation to career path');

  console.log('   ✓ Transparent recommendations and pedagogical trigger rules verified.');

  console.log('\n=============================================================');
  console.log('ALL PHASE 6 VERIFICATION CHECKS PASSED SUCCESSFULLY (100%)');
  console.log('=============================================================');
}

runPhase6Tests().catch(err => {
  console.error('Phase 6 verification failed:', err);
  process.exit(1);
});
