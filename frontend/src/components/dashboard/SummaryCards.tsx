import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatIndianCurrency } from '../../utils/formatters';

export const SummaryCards: React.FC = () => {
  const { summary, transactions } = useFinance();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(monthKey)
  );
  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
  const monthExpenses = monthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <p className="text-sm font-medium text-[#6B7280]">Balance</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-[#111111]">
          {formatIndianCurrency(summary.currentBalance)}
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">What you have left after your spending</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E5E7EB] pt-4 text-sm">
          <span className="text-[#6B7280]">
            Money received <strong className="ml-1 font-semibold tabular-nums text-[#16845B]">{formatIndianCurrency(monthIncome)}</strong>
          </span>
          <span className="text-[#6B7280]">
            Spent <strong className="ml-1 font-semibold tabular-nums text-[#C84A4A]">{formatIndianCurrency(monthExpenses)}</strong>
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <p className="text-sm font-medium text-[#6B7280]">Spent this month</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-[#111111]">
          {formatIndianCurrency(monthExpenses)}
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">
          {monthTransactions.filter((transaction) => transaction.type === 'expense').length} expenses recorded this month
        </p>
      </section>
    </div>
  );
};
