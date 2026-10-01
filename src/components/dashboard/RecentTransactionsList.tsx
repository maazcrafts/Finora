import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIndianCurrency, formatDateDisplay } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { ArrowRight } from 'lucide-react';

export const RecentTransactionsList: React.FC = () => {
  const { transactions, setActivePage, openDetailModal } = useFinance();

  const recentList = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-base font-semibold text-[#111111]">Recent transactions</h2>
        </div>
        <button
          type="button"
          onClick={() => setActivePage('transactions')}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0B5D3B] hover:text-[#06452C]"
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {recentList.length > 0 ? (
        <div className="divide-y divide-[#E5E7EB]">
          {recentList.map((transaction) => {
            const isExpense = transaction.type === 'expense';
            return (
              <button
                key={transaction.id}
                type="button"
                onClick={() => openDetailModal(transaction)}
                className="flex w-full items-center justify-between gap-3 py-3.5 text-left hover:bg-[#F7F8F6]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B5D3B]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#0B5D3B]">
                    {getCategoryIcon(transaction.category)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#111111]">{transaction.description}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#6B7280]">
                      {transaction.category} <span aria-hidden="true">·</span> {formatDateDisplay(transaction.date)}
                    </span>
                  </span>
                </span>
                <span className={`shrink-0 text-sm font-semibold tabular-nums ${isExpense ? 'text-[#C84A4A]' : 'text-[#16845B]'}`}>
                  {isExpense ? '-' : '+'}{formatIndianCurrency(transaction.amount)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="py-6 text-sm text-[#6B7280]">Nothing here yet. Add your first transaction to get started.</p>
      )}
    </section>
  );
};
