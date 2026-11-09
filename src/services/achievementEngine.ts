import { UserProfile } from '../types/user';
import { Achievement } from '../types/gamification';
import { ADVANCED_ACHIEVEMENTS } from '../data/achievementsData';

export interface EvaluatedAchievement extends Achievement {
  isUnlocked: boolean;
  progressPercent: number;
}

/**
 * Evaluates real user records against all achievement criteria
 */
export const evaluateUserAchievements = (user: UserProfile): EvaluatedAchievement[] => {
  const practiceAttempts = user.practiceAttempts || [];
  const completedLessons = user.completedLessonIds || [];
  const completedTopics = user.completedTopicIds || [];
  const simulations = user.simulationSubmissions || {};
  const detective = user.detectiveProgress || {};
  const comps = user.competitionSubmissions || {};
  const projects = user.portfolioProjects || [];
  const mistakes = user.mistakeRecords || [];
  const teams = user.teams || [];

  return ADVANCED_ACHIEVEMENTS.map(ach => {
    let isUnlocked = false;
    let progressPercent = 0;
    const explicitlyUnlocked = (user.unlockedAchievementIds || []).includes(ach.id) || !!ach.unlockedAt;

    switch (ach.id) {
      case 'ach-first-query': {
        const hasSqlAttempt = practiceAttempts.some(a => a.exerciseType === 'sql' && a.isCorrect);
        isUnlocked = explicitlyUnlocked || hasSqlAttempt;
        progressPercent = isUnlocked ? 100 : hasSqlAttempt ? 100 : 0;
        break;
      }
      case 'ach-first-step': {
        const hasLesson = completedLessons.length > 0;
        isUnlocked = explicitlyUnlocked || hasLesson;
        progressPercent = isUnlocked ? 100 : 0;
        break;
      }
      case 'ach-streak-week': {
        const streak = user.currentStreak;
        progressPercent = Math.min(100, Math.round((streak / 7) * 100));
        isUnlocked = explicitlyUnlocked || streak >= 7;
        break;
      }
      case 'ach-streak-14': {
        const streak = Math.max(user.currentStreak, user.longestStreak);
        progressPercent = Math.min(100, Math.round((streak / 14) * 100));
        isUnlocked = explicitlyUnlocked || streak >= 14;
        break;
      }
      case 'ach-streak-30': {
        const streak = Math.max(user.currentStreak, user.longestStreak);
        progressPercent = Math.min(100, Math.round((streak / 30) * 100));
        isUnlocked = explicitlyUnlocked || streak >= 30;
        break;
      }
      case 'ach-milestone-pioneer': {
        const count = completedTopics.length;
        progressPercent = Math.min(100, Math.round((count / 5) * 100));
        isUnlocked = explicitlyUnlocked || count >= 5;
        break;
      }
      case 'ach-flawless-execution': {
        // Count max consecutive correct attempts
        let maxConsec = 0;
        let currConsec = 0;
        practiceAttempts.forEach(a => {
          if (a.isCorrect) {
            currConsec++;
            if (currConsec > maxConsec) maxConsec = currConsec;
          } else {
            currConsec = 0;
          }
        });
        progressPercent = Math.min(100, Math.round((maxConsec / 5) * 100));
        isUnlocked = explicitlyUnlocked || maxConsec >= 5;
        break;
      }
      case 'ach-precision-analyst': {
        const total = practiceAttempts.length;
        const correct = practiceAttempts.filter(a => a.isCorrect).length;
        const acc = total > 0 ? (correct / total) * 100 : 0;
        progressPercent = total >= 10 ? Math.min(100, Math.round(acc)) : Math.min(90, Math.round((total / 10) * 50));
        isUnlocked = explicitlyUnlocked || (total >= 10 && acc >= 80);
        break;
      }
      case 'ach-multi-disciplinary': {
        const distinctDomains = new Set(practiceAttempts.map(a => a.domainId));
        progressPercent = Math.min(100, Math.round((distinctDomains.size / 4) * 100));
        isUnlocked = explicitlyUnlocked || distinctDomains.size >= 4;
        break;
      }
      case 'ach-first-challenge': {
        const totalChallenges =
          (user.completedChallengeIds || []).length +
          Object.keys(simulations).length +
          Object.keys(comps).length;
        progressPercent = totalChallenges > 0 ? 100 : 0;
        isUnlocked = explicitlyUnlocked || totalChallenges > 0;
        break;
      }
      case 'ach-crisis-commander': {
        const solvedSim = Object.values(simulations).some(s => s.score >= 70);
        progressPercent = solvedSim ? 100 : 0;
        isUnlocked = explicitlyUnlocked || solvedSim;
        break;
      }
      case 'ach-forensic-sleuth': {
        const solvedDet = Object.values(detective).some(d => d.isSolved);
        progressPercent = solvedDet ? 100 : 0;
        isUnlocked = explicitlyUnlocked || solvedDet;
        break;
      }
      case 'ach-case-study-architect': {
        const publishedProj = projects.some(p => p.status === 'published');
        progressPercent = publishedProj ? 100 : 0;
        isUnlocked = explicitlyUnlocked || publishedProj;
        break;
      }
      case 'ach-mistake-eradicator': {
        const resolvedMistakes = mistakes.filter(m => m.reviewStatus === 'resolved').length;
        progressPercent = Math.min(100, Math.round((resolvedMistakes / 1) * 100));
        isUnlocked = explicitlyUnlocked || resolvedMistakes >= 1;
        break;
      }
      case 'ach-podium-contender': {
        const enteredComp = Object.keys(comps).length > 0;
        progressPercent = enteredComp ? 100 : 0;
        isUnlocked = explicitlyUnlocked || enteredComp;
        break;
      }
      case 'ach-squad-collaborator': {
        const inTeam = teams.length > 0;
        progressPercent = inTeam ? 100 : 0;
        isUnlocked = explicitlyUnlocked || inTeam;
        break;
      }
      default:
        isUnlocked = explicitlyUnlocked;
        progressPercent = isUnlocked ? 100 : ach.progress;
    }

    return {
      ...ach,
      isUnlocked,
      progressPercent,
      unlockedAt: isUnlocked ? (ach.unlockedAt || new Date().toISOString()) : null,
    };
  });
};
