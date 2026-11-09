# THE DATA MASTER — TECHNICAL ARCHITECTURE

## 1. Architectural Philosophy

The Data Master architecture is engineered around the principle of **clean domain separation**, **resilient offline-first persistence**, and **future backend readiness**. It avoids brittle coupling between visual components and curriculum data, ensuring that content, pedagogical rules, and state logic remain strictly typed and independently maintainable.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│                                                                        │
│   Public Pages          Platform Shell          Interactive Modules    │
│  (Landing, About,    (Sidebar, TopBar,       (Academies, Lab, Arena,   │
│   Explore, Auth)       Drawer, Footer)        Playground, Challenges)  │
│                                                                        │
│                    Atomic UI System & Design Tokens                    │
│      (Button, Card, Badge, StatCard, ObservatoryCanvas, Modal, etc.)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       STATE & CONTEXT LAYER                            │
│                                                                        │
│    UserContext             ThemeContext           CurriculumContext    │
│ (User Profile, XP,       (Dark Default,        (Active Domain, Topic,  │
│  Streak, Level, Path)      Light Surface)        Lesson Filtering)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    BUSINESS & CALCULATION SERVICES                     │
│                                                                        │
│     PathGenerator          GamificationEngine        ProgressManager   │
│   (Prereq Resolution,      (Anti-abuse XP, Level     (Milestone State, │
│     Goal Alignment)           Progression)             History Log)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                      DATA & PERSISTENCE LAYER                          │
│                                                                        │
│   Curriculum Source        StorageService          Backend Adapter     │
│       of Truth         (LocalStorage + Version   (Prepared interface   │
│  (15 Domains, Topics)      Migration Guard)       for future Supabase) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
the-data-master/
├── public/
│   ├── favicon.svg
│   └── data/                 # Sample datasets (CSV, JSON for playground)
├── src/
│   ├── assets/               # Brand assets & SVGs
│   ├── components/
│   │   ├── common/           # Atomic UI: Button, Card, Badge, Modal, etc.
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── ObservatoryBackdrop.tsx
│   │   ├── layout/           # AppShell, Sidebar, Header, MobileNav, Footer
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopHeader.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── PublicFooter.tsx
│   │   ├── curriculum/       # DomainCard, TopicList, PriorityBadge
│   │   └── dashboard/        # StreakWidget, MissionWidget, NextStepWidget
│   ├── context/
│   │   ├── ThemeContext.tsx  # Dark / Light theme control
│   │   └── UserContext.tsx   # Auth, Progress, XP, Gamification state
│   ├── data/
│   │   ├── curriculum.ts     # Complete 15-domain machine-readable curriculum
│   │   ├── priorityLevels.ts # 5 independent learning priority definitions
│   │   └── sampleData.ts     # Initial demo state, achievements, challenges
│   ├── hooks/
│   │   ├── useCurriculum.ts
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── public/           # Landing, About, Explore, Login, Register
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   └── AuthPage.tsx
│   │   └── platform/         # Authenticated platform views
│   │       ├── DashboardPage.tsx
│   │       ├── AcademiesPage.tsx
│   │       ├── DomainDetailPage.tsx
│   │       ├── LearningJourneyPage.tsx
│   │       ├── LearningLabPage.tsx
│   │       ├── PracticeArenaPage.tsx
│   │       ├── DatasetPlaygroundPage.tsx
│   │       ├── ChallengesPage.tsx
│   │       ├── BusinessSimulationsPage.tsx
│   │       ├── DataDetectivePage.tsx
│   │       ├── PortfolioPage.tsx
│   │       ├── CommunityPage.tsx
│   │       ├── ProgressAnalyticsPage.tsx
│   │       ├── AchievementsPage.tsx
│   │       ├── MistakeJournalPage.tsx
│   │       ├── LearningCalendarPage.tsx
│   │       └── SettingsPage.tsx
│   ├── services/
│   │   ├── storage.ts        # Type-safe storage wrapper with schema migration
│   │   ├── gamification.ts   # XP rules, streak logic, level calculation
│   │   └── pathGenerator.ts  # Logic for generating personalized roadmaps
│   ├── types/
│   │   ├── curriculum.ts     # Domain, Topic, Subtopic, Priority, Category
│   │   ├── user.ts           # UserProfile, OnboardingSelection, Preferences
│   │   └── gamification.ts   # XPTransaction, LevelThreshold, Badge
│   ├── utils/
│   │   └── formatters.ts     # Date, number, XP formatters
│   ├── App.tsx               # Root router and providers
│   ├── index.css             # Tailwind base and custom utilities
│   └── main.tsx              # Application entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Data Integrity & Anti-Duplicate XP Engine

To fulfill Rule #21 (*"Prevent duplicate XP awards and inconsistent progress calculations"*), the gamification service enforces an **Idempotent Transaction Model**:

```typescript
interface XPTransaction {
  id: string;             // deterministic hash: `${userId}:${activityType}:${activityId}`
  userId: string;
  activityType: 'lesson' | 'exercise' | 'assessment' | 'mission' | 'challenge' | 'project';
  activityId: string;
  xpAwarded: number;
  timestamp: string;
  repeatable: boolean;    // false for one-time completions
}
```

If an activity with `repeatable: false` has already been recorded in the user's `completedActivityIds`, repeated executions yield `0 XP` while still allowing revision practice.

---

## 4. Backend Readiness (Supabase)

All storage operations flow through `src/services/storage.ts`. When moving to production:
- Replace `localStorage` operations with Supabase client calls (`supabase.from('user_progress').upsert(...)`).
- User authentication hooks map directly to Supabase Auth (`supabase.auth.signInWithPassword`, etc.).
- Offline fallbacks remain functional through the identical interface contract.
