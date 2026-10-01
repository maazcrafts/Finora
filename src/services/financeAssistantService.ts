import { Transaction } from '../types/finance';

export interface FinanceChatContext {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  budget: number;
  budgetSpent: number;
  budgetRemaining: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  recentTransactions: Array<{
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askFinanceAssistant(
  messages: ChatMessage[],
  context: FinanceChatContext
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to reach the financial assistant.');
  }

  return String(data.answer || '');
}

export function buildFinanceChatContext(
  transactions: Transaction[],
  budget: { totalBudget: number }
): FinanceChatContext {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = new Map<string, number>();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => categories.set(t.category, (categories.get(t.category) ?? 0) + t.amount));

  const topCategories = [...categories.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 12)
    .map((t) => ({
      date: t.date,
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description,
    }));

  const budgetSpent = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    balance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    transactionCount: transactions.length,
    budget: budget.totalBudget,
    budgetSpent,
    budgetRemaining: Math.max(0, budget.totalBudget - budgetSpent),
    topCategories,
    recentTransactions,
  };
}
