import { NotificationItem } from '../../types/finance';

export const initialMockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'budget',
    title: 'Budget Alert',
    description: "You've used 97% of your Food budget (₹4,850 of ₹5,000).",
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: 'budget',
  },
  {
    id: 'notif_2',
    type: 'insight',
    title: 'Spending Insight',
    description: 'Food spending is 18% higher than last month at this point.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: 'insights',
  },
  {
    id: 'notif_3',
    type: 'transaction',
    title: 'Transaction Recorded',
    description: 'Expense of ₹450 recorded for Swiggy Lunch Order.',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: 'transactions',
  },
  {
    id: 'notif_4',
    type: 'system',
    title: 'System Notification',
    description: 'Your monthly budget for October 2026 was updated.',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: 'budget',
  },
];
