import { UserProfile } from '../types/user';
import { CURRICULUM_DOMAINS } from '../data/curriculum';

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  type: 'revision' | 'lesson' | 'exercise' | 'challenge' | 'project';
  domainName: string;
  priority: 'high' | 'medium' | 'normal';
  reason: string;
  actionUrl: string;
  actionLabel: string;
}

/**
 * Generates transparent personalized recommendations based on actual stored records
 */
export const generatePersonalizedRecommendations = (user: UserProfile): PersonalizedRecommendation[] => {
  const recommendations: PersonalizedRecommendation[] = [];

  const mistakes = user.mistakeRecords || [];
  const completedTopics = user.completedTopicIds || [];
  const practiceAttempts = user.practiceAttempts || [];
  const projects = user.portfolioProjects || [];
  const completedChallenges = user.completedChallengeIds || [];

  // Rule 1: High Urgency Revision for Unresolved Mistakes
  const unresolvedMistakes = mistakes.filter(m => m.reviewStatus !== 'resolved');
  if (unresolvedMistakes.length > 0) {
    const topMistake = unresolvedMistakes[0];
    recommendations.push({
      id: `rec-rev-${topMistake.id}`,
      title: `Revise: ${topMistake.topicTitle}`,
      type: 'revision',
      domainName: topMistake.domainName,
      priority: 'high',
      reason: `Triggered because you have ${unresolvedMistakes.length} unresolved mistake${unresolvedMistakes.length === 1 ? '' : 's'} flagged in your Mistake Journal.`,
      actionUrl: '/platform/mistakes',
      actionLabel: 'Review Mistake Journal',
    });
  }

  // Rule 2: Low-Accuracy Practice Domain
  // Compute accuracy by domain
  const domainAttemptsMap: Record<string, { total: number; correct: number; name: string }> = {};
  practiceAttempts.forEach(att => {
    if (!domainAttemptsMap[att.domainId]) {
      const dObj = CURRICULUM_DOMAINS.find(d => d.id === att.domainId || d.slug === att.domainId);
      domainAttemptsMap[att.domainId] = { total: 0, correct: 0, name: dObj?.name || 'Practice Arena' };
    }
    domainAttemptsMap[att.domainId].total++;
    if (att.isCorrect) domainAttemptsMap[att.domainId].correct++;
  });

  const lowAccDomainEntry = Object.entries(domainAttemptsMap).find(
    ([, stats]) => stats.total >= 2 && (stats.correct / stats.total) < 0.65
  );

  if (lowAccDomainEntry) {
    const [, stats] = lowAccDomainEntry;
    const accPercent = Math.round((stats.correct / stats.total) * 100);
    recommendations.push({
      id: 'rec-acc-boost',
      title: `Practice Drill: ${stats.name}`,
      type: 'exercise',
      domainName: stats.name,
      priority: 'medium',
      reason: `Recommended because your current accuracy in this domain is ${accPercent}%, which is below the 70% mastery threshold.`,
      actionUrl: '/platform/practice',
      actionLabel: 'Practice Drills',
    });
  }

  // Rule 3: Next Uncompleted Topic on Career Path
  const targetDomainIds = user.selectedDomainIds || ['domain-1', 'domain-2', 'domain-3'];
  let nextTopicFound = false;

  for (const domId of targetDomainIds) {
    const dom = CURRICULUM_DOMAINS.find(d => d.id === domId || d.slug === domId);
    if (!dom) continue;

    for (const topic of dom.topics) {
      if (!completedTopics.includes(topic.id)) {
        recommendations.push({
          id: `rec-topic-${topic.id}`,
          title: `Study Topic: ${topic.title}`,
          type: 'lesson',
          domainName: dom.name,
          priority: 'medium',
          reason: `Recommended as the next sequential milestone on your ${user.targetRole || 'Data Analyst'} learning path.`,
          actionUrl: `/platform/academies/${dom.slug || dom.id}`,
          actionLabel: 'Start Topic',
        });
        nextTopicFound = true;
        break;
      }
    }
    if (nextTopicFound) break;
  }

  // Rule 4: Challenge Suggestion for Progressing Users
  if (completedTopics.length >= 2 && completedChallenges.length === 0) {
    recommendations.push({
      id: 'rec-first-challenge',
      title: 'Attempt Challenge: E-Commerce Churn Investigation',
      type: 'challenge',
      domainName: 'Business Analytics',
      priority: 'normal',
      reason: 'Recommended because you have completed prerequisite foundations and are ready for real-world telemetry analysis.',
      actionUrl: '/platform/challenges',
      actionLabel: 'View Challenge',
    });
  }

  // Rule 5: Portfolio Authoring Suggestion
  const publishedCount = projects.filter(p => p.status === 'published').length;
  if (publishedCount === 0) {
    recommendations.push({
      id: 'rec-portfolio-publish',
      title: 'Publish Your First Portfolio Case Study',
      type: 'project',
      domainName: 'Portfolio Projects',
      priority: 'normal',
      reason: `Recommended to showcase your analytical proof to recruiters for your target role: ${user.targetRole || 'Data Analyst'}.`,
      actionUrl: '/platform/portfolio',
      actionLabel: 'Open Portfolio Studio',
    });
  }

  return recommendations;
};
