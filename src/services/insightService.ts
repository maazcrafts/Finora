import { FinancialInsight, Transaction, MonthlyBudget } from '../types/finance';
import { initialMockInsights } from '../data/mock/mockInsights';
import { formatIndianCurrency } from '../utils/formatters';

export class InsightService {
  public static getInsights(): FinancialInsight[] {
    return [...initialMockInsights];
  }

  public static generateDynamicInsights(
    transactions: Transaction[],
    budget: MonthlyBudget
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    const expenses = transactions.filter((t) => t.type === 'expense');

    // 1. Check budget overruns
    const overBudgetCategory = budget.categoryBudgets.find((c) => c.spent > c.limit);
    if (overBudgetCategory) {
      const overAmount = overBudgetCategory.spent - overBudgetCategory.limit;
      const pct = Math.round((overBudgetCategory.spent / overBudgetCategory.limit) * 100);
      insights.push({
        id: `dyn_over_${overBudgetCategory.category}`,
        type: 'alert',
        title: `${overBudgetCategory.category} exceeded limit by ${pct - 100}%`,
        description: `You have spent ${formatIndianCurrency(overBudgetCategory.spent)} against your allocated ${formatIndianCurrency(overBudgetCategory.limit)} ceiling (${formatIndianCurrency(overAmount)} over).`,
        actionText: `Review ${overBudgetCategory.category}`,
        actionCategory: overBudgetCategory.category,
        statChange: `+${pct - 100}%`,
        metricComparison: `${formatIndianCurrency(overBudgetCategory.spent)} vs ${formatIndianCurrency(overBudgetCategory.limit)}`,
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Highest spending category
    const categoryTotals: Record<string, number> = {};
    for (const e of expenses) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      const topShare = totalExp > 0 ? Math.round((topAmount / totalExp) * 100) : 0;

      insights.push({
        id: `dyn_top_${topCategory}`,
        type: topShare > 35 ? 'alert' : 'trend',
        title: `${topCategory} accounts for ${topShare}% of all expenses`,
        description: `Total outlay of ${formatIndianCurrency(topAmount)} across ${expenses.filter((e) => e.category === topCategory).length} transactions this month.`,
        actionText: `View ${topCategory} expenses`,
        actionCategory: topCategory as any,
        statChange: `${topShare}% share`,
        metricComparison: `${formatIndianCurrency(topAmount)} total`,
        createdAt: new Date().toISOString(),
      });
    }

    // 3. Projected spending check
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const projected = budget.projectedSpending || totalSpent;
    if (projected <= budget.totalBudget) {
      const savings = budget.totalBudget - projected;
      insights.push({
        id: 'dyn_on_track',
        type: 'positive',
        title: "You're on track with your monthly budget",
        description: `At current pace, projected spending is ${formatIndianCurrency(projected)}, leaving an estimated ${formatIndianCurrency(savings)} surplus by month end.`,
        actionText: 'View monthly budget',
        statChange: 'On Track',
        metricComparison: `${formatIndianCurrency(projected)} / ${formatIndianCurrency(budget.totalBudget)}`,
        createdAt: new Date().toISOString(),
      });
    } else {
      const overage = projected - budget.totalBudget;
      insights.push({
        id: 'dyn_projected_over',
        type: 'alert',
        title: 'Projected spending exceeds monthly target',
        description: `Current daily run-rate projects total spending of ${formatIndianCurrency(projected)}, which is ${formatIndianCurrency(overage)} above the ₹${budget.totalBudget.toLocaleString()} limit.`,
        actionText: 'Optimize expenses',
        statChange: 'Over budget pace',
        metricComparison: `${formatIndianCurrency(projected)} vs ${formatIndianCurrency(budget.totalBudget)}`,
        createdAt: new Date().toISOString(),
      });
    }

    // Add baseline mock insights if count is low
    if (insights.length < 3) {
      for (const item of initialMockInsights) {
        if (!insights.find((i) => i.id === item.id)) {
          insights.push(item);
        }
      }
    }

    return insights;
  }
}
