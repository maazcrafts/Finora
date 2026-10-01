import { UserProfile } from '../../types/finance';

export const initialMockUser: UserProfile = {
  id: 'usr_alex_01',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  userType: 'Professional',
  monthlyIncomeRange: '₹40,000 - ₹75,000',
  primaryGoal: 'Control expenses & build budget',
  currency: 'INR (₹)',
  dateFormat: 'DD MMM YYYY',
  defaultCategory: 'Food',
  notificationsEnabled: {
    budgetAlerts: true,
    spendingInsights: true,
    monthlySummary: true,
  },
};
