import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Receipt,
  TrendingUp,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

type Range = 'all' | '12m' | '6m' | '3m';

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const monthLabel = (date: Date) =>
  date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

export const SummaryView: React.FC = () => {
  const { transactions } = useFinance();
  const [range, setRange] = useState<Range>('6m');

  const rangeMonths = range === '12m' ? 12 : range === '3m' ? 3 : range === '6m' ? 6 : 0;

  const filteredTransactions = useMemo(() => {
    if (range === 'all') return transactions;
    const cutoff = new Date();
    cutoff.setDate(1);
    cutoff.setMonth(cutoff.getMonth() - (rangeMonths - 1));
    const cutoffKey = monthKey(cutoff);
    return transactions.filter((t) => t.date >= cutoffKey);
  }, [transactions, range, rangeMonths]);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    }
    const balance = income - expenses;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
    const expenseCount = filteredTransactions.filter((t) => t.type === 'expense').length;
    const avgExpense = expenseCount ? expenses / expenseCount : 0;
    return { income, expenses, balance, savingsRate, expenseCount, avgExpense };
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    const count = range === 'all' ? 12 : rangeMonths;
    const now = new Date();
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
      const key = monthKey(date);
      const items = transactions.filter((t) => t.date.startsWith(key));
      return {
        key,
        label: monthLabel(date),
        income: items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, range, rangeMonths]);

  const categoryData = useMemo(() => {
    const totals = new Map<string, number>();
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount));
    return [...totals.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: stats.expenses ? Math.round((amount / stats.expenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, stats.expenses]);

  const highestExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce<Transaction | null>((highest, t) => (!highest || t.amount > highest.amount ? t : highest), null);
  }, [filteredTransactions]);

  const maxChartValue = Math.max(1, ...monthlyData.flatMap((m) => [m.income, m.expenses]));
  const maxCategory = Math.max(1, ...categoryData.map((c) => c.amount));

  const trend = monthlyData.length >= 2
    ? monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Financial Summary"
        description="A clear view of your money, spending patterns, and progress."
        actions={
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-1">
            {([
              ['3m', '3 months'],
              ['6m', '6 months'],
              ['12m', '12 months'],
              ['all', 'All time'],
            ] as [Range, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRange(value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === value ? 'bg-[#0B5D3B] text-white' : 'text-[#6B7280] hover:bg-[#F7F8F6]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Money received</span>
            <span className="rounded-lg bg-[#16845B]/10 p-2 text-[#16845B]"><ArrowDownRight className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-[#16845B]">{formatIndianCurrency(stats.income)}</p>
          <p className="mt-1 text-xs text-[#6B7280]">Total income in this period</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Money spent</span>
            <span className="rounded-lg bg-[#C84A4A]/10 p-2 text-[#C84A4A]"><ArrowUpRight className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-[#C84A4A]">{formatIndianCurrency(stats.expenses)}</p>
          <p className="mt-1 text-xs text-[#6B7280]">{stats.expenseCount} expense transactions</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Net balance</span>
            <span className="rounded-lg bg-[#0B5D3B]/10 p-2 text-[#0B5D3B]"><Wallet className="h-4 w-4" /></span>
          </div>
          <p className={`mt-3 text-2xl font-bold tabular-nums ${stats.balance >= 0 ? 'text-[#111111]' : 'text-[#C84A4A]'}`}>
            {formatIndianCurrency(stats.balance)}
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">{stats.savingsRate}% of income retained</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Average expense</span>
            <span className="rounded-lg bg-[#F7F8F6] p-2 text-[#0B5D3B]"><Receipt className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-[#111111]">{formatIndianCurrency(stats.avgExpense)}</p>
          <p className="mt-1 text-xs text-[#6B7280]">Per expense transaction</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Income & spending trend</h2>
              <p className="mt-1 text-xs text-[#6B7280]">Monthly totals. Hover-free and easy to compare.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-[#0B5D3B]" />
          </div>

          <div className="mt-6 h-64 flex items-end gap-2 sm:gap-4">
            {monthlyData.map((month) => (
              <div key={month.key} className="min-w-0 flex-1 h-full flex flex-col justify-end">
                <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2">
                  <div
                    className="w-2.5 sm:w-4 max-w-[28px] rounded-t-md bg-[#16845B] transition-all"
                    style={{ height: `${Math.max(month.income ? 4 : 0, (month.income / maxChartValue) * 100)}%` }}
                    title={`Income: ${formatIndianCurrency(month.income)}`}
                  />
                  <div
                    className="w-2.5 sm:w-4 max-w-[28px] rounded-t-md bg-[#C84A4A] transition-all"
                    style={{ height: `${Math.max(month.expenses ? 4 : 0, (month.expenses / maxChartValue) * 100)}%` }}
                    title={`Expenses: ${formatIndianCurrency(month.expenses)}`}
                  />
                </div>
                <span className="mt-2 truncate text-center text-[10px] text-[#6B7280]">{month.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-5 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#16845B]" />Income</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#C84A4A]" />Expenses</span>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">Where your money goes</h2>
              <p className="mt-1 text-xs text-[#6B7280]">Expense categories for the selected period.</p>
            </div>
            <CalendarDays className="h-5 w-5 text-[#0B5D3B]" />
          </div>

          {categoryData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-[#6B7280]">No expense data for this period.</div>
          ) : (
            <div className="mt-6 space-y-4">
              {categoryData.slice(0, 7).map((item) => (
                <div key={item.category}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium text-[#111111]">{item.category}</span>
                    <span className="shrink-0 tabular-nums text-[#6B7280]">{formatIndianCurrency(item.amount)} · {item.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F1F3F1]">
                    <div className="h-full rounded-full bg-[#0B5D3B]" style={{ width: `${(item.amount / maxCategory) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0B5D3B]" />
            <h2 className="text-base font-semibold text-[#111111]">What stands out</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#F7F8F6] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Largest category</p>
              <p className="mt-2 text-sm font-bold text-[#111111]">{categoryData[0]?.category ?? '—'}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{categoryData[0] ? formatIndianCurrency(categoryData[0].amount) : 'No expenses'}</p>
            </div>
            <div className="rounded-xl bg-[#F7F8F6] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Largest transaction</p>
              <p className="mt-2 truncate text-sm font-bold text-[#111111]">{highestExpense?.description ?? '—'}</p>
              <p className="mt-1 text-xs text-[#C84A4A]">{highestExpense ? formatIndianCurrency(highestExpense.amount) : 'No expenses'}</p>
            </div>
            <div className="rounded-xl bg-[#F7F8F6] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Latest month</p>
              <p className="mt-2 text-sm font-bold text-[#111111]">{monthlyData.at(-1)?.label ?? '—'}</p>
              <p className={`mt-1 text-xs ${trend > 0 ? 'text-[#C84A4A]' : 'text-[#16845B]'}`}>
                {trend === 0 ? 'Same spending as previous month' : `${trend > 0 ? '+' : ''}${formatIndianCurrency(trend)} vs previous month`}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#0B5D3B]/20 bg-[#0B5D3B]/5 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#0B5D3B]">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-base font-semibold">Summary</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#374151]">
            {stats.income === 0 && stats.expenses === 0
              ? 'Add a few transactions to generate your financial summary.'
              : stats.balance >= 0
                ? `You received ${formatIndianCurrency(stats.income)} and spent ${formatIndianCurrency(stats.expenses)} in this period, leaving ${formatIndianCurrency(stats.balance)} after expenses.`
                : `You spent ${formatIndianCurrency(stats.expenses - stats.income)} more than you received in this period.`}
          </p>
          <div className="mt-5 border-t border-[#0B5D3B]/15 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0B5D3B]">How to read this</p>
            <p className="mt-2 text-xs leading-5 text-[#4B5563]">
              Green shows money received, red shows money spent. Category bars are proportional to your total expenses for the selected period.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
