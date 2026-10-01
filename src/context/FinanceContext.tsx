import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  MonthlyBudget,
  FinancialInsight,
  NotificationItem,
  UserProfile,
  TransactionFilters,
} from '../types/finance';
import { TransactionService } from '../services/transactionService';
import { BudgetService } from '../services/budgetService';
import { InsightService } from '../services/insightService';
import { NotificationService } from '../services/notificationService';
import { buildProfileFromAuth, persistUserProfile } from '../services/userProfileService';
import { formatIndianCurrency } from '../utils/formatters';
import { initialMockUser } from '../data/mock/mockUser';
import { useAuth } from './AuthContext';
import type { AuthViewMode } from '../components/auth/LoginForm';

function getCrossedBudgetLimits(
  previousTransactions: Transaction[],
  nextTransactions: Transaction[],
  budget: MonthlyBudget
): string[] {
  const monthKey = `${budget.year}-${String(budget.monthIndex + 1).padStart(2, '0')}`;
  const expensesForMonth = (items: Transaction[]) =>
    items.filter((t) => t.type === 'expense' && t.date.startsWith(monthKey));
  const previousMonthExpenses = expensesForMonth(previousTransactions);
  const nextMonthExpenses = expensesForMonth(nextTransactions);
  const warnings: string[] = [];
  const previousTotal = previousMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const nextTotal = nextMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  if (budget.totalBudget > 0 && previousTotal <= budget.totalBudget && nextTotal > budget.totalBudget) {
    warnings.push(
      `Monthly budget crossed: you are ${formatIndianCurrency(nextTotal - budget.totalBudget)} over your ${formatIndianCurrency(budget.totalBudget)} limit.`
    );
  }

  for (const categoryBudget of budget.categoryBudgets) {
    if (categoryBudget.limit <= 0) continue;
    const previousCategory = previousMonthExpenses
      .filter((t) => t.category === categoryBudget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const nextCategory = nextMonthExpenses
      .filter((t) => t.category === categoryBudget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    if (previousCategory <= categoryBudget.limit && nextCategory > categoryBudget.limit) {
      warnings.push(
        `${categoryBudget.category} budget crossed: ${formatIndianCurrency(nextCategory - categoryBudget.limit)} over the ${formatIndianCurrency(categoryBudget.limit)} limit.`
      );
    }
  }
  return warnings;
}

export type NavigationPage =
  | 'dashboard'
  | 'transactions'
  | 'budget'
  | 'insights'
  | 'reports'
  | 'profile'
  | 'landing'
  | 'how-it-works'
  | 'auth';

const PROTECTED_PAGES: NavigationPage[] = [
  'dashboard',
  'transactions',
  'budget',
  'insights',
  'reports',
  'profile',
];

interface FinanceContextType {
  user: UserProfile;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  budget: MonthlyBudget;
  insights: FinancialInsight[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  activePage: NavigationPage;
  filters: TransactionFilters;
  isLoading: boolean;
  hasError: boolean;
  toastMessage: string | null;
  authViewMode: AuthViewMode;

  summary: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    budgetRemaining: number;
    budgetPercentage: number;
    transactionCount: number;
  };

  isAddEditModalOpen: boolean;
  addEditModalMode: 'add' | 'edit';
  editingTransaction: Transaction | null;
  detailTransaction: Transaction | null;
  transactionToDelete: Transaction | null;
  isBudgetModalOpen: boolean;
  isQuickAddOpen: boolean;
  isOnboardingOpen: boolean;
  isNotificationDropdownOpen: boolean;

  setActivePage: (page: NavigationPage) => void;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
  resetFilters: () => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (budget: MonthlyBudget) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  openAddModal: () => void;
  openEditModal: (t: Transaction) => void;
  closeAddEditModal: () => void;
  openDetailModal: (t: Transaction) => void;
  closeDetailModal: () => void;
  promptDeleteTransaction: (t: Transaction) => void;
  cancelDeleteTransaction: () => void;
  executeDeleteTransaction: () => void;
  openBudgetModal: () => void;
  closeBudgetModal: () => void;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  openAuthPage: (mode?: AuthViewMode) => void;
  /** @deprecated Prefer openAuthPage — kept for compatibility */
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'reset' | 'verify') => void;
  closeAuthModal: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  setIsNotificationDropdownOpen: (open: boolean) => void;
  toggleLoadingSkeleton: () => void;
  toggleErrorState: () => void;
  showToast: (msg: string) => void;
  resetAllData: () => void;
  handleLogout: () => Promise<void>;
  enterAuthenticatedApp: () => void;
}

const defaultFilters: TransactionFilters = {
  searchQuery: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function loadUserScopedState(userId: string | null) {
  TransactionService.setUserId(userId);
  BudgetService.setUserId(userId);
  NotificationService.setUserId(userId);

  const txns = TransactionService.getAll();
  const rawBudget = BudgetService.getBudget();
  const budget = BudgetService.recalculateFromTransactions(rawBudget, txns);
  const insights = InsightService.generateDynamicInsights(txns, budget);
  const notifications = NotificationService.getAll();

  return { txns, budget, insights, notifications };
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, isAuthenticated, needsEmailVerification, logout } = useAuth();

  const [user, setUser] = useState<UserProfile>(initialMockUser);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<MonthlyBudget>(() => ({
    ...BudgetService.getBudget(),
  }));
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activePage, setActivePageState] = useState<NavigationPage>(() =>
    window.location.pathname === '/how-it-works' ? 'how-it-works' : 'landing'
  );
  const [authViewMode, setAuthViewMode] = useState<AuthViewMode>('login');
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [addEditModalMode, setAddEditModalMode] = useState<'add' | 'edit'>('add');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [detailTransaction, setDetailTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [boundUid, setBoundUid] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  const setActivePage = useCallback(
    (page: NavigationPage) => {
      if (PROTECTED_PAGES.includes(page) && !isAuthenticated) {
        setAuthViewMode('login');
        setActivePageState('auth');
        showToast('Please sign in to continue.');
        return;
      }
      if (page === 'how-it-works' && window.location.pathname !== '/how-it-works') {
        window.history.pushState(null, '', '/how-it-works');
      } else if (page !== 'how-it-works' && window.location.pathname === '/how-it-works') {
        window.history.pushState(null, '', '/');
      }
      setActivePageState(page);
    },
    [isAuthenticated, showToast]
  );

  useEffect(() => {
    const syncHowItWorksPath = () => {
      if (window.location.pathname === '/how-it-works') {
        setActivePageState('how-it-works');
      } else if (activePage === 'how-it-works') {
        setActivePageState('landing');
      }
    };

    window.addEventListener('popstate', syncHowItWorksPath);
    return () => window.removeEventListener('popstate', syncHowItWorksPath);
  }, [activePage]);

  // Bind finance data to Firebase UID whenever auth identity changes
  useEffect(() => {
    if (authUser && (isAuthenticated || needsEmailVerification)) {
      if (boundUid !== authUser.uid) {
        const scoped = loadUserScopedState(authUser.uid);
        setTransactions(scoped.txns);
        setBudget(scoped.budget);
        setInsights(scoped.insights);
        setNotifications(scoped.notifications);
        setBoundUid(authUser.uid);
      }
      const profile = buildProfileFromAuth(authUser);
      setUser(profile);
    } else if (!authUser) {
      TransactionService.setUserId(null);
      BudgetService.setUserId(null);
      NotificationService.setUserId(null);
      setBoundUid(null);
      setUser(initialMockUser);
      setTransactions([]);
      setNotifications([]);
    }
  }, [authUser, isAuthenticated, needsEmailVerification, boundUid]);

  // Route guards driven by auth state
  useEffect(() => {
    if (needsEmailVerification) {
      setAuthViewMode('verify');
      setActivePageState('auth');
      return;
    }
    if (isAuthenticated && (activePage === 'auth' || activePage === 'landing')) {
      setActivePageState('dashboard');
    }
    if (!isAuthenticated && PROTECTED_PAGES.includes(activePage)) {
      setActivePageState('landing');
    }
  }, [isAuthenticated, needsEmailVerification, activePage]);

  const refreshDependentData = useCallback((newTxns: Transaction[]) => {
    setBudget((prevBudget) => {
      const recalculated = BudgetService.recalculateFromTransactions(prevBudget, newTxns);
      setInsights(InsightService.generateDynamicInsights(newTxns, recalculated));
      return recalculated;
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    return TransactionService.filterTransactions(transactions, filters);
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const s = TransactionService.getFinancialSummary(transactions);
    const budgetRemaining = Math.max(0, budget.totalBudget - s.totalExpenses);
    const budgetPercentage =
      budget.totalBudget > 0 ? Math.min(100, Math.round((s.totalExpenses / budget.totalBudget) * 100)) : 0;

    return {
      totalIncome: s.totalIncome,
      totalExpenses: s.totalExpenses,
      currentBalance: s.currentBalance,
      budgetRemaining,
      budgetPercentage,
      transactionCount: s.transactionCount,
    };
  }, [transactions, budget]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
      const previousTransactions = transactions;
      const created = TransactionService.create(data);
      const allTxns = TransactionService.getAll();
      const crossedLimits = getCrossedBudgetLimits(previousTransactions, allTxns, budget);
      setTransactions(allTxns);
      refreshDependentData(allTxns);
      NotificationService.addNotification({
        type: 'transaction',
        title: 'Transaction Added',
        description: `${created.type === 'income' ? 'Income' : 'Expense'} of ₹${created.amount.toLocaleString('en-IN')} for ${created.description}.`,
        actionUrl: 'transactions',
      });
      crossedLimits.forEach((warning) => {
        NotificationService.addNotification({
          type: 'budget',
          title: 'Budget limit crossed',
          description: warning,
          actionUrl: 'budget',
        });
      });
      setNotifications(NotificationService.getAll());
      showToast(crossedLimits[0] ?? 'Done! Your transaction has been saved.');
      return created;
    },
    [transactions, budget, refreshDependentData, showToast]
  );

  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
      const previousTransactions = transactions;
      const updated = TransactionService.update(id, data);
      if (updated) {
        const allTxns = TransactionService.getAll();
        const crossedLimits = getCrossedBudgetLimits(previousTransactions, allTxns, budget);
        setTransactions(allTxns);
        refreshDependentData(allTxns);
        crossedLimits.forEach((warning) => {
          NotificationService.addNotification({
            type: 'budget',
            title: 'Budget limit crossed',
            description: warning,
            actionUrl: 'budget',
          });
        });
        setNotifications(NotificationService.getAll());
        showToast(crossedLimits[0] ?? 'Your transaction has been updated.');
      }
    },
    [transactions, budget, refreshDependentData, showToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const success = TransactionService.delete(id);
      if (success) {
        const allTxns = TransactionService.getAll();
        setTransactions(allTxns);
        refreshDependentData(allTxns);
        showToast('Your transaction has been deleted.');
      }
    },
    [refreshDependentData, showToast]
  );

  const updateBudget = useCallback(
    (newBudget: MonthlyBudget) => {
      const saved = BudgetService.updateBudget(newBudget);
      const recalculated = BudgetService.recalculateFromTransactions(saved, transactions);
      const monthKey = `${newBudget.year}-${String(newBudget.monthIndex + 1).padStart(2, '0')}`;
      const monthExpenses = transactions.filter(
        (transaction) => transaction.type === 'expense' && transaction.date.startsWith(monthKey)
      );
      const totalSpent = monthExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
      const budgetWarnings: string[] = [];

      if (budget.totalBudget > 0 && budget.totalBudget <= totalSpent && newBudget.totalBudget < totalSpent) {
        budgetWarnings.push(
          `Monthly budget limit is already crossed by ${formatIndianCurrency(totalSpent - newBudget.totalBudget)}.`
        );
      }

      newBudget.categoryBudgets.forEach((categoryBudget) => {
        const spent = monthExpenses
          .filter((transaction) => transaction.category === categoryBudget.category)
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        const previousLimit = budget.categoryBudgets.find(
          (item) => item.category === categoryBudget.category
        )?.limit ?? 0;
        if (previousLimit > 0 && previousLimit <= spent && categoryBudget.limit < spent) {
          budgetWarnings.push(
            `${categoryBudget.category} limit is already crossed by ${formatIndianCurrency(spent - categoryBudget.limit)}.`
          );
        }
      });

      setBudget(recalculated);
      setInsights(InsightService.generateDynamicInsights(transactions, recalculated));
      NotificationService.addNotification({
        type: 'system',
        title: 'Budget Updated',
        description: `Monthly budget updated to ₹${newBudget.totalBudget.toLocaleString('en-IN')}.`,
        actionUrl: 'budget',
      });
      budgetWarnings.forEach((warning) => {
        NotificationService.addNotification({
          type: 'budget',
          title: 'Budget limit crossed',
          description: warning,
          actionUrl: 'budget',
        });
      });
      setNotifications(NotificationService.getAll());
      showToast(budgetWarnings[0] ?? 'Your budget has been saved.');
    },
    [transactions, budget, showToast]
  );


  const markNotificationRead = useCallback((id: string) => {
    const updated = NotificationService.markAsRead(id);
    setNotifications(updated);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
    showToast('All notifications marked as read.');
  }, [showToast]);

  const updateUserProfile = useCallback(
    (profile: Partial<UserProfile>) => {
      setUser((prev) => {
        const next = { ...prev, ...profile };
        persistUserProfile(next);
        return next;
      });
      showToast('Your preferences have been saved.');
    },
    [showToast]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const openAddModal = useCallback(() => {
    setAddEditModalMode('add');
    setEditingTransaction(null);
    setIsAddEditModalOpen(true);
  }, []);

  const openEditModal = useCallback((t: Transaction) => {
    setAddEditModalMode('edit');
    setEditingTransaction(t);
    setIsAddEditModalOpen(true);
  }, []);

  const closeAddEditModal = useCallback(() => {
    setIsAddEditModalOpen(false);
    setEditingTransaction(null);
  }, []);

  const openDetailModal = useCallback((t: Transaction) => {
    setDetailTransaction(t);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailTransaction(null);
  }, []);

  const promptDeleteTransaction = useCallback((t: Transaction) => {
    setTransactionToDelete(t);
  }, []);

  const cancelDeleteTransaction = useCallback(() => {
    setTransactionToDelete(null);
  }, []);

  const executeDeleteTransaction = useCallback(() => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      if (detailTransaction?.id === transactionToDelete.id) {
        setDetailTransaction(null);
      }
    }
  }, [transactionToDelete, deleteTransaction, detailTransaction]);

  const openBudgetModal = useCallback(() => {
    setIsBudgetModalOpen(true);
  }, []);

  const closeBudgetModal = useCallback(() => {
    setIsBudgetModalOpen(false);
  }, []);

  const openQuickAdd = useCallback(() => {
    setIsQuickAddOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setIsQuickAddOpen(false);
  }, []);

  const openAuthPage = useCallback((mode: AuthViewMode = 'login') => {
    setAuthViewMode(mode);
    if (window.location.pathname === '/how-it-works') {
      window.history.pushState(null, '', '/');
    }
    setActivePageState('auth');
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'register' | 'forgot' | 'reset' | 'verify' = 'login') => {
    const mapped: AuthViewMode =
      mode === 'reset' ? 'forgot' : mode === 'verify' ? 'verify' : mode;
    openAuthPage(mapped);
  }, [openAuthPage]);

  const closeAuthModal = useCallback(() => {
    if (!isAuthenticated) {
      setActivePageState('landing');
    } else {
      setActivePageState('dashboard');
    }
  }, [isAuthenticated]);

  const openOnboarding = useCallback(() => {
    setIsOnboardingOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
  }, []);

  const toggleLoadingSkeleton = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, []);

  const toggleErrorState = useCallback(() => {
    setHasError((prev) => !prev);
  }, []);

  const resetAllData = useCallback(() => {
    const defaultTxns = TransactionService.resetToDefault();
    setTransactions(defaultTxns);
    const rawBudget = BudgetService.recalculateFromTransactions(
      BudgetService.getBudget(),
      defaultTxns
    );
    setBudget(rawBudget);
    setInsights(InsightService.generateDynamicInsights(defaultTxns, rawBudget));
    showToast('Reset data to initial state.');
  }, [showToast]);

  const handleLogout = useCallback(async () => {
    await logout();
    TransactionService.setUserId(null);
    BudgetService.setUserId(null);
    NotificationService.setUserId(null);
    setBoundUid(null);
    setUser(initialMockUser);
    setTransactions([]);
    setNotifications([]);
    setActivePageState('landing');
    setAuthViewMode('login');
    showToast('You have signed out.');
  }, [logout, showToast]);

  const enterAuthenticatedApp = useCallback(() => {
    setActivePageState('dashboard');
    const onboardKey = authUser ? `fintrack_onboarded_${authUser.uid}` : null;
    if (onboardKey && !localStorage.getItem(onboardKey)) {
      setIsOnboardingOpen(true);
      localStorage.setItem(onboardKey, '1');
    }
  }, [authUser]);

  return (
    <FinanceContext.Provider
      value={{
        user,
        transactions,
        filteredTransactions,
        budget,
        insights,
        notifications,
        unreadNotificationsCount,
        activePage,
        filters,
        isLoading,
        hasError,
        toastMessage,
        authViewMode,
        summary,
        isAddEditModalOpen,
        addEditModalMode,
        editingTransaction,
        detailTransaction,
        transactionToDelete,
        isBudgetModalOpen,
        isQuickAddOpen,
        isOnboardingOpen,
        isNotificationDropdownOpen,
        setActivePage,
        setFilters,
        resetFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        openDetailModal,
        closeDetailModal,
        promptDeleteTransaction,
        cancelDeleteTransaction,
        executeDeleteTransaction,
        openBudgetModal,
        closeBudgetModal,
        openQuickAdd,
        closeQuickAdd,
        openAuthPage,
        openAuthModal,
        closeAuthModal,
        openOnboarding,
        closeOnboarding,
        setIsNotificationDropdownOpen,
        toggleLoadingSkeleton,
        toggleErrorState,
        showToast,
        resetAllData,
        handleLogout,
        enterAuthenticatedApp,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
