import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Check,
  TrendingUp,
  PieChart,
  BarChart3,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { transactions, budget, showToast } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [exportModalType, setExportModalType] = useState<'csv' | 'pdf' | null>(null);

  const monthIndex = new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth();
  const monthKey = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}`;
  const periodTransactions = transactions.filter((transaction) => {
    if (!transaction.date.startsWith(monthKey)) return false;
    if (selectedCategory !== 'all' && transaction.category !== selectedCategory) return false;
    if (selectedType !== 'all' && transaction.type !== selectedType) return false;
    return true;
  });
  const periodIncome = periodTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
  const periodExpenses = periodTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
  const budgetMatchesPeriod = budget.year === Number(selectedYear) && budget.monthIndex === monthIndex;
  const budgetPercentage = budgetMatchesPeriod && budget.totalBudget > 0
    ? Math.round((periodExpenses / budget.totalBudget) * 100)
    : null;
  const savings = periodIncome - periodExpenses;
  const savingsRate =
    periodIncome > 0
      ? Math.round((savings / periodIncome) * 100)
      : 0;

  const monthRows = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(Number(selectedYear), monthIndex - 3 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthItems = transactions.filter((transaction) => {
      if (!transaction.date.startsWith(key)) return false;
      if (selectedCategory !== 'all' && transaction.category !== selectedCategory) return false;
      if (selectedType !== 'all' && transaction.type !== selectedType) return false;
      return true;
    });
    return {
      month: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      income: monthItems.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0),
      expense: monthItems.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0),
    };
  });
  const maxMonthAmount = Math.max(...monthRows.flatMap((row) => [row.income, row.expense]), 1);

  const categoryTotals = new Map<string, number>();
  periodTransactions.filter((transaction) => transaction.type === 'expense').forEach((transaction) => {
    categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount);
  });
  const categoryBreakdown = [...categoryTotals.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: periodExpenses > 0 ? Math.round((amount / periodExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const handleExportInitiate = (type: 'csv' | 'pdf') => {
    setExportModalType(type);
  };

  const handleExportConfirm = () => {
    if (exportModalType === 'pdf') {
      showToast('PDF downloads are not available yet.');
      setExportModalType(null);
      return;
    }

    const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const rows = [
      ['Date', 'Spent or received', 'Category', 'Description', 'Amount', 'Note'],
      ...periodTransactions.map((transaction) => [
        transaction.date,
        transaction.type === 'expense' ? 'Spent' : 'Received',
        transaction.category,
        transaction.description,
        transaction.amount,
        transaction.notes ?? '',
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack_${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Your CSV has been downloaded.');
    setExportModalType(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Financial Reports & Analytics"
        description="Comprehensive periodic breakdown, cashflow metrics, and ledger summaries"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              icon={<FileSpreadsheet className="h-4 w-4 text-[#0B5D3B]" />}
              onClick={() => handleExportInitiate('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<FileText className="h-4 w-4 text-[#C84A4A]" />}
              onClick={() => handleExportInitiate('pdf')}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filter Ribbon */}
      <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] font-medium mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Report Parameters:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280]">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-[#0B5D3B]"
            >
              <option value="October">October</option>
              <option value="September">September</option>
              <option value="August">August</option>
              <option value="July">July</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280]">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-[#0B5D3B]"
            >
              {Array.from({ length: 6 }, (_, index) => new Date().getFullYear() - index).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-[#0B5D3B]"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280]">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111111] focus:ring-1 focus:ring-[#0B5D3B]"
            >
              <option value="all">Income & Expenses</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Money received
          </span>
          <p className="mt-2 text-2xl font-bold text-[#16845B] tabular-nums">
            {formatIndianCurrency(periodIncome)}
          </p>
          <span className="text-xs text-[#6B7280] mt-1 block">
            {periodTransactions.filter((transaction) => transaction.type === 'income').length} payments recorded
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Spent
          </span>
          <p className="mt-2 text-2xl font-bold text-[#C84A4A] tabular-nums">
            {formatIndianCurrency(periodExpenses)}
          </p>
          <span className="text-xs text-[#6B7280] mt-1 block">
            {periodTransactions.filter((transaction) => transaction.type === 'expense').length} expenses recorded
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Difference
          </span>
          <p className="mt-2 text-2xl font-bold text-[#111111] tabular-nums">
            {formatIndianCurrency(savings)}
          </p>
          <span className="text-xs text-[#16845B] font-medium mt-1 block">
            {savingsRate}% of money received
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Budget used
          </span>
          <p className="mt-2 text-2xl font-bold text-[#111111] tabular-nums">
            {budgetPercentage === null ? '—' : `${budgetPercentage}%`}
          </p>
          <span className="text-xs text-[#6B7280] mt-1 block">
            {budgetPercentage === null ? 'No budget set for this month' : `of ${formatIndianCurrency(budget.totalBudget)}`}
          </span>
        </div>
      </div>

      {/* Visual Chart Comparison: Income vs Expenses & Daily Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Stack */}
        <div className="p-5 sm:p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]/60">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Income vs Expenses Comparison
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                The four months ending in {selectedMonth} {selectedYear}
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-[#6B7280]" />
          </div>

          <div className="mt-6 space-y-4 text-xs">
                        {monthRows.map((row) => (
              <div key={row.month} className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-[#111111]">{row.month}</span>
                  <span className="text-[#6B7280] tabular-nums">
                    +{formatIndianCurrency(row.income)} / -{formatIndianCurrency(row.expense)}
                  </span>
                </div>
                <div className="h-3 w-full bg-[#F7F8F6] rounded-full overflow-hidden flex border border-[#E5E7EB]">
                  <div
                    className="bg-[#16845B] h-full"
                          style={{ width: `${(row.income / maxMonthAmount) * 100}%` }}
                    title={`Income: ${formatIndianCurrency(row.income)}`}
                  />
                  <div
                    className="bg-[#C84A4A] h-full"
                          style={{ width: `${(row.expense / maxMonthAmount) * 100}%` }}
                    title={`Expense: ${formatIndianCurrency(row.expense)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Spending Breakdown Bar */}
        <div className="p-5 sm:p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]/60">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Category Expenditure Weight
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                          Where spending went in {selectedMonth} {selectedYear}
              </p>
            </div>
            <PieChart className="h-4 w-4 text-[#6B7280]" />
          </div>

          <div className="mt-6 space-y-3 text-xs">
                        {categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-[#111111]">{category.category}</span>
                  <span className="text-[#6B7280] tabular-nums font-semibold">
                    {formatIndianCurrency(category.amount)} ({category.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[#F7F8F6] rounded-full overflow-hidden border border-[#E5E7EB]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${category.percentage}%`, backgroundColor: '#0B5D3B' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Confirmation Dialog */}
      {exportModalType && (
        <Modal
          isOpen={!!exportModalType}
          onClose={() => setExportModalType(null)}
          title={exportModalType === 'csv' ? 'Download your CSV' : 'PDF download'}
          description={exportModalType === 'csv' ? 'The file will include transactions shown for this month and filters.' : 'PDF downloads are not available yet.'}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-[#F7F8F6] border border-[#E5E7EB] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Reporting Period:</span>
                <span className="font-semibold text-[#111111]">{selectedMonth} {selectedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">File Format:</span>
                  <span className="font-semibold text-[#111111]">
                  fintrack_report_{selectedMonth.toLowerCase()}_{selectedYear}.{exportModalType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Total Entries:</span>
                <span className="font-semibold text-[#111111]">{periodTransactions.length} transactions</span>
              </div>
            </div>

            {exportModalType === 'pdf' && (
              <p className="text-sm text-[#6B7280]">You can download your transactions as a CSV file for now.</p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
              <Button variant="outline" size="md" onClick={() => setExportModalType(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleExportConfirm} disabled={exportModalType === 'pdf'}>
                Download CSV
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
