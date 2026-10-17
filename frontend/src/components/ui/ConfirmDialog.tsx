import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/formatters';
import { Transaction } from '../../types/finance';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  transaction?: Transaction | null;
  confirmButtonText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  transaction,
  confirmButtonText = 'Delete Transaction',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-[#C84A4A]/10 text-[#C84A4A] shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {description}
            </p>
            {transaction && (
              <div className="mt-3 p-3 rounded-lg bg-[#F7F8F6] border border-[#E5E7EB] text-xs text-[#111111] space-y-1">
                <div className="flex justify-between font-medium">
                  <span>{transaction.description}</span>
                  <span className="tabular-nums">
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatIndianCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="text-[#6B7280] flex items-center gap-1.5">
                  <span>{transaction.category}</span>
                  <span>·</span>
                  <span>{transaction.id}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
