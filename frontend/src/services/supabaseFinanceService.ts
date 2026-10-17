import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  MonthlyBudget,
  NotificationItem,
  Transaction,
  UserProfile,
} from '../types/finance';

export interface SupabaseFinanceSnapshot {
  transactions: Transaction[];
  budget: MonthlyBudget | null;
  notifications: NotificationItem[];
  profile: UserProfile | null;
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function transactionToRow(userId: string, t: Transaction) {
  return {
    id: t.id,
    user_id: userId,
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date,
    description: t.description,
    notes: t.notes ?? null,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
    recurrence: t.recurrence ?? null,
    recurrence_id: t.recurrenceId ?? null,
  };
}

function rowToTransaction(row: any): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
    description: row.description,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    recurrence: row.recurrence ?? undefined,
    recurrenceId: row.recurrence_id ?? undefined,
  };
}

export class SupabaseFinanceService {
  static isConfigured(): boolean {
    return isSupabaseConfigured && Boolean(supabase);
  }

  static async loadUser(userId: string): Promise<SupabaseFinanceSnapshot | null> {
    if (!this.isConfigured()) return null;
    const client = requireClient();

    const [transactions, budget, notifications, profile] = await Promise.all([
      client.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      client.from('budgets').select('budget').eq('user_id', userId).maybeSingle(),
      client.from('notifications').select('*').eq('user_id', userId).order('id', { ascending: false }),
      client.from('user_profiles').select('profile').eq('user_id', userId).maybeSingle(),
    ]);

    const error = transactions.error || budget.error || notifications.error || profile.error;
    if (error) throw error;

    return {
      transactions: (transactions.data ?? []).map(rowToTransaction),
      budget: (budget.data?.budget as MonthlyBudget | undefined) ?? null,
      notifications: (notifications.data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        timestamp: row.timestamp,
        read: row.read,
        actionUrl: row.action_url ?? undefined,
      })),
      profile: (profile.data?.profile as UserProfile | undefined) ?? null,
    };
  }

  static async upsertTransaction(userId: string, transaction: Transaction): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient().from('transactions').upsert(transactionToRow(userId, transaction));
    if (error) throw error;
  }

  static async deleteTransaction(userId: string, id: string): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient().from('transactions').delete().eq('user_id', userId).eq('id', id);
    if (error) throw error;
  }

  static async upsertBudget(userId: string, budget: MonthlyBudget): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient().from('budgets').upsert({
      user_id: userId,
      budget,
      updated_at: budget.updatedAt,
    });
    if (error) throw error;
  }

  static async upsertNotification(userId: string, notification: NotificationItem): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient().from('notifications').upsert({
      id: notification.id,
      user_id: userId,
      title: notification.title,
      description: notification.description,
      type: notification.type,
      timestamp: notification.timestamp,
      read: notification.read,
      action_url: notification.actionUrl ?? null,
    });
    if (error) throw error;
  }

  static async updateNotificationRead(userId: string, id: string, read: boolean): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient()
      .from('notifications')
      .update({ read })
      .eq('user_id', userId)
      .eq('id', id);
    if (error) throw error;
  }

  static async upsertProfile(userId: string, profile: UserProfile): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await requireClient().from('user_profiles').upsert({
      user_id: userId,
      profile,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
}
