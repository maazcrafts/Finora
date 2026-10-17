import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Transaction, TransactionCategory, TransactionType, RecurrenceFrequency } from '../../types/finance';

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
  const [date, setDate] = useState<string>(getTodayDate());
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>('monthly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>('');
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
      setIsRecurring(Boolean(transaction.recurrence));
      setRecurrenceFrequency(transaction.recurrence?.frequency ?? 'monthly');
      setRecurrenceEndDate(transaction.recurrence?.endDate ?? '');
    } else {
      setType('expense');
      setAmount('');
      setCategory('Food');
      setDate(getTodayDate());
      setDescription('');
      setNotes('');
      setShowNotes(false);
      setShowMoreCategories(false);
      setIsRecurring(false);
      setRecurrenceFrequency('monthly');
      setRecurrenceEndDate('');
    }

    setErrors({});
  }, [mode, transaction, isOpen]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && !incomeCategories.includes(category)) {
      setCategory('Salary');
    } else if (newType === 'expense' && !expenseCategories.includes(category)) {
      setCategory('Food');
    }
    if (newType === 'income') {
      setIsRecurring(false);
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
    if (isRecurring && type === 'expense') {
      if (!recurrenceEndDate) {
        newErrors.recurrenceEndDate = 'Choose when the recurring expense should stop.';
      } else if (recurrenceEndDate < date) {
        newErrors.recurrenceEndDate = 'End date must be on or after the first expense date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);
    const recurrence =
      isRecurring && type === 'expense'
        ? {
            id: transaction?.recurrence?.id ?? `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            frequency: recurrenceFrequency,
            endDate: recurrenceEndDate,
            generatedThrough: transaction?.recurrence?.generatedThrough,
          }
        : undefined;

    const data = {
      type,
      amount: parsedAmount,
      category,
      date,
      description: description.trim(),
      notes: notes.trim() || undefined,
      recurrence,
      recurrenceId: undefined,
    };

    if (mode === 'edit' && transaction) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
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

        <Input
          label="What was it for?"
          placeholder="e.g. Lunch"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          required
        />

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

        {type === 'expense' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#D1D5DB] text-[#0B5D3B] focus:ring-[#0B5D3B]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#111111]">Make this a recurring expense</span>
                <span className="mt-0.5 block text-xs text-[#6B7280]">
                  Finora will add future occurrences automatically until the end date.
                </span>
              </span>
            </label>

            {isRecurring && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Repeat"
                  value={recurrenceFrequency}
                  onChange={(e) => setRecurrenceFrequency(e.target.value as RecurrenceFrequency)}
                  options={[
                    { value: 'monthly', label: 'Every month' },
                    { value: 'weekly', label: 'Every week' },
                  ]}
                />
                <Input
                  label="Ends on"
                  type="date"
                  min={date}
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  error={errors.recurrenceEndDate}
                  required
                />
              </div>
            )}
          </div>
        )}

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
