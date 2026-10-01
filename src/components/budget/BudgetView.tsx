import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { CategoryBudgetCard } from './CategoryBudgetCard';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { formatIndianCurrency } from '../../utils/formatters';
import { EmptyState } from '../ui/EmptyState';
import { Plus, Settings } from 'lucide-react';

export const BudgetView: React.FC = () => {
  const { budget, transactions, openBudgetModal, setFilters, setActivePage, isLoading } = useFinance();

  if (isLoading) {
    return <LoadingSkeleton type="budget" />;
  }

  const monthKey = `${budget.year}-${String(budget.monthIndex + 1).padStart(2, '0')}`;
  const spent = transactions
    .filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(monthKey))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const total = budget.totalBudget;
  const remaining = total - spent;
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
  const isOverBudget = spent > total;
  const isClose = percentage >= 80 && !isOverBudget;

  const handleSelectCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      type: 'expense',
    }));
    setActivePage('transactions');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Your budget"
        description="A monthly spending limit that's easy to follow."
        actions={
          <Button
            variant={total > 0 ? 'outline' : 'primary'}
            size="md"
            icon={total > 0 ? <Settings className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            onClick={openBudgetModal}
          >
            {total > 0 ? 'Edit budget' : 'Set monthly budget'}
          </Button>
        }
      />

      <section className="max-w-3xl rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
        <p className="text-sm font-medium text-[#6B7280]">{budget.month}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-[#111111]">{formatIndianCurrency(total)}</p>
        <p className="mt-1 text-sm text-[#6B7280]">Your monthly spending limit</p>

        {total > 0 ? (
          <>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-[#6B7280]">You&apos;ve spent</p>
                <p className="mt-1 text-xl font-semibold tabular-nums text-[#111111]">{formatIndianCurrency(spent)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-[#6B7280]">{remaining >= 0 ? 'You have left' : 'Over your limit by'}</p>
                <p className={`mt-1 text-xl font-semibold tabular-nums ${isOverBudget ? 'text-[#C84A4A]' : 'text-[#111111]'}`}>
                  {formatIndianCurrency(Math.abs(remaining))}
                </p>
              </div>
            </div>
            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#F0F1EF]"
              role="progressbar"
              aria-label="Monthly budget used"
              aria-valuenow={Math.min(100, percentage)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full ${isOverBudget ? 'bg-[#C84A4A]' : isClose ? 'bg-[#B7791F]' : 'bg-[#0B5D3B]'}`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
            <p className={`mt-3 text-sm ${isOverBudget ? 'text-[#C84A4A]' : isClose ? 'text-[#B7791F]' : 'text-[#16845B]'}`}>
              {isOverBudget
                ? 'Your budget has been reached.'
                : isClose
                ? "You're getting close to your monthly limit."
                : "You're doing well — you're within your budget."}
            </p>
          </>
        ) : (
          <p className="mt-5 text-sm text-[#6B7280]">Set a monthly limit when you&apos;re ready. You can skip category budgets.</p>
        )}
      </section>

      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#111111]">Optional category budgets</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Set limits for specific kinds of spending if that helps.</p>
        </div>

        {budget.categoryBudgets.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {budget.categoryBudgets.map((catBudget) => (
              <CategoryBudgetCard
                key={catBudget.category}
                categoryBudget={catBudget}
                onSelectCategory={handleSelectCategory}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No category budgets yet."
            description="Add a limit for food, transport, or another category whenever you like."
            actionText="Add category budgets"
            onAction={openBudgetModal}
          />
        )}
      </div>
    </div>
  );
};
