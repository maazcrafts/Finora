import { Transaction, TransactionFilters, TransactionCategory, TransactionType } from '../types/finance';
import { initialMockTransactions } from '../data/mock/mockTransactions';
import { generateTransactionId } from '../utils/formatters';

const LEGACY_KEY = 'fintrack_transactions_v1';

function storageKey(userId?: string | null): string {
  return userId ? `fintrack_transactions_${userId}` : LEGACY_KEY;
}

export class TransactionService {
  private static activeUserId: string | null = null;

  public static setUserId(userId: string | null): void {
    this.activeUserId = userId;
  }

  private static loadTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(storageKey(this.activeUserId));
      if (stored) {
        return JSON.parse(stored);
      }
      // First visit for this user: seed mock data scoped to their UID
      if (this.activeUserId) {
        const seeded = initialMockTransactions.map((t) => ({ ...t }));
        this.saveTransactions(seeded);
        return seeded;
      }
    } catch {
      // Fallback
    }
    return [...initialMockTransactions];
  }

  private static saveTransactions(txns: Transaction[]): void {
    try {
      localStorage.setItem(storageKey(this.activeUserId), JSON.stringify(txns));
    } catch {
      // Fallback if storage fails
    }
  }

  public static getAll(): Transaction[] {
    return this.loadTransactions();
  }

  public static getById(id: string): Transaction | undefined {
    return this.loadTransactions().find((t) => t.id === id);
  }

  public static create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Transaction {
    const list = this.loadTransactions();
    const now = new Date().toISOString();
    const newTxn: Transaction = {
      ...data,
      id: generateTransactionId(data.date),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newTxn, ...list];
    this.saveTransactions(updated);
    return newTxn;
  }

  public static update(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ): Transaction | null {
    const list = this.loadTransactions();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedTxn: Transaction = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updatedTxn;
    this.saveTransactions(list);
    return updatedTxn;
  }

  public static delete(id: string): boolean {
    const list = this.loadTransactions();
    const filtered = list.filter((t) => t.id !== id);
    if (filtered.length === list.length) return false;
    this.saveTransactions(filtered);
    return true;
  }

  public static resetToDefault(): Transaction[] {
    const seeded = initialMockTransactions.map((t) => ({ ...t }));
    this.saveTransactions(seeded);
    return seeded;
  }

  public static clearUserCache(): void {
    if (!this.activeUserId) return;
    try {
      localStorage.removeItem(storageKey(this.activeUserId));
    } catch {
      // ignore
    }
  }

  public static getFinancialSummary(transactions: Transaction[]) {
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
      }
    }

    const currentBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      transactionCount: transactions.length,
    };
  }

  public static filterTransactions(
    transactions: Transaction[],
    filters: TransactionFilters
  ): Transaction[] {
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) {
        return false;
      }

      if (filters.category !== 'all' && t.category !== filters.category) {
        return false;
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchId = t.id.toLowerCase().includes(query);
        const matchCat = t.category.toLowerCase().includes(query);
        const matchNote = t.notes ? t.notes.toLowerCase().includes(query) : false;
        if (!matchDesc && !matchId && !matchCat && !matchNote) {
          return false;
        }
      }

      if (filters.dateRange !== 'all') {
        const txnDate = new Date(t.date);
        const now = new Date();

        if (filters.dateRange === 'today') {
          const isToday =
            txnDate.getFullYear() === now.getFullYear() &&
            txnDate.getMonth() === now.getMonth() &&
            txnDate.getDate() === now.getDate();
          if (!isToday) return false;
        } else if (filters.dateRange === 'this_week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          if (txnDate < weekAgo) return false;
        } else if (filters.dateRange === 'this_month') {
          if (
            txnDate.getFullYear() !== now.getFullYear() ||
            txnDate.getMonth() !== now.getMonth()
          ) {
            return false;
          }
        } else if (filters.dateRange === 'last_month') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          if (
            txnDate.getFullYear() !== lastMonthYear ||
            txnDate.getMonth() !== lastMonth
          ) {
            return false;
          }
        } else if (filters.dateRange === 'custom') {
          if (filters.startDate && t.date < filters.startDate) return false;
          if (filters.endDate && t.date > filters.endDate) return false;
        }
      }

      if (filters.minAmount !== undefined && t.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) {
        return false;
      }

      return true;
    });
  }

  public static quickParseTransaction(input: string): {
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
    date: string;
    description: string;
  } {
    const raw = input.trim();
    const lower = raw.toLowerCase();

    const isIncome =
      lower.includes('salary') ||
      lower.includes('income') ||
      lower.includes('credited') ||
      lower.includes('freelance') ||
      lower.includes('received') ||
      lower.includes('earned');
    const type: TransactionType = isIncome ? 'income' : 'expense';

    let amount = 0;
    const amountMatch = raw.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    if (amountMatch) {
      const cleanNum = amountMatch[1].replace(/,/g, '');
      const parsed = parseFloat(cleanNum);
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
      }
    }

    const today = new Date();
    let targetDate = today;

    if (lower.includes('yesterday')) {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() - 1);
    } else if (lower.includes('day before yesterday')) {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() - 2);
    }

    const dateStr = targetDate.toISOString().split('T')[0];

    let category: TransactionCategory = isIncome ? 'Salary' : 'Food';

    if (isIncome) {
      if (lower.includes('freelance') || lower.includes('project') || lower.includes('client')) {
        category = 'Freelance';
      } else if (lower.includes('dividend') || lower.includes('stock') || lower.includes('interest')) {
        category = 'Investments';
      } else {
        category = 'Salary';
      }
    } else {
      if (lower.includes('uber') || lower.includes('ola') || lower.includes('metro') || lower.includes('fuel') || lower.includes('petrol') || lower.includes('cab') || lower.includes('auto') || lower.includes('transport')) {
        category = 'Transport';
      } else if (lower.includes('rent') || lower.includes('maintenance') || lower.includes('house') || lower.includes('flat')) {
        category = 'Housing';
      } else if (lower.includes('zara') || lower.includes('clothes') || lower.includes('amazon') || lower.includes('myntra') || lower.includes('shopping')) {
        category = 'Shopping';
      } else if (lower.includes('electricity') || lower.includes('bescom') || lower.includes('wifi') || lower.includes('airtel') || lower.includes('water') || lower.includes('bill')) {
        category = 'Bills & Utilities';
      } else if (lower.includes('movie') || lower.includes('concert') || lower.includes('bookmyshow') || lower.includes('game') || lower.includes('entertainment')) {
        category = 'Entertainment';
      } else if (lower.includes('doctor') || lower.includes('medicine') || lower.includes('hospital') || lower.includes('pharmacy') || lower.includes('gym')) {
        category = 'Healthcare';
      } else if (lower.includes('course') || lower.includes('book') || lower.includes('tuition') || lower.includes('education')) {
        category = 'Education';
      } else if (lower.includes('flight') || lower.includes('hotel') || lower.includes('trip') || lower.includes('travel')) {
        category = 'Travel';
      } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('prime') || lower.includes('youtube') || lower.includes('subscription')) {
        category = 'Subscriptions';
      } else if (lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast') || lower.includes('coffee') || lower.includes('swiggy') || lower.includes('zomato') || lower.includes('groceries')) {
        category = 'Food';
      }
    }

    let description = raw;
    if (lower.startsWith('spent')) {
      description = raw.replace(/^spent\s+/i, '');
    }
    if (description.length > 0) {
      description = description.charAt(0).toUpperCase() + description.slice(1);
    }
    if (!description || description.trim().length === 0) {
      description = `${category} ${type === 'income' ? 'Income' : 'Expense'}`;
    }

    return {
      amount,
      category,
      type,
      date: dateStr,
      description,
    };
  }
}
