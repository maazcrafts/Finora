import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { SummaryCards } from './SummaryCards';
import { MonthlyBudgetCard } from './MonthlyBudgetCard';
import { SpendingBreakdown } from './SpendingBreakdown';
import { DashboardAnalytics } from './DashboardAnalytics';
import { RecentTransactionsList } from './RecentTransactionsList';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Plus } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, openAddModal, isLoading } = useFinance();

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.split(' ')[0] || 'there';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 sm:pb-6 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#111111] tracking-tight leading-tight">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#6B7280]">
            Here&apos;s how your money is doing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="h-4 w-4" />}
            onClick={openAddModal}
          >
            Add transaction
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <SummaryCards />

      {/* Monthly Budget Card + Spending Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <MonthlyBudgetCard />
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <SpendingBreakdown />
        </div>
      </div>

      <DashboardAnalytics />

      <RecentTransactionsList />
    </div>
  );
};
