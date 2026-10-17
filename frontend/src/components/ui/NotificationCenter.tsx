import React, { useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Bell, CheckCheck, AlertCircle, TrendingUp, Receipt, Info, X } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    markNotificationRead,
    markAllNotificationsRead,
    setActivePage,
  } = useFinance();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
    };
    if (isNotificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationDropdownOpen, setIsNotificationDropdownOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <AlertCircle className="h-4 w-4 text-[#B7791F]" />;
      case 'insight':
        return <TrendingUp className="h-4 w-4 text-[#0B5D3B]" />;
      case 'transaction':
        return <Receipt className="h-4 w-4 text-[#111111]" />;
      default:
        return <Info className="h-4 w-4 text-[#6B7280]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
        className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-[#F7F8F6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
        aria-label="View notifications"
        aria-expanded={isNotificationDropdownOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C84A4A] ring-2 ring-white" />
        )}
      </button>

      {isNotificationDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E5E7EB] bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-[#F7F8F6]/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#111111]">Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#0B5D3B] hover:underline flex items-center gap-1 font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationDropdownOpen(false)}
                className="text-[#6B7280] hover:text-[#111111] p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E5E7EB]/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B7280]">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationRead(item.id);
                    if (item.actionUrl) {
                      setActivePage(item.actionUrl as any);
                    }
                    setIsNotificationDropdownOpen(false);
                  }}
                  className={`p-3.5 flex items-start gap-3 hover:bg-[#F7F8F6] cursor-pointer transition-colors ${
                    !item.read ? 'bg-[#0B5D3B]/[0.02]' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-md bg-[#F7F8F6] border border-[#E5E7EB] shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs ${!item.read ? 'font-semibold text-[#111111]' : 'font-medium text-[#4B5563]'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#9CA3AF] shrink-0 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0B5D3B] shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
