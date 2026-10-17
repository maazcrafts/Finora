import { NotificationItem } from '../types/finance';
import { initialMockNotifications } from '../data/mock/mockNotifications';

const LEGACY_KEY = 'fintrack_notifications_v1';

function storageKey(userId?: string | null): string {
  return userId ? `fintrack_notifications_${userId}` : LEGACY_KEY;
}

export class NotificationService {
  private static activeUserId: string | null = null;

  public static setUserId(userId: string | null): void {
    this.activeUserId = userId;
  }

  private static loadNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(storageKey(this.activeUserId));
      if (stored) {
        return JSON.parse(stored);
      }
      if (this.activeUserId) {
        const seeded = initialMockNotifications.map((n) => ({ ...n }));
        this.saveNotifications(seeded);
        return seeded;
      }
    } catch {
      // Fallback
    }
    return [...initialMockNotifications];
  }

  private static saveNotifications(items: NotificationItem[]): void {
    try {
      localStorage.setItem(storageKey(this.activeUserId), JSON.stringify(items));
    } catch {
      // Fallback
    }
  }

  public static getAll(): NotificationItem[] {
    return this.loadNotifications();
  }

  public static markAsRead(id: string): NotificationItem[] {
    const list = this.loadNotifications();
    const updated = list.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    this.saveNotifications(updated);
    return updated;
  }

  public static markAllAsRead(): NotificationItem[] {
    const list = this.loadNotifications();
    const updated = list.map((item) => ({ ...item, read: true }));
    this.saveNotifications(updated);
    return updated;
  }

  public static addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.loadNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    const updated = [newItem, ...list];
    this.saveNotifications(updated);
    return newItem;
  }
}
