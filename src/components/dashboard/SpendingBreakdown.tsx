import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionCategory } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

export const SpendingBreakdown: React.FC = () => {
  const { transactions, setActivePage } = useFinance();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const breakdown = useMemo(() => {
    const totals = new Map<TransactionCategory, number>();

    transactions.forEach((transaction) => {
      if (transaction.type !== 'expense' || !transaction.date.startsWith(currentMonth)) return;
      totals.set(
        transaction.category,
        (totals.get(transaction.category) ?? 0) + transaction.amount
      );
    });

    return [...totals.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions, currentMonth]);

  const totalSpent = breakdown.reduce((total, item) => total + item.amount, 0);

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#111111]">Where your money goes</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Your top spending categories this month</p>
        </div>
        <button
          type="button"
          onClick={() => setActivePage('insights')}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0B5D3B] hover:text-[#06452C]"
        >
          More <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {breakdown.length === 0 ? (
        <p className="mt-6 border-t border-[#E5E7EB] pt-5 text-sm text-[#6B7280]">
          No spending recorded this month yet. Add a transaction to see where your money goes.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {breakdown.map(({ category, amount }) => {
            const share = Math.round((amount / totalSpent) * 100);

            return (
              <div key={category}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#0B5D3B]">
                      {getCategoryIcon(category, 'h-4 w-4')}
                    </span>
                    <span className="truncate font-medium text-[#111111]">{category}</span>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-[#111111]">
                    {formatIndianCurrency(amount)}
                  </span>
                </div>
                <div
                  className="ml-10 mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0F1EF]"
                  role="progressbar"
                  aria-label={`${category} share of this month's spending`}
                  aria-valuenow={share}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full rounded-full bg-[#0B5D3B]" style={{ width: `${share}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};