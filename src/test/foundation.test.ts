import { CURRICULUM_DOMAINS } from '../data/curriculum';
import { PRIORITY_LEVELS } from '../data/priorityLevels';
import { calculateLevelInfo, evaluateXPReward, buildTransactionId } from '../services/gamification';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('🧪 Starting The Data Master Foundation Verification Tests...\n');

// 1. Verify 15 Domains
console.log('1. Verifying 15 Curriculum Domains...');
assert(CURRICULUM_DOMAINS.length === 15, `Expected exactly 15 domains, got ${CURRICULUM_DOMAINS.length}`);

const expectedClassifications = [
  'CORE SKILL',
  'MAJOR DIFFERENTIATOR',
  'PROFESSIONAL SKILL',
  'CAREER DIFFERENTIATOR / PRACTICAL SKILL',
  'ADDITIONAL TECHNICAL KNOWLEDGE',
  'ADVANCED / OPTIONAL FOR ENTRY-LEVEL ANALYSTS',
  'EMERGING PROFESSIONAL SKILL',
  'PROFESSIONAL KNOWLEDGE',
  'CAREER PREPARATION',
  'SPECIALIZATION / CAREER DEVELOPMENT',
];

CURRICULUM_DOMAINS.forEach(d => {
  assert(d.number >= 1 && d.number <= 15, `Domain ${d.name} has invalid number: ${d.number}`);
  assert(d.name.length > 0, `Domain ${d.id} has empty name`);
  assert(expectedClassifications.includes(d.classification), `Domain ${d.name} has unexpected classification: ${d.classification}`);
  assert(d.topics.length > 0, `Domain ${d.name} has no topics`);
  d.topics.forEach(t => {
    assert(t.subtopics.length > 0, `Topic ${t.title} in domain ${d.name} has no subtopics`);
  });
});
console.log(`✅ All 15 domains and subtopics validated. Total topics: ${CURRICULUM_DOMAINS.reduce((acc, d) => acc + d.topics.length, 0)}`);

// 2. Verify 5 Priority Levels
console.log('\n2. Verifying 5 Learning Priority Levels...');
const levels = Object.keys(PRIORITY_LEVELS);
assert(levels.length === 5, `Expected 5 priority levels, got ${levels.length}`);
assert(levels.includes('Level 1') && levels.includes('Level 5'), 'Missing Level 1 or Level 5');
console.log('✅ All 5 priority levels strictly preserved and separated from classifications.');

// 3. Verify Gamification Level Calculation
console.log('\n3. Verifying Level Calculation Engine...');
const lvl1 = calculateLevelInfo(50);
assert(lvl1.level === 1, `Expected Level 1 for 50 XP, got ${lvl1.level}`);
assert(lvl1.title === 'Data Apprentice', `Expected Data Apprentice, got ${lvl1.title}`);

const lvl3 = calculateLevelInfo(420);
assert(lvl3.level === 3, `Expected Level 3 for 420 XP, got ${lvl3.level}`);
assert(lvl3.title === 'Analytical Practitioner', `Expected Analytical Practitioner, got ${lvl3.title}`);

const lvl10 = calculateLevelInfo(6000);
assert(lvl10.level === 10, `Expected Level 10 for 6000 XP, got ${lvl10.level}`);
assert(lvl10.title === 'The Data Master', `Expected The Data Master, got ${lvl10.title}`);
console.log('✅ Level thresholds and titles verified.');

// 4. Verify Duplicate XP Prevention (Rule #21)
console.log('\n4. Verifying Anti-Duplicate XP Engine (Rule #21)...');
const userId = 'usr_test_01';
const activityId = 'sql-lesson-01';

// First completion
const first = evaluateXPReward(userId, 'lesson', activityId, 30, [], false);
assert(first.xpAwarded === 30, `Expected 30 XP on first completion, got ${first.xpAwarded}`);
assert(first.isDuplicate === false, 'Expected isDuplicate = false on first run');

// Second completion (repeat without repeatability flag)
const completedIds = [first.transaction.id];
const second = evaluateXPReward(userId, 'lesson', activityId, 30, completedIds, false);
assert(second.xpAwarded === 0, `Expected 0 XP on duplicate attempt, got ${second.xpAwarded}`);
assert(second.isDuplicate === true, 'Expected isDuplicate = true on duplicate attempt');

// Repeatable activity (e.g. revision)
const repeatable = evaluateXPReward(userId, 'revision', 'rev-01', 5, completedIds, true);
assert(repeatable.xpAwarded === 5, 'Expected 5 XP on repeatable revision');
console.log('✅ Duplicate XP award prevention successfully enforced.');

console.log('\n🎉 ALL FOUNDATION VERIFICATION TESTS PASSED SUCCESSFULLY!');
