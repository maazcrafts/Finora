import React, { useMemo } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BellRing,
  CalendarClock,
  ChevronRight,
  LineChart,
  PieChart,
  Repeat2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatIndianCurrency } from '../../utils/formatters';

export const AdvancedView: React.FC = () => {
  const {
    transactions,
    budget,
    summary,
    setActivePage,
    setFilters,
    openBudgetModal,
    openEditModal,
  } = useFinance();

  const monthKey = `${budget.year}-${String(budget.monthIndex + 1).padStart(2, '0')}`;

  const monthExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense' && t.date.startsWith(monthKey)),
    [transactions, monthKey]
  );

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    const total = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
    return [...map.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        share: total ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses]);

  const trend = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const d = new Date(budget.year, budget.monthIndex - 5 + index, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(key))
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        key,
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        amount,
      };
    });
  }, [transactions, budget.year, budget.monthIndex]);

  const recurring = transactions.filter((t) => t.type === 'expense' && t.recurrence);
  const highest = categoryData[0];
  const maxTrend = Math.max(...trend.map((m) => m.amount), 1);
  const budgetUsed = budget.totalBudget
    ? Math.round((summary.totalExpenses / budget.totalBudget) * 100)
    : 0;
  const budgetExceeded = budget.totalBudget > 0 && summary.totalExpenses > budget.totalBudget;

  const openCategory = (category: string) => {
    setFilters((current) => ({
      ...current,
      type: 'expense',
      category,
      dateRange: 'this_month',
    }));
    setActivePage('transactions');
  };

  return (
    <div className="min-h-full bg-[#F7F8F6]">
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-7 border-b border-[#E5E7EB] pb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0B5D3B]/15 bg-[#0B5D3B]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0B5D3B]">
            <Sparkles className="h-3.5 w-3.5" />
            Advanced
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            Advanced financial intelligence
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Advanced tools that turn your transaction history into warnings, recurring-payment tracking, category analysis, and spending trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <section className={`rounded-xl border p-5 sm:p-6 lg:col-span-2 ${budgetExceeded ? 'border-[#C84A4A]/30 bg-[#FFF8F8]' : 'border-[#E5E7EB] bg-white'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Budget warning</p>
                <h2 className="mt-1 text-lg font-semibold text-[#111111]">
                  {budgetExceeded ? 'Monthly limit crossed' : 'Budget is being monitored'}
                </h2>
              </div>
              {budgetExceeded ? (
                <AlertTriangle className="h-5 w-5 text-[#C84A4A]" />
              ) : (
                <BellRing className="h-5 w-5 text-[#0B5D3B]" />
              )}
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-bold tabular-nums text-[#111111]">{formatIndianCurrency(summary.totalExpenses)}</p>
                <p className="mt-1 text-xs text-[#6B7280]">of {formatIndianCurrency(budget.totalBudget)} limit</p>
              </div>
              <p className={`text-sm font-semibold ${budgetExceeded ? 'text-[#C84A4A]' : 'text-[#0B5D3B]'}`}>
                {budgetExceeded
                  ? `${formatIndianCurrency(summary.totalExpenses - budget.totalBudget)} over`
                  : `${Math.max(0, 100 - budgetUsed)}% remaining`}
              </p>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E9ECEA]">
              <div
                className={`h-full rounded-full ${budgetExceeded ? 'bg-[#C84A4A]' : 'bg-[#0B5D3B]'}`}
                style={{ width: `${Math.min(100, Math.max(0, budgetUsed))}%` }}
              />
            </div>
            <button
              type="button"
              onClick={openBudgetModal}
              className="mt-4 text-xs font-semibold text-[#0B5D3B] hover:underline"
            >
              Adjust budget →
            </button>
          </section>

          <section className="rounded-xl bg-[#0B5D3B] p-5 text-white sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/65">Highest-expense category</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{highest?.category ?? 'No expenses yet'}</p>
                <p className="mt-0.5 text-sm text-white/70">
                  {highest ? `${formatIndianCurrency(highest.amount)} • ${highest.share}%` : 'Add an expense to calculate'}
                </p>
              </div>
            </div>
            {highest && (
              <button
                type="button"
                onClick={() => openCategory(highest.category)}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold"
              >
                View transactions <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </section>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Recurring expenses</p>
                <h2 className="mt-1 text-lg font-semibold text-[#111111]">Scheduled spending</h2>
              </div>
              <Repeat2 className="h-5 w-5 text-[#0B5D3B]" />
            </div>

            {recurring.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-[#D1D5DB] bg-[#F7F8F6] p-5">
                <p className="text-sm font-medium text-[#111111]">No recurring expenses yet.</p>
                <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                  Create a weekly or monthly recurring expense from Transactions.
                </p>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[#E5E7EB]">
                {recurring.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-[#F7F8F6]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <CalendarClock className="h-4 w-4 shrink-0 text-[#0B5D3B]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[#111111]">{t.description}</span>
                        <span className="text-[11px] text-[#6B7280]">
                          {t.recurrence?.frequency === 'weekly' ? 'Weekly' : 'Monthly'} • {t.category}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">{formatIndianCurrency(t.amount)}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Monthly spending trend</p>
                <h2 className="mt-1 text-lg font-semibold text-[#111111]">Last six months</h2>
              </div>
              <LineChart className="h-5 w-5 text-[#0B5D3B]" />
            </div>
            <div className="mt-6 flex h-48 items-end gap-2 border-b border-[#E5E7EB] sm:gap-3">
              {trend.map((month) => (
                <div key={month.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="max-w-full truncate text-[10px] text-[#6B7280]">
                    {formatIndianCurrency(month.amount)}
                  </span>
                  <div
                    className={`w-full max-w-12 rounded-t-md ${month.key === monthKey ? 'bg-[#0B5D3B]' : 'bg-[#B8C8C1]'}`}
                    style={{ height: `${month.amount ? Math.max(5, (month.amount / maxTrend) * 100) : 3}%` }}
                  />
                  <span className="text-[11px] text-[#6B7280]">{month.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Category-wise analysis</p>
              <h2 className="mt-1 text-lg font-semibold text-[#111111]">This month’s spending mix</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-[#0B5D3B]" />
          </div>

          {categoryData.length === 0 ? (
            <p className="mt-5 rounded-lg bg-[#F7F8F6] p-5 text-sm text-[#6B7280]">No expenses recorded for this month.</p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {categoryData.map((item) => (
                <button key={item.category} type="button" onClick={() => openCategory(item.category)} className="text-left">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-[#111111]">{item.category}</span>
                    <span className="shrink-0 text-xs font-semibold text-[#6B7280]">
                      {formatIndianCurrency(item.amount)} · {item.share}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EEF1EF]">
                    <div className="h-full rounded-full bg-[#0B5D3B]" style={{ width: `${Math.min(100, item.share)}%` }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric icon={<Target className="h-4 w-4" />} label="Budget remaining" value={formatIndianCurrency(Math.max(0, budget.totalBudget - summary.totalExpenses))} />
          <Metric icon={<PieChart className="h-4 w-4" />} label="Active categories" value={String(categoryData.length)} />
          <Metric icon={<TrendingUp className="h-4 w-4" />} label="Recurring expenses" value={String(recurring.length)} />
        </div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
    <div className="flex items-center gap-2 text-[#0B5D3B]">{icon}<span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</span></div>
    <p className="mt-3 text-xl font-bold tabular-nums text-[#111111]">{value}</p>
  </div>
);
