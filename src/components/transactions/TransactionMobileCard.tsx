import React from 'react';
import { Transaction } from '../../types/finance';
import { formatIndianCurrency, formatDateDisplay } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { Pencil, Trash2, Repeat2 } from 'lucide-react';

interface TransactionMobileCardProps {
  transaction: Transaction;
  onView: (t: Transaction) => void;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export const TransactionMobileCard: React.FC<TransactionMobileCardProps> = ({
  transaction,
  onView,
  onEdit,
  onDelete,
}) => {
  const isExpense = transaction.type === 'expense';

  return (
    <article className="p-4 sm:px-5 transition-colors hover:bg-[#F7F8F6]/60">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onView(transaction)}
          aria-label={`View ${transaction.type === 'expense' ? 'spent' : 'received'} ${formatIndianCurrency(transaction.amount)} for ${transaction.description}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#0B5D3B]">
            {getCategoryIcon(transaction.category)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#111111]">
              {transaction.description}
            </span>
            <span className="mt-1 block truncate text-xs text-[#6B7280]">
              {transaction.category} <span aria-hidden="true">·</span> {formatDateDisplay(transaction.date)}
              {transaction.recurrence || transaction.recurrenceId ? (
                <span className="ml-2 inline-flex items-center gap-1 text-[#0B5D3B]">
                  <Repeat2 className="inline h-3 w-3" />Recurring
                </span>
              ) : null}
            </span>
            <span className="mt-1 block truncate font-mono text-[10px] font-medium tracking-wide text-[#9CA3AF]">
              Transaction ID: {transaction.id}
            </span>
          </span>
        </button>
        <div className="shrink-0 text-right">
          <span
            className={`text-sm font-bold tabular-nums block ${
              isExpense ? 'text-[#C84A4A]' : 'text-[#16845B]'
            }`}
          >
            {isExpense ? '-' : '+'}
            {formatIndianCurrency(transaction.amount)}
          </span>
          <span className="text-[11px] text-[#6B7280]">{isExpense ? 'Spent' : 'Received'}</span>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${transaction.description}`}
            title="Edit transaction"
            className="rounded-md p-2 text-[#6B7280] hover:bg-[#F7F8F6] hover:text-[#0B5D3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${transaction.description}`}
            title="Delete transaction"
            className="rounded-md p-2 text-[#6B7280] hover:bg-[#C84A4A]/5 hover:text-[#C84A4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
      </div>
    </article>
  );
};
