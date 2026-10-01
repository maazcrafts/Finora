import React from 'react';
import { useFinance, NavigationPage } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    activePage,
    setActivePage,
    handleLogout,
  } = useFinance();

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="h-4 w-4" /> },
    { id: 'budget', label: 'Budget', icon: <PieChart className="h-4 w-4" /> },
    { id: 'insights', label: 'Spending patterns', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setActivePage(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 border-r border-[#E5E7EB] bg-white flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="h-8 w-8 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            FT
          </div>
          <div>
            <span className="text-base font-bold text-[#111111] tracking-tight block leading-tight">
              FINTRACK
            </span>
            <span className="text-[11px] text-[#6B7280] block font-normal">
              Money made simple
            </span>
          </div>
        </button>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#0B5D3B]/10 text-[#0B5D3B] font-semibold'
                  : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F7F8F6]'
              }`}
            >
              <span className={isActive ? 'text-[#0B5D3B]' : 'text-[#6B7280]'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => handleNavClick('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'profile'
              ? 'bg-[#0B5D3B]/10 text-[#0B5D3B] font-semibold'
              : 'text-[#4B5563] hover:text-[#111111] hover:bg-[#F7F8F6]'
          }`}
        >
          <Settings className="h-4 w-4 text-[#6B7280]" />
          <span>Profile & settings</span>
        </button>

        <button
          onClick={() => {
            void handleLogout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#4B5563] hover:text-[#C84A4A] hover:bg-[#C84A4A]/5 transition-colors"
        >
          <LogOut className="h-4 w-4 text-[#6B7280]" />
          <span>Log out</span>
        </button>
      </nav>

    </aside>
  );
};
