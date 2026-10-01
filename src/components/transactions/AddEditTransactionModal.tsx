import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Transaction, TransactionCategory, TransactionType } from '../../types/finance';

interface AddEditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  transaction?: Transaction | null;
}

const expenseCategories: TransactionCategory[] = [
  'Food',
  'Transport',
  'Housing',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Subscriptions',
  'Other',
];

const incomeCategories: TransactionCategory[] = [
  'Salary',
  'Freelance',
  'Investments',
  'Other',
];

const commonExpenseCategories: { value: TransactionCategory; label: string }[] = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Bills & Utilities', label: 'Bills' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Healthcare', label: 'Health' },
  { value: 'Education', label: 'Education' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Other', label: 'Other' },
];

function getTodayDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function currentCategoriesFor(type: TransactionType): { value: TransactionCategory; label: string }[] {
  return type === 'expense'
    ? commonExpenseCategories
    : incomeCategories.map((value) => ({ value, label: value }));
}

export const AddEditTransactionModal: React.FC<AddEditTransactionModalProps> = ({
  isOpen,
  onClose,
  mode,
  transaction,
}) => {
  const { addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDate(transaction.date);
      setDescription(transaction.description);
      setNotes(transaction.notes || '');
      setShowNotes(Boolean(transaction.notes));
      setShowMoreCategories(!currentCategoriesFor(transaction.type).some((item) => item.value === transaction.category));
    } else {
      setType('expense');
      setAmount('');
      setCategory('Food');
      setDate(getTodayDate());
      setDescription('');
      setNotes('');
      setShowNotes(false);
      setShowMoreCategories(false);
    }

    setErrors({});
  }, [mode, transaction, isOpen]);

  // When type changes, adjust default category if needed
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && !incomeCategories.includes(category)) {
      setCategory('Salary');
    } else if (newType === 'expense' && !expenseCategories.includes(category)) {
      setCategory('Food');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please say what this was for.';
    }
    if (!date) {
      newErrors.date = 'Please select a transaction date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);

    if (mode === 'edit' && transaction) {
      updateTransaction(transaction.id, {
        type,
        amount: parsedAmount,
        category,
        date,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });
    } else {
      addTransaction({
        type,
        amount: parsedAmount,
        category,
        date,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });
    }
    onClose();
  };

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
      description={mode === 'edit' ? 'Update the details below.' : undefined}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-[#111111]">What happened?</legend>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Transaction type">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            aria-pressed={type === 'expense'}
            className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
              type === 'expense'
                ? 'border-[#0B5D3B] bg-[#0B5D3B]/5 text-[#0B5D3B]'
                : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F7F8F6]'
            }`}
          >
            I spent money
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            aria-pressed={type === 'income'}
            className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors ${
              type === 'income'
                ? 'border-[#0B5D3B] bg-[#0B5D3B]/5 text-[#0B5D3B]'
                : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F7F8F6]'
            }`}
          >
            I received money
          </button>
          </div>
        </fieldset>

        <div>
          <Input
            label="How much?"
            type="number"
            step="any"
            min="0.01"
            placeholder="0.00"
            prefixElement={<span className="text-xl font-medium">₹</span>}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
            autoFocus
            className="py-3 text-2xl font-semibold tabular-nums"
          />
        </div>

        <div>
          <Input
            label="What was it for?"
            placeholder="e.g. Lunch"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
          />
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-[#111111]">Choose a category</legend>
          <div className="flex flex-wrap gap-2">
            {currentCategoriesFor(type).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={category === item.value}
                  onClick={() => setCategory(item.value)}
                  className={`min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors ${
                    category === item.value
                      ? 'border-[#0B5D3B] bg-[#0B5D3B]/5 text-[#0B5D3B]'
                      : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F7F8F6]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            {showMoreCategories && (
              <Select
                label="More categories"
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                options={currentCategories.map((value) => ({ value, label: value }))}
                className="min-h-10"
              />
            )}
            <button
              type="button"
              onClick={() => setShowMoreCategories((shown) => !shown)}
              className="min-h-10 px-2 text-sm font-medium text-[#0B5D3B] hover:underline"
            >
              {showMoreCategories ? 'Fewer categories' : 'More'}
            </button>
          </div>
        </fieldset>

        <Input
          label="When?"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />

        <div>
          <button
            type="button"
            onClick={() => {
              setShowNotes((shown) => {
                if (shown) setNotes('');
                return !shown;
              });
            }}
            className="text-sm font-medium text-[#0B5D3B] hover:underline"
          >
            {showNotes ? 'Remove note' : 'Add a note'}
          </button>
        </div>
        {(showNotes || notes) && (
          <textarea
            aria-label="Optional note"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else to remember?"
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
          />
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {mode === 'edit' ? 'Save changes' : 'Save transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
