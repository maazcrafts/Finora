import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { UserAvatar } from '../ui/UserAvatar';
import { Shield, Bell, Sliders, LogOut } from 'lucide-react';
import { TransactionCategory } from '../../types/finance';

export const ProfileSettingsView: React.FC = () => {
  const { user, updateUserProfile, handleLogout } = useFinance();

  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);
  const [dateFormat, setDateFormat] = useState(user.dateFormat);
  const [defaultCategory, setDefaultCategory] = useState<TransactionCategory>(user.defaultCategory);

  const [budgetAlerts, setBudgetAlerts] = useState(user.notificationsEnabled.budgetAlerts);
  const [spendingInsights, setSpendingInsights] = useState(user.notificationsEnabled.spendingInsights);
  const [monthlySummary, setMonthlySummary] = useState(user.notificationsEnabled.monthlySummary);

  useEffect(() => {
    setName(user.name);
    setCurrency(user.currency);
    setDateFormat(user.dateFormat);
    setDefaultCategory(user.defaultCategory);
    setBudgetAlerts(user.notificationsEnabled.budgetAlerts);
    setSpendingInsights(user.notificationsEnabled.spendingInsights);
    setMonthlySummary(user.notificationsEnabled.monthlySummary);
  }, [user]);

  const providerLabel =
    user.authProvider === 'google.com'
      ? 'Google'
      : user.authProvider === 'phone'
      ? 'Phone OTP'
      : user.authProvider === 'password'
      ? 'Email & password'
      : 'Firebase';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      currency,
      dateFormat,
      defaultCategory,
      notificationsEnabled: {
        budgetAlerts,
        spendingInsights,
        monthlySummary,
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      <PageHeader
        title="Profile & settings"
        description="Update your profile and preferences."
      />

      <form onSubmit={handleSaveProfile} className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB]/60">
          <UserAvatar name={user.name} photoURL={user.photoURL} size="lg" />
          <div>
            <h3 className="text-base font-semibold text-[#111111]">{user.name}</h3>
            <p className="text-xs text-[#6B7280]">{user.email || user.phoneNumber || 'No contact on file'}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#6B7280]">
              <span>Signed in with {providerLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={user.email || ''}
            disabled
            helperText="Managed by your sign-in provider"
          />
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]/60 space-y-4">
          <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-[#0B5D3B]" />
            <span>Preferences</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'INR (₹)', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD ($)', label: 'USD ($) - US Dollar' },
                { value: 'EUR (€)', label: 'EUR (€) - Euro' },
              ]}
            />

            <Select
              label="Date format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { value: 'DD MMM YYYY', label: '01 Oct 2026' },
                { value: 'YYYY-MM-DD', label: '2026-10-01' },
                { value: 'MM/DD/YYYY', label: '10/01/2026' },
              ]}
            />

            <Select
              label="Default category"
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value as TransactionCategory)}
              options={[
                { value: 'Food', label: 'Food & Dining' },
                { value: 'Transport', label: 'Transport' },
                { value: 'Shopping', label: 'Shopping' },
                { value: 'Bills & Utilities', label: 'Bills & Utilities' },
              ]}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]/60 space-y-3">
          <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-[#0B5D3B]" />
            <span>Notifications</span>
          </h4>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8F6]/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-[#111111] block">
                  Budget alerts
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Let me know when I’m close to my budget
                </span>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-[#0B5D3B] focus:ring-[#0B5D3B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8F6]/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-[#111111] block">
                  Spending tips
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Share useful patterns from my spending
                </span>
              </div>
              <input
                type="checkbox"
                checked={spendingInsights}
                onChange={(e) => setSpendingInsights(e.target.checked)}
                className="h-4 w-4 rounded text-[#0B5D3B] focus:ring-[#0B5D3B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8F6]/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-[#111111] block">
                  Monthly summary
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Send me a simple summary each month
                </span>
              </div>
              <input
                type="checkbox"
                checked={monthlySummary}
                onChange={(e) => setMonthlySummary(e.target.checked)}
                className="h-4 w-4 rounded text-[#0B5D3B] focus:ring-[#0B5D3B]"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </form>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs space-y-6">
        <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-[#0B5D3B]" />
          <span>Security & Sessions</span>
        </h4>

        <p className="text-xs text-[#6B7280] leading-relaxed">
          Password changes and multi-factor options are managed through Firebase Authentication.
          Use “Forgot password?” on the sign-in screen to reset an email password.
        </p>

        <div className="pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#111111] block">
              Sign Out
            </span>
            <span className="text-[11px] text-[#6B7280]">
              End this session and return to the landing page
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<LogOut className="h-3.5 w-3.5" />}
            onClick={() => {
              void handleLogout();
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};
