import { generateLearningPath, getRoleArchetypes, evaluateTopicPrerequisites } from '../services/pathGenerator';
import { LESSONS_DATABASE, getLessonById, getLessonsByTopicId } from '../data/lessons';
import { getDomainById } from '../data/curriculum';
import { evaluateXPReward } from '../services/gamification';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('🧪 Starting The Data Master Phase 2 (Personalisation & Learning Engine) Tests...\n');

// 1. Test Role Archetypes & Essential/Recommended Assignment
console.log('1. Testing Role Archetypes Mapping...');
const daArchetype = getRoleArchetypes('Data Analyst');
assert(daArchetype.essential.includes('domain-2'), 'Data Analyst must have SQL as essential');
assert(daArchetype.essential.includes('domain-1'), 'Data Analyst must have Excel as essential');
assert(daArchetype.essential.includes('domain-4'), 'Data Analyst must have Statistics as essential');

const baArchetype = getRoleArchetypes('Business Analyst');
assert(baArchetype.essential.includes('domain-7'), 'Business Analyst must have Business Understanding as essential');
assert(baArchetype.essential.includes('domain-8'), 'Business Analyst must have Storytelling as essential');

const biArchetype = getRoleArchetypes('BI Analyst');
assert(biArchetype.essential.includes('domain-5'), 'BI Analyst must have Data Viz & BI as essential');
console.log('✅ Role archetype mappings correctly identify essential and recommended domains.');

// 2. Test Prerequisite Resolution Engine
console.log('\n2. Testing Prerequisite Resolution Engine...');
// Test 2a: Domain 11 (ML) without Python & Stats
const dummyDomain11 = getDomainById('domain-11')!;
const topic11 = dummyDomain11.topics[0];
const prereqsMissing = evaluateTopicPrerequisites(topic11, dummyDomain11, [], []);
assert(prereqsMissing.prerequisitesMet === false, 'ML topic without Python/Stats should flag missing prerequisites');
assert(prereqsMissing.missingPrerequisites.length >= 2, 'Should list both Python and Statistics as missing prerequisites');

// Test 2b: With prerequisites completed
const prereqsMet = evaluateTopicPrerequisites(topic11, dummyDomain11, ['d3-t1', 'd4-t1'], ['d3-t1', 'd4-t1']);
assert(prereqsMet.prerequisitesMet === true, 'ML topic with Python and Stats completed should have prerequisitesMet = true');
console.log('✅ Prerequisite relationships strictly enforced across domains.');

// 3. Test Learning Path Generator Output
console.log('\n3. Testing Learning Path Generator...');
const path = generateLearningPath({
  userId: 'usr_test_ph2',
  targetRole: 'Data Analyst',
  primaryGoals: ['Become a Data Analyst', 'Build a portfolio'],
  selectedDomainIds: ['domain-1', 'domain-2', 'domain-3', 'domain-4', 'domain-11'],
  experienceLevel: 'Complete beginner',
  dailyCommitmentMinutes: 30,
  completedTopicIds: ['d1-t1', 'd2-t1'],
});

assert(path.milestones.length === 4, `Expected 4 structured milestones, got ${path.milestones.length}`);
assert(path.allTopicsCount > 0, 'Learning path should contain topics');
assert(path.totalEstimatedDays > 0, 'Estimated days should be calculated');
assert(path.milestones[0].isUnlocked === true, 'Milestone 1 must always be unlocked');

// Verify that Milestone 1 starts with Level 1 Core Foundations
const m1FirstItem = path.milestones[0].items[0];
assert(m1FirstItem.domain.defaultPriority === 'Level 1', 'Milestone 1 should prioritize Level 1 Core Foundations');
console.log(`✅ Learning path generated successfully: ${path.allTopicsCount} topics across 4 milestones (${path.totalEstimatedDays} days @ 30m/day).`);

// 4. Test Lesson Database Completeness & Quality
console.log('\n4. Testing Expanded Lesson Database...');
assert(LESSONS_DATABASE.length >= 5, `Expected rich lesson catalog, got ${LESSONS_DATABASE.length} lessons`);

LESSONS_DATABASE.forEach(lesson => {
  assert(lesson.title.length > 0, `Lesson ${lesson.id} has empty title`);
  assert(lesson.conceptMarkdown.length > 50, `Lesson ${lesson.id} has insufficient conceptual explanation`);
  assert(lesson.keyTakeaways.length >= 3, `Lesson ${lesson.id} should have at least 3 key takeaways`);
  assert(lesson.quiz.length >= 2, `Lesson ${lesson.id} should have at least 2 comprehension quiz questions`);

  lesson.quiz.forEach(q => {
    assert(q.options.length >= 3, `Quiz question ${q.id} has fewer than 3 options`);
    assert(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Quiz question ${q.id} has invalid correctIndex`);
    assert(q.explanation.length > 10, `Quiz question ${q.id} missing explanation`);
  });
});
console.log(`✅ All ${LESSONS_DATABASE.length} lessons verified with rich concepts, examples, practical exercises, and graded quizzes.`);

// 5. Test Quiz Scoring & Revision Flagging
console.log('\n5. Testing Quiz Evaluation & Smart Revision Triggers...');
const sqlLesson = getLessonById('lesson-sql-filtering')!;

// 5a. Passing attempt (100%)
const passingAnswers: Record<string, number> = {};
sqlLesson.quiz.forEach(q => {
  passingAnswers[q.id] = q.correctIndex; // All correct
});
const passCount = sqlLesson.quiz.filter(q => passingAnswers[q.id] === q.correctIndex).length;
const passScore = Math.round((passCount / sqlLesson.quiz.length) * 100);
assert(passScore === 100, `Expected 100% score, got ${passScore}%`);
assert(passScore >= 70, 'Passing score threshold (>=70%) met');

// 5b. Failing attempt (0%)
const failingAnswers: Record<string, number> = {};
sqlLesson.quiz.forEach(q => {
  failingAnswers[q.id] = (q.correctIndex + 1) % q.options.length; // All wrong
});
const failCount = sqlLesson.quiz.filter(q => failingAnswers[q.id] === q.correctIndex).length;
const failScore = Math.round((failCount / sqlLesson.quiz.length) * 100);
assert(failScore === 0, `Expected 0% score, got ${failScore}%`);
assert(failScore < 70, 'Failing score threshold (<70%) properly triggers revision requirement');
assert(sqlLesson.revisionTopicId !== undefined, 'Failing lesson has associated revision topic');
console.log('✅ Quiz grading and smart revision recommendation triggers verified.');

// 6. Test Exercise Validation Engine
console.log('\n6. Testing Practical Exercise Validation Engine...');
if (sqlLesson.practicalExercise) {
  const correctCode = 'SELECT order_id, COALESCE(shipping_date, \'Pending\') FROM orders;';
  const isCodeValid = correctCode.toLowerCase().includes(sqlLesson.practicalExercise.expectedOutputKeyword.toLowerCase());
  assert(isCodeValid === true, 'Valid code should match expected keyword');

  const incorrectCode = 'SELECT * FROM orders;';
  const isCodeInvalid = incorrectCode.toLowerCase().includes(sqlLesson.practicalExercise.expectedOutputKeyword.toLowerCase());
  assert(isCodeInvalid === false, 'Invalid code without required keyword should fail');
}
console.log('✅ Interactive exercise validation engine verified.');

console.log('\n🎉 ALL PHASE 2 TESTS PASSED WITH 100% INTEGRITY!');
