import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ObservatoryLoader } from './components/common/ObservatoryLoader';

// Core shell & landing page (statically loaded for instant first paint)
import { LandingPage } from './pages/public/LandingPage';
import { AuthPage } from './pages/public/AuthPage';
import { AppShell } from './components/layout/AppShell';

// Public pages (lazy loaded)
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ExplorePage = lazy(() => import('./pages/public/ExplorePage').then(m => ({ default: m.ExplorePage })));
const OnboardingPage = lazy(() => import('./pages/public/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const PublicPortfolioView = lazy(() => import('./pages/public/PublicPortfolioView').then(m => ({ default: m.PublicPortfolioView })));

// Platform pages (lazy loaded for optimal bundle splitting)
const DashboardPage = lazy(() => import('./pages/platform/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AcademiesPage = lazy(() => import('./pages/platform/AcademiesPage').then(m => ({ default: m.AcademiesPage })));
const DomainDetailPage = lazy(() => import('./pages/platform/DomainDetailPage').then(m => ({ default: m.DomainDetailPage })));
const LearningJourneyPage = lazy(() => import('./pages/platform/LearningJourneyPage').then(m => ({ default: m.LearningJourneyPage })));
const LearningLabPage = lazy(() => import('./pages/platform/LearningLabPage').then(m => ({ default: m.LearningLabPage })));
const LessonDetailPage = lazy(() => import('./pages/platform/LessonDetailPage').then(m => ({ default: m.LessonDetailPage })));
const PracticeArenaPage = lazy(() => import('./pages/platform/PracticeArenaPage').then(m => ({ default: m.PracticeArenaPage })));
const DatasetPlaygroundPage = lazy(() => import('./pages/platform/DatasetPlaygroundPage').then(m => ({ default: m.DatasetPlaygroundPage })));
const ChallengesPage = lazy(() => import('./pages/platform/ChallengesPage').then(m => ({ default: m.ChallengesPage })));
const BusinessSimulationsPage = lazy(() => import('./pages/platform/BusinessSimulationsPage').then(m => ({ default: m.BusinessSimulationsPage })));
const DataDetectivePage = lazy(() => import('./pages/platform/DataDetectivePage').then(m => ({ default: m.DataDetectivePage })));
const PortfolioPage = lazy(() => import('./pages/platform/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const CommunityPage = lazy(() => import('./pages/platform/CommunityPage').then(m => ({ default: m.CommunityPage })));
const TeamsPage = lazy(() => import('./pages/platform/TeamsPage').then(m => ({ default: m.TeamsPage })));
const ProgressAnalyticsPage = lazy(() => import('./pages/platform/ProgressAnalyticsPage').then(m => ({ default: m.ProgressAnalyticsPage })));
const AchievementsPage = lazy(() => import('./pages/platform/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const MistakeJournalPage = lazy(() => import('./pages/platform/MistakeJournalPage').then(m => ({ default: m.MistakeJournalPage })));
const LearningCalendarPage = lazy(() => import('./pages/platform/LearningCalendarPage').then(m => ({ default: m.LearningCalendarPage })));
const SettingsPage = lazy(() => import('./pages/platform/SettingsPage').then(m => ({ default: m.SettingsPage })));

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <Suspense fallback={<ObservatoryLoader />}>
              <Routes>
                {/* Public Marketing & Onboarding Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/login" element={<AuthPage initialMode="login" />} />
                <Route path="/register" element={<AuthPage initialMode="register" />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/portfolio/:userId" element={<PublicPortfolioView />} />
                <Route path="/portfolio" element={<PublicPortfolioView />} />

                {/* Public Academy Views */}
                <Route
                  path="/academies"
                  element={
                    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col font-sans">
                      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                        <AcademiesPage />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/academies/:slug"
                  element={
                    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col font-sans">
                      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                        <DomainDetailPage />
                      </div>
                    </div>
                  }
                />

                {/* Authenticated Platform Studio Shell */}
                <Route path="/platform" element={<AppShell />}>
                  <Route index element={<Navigate to="/platform/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="journey" element={<LearningJourneyPage />} />
                  <Route path="academies" element={<AcademiesPage />} />
                  <Route path="academies/:slug" element={<DomainDetailPage />} />
                  <Route path="lab" element={<LearningLabPage />} />
                  <Route path="lessons/:lessonId" element={<LessonDetailPage />} />
                  <Route path="practice" element={<PracticeArenaPage />} />
                  <Route path="playground" element={<DatasetPlaygroundPage />} />
                  <Route path="challenges" element={<ChallengesPage />} />
                  <Route path="simulations" element={<BusinessSimulationsPage />} />
                  <Route path="detective" element={<DataDetectivePage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="community" element={<CommunityPage />} />
                  <Route path="teams" element={<TeamsPage />} />
                  <Route path="progress" element={<ProgressAnalyticsPage />} />
                  <Route path="achievements" element={<AchievementsPage />} />
                  <Route path="mistakes" element={<MistakeJournalPage />} />
                  <Route path="calendar" element={<LearningCalendarPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
