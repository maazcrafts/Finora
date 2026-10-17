import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionMobileCard } from './TransactionMobileCard';
import { EmptyState } from '../ui/EmptyState';
import { Receipt, Search } from 'lucide-react';

export const TransactionTable: React.FC = () => {
  const {
    filteredTransactions,
    transactions,
    openDetailModal,
    openEditModal,
    promptDeleteTransaction,
    openAddModal,
    resetFilters,
  } = useFinance();

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-6 w-6 text-[#0B5D3B]" />}
        title="Nothing here yet."
        description="Add your first transaction and we’ll start tracking your money."
        actionText="Add transaction"
        onAction={openAddModal}
      />
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6 text-[#6B7280]" />}
        title="No transactions found."
        description="Try changing your search or clearing the filters."
        actionText="Clear filters"
        onAction={resetFilters}
      />
    );
  }

  return (
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white divide-y divide-[#E5E7EB]">
        {filteredTransactions.map((t) => (
          <TransactionMobileCard
            key={t.id}
            transaction={t}
            onView={openDetailModal}
            onEdit={openEditModal}
            onDelete={promptDeleteTransaction}
          />
        ))}
      </div>
  );
};
