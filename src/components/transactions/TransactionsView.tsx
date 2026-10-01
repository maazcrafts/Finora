import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { TransactionFilterPanel } from './TransactionFilterPanel';
import { TransactionTable } from './TransactionTable';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Plus, Zap } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const {
    openAddModal,
    openQuickAdd,
    isLoading,
    filteredTransactions,
  } = useFinance();

  if (isLoading) {
    return <LoadingSkeleton type="transactions" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Transactions"
        description="All the money you’ve spent and received."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              icon={<Zap className="h-4 w-4" />}
              onClick={openQuickAdd}
            >
              Quick bar
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="h-4 w-4" />}
              onClick={openAddModal}
            >
              Add transaction
            </Button>
          </div>
        }
      />

      {/* Filter Ribbon */}
      <TransactionFilterPanel />

      <p className="text-sm text-[#6B7280]" aria-live="polite">
        {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
      </p>

      {/* Main Table / Cards View */}
      <TransactionTable />
    </div>
  );
};
