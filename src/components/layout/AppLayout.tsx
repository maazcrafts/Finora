import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { AddEditTransactionModal } from '../transactions/AddEditTransactionModal';
import { TransactionDetailModal } from '../transactions/TransactionDetailModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { CreateEditBudgetModal } from '../budget/CreateEditBudgetModal';
import { QuickAddWidget } from '../dashboard/QuickAddWidget';
import { OnboardingFlow } from '../auth/OnboardingFlow';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activePage,
    toastMessage,
    isAddEditModalOpen,
    closeAddEditModal,
    addEditModalMode,
    editingTransaction,
    detailTransaction,
    closeDetailModal,
    transactionToDelete,
    cancelDeleteTransaction,
    executeDeleteTransaction,
    isBudgetModalOpen,
    closeBudgetModal,
    isQuickAddOpen,
    closeQuickAdd,
    isOnboardingOpen,
    closeOnboarding,
    hasError,
    toggleErrorState,
  } = useFinance();

  if (activePage === 'landing' || activePage === 'how-it-works') {
    return (
      <div className="min-h-screen bg-white text-[#111111]">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111111] text-white text-xs sm:text-sm shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-[#16845B]" />
            <span>{toastMessage}</span>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#111111] flex flex-col font-sans">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#111111] text-white text-xs sm:text-sm shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#16845B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex w-full">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto pb-24 lg:pb-8">
            {hasError ? (
              <div className="my-12 p-8 rounded-xl border border-[#E5E7EB] bg-white text-center max-w-md mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#C84A4A]/10 text-[#C84A4A] flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">Something went wrong</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280]">
                  Unable to load your financial data right now. Please verify your connection and try again.
                </p>
                <div className="mt-5">
                  <button
                    onClick={toggleErrorState}
                    className="px-4 py-2 rounded-lg bg-[#0B5D3B] text-white text-xs sm:text-sm font-medium hover:bg-[#06452C] transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      <BottomNav />

      {isAddEditModalOpen && (
        <AddEditTransactionModal
          isOpen={isAddEditModalOpen}
          onClose={closeAddEditModal}
          mode={addEditModalMode}
          transaction={editingTransaction}
        />
      )}

      {detailTransaction && (
        <TransactionDetailModal
          isOpen={!!detailTransaction}
          onClose={closeDetailModal}
          transaction={detailTransaction}
        />
      )}

      {transactionToDelete && (
        <ConfirmDialog
          isOpen={!!transactionToDelete}
          onClose={cancelDeleteTransaction}
          onConfirm={executeDeleteTransaction}
          title="Delete this transaction?"
          description="This action cannot be undone. All budget progress, metrics, and monthly reports will immediately reflect this change."
          transaction={transactionToDelete}
        />
      )}

      {isBudgetModalOpen && (
        <CreateEditBudgetModal
          isOpen={isBudgetModalOpen}
          onClose={closeBudgetModal}
        />
      )}

      {isQuickAddOpen && (
        <QuickAddWidget
          isOpen={isQuickAddOpen}
          onClose={closeQuickAdd}
        />
      )}

      {isOnboardingOpen && (
        <OnboardingFlow
          isOpen={isOnboardingOpen}
          onClose={closeOnboarding}
        />
      )}
    </div>
  );
};
