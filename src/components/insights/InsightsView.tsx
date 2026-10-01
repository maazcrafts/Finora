import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { formatIndianCurrency, formatDateDisplay } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from 'lucide-react';
import { TransactionCategory } from '../../types/finance';

export const InsightsView: React.FC = () => {
  const { transactions, budget, summary, setActivePage, setFilters } = useFinance();
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;

  const expenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense' && t.date.startsWith(currentMonthKey)),
    [transactions, currentMonthKey]
  );

  // 1. Highest Spending Category
  const categoryTotals: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return entries.length > 0 ? { category: entries[0][0] as TransactionCategory, amount: entries[0][1] } : null;
  }, [categoryTotals]);

  // 2. Largest Transaction
  const largestTransaction = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => b.amount - a.amount)[0];
  }, [expenses]);

  // 3. Average Daily Spending
  const avgDailySpending = useMemo(() => {
    const day = Math.max(1, new Date().getDate());
    return Math.round(summary.totalExpenses / day);
  }, [summary.totalExpenses]);

  // 4. Projected Monthly Spending
  const projectedSpending = budget.projectedSpending || summary.totalExpenses;

  const previousMonthTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense' && transaction.date.startsWith(previousMonthKey)) {
        totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
      }
    });
    return totals;
  }, [transactions, previousMonthKey]);

  const momComparisonData = Object.keys({ ...previousMonthTotals, ...categoryTotals })
    .map((category) => {
      const thisMonth = categoryTotals[category] || 0;
      const lastMonth = previousMonthTotals[category] || 0;
      return {
        category: category as TransactionCategory,
        thisMonth,
        lastMonth,
        changePct: lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null,
      };
    })
    .sort((a, b) => b.thisMonth - a.thisMonth)
    .slice(0, 5);

  const monthIncome = transactions
    .filter((transaction) => transaction.type === 'income' && transaction.date.startsWith(currentMonthKey))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const monthSpent = expenses.reduce((total, transaction) => total + transaction.amount, 0);
  const moneyTips = [
    ...(budget.totalBudget > 0 && monthSpent > 0
      ? [`You've used ${Math.round((monthSpent / budget.totalBudget) * 100)}% of your monthly budget.`]
      : []),
    ...(topCategory
      ? [`Most of your spending this month is in ${topCategory.category} (${formatIndianCurrency(topCategory.amount)}).`]
      : []),
    ...(largestTransaction
      ? [`Your largest expense this month was ${largestTransaction.description} (${formatIndianCurrency(largestTransaction.amount)}).`]
      : []),
  ].slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Understand your spending"
        description="See where your money goes."
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Highest Spending Category */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Top category this month</span>
            {topCategory && getCategoryIcon(topCategory.category, 'h-4 w-4 text-[#0B5D3B]')}
          </div>
          <p className="mt-2 text-lg font-bold text-[#111111] truncate">
            {topCategory?.category || 'Not yet available'}
          </p>
          <p className="mt-1 text-xs text-[#6B7280] tabular-nums font-medium">
            {topCategory ? formatIndianCurrency(topCategory.amount) : 'Add a few transactions to see a pattern'}
          </p>
        </div>

        {/* Most Improved Category */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Money received this month</span>
            <ArrowDownRight className="h-4 w-4 text-[#16845B]" />
          </div>
          <p className="mt-2 text-lg font-bold text-[#111111] truncate">
            {formatIndianCurrency(monthIncome)}
          </p>
          <p className="mt-1 text-xs text-[#16845B] tabular-nums font-medium">
            Compare it with your spending below.
          </p>
        </div>

        {/* Largest Transaction */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Largest expense this month</span>
            <AlertTriangle className="h-4 w-4 text-[#B7791F]" />
          </div>
          <p className="mt-2 text-lg font-bold text-[#111111] tabular-nums">
            {largestTransaction ? formatIndianCurrency(largestTransaction.amount) : '₹0'}
          </p>
          <p className="mt-1 text-xs text-[#6B7280] truncate font-medium">
            {largestTransaction?.description || 'N/A'}
          </p>
        </div>

        {/* Average Daily Spending */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Average spent per day</span>
            <Calendar className="h-4 w-4 text-[#6B7280]" />
          </div>
          <p className="mt-2 text-lg font-bold text-[#111111] tabular-nums">
            {formatIndianCurrency(avgDailySpending)}
          </p>
          <p className="mt-1 text-xs text-[#6B7280] font-medium">
            So far this month
          </p>
        </div>

        {/* Projected Monthly Spending */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Monthly spending estimate</span>
            <Target className="h-4 w-4 text-[#0B5D3B]" />
          </div>
          <p className="mt-2 text-lg font-bold text-[#111111] tabular-nums">
            {formatIndianCurrency(projectedSpending)}
          </p>
          <p className="mt-1 text-xs text-[#16845B] font-medium">
            Target ₹{budget.totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Month-over-Month Comparison Table / Grid */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
        <div className="pb-4 border-b border-[#E5E7EB]/60">
          <h3 className="text-base font-semibold text-[#111111] tracking-tight">
            Month-over-Month Category Shift
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Compare this month with last month
          </p>
        </div>

        <div className="mt-4 divide-y divide-[#E5E7EB]/60">
          {momComparisonData.map((item) => {
            const isIncrease = item.changePct !== null && item.changePct > 0;
            return (
              <div
                key={item.category}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#F7F8F6] border border-[#E5E7EB] flex items-center justify-center text-[#111111]">
                    {getCategoryIcon(item.category, 'h-4 w-4')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#111111]">
                      {item.category}
                    </h4>
                    <span className="text-[#6B7280]">
                      Last month: {formatIndianCurrency(item.lastMonth)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 text-right">
                  <div>
                      <span className="text-xs text-[#6B7280] block">This month</span>
                    <span className="font-semibold text-sm text-[#111111] tabular-nums">
                      {formatIndianCurrency(item.thisMonth)}
                    </span>
                  </div>

                  <div className="w-20">
                    <span
                      className={`inline-flex items-center gap-0.5 font-semibold text-xs px-2 py-0.5 rounded-md ${
                        item.changePct === null
                          ? 'text-[#6B7280] bg-[#F7F8F6]'
                          : isIncrease
                          ? 'text-[#C84A4A] bg-[#C84A4A]/10'
                          : 'text-[#16845B] bg-[#16845B]/10'
                      }`}
                    >
                      {item.changePct === null ? null : isIncrease ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>{item.changePct === null ? 'New' : `${item.changePct > 0 ? '+' : ''}${item.changePct}%`}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#0B5D3B]" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#111111]">Money tips</h2>
        </div>
        {moneyTips.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {moneyTips.map((tip) => (
              <li key={tip} className="border-t border-[#E5E7EB] pt-3 text-sm leading-relaxed text-[#4B5563]">{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[#6B7280]">Add a few transactions and we’ll share useful patterns from your spending.</p>
        )}
        <button
          type="button"
          onClick={() => setActivePage('reports')}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0B5D3B] hover:text-[#06452C]"
        >
          View monthly report <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
};
