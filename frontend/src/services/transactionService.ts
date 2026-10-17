import {
  Transaction,
  TransactionFilters,
  TransactionCategory,
  TransactionType,
  RecurrenceFrequency,
} from '../types/finance';
import { initialMockTransactions } from '../data/mock/mockTransactions';
import { generateTransactionId } from '../utils/formatters';

const LEGACY_KEY = 'fintrack_transactions_v1';

function storageKey(userId?: string | null): string {
  return userId ? `fintrack_transactions_${userId}` : LEGACY_KEY;
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function addRecurrence(date: Date, frequency: RecurrenceFrequency): Date {
  const next = new Date(date);
  if (frequency === 'weekly') {
    next.setDate(next.getDate() + 7);
    return next;
  }

  const targetDay = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + 1);
  const lastDayOfTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(targetDay, lastDayOfTargetMonth));
  return next;
}

function cloneTransactionForRecurrence(source: Transaction, date: string): Transaction {
  const now = new Date().toISOString();
  return {
    ...source,
    id: generateTransactionId(date),
    date,
    createdAt: now,
    updatedAt: now,
    recurrence: undefined,
    recurrenceId: source.recurrence?.id,
  };
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
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }

      if (this.activeUserId) {
        const seeded = initialMockTransactions.map((t) => ({ ...t }));
        this.saveTransactions(seeded);
        return seeded;
      }
    } catch {
      // Fallback to seeded data.
    }
    return [...initialMockTransactions];
  }

  private static saveTransactions(txns: Transaction[]): void {
    try {
      localStorage.setItem(storageKey(this.activeUserId), JSON.stringify(txns));
    } catch {
      // Ignore storage failures; the UI still retains the in-memory result.
    }
  }

  private static materializeRecurringTransactions(transactions: Transaction[]): Transaction[] {
    const today = parseDateOnly(formatDateOnly(new Date()));
    let changed = false;
    const nextTransactions = [...transactions];

    for (const source of transactions) {
      if (source.type !== 'expense' || !source.recurrence) continue;

      const endDate = parseDateOnly(source.recurrence.endDate);
      const startDate = parseDateOnly(source.date);
      if (endDate < startDate) continue;

      const generatedDates = new Set(
        transactions
          .filter((transaction) => transaction.recurrenceId === source.recurrence?.id)
          .map((transaction) => transaction.date)
      );

      let cursor = source.recurrence.generatedThrough
        ? parseDateOnly(source.recurrence.generatedThrough)
        : startDate;

      while (true) {
        const nextDate = addRecurrence(cursor, source.recurrence.frequency);
        if (nextDate > today || nextDate > endDate) break;

        const nextDateString = formatDateOnly(nextDate);
        if (!generatedDates.has(nextDateString)) {
          nextTransactions.push(cloneTransactionForRecurrence(source, nextDateString));
          generatedDates.add(nextDateString);
          changed = true;
        }

        cursor = nextDate;
      }

      const generatedThrough = cursor < today && cursor < endDate ? formatDateOnly(cursor) : formatDateOnly(cursor);
      if (source.recurrence.generatedThrough !== generatedThrough) {
        const sourceIndex = nextTransactions.findIndex((transaction) => transaction.id === source.id);
        if (sourceIndex !== -1) {
          nextTransactions[sourceIndex] = {
            ...nextTransactions[sourceIndex],
            recurrence: {
              ...source.recurrence,
              generatedThrough,
            },
            updatedAt: new Date().toISOString(),
          };
          changed = true;
        }
      }
    }

    if (changed) this.saveTransactions(nextTransactions);
    return nextTransactions;
  }

  public static getAll(): Transaction[] {
    return this.materializeRecurringTransactions(this.loadTransactions());
  }

  public static getById(id: string): Transaction | undefined {
    return this.getAll().find((t) => t.id === id);
  }

  public static create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Transaction {
    const list = this.getAll();
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
    const list = this.getAll();
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
    const list = this.getAll();
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
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchId = t.id.toLowerCase().includes(query);
        const matchCat = t.category.toLowerCase().includes(query);
        const matchNote = t.notes ? t.notes.toLowerCase().includes(query) : false;
        if (!matchDesc && !matchId && !matchCat && !matchNote) return false;
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
          if (txnDate.getFullYear() !== now.getFullYear() || txnDate.getMonth() !== now.getMonth()) return false;
        } else if (filters.dateRange === 'last_month') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          if (txnDate.getFullYear() !== lastMonthYear || txnDate.getMonth() !== lastMonth) return false;
        } else if (filters.dateRange === 'custom') {
          if (filters.startDate && t.date < filters.startDate) return false;
          if (filters.endDate && t.date > filters.endDate) return false;
        }
      }

      if (filters.minAmount !== undefined && t.amount < filters.minAmount) return false;
      if (filters.maxAmount !== undefined && t.amount > filters.maxAmount) return false;

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
      lower.includes('earned') ||
      lower.includes('got paid') ||
      lower.includes('got ') ||
      lower.includes('deposit') ||
      lower.includes('cashback') ||
      lower.includes('refund');
    const type: TransactionType =
      isIncome ||
      /\b(received|credited|earned|got|deposit|cashback|refund|salary)\b/i.test(lower)
        ? 'income'
        : 'expense';

    let amount = 0;
    const amountMatch = raw.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    if (amountMatch) {
      const cleanNum = amountMatch[1].replace(/,/g, '');
      const parsed = parseFloat(cleanNum);
      if (!isNaN(parsed) && parsed > 0) amount = parsed;
    }

    const today = new Date();
    let targetDate = today;

    if (lower.includes('today')) {
      targetDate = new Date(today);
    } else if (lower.includes('day before yesterday')) {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() - 2);
    } else if (lower.includes('yesterday')) {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() - 1);
    }

    const dateStr = targetDate.toISOString().split('T')[0];

    let category: TransactionCategory = isIncome ? 'Salary' : 'Food';

    if (isIncome) {
      if (lower.includes('freelance') || lower.includes('project') || lower.includes('client')) {
        category = 'Freelance';
      } else if (lower.includes('dividend') || lower.includes('stock') || lower.includes('interest')) {
        category = 'Investments';
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
    if (lower.startsWith('spent')) description = raw.replace(/^spent\s+/i, '');
    if (description.length > 0) description = description.charAt(0).toUpperCase() + description.slice(1);
    if (!description || description.trim().length === 0) description = `${category} ${type === 'income' ? 'Income' : 'Expense'}`;

    return { amount, category, type, date: dateStr, description };
  }
}
