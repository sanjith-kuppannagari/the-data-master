import { UserProfile } from '../types/user';
import { RevisionRecommendation } from '../types/practice';
import { CURRICULUM_DOMAINS } from '../data/curriculum';
import { PRACTICE_EXERCISES } from '../data/practiceExercises';

export function generateSmartRevisionPlan(user: UserProfile): RevisionRecommendation[] {
  const attempts = user.practiceAttempts || [];
  const mistakes = user.mistakeRecords || [];
  const selectedDomains = new Set(user.selectedDomainIds || []);

  const recommendations: RevisionRecommendation[] = [];

  // Map topic lookup from curriculum
  const topicMap = new Map<
    string,
    { topicId: string; topicTitle: string; domainId: string; domainName: string }
  >();
  for (const domain of CURRICULUM_DOMAINS) {
    for (const topic of domain.topics) {
      topicMap.set(topic.id, {
        topicId: topic.id,
        topicTitle: topic.title,
        domainId: domain.id,
        domainName: domain.name,
      });
    }
  }

  // Group mistakes & attempts by topicId
  const candidateTopicIds = new Set<string>();
  for (const m of mistakes) {
    if (m.reviewStatus !== 'resolved') {
      candidateTopicIds.add(m.topicId);
    }
  }
  for (const a of attempts) {
    candidateTopicIds.add(a.topicId);
  }

  // Also include topics from selected learning path domains that have exercises
  for (const ex of PRACTICE_EXERCISES) {
    if (selectedDomains.has(ex.domainId)) {
      candidateTopicIds.add(ex.topicId);
    }
  }

  for (const topicId of candidateTopicIds) {
    const meta = topicMap.get(topicId);
    if (!meta) continue;

    const topicMistakes = mistakes.filter(
      (m) => m.topicId === topicId && m.reviewStatus !== 'resolved'
    );
    const topicAttempts = attempts.filter((a) => a.topicId === topicId);
    const correctCount = topicAttempts.filter((a) => a.isCorrect).length;
    const accuracyPercent =
      topicAttempts.length > 0
        ? Math.round((correctCount / topicAttempts.length) * 100)
        : 0;

    const inLearningPath = selectedDomains.has(meta.domainId);
    const topicExercises = PRACTICE_EXERCISES.filter((e) => e.topicId === topicId);
    const recommendedExerciseIds =
      topicExercises.length > 0
        ? topicExercises.map((e) => e.id)
        : PRACTICE_EXERCISES.filter((e) => e.domainId === meta.domainId)
            .slice(0, 2)
            .map((e) => e.id);

    const totalUnresolvedAttempts = topicMistakes.reduce(
      (acc, m) => acc + m.attemptCount,
      0
    );
    const hasMarkedForRevision = topicMistakes.some(
      (m) => m.reviewStatus === 'marked_for_revision'
    );

    let priorityScore = 0;
    let reason = '';

    if (topicMistakes.length > 0) {
      priorityScore += 55 + Math.min(25, totalUnresolvedAttempts * 8);
      if (hasMarkedForRevision) priorityScore += 12;
      if (inLearningPath) priorityScore += 8;
      priorityScore = Math.min(99, priorityScore);

      const errorCategories = Array.from(
        new Set(topicMistakes.map((m) => m.errorCategory))
      ).join(', ');

      reason =
        totalUnresolvedAttempts > 1
          ? `Repeated unresolved error (${totalUnresolvedAttempts} attempts) in ${errorCategories}.${
              hasMarkedForRevision ? ' Explicitly flagged for revision.' : ''
            }`
          : `Unresolved mistake recorded in ${errorCategories} (${topicMistakes[0].exerciseTitle}).`;
    } else if (topicAttempts.length > 0 && accuracyPercent < 75) {
      priorityScore = Math.min(85, 45 + (75 - accuracyPercent) + (inLearningPath ? 10 : 0));
      reason = `Practice accuracy is ${accuracyPercent}% across ${topicAttempts.length} attempt(s) — below the 75% mastery threshold.`;
    } else if (topicAttempts.length === 0 && inLearningPath && topicExercises.length > 0) {
      priorityScore = 48;
      reason = `Core topic in your active ${meta.domainName} learning path with ${topicExercises.length} unattempted practice exercise(s).`;
    } else {
      continue;
    }

    const urgency: 'high' | 'medium' | 'low' =
      priorityScore >= 75 ? 'high' : priorityScore >= 55 ? 'medium' : 'low';

    recommendations.push({
      id: `rev-${topicId}`,
      topicId,
      topicTitle: meta.topicTitle,
      domainId: meta.domainId,
      domainName: meta.domainName,
      priorityScore,
      urgency,
      reason,
      mistakeCount: topicMistakes.length,
      accuracyPercent,
      recommendedExerciseIds,
      inLearningPath,
    });
  }

  return recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
}
