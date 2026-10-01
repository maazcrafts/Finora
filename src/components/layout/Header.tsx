import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { NotificationCenter } from '../ui/NotificationCenter';
import { UserAvatar } from '../ui/UserAvatar';
import { Menu, LogOut, Settings, User } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activePage,
    setActivePage,
    user,
    handleLogout,
  } = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Home';
      case 'transactions':
        return 'Transactions';
      case 'budget':
        return 'Monthly Budget';
      case 'insights':
        return 'Spending patterns';
      case 'reports':
        return 'Monthly spending';
      case 'profile':
        return 'Profile & settings';
      default:
        return 'FinTrack';
    }
  };

  const providerLabel =
    user.authProvider === 'google.com'
      ? 'Google'
      : user.authProvider === 'phone'
      ? 'Phone'
      : user.authProvider === 'password'
      ? 'Email'
      : null;

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-[#F7F8F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span>FinTrack</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[#111111]">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationCenter />

        <div className="relative flex items-center pl-1 sm:pl-2 border-l border-[#E5E7EB]" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F7F8F6] transition-colors text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Account menu"
          >
            <UserAvatar name={user.name} photoURL={user.photoURL} size="sm" />
            <div className="hidden xl:block">
              <span className="text-xs font-semibold text-[#111111] block leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-[#6B7280] block font-normal truncate max-w-[160px]">
                {user.email || user.phoneNumber}
              </span>
            </div>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E5E7EB] bg-white shadow-lg py-1.5 z-50 animate-in fade-in duration-150"
            >
              <div className="px-3 py-2 border-b border-[#E5E7EB]">
                <p className="text-xs font-semibold text-[#111111] truncate">{user.name}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{user.email || user.phoneNumber}</p>
                {providerLabel && (
                  <p className="text-[10px] text-[#0B5D3B] mt-1 font-medium">Signed in with {providerLabel}</p>
                )}
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setActivePage('profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#111111] hover:bg-[#F7F8F6]"
              >
                <User className="h-3.5 w-3.5 text-[#6B7280]" />
                Profile
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setActivePage('profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#111111] hover:bg-[#F7F8F6]"
              >
                <Settings className="h-3.5 w-3.5 text-[#6B7280]" />
                Settings
              </button>
              <button
                role="menuitem"
                onClick={async () => {
                  setMenuOpen(false);
                  await handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#C84A4A] hover:bg-[#C84A4A]/5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
