import { UserProfile } from '../types/user';
import { CalendarDayActivity, PlannedSession } from '../types/calendar';

export interface CalendarMonthData {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  monthName: string;
  days: {
    date: string; // YYYY-MM-DD
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    activity: CalendarDayActivity;
  }[];
  weeklyTargetMinutes: number;
  weeklyActualMinutes: number;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Computes calendar matrix and binds real activity records to dates
 */
export const buildCalendarMonthData = (
  user: UserProfile,
  year: number,
  month: number // 0-indexed
): CalendarMonthData => {
  const monthName = MONTH_NAMES[month];
  const todayStr = new Date().toISOString().split('T')[0];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Find day of week for 1st of month (0 = Sun, 1 = Mon... convert to Monday-first: Mon=0 ... Sun=6)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const practiceAttempts = user.practiceAttempts || [];
  const plannedSessions = user.plannedSessions || [];
  const mistakeRecords = user.mistakeRecords || [];
  const simulationSubmissions = user.simulationSubmissions || {};
  const portfolioProjects = user.portfolioProjects || [];

  const days: CalendarMonthData['days'] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, month - 1, dayNum).toISOString().split('T')[0];
    days.push({
      date: prevMonthDate,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: prevMonthDate === todayStr,
      activity: getDayActivity(prevMonthDate, user),
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const curDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    days.push({
      date: curDate,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: curDate === todayStr,
      activity: getDayActivity(curDate, user),
    });
  }

  // Next month padding to fill complete grid of 35 or 42 cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const nextMonthDate = new Date(year, month + 1, dayNum).toISOString().split('T')[0];
    days.push({
      date: nextMonthDate,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: nextMonthDate === todayStr,
      activity: getDayActivity(nextMonthDate, user),
    });
  }

  // Calculate weekly target vs actual minutes for the current calendar week
  const weeklyTargetMinutes = user.preferences?.weeklyGoalMinutes || user.dailyCommitmentMinutes * 7 || 180;

  // Find current week (Monday to Sunday)
  const now = new Date();
  const currentDayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  let weeklyActualSeconds = 0;
  practiceAttempts.forEach(att => {
    const attTime = new Date(att.timestamp).getTime();
    if (attTime >= startOfWeek.getTime() && attTime <= endOfWeek.getTime()) {
      weeklyActualSeconds += att.timeSpentSeconds || 0;
    }
  });

  const weeklyActualMinutes = Math.round(weeklyActualSeconds / 60);

  return {
    year,
    month,
    monthName,
    days,
    weeklyTargetMinutes,
    weeklyActualMinutes,
  };
};

/**
 * Returns real activity metrics for a specific calendar date string (YYYY-MM-DD)
 */
export const getDayActivity = (dateStr: string, user: UserProfile): CalendarDayActivity => {
  const practiceAttempts = user.practiceAttempts || [];
  const plannedSessions = user.plannedSessions || [];
  const mistakeRecords = user.mistakeRecords || [];
  const simulationSubmissions = user.simulationSubmissions || {};
  const portfolioProjects = user.portfolioProjects || [];

  const dayAttempts = practiceAttempts.filter(a => a.timestamp.startsWith(dateStr));
  const exercisesAttempted = dayAttempts.length;

  // Tracked seconds
  const daySeconds = dayAttempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);
  const minutesSpent = Math.round(daySeconds / 60);

  // Challenges completed on this date
  const daySims = Object.values(simulationSubmissions).filter(s => s.completedAt?.startsWith(dateStr));
  const challengesCompleted = daySims.length;

  // Projects worked on this date
  const dayProjects = portfolioProjects.filter(p => p.updatedAt?.startsWith(dateStr));
  const projectsWorked = dayProjects.length;

  // Planned sessions for this date
  const dayPlanned = plannedSessions.filter(s => s.date === dateStr);

  // Revision reminders for unresolved mistakes
  const revisionReminders: string[] = [];
  mistakeRecords.forEach(m => {
    if (m.reviewStatus !== 'resolved' && m.attemptDate.startsWith(dateStr)) {
      revisionReminders.push(m.topicTitle);
    }
  });

  const hasActivity =
    exercisesAttempted > 0 || challengesCompleted > 0 || projectsWorked > 0 || dayPlanned.length > 0;

  return {
    date: dateStr,
    hasActivity,
    lessonsCompleted: 0,
    exercisesAttempted,
    challengesCompleted,
    projectsWorked,
    minutesSpent,
    plannedSessions: dayPlanned,
    revisionReminders,
  };
};
