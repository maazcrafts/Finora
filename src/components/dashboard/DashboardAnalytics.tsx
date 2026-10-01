import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Trophy } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionCategory } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function monthLabel(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString('en-IN', {
    month: 'short',
  });
}

export const DashboardAnalytics: React.FC = () => {
  const { transactions, budget, setActivePage, setFilters } = useFinance();

  const categoryBreakdown = useMemo(() => {
    const key = monthKey(budget.year, budget.monthIndex);
    const totals = new Map<TransactionCategory, number>();

    transactions.forEach((transaction) => {
      if (transaction.type !== 'expense' || !transaction.date.startsWith(key)) return;
      totals.set(
        transaction.category,
        (totals.get(transaction.category) ?? 0) + transaction.amount
      );
    });

    return [...totals.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, budget.year, budget.monthIndex]);

  const monthlyTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(budget.year, budget.monthIndex - 5 + index, 1);
      const key = monthKey(date.getFullYear(), date.getMonth());
      const expense = transactions
        .filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(key))
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        key,
        label: monthLabel(date.getFullYear(), date.getMonth()),
        expense,
      };
    });
  }, [transactions, budget.year, budget.monthIndex]);

  const highestCategory = categoryBreakdown[0] ?? null;
  const maxCategory = Math.max(...categoryBreakdown.map((item) => item.amount), 1);
  const maxMonth = Math.max(...monthlyTrend.map((item) => item.expense), 1);

  const openCategory = (category: string) => {
    setFilters((current) => ({
      ...current,
      category,
      type: 'expense',
      dateRange: 'this_month',
    }));
    setActivePage('transactions');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#111111]">Category-wise spending</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Expense distribution for {budget.month}
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-[#6B7280]" aria-hidden="true" />
        </div>

        {categoryBreakdown.length === 0 ? (
          <p className="mt-6 border-t border-[#E5E7EB] pt-5 text-sm text-[#6B7280]">
            Add an expense this month to populate the category chart.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {categoryBreakdown.slice(0, 8).map(({ category, amount }) => {
              const percentage = Math.round((amount / maxCategory) * 100);
              const share = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0) > 0
                ? Math.round((amount / categoryBreakdown.reduce((sum, item) => sum + item.amount, 0)) * 100)
                : 0;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => openCategory(category)}
                  className="w-full text-left group"
                  title={`View ${category} transactions`}
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#0B5D3B]">
                        {getCategoryIcon(category, 'h-4 w-4')}
                      </span>
                      <span className="truncate font-medium text-[#111111] group-hover:text-[#0B5D3B]">
                        {category}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-semibold tabular-nums text-[#111111]">
                        {formatIndianCurrency(amount)}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">{share}%</span>
                    </span>
                  </div>
                  <div className="ml-10 mt-2 h-2 overflow-hidden rounded-full bg-[#F0F1EF]">
                    <div
                      className="h-full rounded-full bg-[#0B5D3B] transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#111111]">Monthly spending trend</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Expense totals across the last six months</p>
          </div>
          <TrendingUp className="h-5 w-5 text-[#6B7280]" aria-hidden="true" />
        </div>

        <div className="mt-6 h-52 flex items-end gap-2 sm:gap-3 border-b border-[#E5E7EB]">
          {monthlyTrend.map((month) => {
            const height = Math.max(4, Math.round((month.expense / maxMonth) * 100));
            const isSelected = month.key === monthKey(budget.year, budget.monthIndex);

            return (
              <div key={month.key} className="min-w-0 flex-1 h-full flex flex-col justify-end items-center gap-2">
                <span className="text-[10px] text-[#6B7280] tabular-nums whitespace-nowrap">
                  {month.expense > 0 ? formatIndianCurrency(month.expense) : '₹0'}
                </span>
                <div
                  className={`w-full max-w-12 rounded-t-md transition-all ${isSelected ? 'bg-[#0B5D3B]' : 'bg-[#A7B8B0]'}`}
                  style={{ height: `${height}%` }}
                  title={`${month.label}: ${formatIndianCurrency(month.expense)}`}
                />
                <span className={`text-xs ${isSelected ? 'font-semibold text-[#111111]' : 'text-[#6B7280]'}`}>
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg border border-[#E5E7EB] bg-[#F7F8F6] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#0B5D3B]">
              <Trophy className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#6B7280]">Highest expense category this month</p>
              <p className="mt-1 text-base font-semibold text-[#111111]">
                {highestCategory ? highestCategory.category : 'No expenses yet'}
              </p>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                {highestCategory
                  ? `${formatIndianCurrency(highestCategory.amount)} spent`
                  : 'Add a transaction to calculate this automatically.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
