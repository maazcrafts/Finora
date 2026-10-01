import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MonthlyBudget, CategoryBudget, TransactionCategory } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';

interface CreateEditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCategories: TransactionCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Other',
];

export const CreateEditBudgetModal: React.FC<CreateEditBudgetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { budget, updateBudget } = useFinance();

  const [totalBudgetStr, setTotalBudgetStr] = useState<string>('20000');
  const [categoryLimits, setCategoryLimits] = useState<Record<string, string>>({});
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTotalBudgetStr(budget.totalBudget.toString());
      setShowCategoryBudgets(budget.categoryBudgets.length > 0);

      const limits: Record<string, string> = {};
      defaultCategories.forEach((cat) => {
        const found = budget.categoryBudgets.find((c) => c.category === cat);
        limits[cat] = found ? found.limit.toString() : '';
      });
      setCategoryLimits(limits);
    }
  }, [isOpen, budget]);

  const parsedTotal = parseFloat(totalBudgetStr) || 0;

  const handleCategoryChange = (cat: string, value: string) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [cat]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryBudgets: CategoryBudget[] = defaultCategories.map((cat) => {
      const existing = budget.categoryBudgets.find((c) => c.category === cat);
      const limit = parseFloat(categoryLimits[cat]) || 0;
      return {
        category: cat,
        limit,
        spent: existing ? existing.spent : 0,
      };
    }).filter((categoryBudget) => categoryBudget.limit > 0);

    const updated: MonthlyBudget = {
      ...budget,
      totalBudget: parsedTotal,
      categoryBudgets,
      updatedAt: new Date().toISOString(),
    };

    updateBudget(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan Monthly Budget"
      description="Set a monthly spending limit. Category limits are optional."
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-5">
        <Input
          label="Your monthly budget"
          type="number"
          min="0"
          step="any"
          prefixElement={<span className="text-xl font-medium">₹</span>}
          value={totalBudgetStr}
          onChange={(e) => setTotalBudgetStr(e.target.value)}
          placeholder="0"
          required
          className="py-3 text-2xl font-semibold tabular-nums"
        />

        <div>
          <button
            type="button"
            aria-expanded={showCategoryBudgets}
            onClick={() => setShowCategoryBudgets((shown) => !shown)}
            className="text-sm font-semibold text-[#0B5D3B] hover:underline"
          >
            {showCategoryBudgets ? 'Hide category limits' : 'Add category limits (optional)'}
          </button>
          {showCategoryBudgets && (
            <div className="mt-4 space-y-3 border-t border-[#E5E7EB] pt-4">
              {defaultCategories.map((cat) => (
                <div key={cat} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#111111]">{cat}</span>
                  <div className="w-36">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      prefixElement={<span className="text-sm">₹</span>}
                      value={categoryLimits[cat] || ''}
                      onChange={(e) => handleCategoryChange(cat, e.target.value)}
                      placeholder="No limit"
                      aria-label={`${cat} monthly limit`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save budget
          </Button>
        </div>
      </form>
    </Modal>
  );
};
