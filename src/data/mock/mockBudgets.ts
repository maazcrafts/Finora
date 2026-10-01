import { MonthlyBudget } from '../../types/finance';

export const initialMockBudget: MonthlyBudget = {
  id: 'bgt-202610',
  month: 'October 2026',
  year: 2026,
  monthIndex: 9,
  totalBudget: 20000,
  projectedSpending: 18700,
  daysRemaining: 9,
  updatedAt: '2026-10-01T08:00:00Z',
  categoryBudgets: [
    {
      category: 'Food',
      limit: 5000,
      spent: 4850,
    },
    {
      category: 'Transport',
      limit: 3000,
      spent: 2300,
    },
    {
      category: 'Shopping',
      limit: 3000,
      spent: 2100,
    },
    {
      category: 'Bills & Utilities',
      limit: 3500,
      spent: 3200,
    },
    {
      category: 'Entertainment',
      limit: 2500,
      spent: 2800, // 112% - over budget!
    },
    {
      category: 'Healthcare',
      limit: 2000,
      spent: 800,
    },
    {
      category: 'Other',
      limit: 1000,
      spent: 400,
    },
  ],
};
