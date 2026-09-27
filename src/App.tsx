import React from 'react';
import { MindVibeProvider, useMindVibe } from './hooks/useMindVibe';
import { LandingView } from './views/LandingView';
import { OnboardingModal } from './views/OnboardingModal';
import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { FocusView } from './views/FocusView';
import { WellnessView } from './views/WellnessView';
import { InsightsView } from './views/InsightsView';
import { AppShell } from './components/layout/AppShell';

const MainRouter: React.FC = () => {
  const { currentView } = useMindVibe();

  if (currentView === 'landing' || currentView === 'onboarding') {
    return (
      <>
        <LandingView />
        <OnboardingModal />
      </>
    );
  }

  return (
    <AppShell>
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'planner' && <PlannerView />}
      {currentView === 'focus' && <FocusView />}
      {currentView === 'wellness' && <WellnessView />}
      {currentView === 'insights' && <InsightsView />}
      <OnboardingModal />
    </AppShell>
  );
};

export default function App() {
  return (
    <MindVibeProvider>
      <MainRouter />
    </MindVibeProvider>
  );
}
