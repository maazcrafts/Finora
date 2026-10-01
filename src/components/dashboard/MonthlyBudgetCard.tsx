import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { ArrowRight, Settings } from 'lucide-react';

export const MonthlyBudgetCard: React.FC = () => {
  const { budget, transactions, openBudgetModal, setActivePage } = useFinance();
  const monthKey = `${budget.year}-${String(budget.monthIndex + 1).padStart(2, '0')}`;
  const spent = transactions
    .filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(monthKey))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const total = budget.totalBudget;
  const remaining = total - spent;
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
  const isOverBudget = spent > total;
  const isClose = percentage >= 80 && !isOverBudget;

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#111111]">Your monthly budget</h2>
          <p className="mt-1 text-sm text-[#6B7280]">{budget.month}</p>
        </div>
        <button
          type="button"
          onClick={openBudgetModal}
          className="rounded-md p-2 text-[#6B7280] hover:bg-[#F7F8F6] hover:text-[#111111]"
          aria-label="Edit monthly budget"
          title="Edit monthly budget"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {total <= 0 ? (
        <div className="mt-6 border-t border-[#E5E7EB] pt-5">
          <p className="text-sm text-[#6B7280]">No monthly budget yet. Set one in less than a minute.</p>
          <button type="button" onClick={openBudgetModal} className="mt-4 text-sm font-semibold text-[#0B5D3B]">
            Set a budget <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-[#6B7280]">You&apos;ve spent</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#111111]">
                {formatIndianCurrency(spent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6B7280]">{remaining >= 0 ? 'You have' : 'Over by'}</p>
              <p className={`mt-1 text-lg font-semibold tabular-nums ${isOverBudget ? 'text-[#C84A4A]' : 'text-[#111111]'}`}>
                {formatIndianCurrency(Math.abs(remaining))} {remaining >= 0 ? 'left' : ''}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div
              className="h-2 overflow-hidden rounded-full bg-[#F0F1EF]"
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
                ? 'Your monthly budget has been reached.'
                : isClose
                ? "You're getting close to your monthly limit."
                : "You're doing well — you're within your budget."}
            </p>
          </div>
        </>
      )}

      <div className="mt-5 border-t border-[#E5E7EB] pt-4">
        <button
          type="button"
          onClick={() => setActivePage('budget')}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B5D3B] hover:text-[#06452C]"
        >
          Manage budget <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
