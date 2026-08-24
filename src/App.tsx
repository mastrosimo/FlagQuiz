import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AchievementToast } from './components/feedback/AchievementToast';
import { MasteryLevelUpToast } from './components/mastery/MasteryLevelUpToast';
import { MissionCompleteToast } from './components/missions/MissionCompleteToast';
import { Spinner } from './components/common/Spinner';
import { HomePage } from './pages/HomePage';
import { useSeoSync } from './i18n/useSeoSync';

const QuizPage = lazy(() => import('./pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then((m) => ({ default: m.StatsPage })));
const LearnPage = lazy(() => import('./pages/LearnPage').then((m) => ({ default: m.LearnPage })));
const MissionsPage = lazy(() => import('./pages/MissionsPage').then((m) => ({ default: m.MissionsPage })));
const AchievementsPage = lazy(() =>
  import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
);
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const LocaleHomeRoute = lazy(() =>
  import('./pages/seo/LocaleHomePage').then((m) => ({ default: m.LocaleHomeRoute })),
);
const CountrySlugPage = lazy(() =>
  import('./pages/seo/CountryPage').then((m) => ({ default: m.CountrySlugPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

function AppShell() {
  useSeoSync();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AchievementToast />
      <MasteryLevelUpToast />
      <MissionCompleteToast />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/:locale" element={<LocaleHomeRoute />} />
            <Route path="/it/bandiere/:slug" element={<CountrySlugPage locale="it" />} />
            <Route path="/en/flags/:slug" element={<CountrySlugPage locale="en" />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
