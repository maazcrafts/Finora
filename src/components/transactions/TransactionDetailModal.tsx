import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Transaction } from '../../types/finance';
import { formatIndianCurrency, formatFullDate } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';
import {
  Calendar,
  Tag,
  Clock,
  FileText,
  Pencil,
  Trash2,
  CheckCircle2,
  History,
  Repeat2,
} from 'lucide-react';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { openEditModal, promptDeleteTransaction } = useFinance();

  const handleEdit = () => {
    onClose();
    openEditModal(transaction);
  };

  const handleDelete = () => {
    promptDeleteTransaction(transaction);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      description={`ID: ${transaction.id}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Main Amount Card */}
        <div className="p-5 rounded-xl bg-[#F7F8F6] border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#6B7280] block">
              {transaction.type === 'expense' ? 'Expense Deduction' : 'Income Credit'}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums block mt-1 ${
                transaction.type === 'expense' ? 'text-[#C84A4A]' : 'text-[#16845B]'
              }`}
            >
              {transaction.type === 'expense' ? '-' : '+'}
              {formatIndianCurrency(transaction.amount)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[#111111]">
              {transaction.category}
            </span>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white space-y-1">
            <span className="text-[#6B7280] flex items-center gap-1.5 font-medium">
              <FileText className="h-3.5 w-3.5" />
              <span>Description</span>
            </span>
            <p className="text-sm font-semibold text-[#111111]">
              {transaction.description}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white space-y-1">
            <span className="text-[#6B7280] flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>Transaction Date</span>
            </span>
            <p className="text-sm font-semibold text-[#111111]">
              {formatFullDate(transaction.date)}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white space-y-1">
            <span className="text-[#6B7280] flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>Created Timestamp</span>
            </span>
            <p className="text-xs font-mono tabular-nums text-[#111111]">
              {new Date(transaction.createdAt).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white space-y-1">
            <span className="text-[#6B7280] flex items-center gap-1.5 font-medium">
              <History className="h-3.5 w-3.5" />
              <span>Last Modified</span>
            </span>
            <p className="text-xs font-mono tabular-nums text-[#111111]">
              {new Date(transaction.updatedAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {(transaction.recurrence || transaction.recurrenceId) && (
          <div className="p-3.5 rounded-lg border border-[#0B5D3B]/20 bg-[#0B5D3B]/5">
            <span className="text-xs text-[#0B5D3B] flex items-center gap-1.5 font-semibold">
              <Repeat2 className="h-3.5 w-3.5" />
              Recurring expense
            </span>
            <p className="mt-1 text-xs text-[#4B5563]">
              {transaction.recurrence
                ? `Repeats ${transaction.recurrence.frequency === 'monthly' ? 'monthly' : 'weekly'} until ${formatFullDate(transaction.recurrence.endDate)}.`
                : 'This transaction was generated from a recurring expense.'}
            </p>
          </div>
        )}

        {/* Notes if present */}
        {transaction.notes && (
          <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
            <span className="text-xs text-[#6B7280] block font-medium mb-1">
              Internal Notes
            </span>
            <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
              {transaction.notes}
            </p>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider block mb-3">
            Activity History
          </span>
          <div className="relative pl-6 space-y-4 border-l border-[#E5E7EB] ml-2 text-xs">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-[#16845B] ring-4 ring-white" />
              <p className="font-medium text-[#111111]">Transaction record created</p>
              <p className="text-[11px] text-[#6B7280]">
                Logged with unique identifier {transaction.id}
              </p>
            </div>
            {transaction.updatedAt !== transaction.createdAt && (
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-[#0B5D3B] ring-4 ring-white" />
                <p className="font-medium text-[#111111]">Transaction updated</p>
                <p className="text-[11px] text-[#6B7280]">
                  Modified on {new Date(transaction.updatedAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
          <Button
            variant="danger"
            size="md"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Pencil className="h-4 w-4" />}
              onClick={handleEdit}
            >
              Edit Transaction
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
