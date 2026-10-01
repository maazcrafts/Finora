export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Subscriptions'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Other';

export type RecurrenceFrequency = 'weekly' | 'monthly';

export interface RecurrenceRule {
  id: string;
  frequency: RecurrenceFrequency;
  endDate: string;
}

export interface Transaction {
  id: string; // TXN-YYYYMMDD-XXXXX
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // ISO YYYY-MM-DD
  description: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  recurrence?: RecurrenceRule;
}

export interface CategoryBudget {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface MonthlyBudget {
  id: string;
  month: string; // e.g. "October 2026"
  year: number;
  monthIndex: number; // 0-11
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
  projectedSpending?: number;
  daysRemaining?: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string; // Firebase UID when authenticated
  name: string;
  email: string;
  photoURL?: string | null;
  phoneNumber?: string | null;
  authProvider?: 'password' | 'google.com' | 'phone' | 'unknown';
  userType?: 'Student' | 'Professional' | 'Freelancer' | 'Business owner' | 'Other';
  monthlyIncomeRange?: string;
  primaryGoal?: string;
  currency: string;
  dateFormat: string;
  defaultCategory: TransactionCategory;
  notificationsEnabled: {
    budgetAlerts: boolean;
    spendingInsights: boolean;
    monthlySummary: boolean;
  };
}

export type InsightType = 'trend' | 'alert' | 'positive' | 'neutral';

export interface FinancialInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionText?: string;
  actionCategory?: TransactionCategory;
  statChange?: string;
  metricComparison?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'budget' | 'insight' | 'transaction' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface TransactionFilters {
  searchQuery: string;
  type: 'all' | 'income' | 'expense';
  category: string; // 'all' or specific
  dateRange: 'all' | 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}
