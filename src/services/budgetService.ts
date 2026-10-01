import { MonthlyBudget, Transaction, CategoryBudget } from '../types/finance';
import { initialMockBudget } from '../data/mock/mockBudgets';

const LEGACY_KEY = 'fintrack_budget_v1';

function storageKey(userId?: string | null): string {
  return userId ? `fintrack_budget_${userId}` : LEGACY_KEY;
}

export class BudgetService {
  private static activeUserId: string | null = null;

  public static setUserId(userId: string | null): void {
    this.activeUserId = userId;
  }

  private static loadBudget(): MonthlyBudget {
    try {
      const stored = localStorage.getItem(storageKey(this.activeUserId));
      if (stored) {
        return JSON.parse(stored);
      }
      if (this.activeUserId) {
        const seeded = { ...initialMockBudget, categoryBudgets: initialMockBudget.categoryBudgets.map((c) => ({ ...c })) };
        this.saveBudget(seeded);
        return seeded;
      }
    } catch {
      // Fallback
    }
    return {
      ...initialMockBudget,
      categoryBudgets: initialMockBudget.categoryBudgets.map((c) => ({ ...c })),
    };
  }

  private static saveBudget(budget: MonthlyBudget): void {
    try {
      localStorage.setItem(storageKey(this.activeUserId), JSON.stringify(budget));
    } catch {
      // Fallback
    }
  }

  public static getBudget(): MonthlyBudget {
    return this.loadBudget();
  }

  public static updateBudget(budget: MonthlyBudget): MonthlyBudget {
    const updated = {
      ...budget,
      updatedAt: new Date().toISOString(),
    };
    this.saveBudget(updated);
    return updated;
  }

  public static recalculateFromTransactions(
    budget: MonthlyBudget,
    transactions: Transaction[]
  ): MonthlyBudget {
    const categoryTotals: Record<string, number> = {};
    let totalSpent = 0;
    const monthKey = `${budget.year}-${String(budget.monthIndex + 1).padStart(2, '0')}`;

    for (const t of transactions) {
      if (t.type === 'expense' && t.date.startsWith(monthKey)) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalSpent += t.amount;
      }
    }

    const updatedCategoryBudgets: CategoryBudget[] = budget.categoryBudgets.map(
      (cat) => ({
        ...cat,
        spent: categoryTotals[cat.category] || 0,
      })
    );

    const now = new Date();
    const daysInMonth = new Date(budget.year, budget.monthIndex + 1, 0).getDate();
    const isCurrentMonth =
      now.getFullYear() === budget.year && now.getMonth() === budget.monthIndex;
    const currentDay = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    const dailyAverage = totalSpent / currentDay;
    const projected = Math.round(dailyAverage * daysInMonth);

    const updated: MonthlyBudget = {
      ...budget,
      categoryBudgets: updatedCategoryBudgets,
      projectedSpending: projected,
      daysRemaining: isCurrentMonth ? Math.max(0, daysInMonth - currentDay) : 0,
      updatedAt: new Date().toISOString(),
    };

    this.saveBudget(updated);
    return updated;
  }
}
