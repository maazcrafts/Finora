import React from 'react';
import { useFinance, NavigationPage } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  TrendingUp,
  Plus,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, openAddModal } = useFinance();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E5E7EB] z-40 px-3 flex items-center justify-around shadow-sm">
      <button
        onClick={() => setActivePage('dashboard')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-xs transition-colors ${
          activePage === 'dashboard' ? 'text-[#0B5D3B] font-semibold' : 'text-[#6B7280]'
        }`}
      >
        <LayoutDashboard className="h-4.5 w-4.5" />
        <span className="text-[10px] mt-1">Home</span>
      </button>

      <button
        onClick={() => setActivePage('transactions')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-xs transition-colors ${
          activePage === 'transactions' ? 'text-[#0B5D3B] font-semibold' : 'text-[#6B7280]'
        }`}
      >
        <ArrowLeftRight className="h-4.5 w-4.5" />
        <span className="text-[10px] mt-1">Transactions</span>
      </button>

      {/* Floating Center Action Button */}
      <div className="relative -top-3">
        <button
          onClick={openAddModal}
          className="h-11 w-11 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center shadow-md hover:bg-[#06452C] active:scale-95 transition-all focus:outline-none ring-4 ring-white"
          aria-label="Add Transaction"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={() => setActivePage('budget')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-xs transition-colors ${
          activePage === 'budget' ? 'text-[#0B5D3B] font-semibold' : 'text-[#6B7280]'
        }`}
      >
        <PieChart className="h-4.5 w-4.5" />
        <span className="text-[10px] mt-1">Budget</span>
      </button>

      <button
        onClick={() => setActivePage('insights')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-xs transition-colors ${
          activePage === 'insights' ? 'text-[#0B5D3B] font-semibold' : 'text-[#6B7280]'
        }`}
      >
        <TrendingUp className="h-4.5 w-4.5" />
        <span className="text-[10px] mt-1">Insights</span>
      </button>
    </nav>
  );
};
