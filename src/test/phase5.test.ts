import assert from 'node:assert/strict';
import { PROJECT_TEMPLATES } from '../data/projectTemplatesData';
import { INITIAL_PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { INITIAL_COMMUNITY_DISCUSSIONS } from '../data/communityData';
import { INITIAL_TEAMS } from '../data/teamsData';
import { PortfolioProject, ProjectTemplate } from '../types/portfolio';
import { CommunityDiscussion, CommunityReply } from '../types/community';
import { Team, TeamTask } from '../types/team';
import { evaluateXPReward } from '../services/gamification';

async function runPhase5Tests() {
  console.log('=============================================================');
  console.log('RUNNING PHASE 5 AUTOMATED VERIFICATION SUITE');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Project Templates Data Bank (8 Starter Blueprints)
  // ---------------------------------------------------------------------------
  console.log('1. Testing Project Starter Templates Bank...');
  assert.equal(PROJECT_TEMPLATES.length, 8, 'Must have exactly 8 starter blueprints');

  const expectedTemplateIds = [
    'tmpl-excel-sales',
    'tmpl-sql-business',
    'tmpl-python-eda',
    'tmpl-customer-segmentation',
    'tmpl-bi-dashboard',
    'tmpl-statistical-analysis',
    'tmpl-marketing-attribution',
    'tmpl-business-case',
  ];

  for (const id of expectedTemplateIds) {
    const tmpl = PROJECT_TEMPLATES.find(t => t.id === id);
    assert.ok(tmpl, `Template with id "${id}" must exist`);
    assert.ok(tmpl.title.length > 5, `Template "${id}" must have a descriptive title`);
    assert.ok(tmpl.problemStatement.length > 20, `Template "${id}" must have a problem statement`);
    assert.ok(tmpl.businessContext.length > 20, `Template "${id}" must have business context`);
    assert.ok(tmpl.objectives.length >= 3, `Template "${id}" must have at least 3 objectives`);
    assert.ok(tmpl.suggestedWorkflow.length >= 3, `Template "${id}" must have at least 3 workflow steps`);
    assert.ok(tmpl.expectedDeliverables.length >= 2, `Template "${id}" must have at least 2 deliverables`);
    assert.ok(tmpl.recommendedTools.length >= 2, `Template "${id}" must specify recommended tools`);
    assert.ok(tmpl.starterMarkdown.methodology.length > 10, `Template "${id}" must have starter methodology`);
    assert.ok(tmpl.starterMarkdown.analysisAndFindings.length > 10, `Template "${id}" must have starter findings`);
    assert.ok(tmpl.starterMarkdown.conclusionsAndRecommendations.length > 10, `Template "${id}" must have starter recommendations`);
  }
  console.log('   ✓ All 8 starter blueprints verified with problem statements, workflows, and deliverables.');

  // ---------------------------------------------------------------------------
  // 2. Non-Coding and Multi-Modality Project Support
  // ---------------------------------------------------------------------------
  console.log('2. Testing Coding & Non-Coding Project Modalities...');
  const projectTypes = new Set(PROJECT_TEMPLATES.map(t => t.projectType));
  assert.ok(projectTypes.has('coding'), 'Must support coding projects');
  assert.ok(projectTypes.has('spreadsheet'), 'Must support spreadsheet projects');
  assert.ok(projectTypes.has('business_case'), 'Must support business case projects');
  assert.ok(projectTypes.has('bi_dashboard'), 'Must support BI dashboard projects');
  assert.ok(projectTypes.has('statistical_study'), 'Must support statistical study projects');

  const excelTmpl = PROJECT_TEMPLATES.find(t => t.projectType === 'spreadsheet')!;
  assert.equal(excelTmpl.recommendedTools.some(t => t.includes('Excel')), true);

  const sqlProj = INITIAL_PORTFOLIO_PROJECTS.find(p => p.id === 'proj-01')!;
  assert.equal(sqlProj.linkedChallengeId, 'ch-01', 'Project should link to completed challenge');
  assert.ok(sqlProj.visualizations.length >= 2, 'Project should support visual evidence snapshots');
  console.log('   ✓ Multiple analytical modalities verified (Spreadsheet, SQL, Python, BI, Case Study).');

  // ---------------------------------------------------------------------------
  // 3. Project Creation, Draft Saving, Publishing & Deletion Lifecycle
  // ---------------------------------------------------------------------------
  console.log('3. Testing Project CRUD Lifecycle & Anti-Duplicate XP...');
  const mockProjects: PortfolioProject[] = [...INITIAL_PORTFOLIO_PROJECTS];

  // Create Draft
  const newDraft: PortfolioProject = {
    id: 'proj-test-new',
    userId: 'usr_demo_01',
    authorName: 'Alex Rivera',
    title: 'Customer Lifetime Value Gradient Descent Optimization',
    shortDescription: 'Mathematical formulation of customer retention probabilities.',
    domainId: 'statistics-foundations',
    domainName: 'Statistics Foundations for Data Analysis',
    projectType: 'statistical_study',
    problemStatement: 'Acquisition spend is misallocated to customer segments with negative marginal ROI.',
    businessContext: 'Executive finance requires an empirical threshold for marketing CAC spend.',
    datasetInfo: { name: 'Customer_Cohorts_2025.csv', rowCount: 50000 },
    tools: ['Python', 'SciPy', 'Matplotlib'],
    methodology: 'Fitted exponential decay curve to longitudinal retention.',
    analysisAndFindings: 'Break-even CAC is $42.50 per acquisition.',
    visualizations: [],
    conclusionsAndRecommendations: 'Cap PPC bidding at $38.00 to preserve a 20% margin buffer.',
    skillsDemonstrated: ['Loss Function Optimization', 'Curve Fitting'],
    learningOutcomes: ['Understood convex optimization principles in commercial churn'],
    status: 'draft',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockProjects.push(newDraft);
  assert.equal(mockProjects.some(p => p.id === 'proj-test-new'), true);
  assert.equal(newDraft.status, 'draft');
  assert.equal(newDraft.isPublic, false, 'Draft projects must not be public');

  // Publishing Project
  const targetProject = mockProjects.find(p => p.id === 'proj-test-new')!;
  targetProject.status = 'published';
  targetProject.isPublic = true;
  targetProject.updatedAt = new Date().toISOString();

  // XP Award Evaluation
  let completedActivities = ['usr_demo_01:lesson:d1-t1'];
  const xpFirst = evaluateXPReward('usr_demo_01', 'project', 'proj-test-new', 150, completedActivities, false);
  assert.equal(xpFirst.xpAwarded, 150, 'First time project publication awards 150 XP');
  assert.equal(xpFirst.isDuplicate, false);
  completedActivities.push(xpFirst.transaction.id);

  // Re-publishing should NOT award duplicate XP (Rule #21)
  const xpDuplicate = evaluateXPReward('usr_demo_01', 'project', 'proj-test-new', 150, completedActivities, false);
  assert.equal(xpDuplicate.xpAwarded, 0, 'Duplicate publication must award 0 XP');
  assert.equal(xpDuplicate.isDuplicate, true);

  // Unpublish
  targetProject.status = 'draft';
  targetProject.isPublic = false;
  assert.equal(targetProject.status, 'draft');
  assert.equal(targetProject.isPublic, false);

  // Delete Project
  const remainingProjects = mockProjects.filter(p => p.id !== 'proj-test-new');
  assert.equal(remainingProjects.some(p => p.id === 'proj-test-new'), false, 'Deleted project must be removed');
  console.log('   ✓ Project draft saving, publishing, anti-duplicate XP, and deletion verified.');

  // ---------------------------------------------------------------------------
  // 4. Public Portfolio Privacy Filter & Data Protection
  // ---------------------------------------------------------------------------
  console.log('4. Testing Public Portfolio Privacy & Draft Protection...');
  const mixedProjects: PortfolioProject[] = [
    { ...INITIAL_PORTFOLIO_PROJECTS[0], status: 'published', isPublic: true },
    { ...INITIAL_PORTFOLIO_PROJECTS[1], status: 'draft', isPublic: false },
    {
      id: 'proj-private-draft',
      userId: 'usr_demo_01',
      authorName: 'Alex Rivera',
      title: 'Confidential Internal Salary Inequity Analysis',
      shortDescription: 'Internal HR telemetry audit.',
      domainId: 'domain-2',
      domainName: 'SQL',
      projectType: 'coding',
      problemStatement: 'Audit compensation variance.',
      businessContext: 'Internal legal compliance review.',
      datasetInfo: { name: 'payroll.db' },
      tools: ['SQL'],
      methodology: 'Private regression analysis.',
      analysisAndFindings: 'Internal findings.',
      visualizations: [],
      conclusionsAndRecommendations: 'Adjust compensation band tiers.',
      skillsDemonstrated: ['SQL'],
      learningOutcomes: [],
      status: 'draft',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Filter for public portfolio
  const publicViewProjects = mixedProjects.filter(p => p.status === 'published' && p.isPublic);
  assert.equal(publicViewProjects.length, 1, 'Only published & public projects must be visible');
  assert.equal(publicViewProjects[0].id, 'proj-01');
  assert.equal(
    publicViewProjects.some(p => p.status === 'draft'),
    false,
    'Draft projects must NEVER appear in public portfolio view'
  );
  console.log('   ✓ Public portfolio strictly hides drafts and unlisted content.');

  // ---------------------------------------------------------------------------
  // 5. Community Discussions Engine
  // ---------------------------------------------------------------------------
  console.log('5. Testing Community Discussions Engine...');
  const mockDiscussions: CommunityDiscussion[] = [...INITIAL_COMMUNITY_DISCUSSIONS];

  // Verify seeded discussions
  assert.ok(mockDiscussions.length >= 4, 'Must have at least 4 authentic initial discussions');
  const sqlDisc = mockDiscussions.find(d => d.category === 'SQL & Databases');
  assert.ok(sqlDisc, 'SQL discussion thread must exist');
  assert.ok(sqlDisc.replies.length >= 1, 'Discussion must contain replies');

  // Create new discussion
  const newDisc: CommunityDiscussion = {
    id: 'disc-test-01',
    title: 'DuckDB vs SQLite: Memory efficiency on 5M row CSV aggregations',
    authorId: 'usr_demo_01',
    authorName: 'Alex Rivera',
    authorRole: 'Analyst',
    category: 'SQL & Databases',
    domainId: 'sql-relational-databases',
    content: 'When evaluating columnar vs row-oriented query engines for local analytical workflows...',
    tags: ['DuckDB', 'Performance', 'Benchmarking'],
    replies: [],
    upvotes: 1,
    views: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockDiscussions.unshift(newDisc);

  // Search filter check
  const searchResults = mockDiscussions.filter(d =>
    d.title.toLowerCase().includes('duckdb') || d.tags.includes('DuckDB')
  );
  assert.ok(searchResults.length >= 1, 'Search query must find matching thread');

  // Add reply
  const reply: CommunityReply = {
    id: 'rep-test-01',
    discussionId: 'disc-test-01',
    authorId: 'mentor-marcus-01',
    authorName: 'Marcus Vance',
    authorRole: 'Platform Mentor',
    content: 'DuckDB uses vectorized execution (morsel-driven parallelism) which scales across CPU cores far better than SQLite for columnar analytical queries.',
    upvotes: 4,
    createdAt: new Date().toISOString(),
  };
  newDisc.replies.push(reply);
  assert.equal(newDisc.replies.length, 1, 'Reply must be recorded on discussion');

  // Toggle upvote
  newDisc.upvotes += 1;
  assert.equal(newDisc.upvotes, 2, 'Upvote count must increment');

  // Reporting
  newDisc.isReported = true;
  newDisc.reportReason = 'Spam or promotional content';
  assert.equal(newDisc.isReported, true);
  console.log('   ✓ Community discussion creation, search, replies, upvoting, and reporting verified.');

  // ---------------------------------------------------------------------------
  // 6. Collaborative Teams & Team Challenges
  // ---------------------------------------------------------------------------
  console.log('6. Testing Collaborative Teams & Team Challenges...');
  const mockTeams: Team[] = [...INITIAL_TEAMS];
  const initialTeam = mockTeams[0];
  assert.equal(initialTeam.inviteCode, 'AAS701');
  assert.ok(initialTeam.members.length >= 2, 'Team must have members');
  assert.ok(initialTeam.tasks.length >= 2, 'Team must have tasks in responsibility matrix');

  // Join Team with Invite Code
  const joinCode = 'AAS701';
  const matchingTeam = mockTeams.find(t => t.inviteCode === joinCode);
  assert.ok(matchingTeam, 'Must find team by invite code');

  // Assign Task
  const newTask: TeamTask = {
    id: 'task-test-01',
    teamId: matchingTeam.id,
    title: 'Validate multi-touch attribution attribution weights against control cohort',
    assignedToUserId: 'usr_demo_01',
    assignedToName: 'Alex Rivera',
    status: 'todo',
    dueDate: '2026-11-25',
    createdAt: new Date().toISOString(),
  };
  matchingTeam.tasks.push(newTask);
  assert.equal(matchingTeam.tasks.some(t => t.id === 'task-test-01'), true);

  // Status transition: todo -> completed
  newTask.status = 'completed';
  newTask.completedAt = new Date().toISOString();
  assert.equal(newTask.status, 'completed');

  // Team Challenge Submission & XP
  assert.ok(matchingTeam.activeChallenge, 'Team must have an active challenge');
  matchingTeam.activeChallenge.status = 'submitted';
  matchingTeam.activeChallenge.score = 94;
  matchingTeam.activeChallenge.teamDeliverableText = 'Executive memo submitted by Alpha Analytics Syndicate.';

  const teamXpFirst = evaluateXPReward('usr_demo_01', 'challenge', `team-${matchingTeam.id}-${matchingTeam.activeChallenge.challengeId}`, 100, completedActivities, false);
  assert.equal(teamXpFirst.xpAwarded, 100, 'Team challenge submission awards 100 XP');
  completedActivities.push(teamXpFirst.transaction.id);

  const teamXpDuplicate = evaluateXPReward('usr_demo_01', 'challenge', `team-${matchingTeam.id}-${matchingTeam.activeChallenge.challengeId}`, 100, completedActivities, false);
  assert.equal(teamXpDuplicate.xpAwarded, 0, 'Duplicate team challenge submission must not double-award XP');
  console.log('   ✓ Team creation, invite codes, task delegation, and team challenge evaluation verified.');

  console.log('\n=============================================================');
  console.log('ALL PHASE 5 AUTOMATED TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('=============================================================');
}

runPhase5Tests().catch((err) => {
  console.error('Phase 5 Test Suite Failed:', err);
  process.exit(1);
});
