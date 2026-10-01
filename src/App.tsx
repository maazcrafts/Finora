import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetView } from './components/budget/BudgetView';
import { InsightsView } from './components/insights/InsightsView';
import { ReportsView } from './components/reports/ReportsView';
import { SummaryView } from './components/summary/SummaryView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { HowItWorksPage } from './components/landing/HowItWorksPage';
import { AuthPage } from './components/auth/AuthPage';
import { Loader2 } from 'lucide-react';

const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#F7F8F6] flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="h-11 w-11 rounded-xl bg-[#0B5D3B] text-white flex items-center justify-center font-bold mx-auto">
        FT
      </div>
      <div className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
        <Loader2 className="h-4 w-4 animate-spin text-[#0B5D3B]" />
        Checking your session…
      </div>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { activePage, authViewMode, enterAuthenticatedApp, setActivePage } = useFinance();
  const { isLoading: authLoading, isAuthenticated, needsEmailVerification } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (activePage === 'landing' && !isAuthenticated) {
    return (
      <AppLayout>
        <LandingPage />
      </AppLayout>
    );
  }

  if (activePage === 'how-it-works') {
    return (
      <AppLayout>
        <HowItWorksPage />
      </AppLayout>
    );
  }

  if (activePage === 'auth' || needsEmailVerification) {
    return (
      <AuthPage
        initialMode={needsEmailVerification ? 'verify' : authViewMode}
        onAuthenticated={enterAuthenticatedApp}
        onBackToLanding={() => setActivePage('landing')}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <LandingPage />
      </AppLayout>
    );
  }

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'budget':
        return <BudgetView />;
      case 'insights':
        return <InsightsView />;
      case 'reports':
        return <ReportsView />;
      case 'summary':
        return <SummaryView />;
      case 'profile':
        return <ProfileSettingsView />;
      case 'landing':
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppLayout>{renderActiveView()}</AppLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}
