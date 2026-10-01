import React, { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionFilters } from '../../types/finance';

const categories = [
  'Food',
  'Transport',
  'Housing',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Subscriptions',
  'Salary',
  'Freelance',
  'Investments',
  'Other',
];

const emptyFilters: TransactionFilters = {
  searchQuery: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

export const TransactionFilterPanel: React.FC = () => {
  const { filters, setFilters, resetFilters } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<TransactionFilters>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const activeFilterCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    filters.dateRange !== 'all',
    filters.minAmount !== undefined,
    filters.maxAmount !== undefined,
  ].filter(Boolean).length;

  const clearFilters = () => {
    resetFilters();
    setDraft(emptyFilters);
  };

  const changeAmount = (key: 'minAmount' | 'maxAmount', value: string) => {
    const amount = value === '' ? undefined : Number(value);
    setDraft((current) => ({
      ...current,
      [key]: amount !== undefined && Number.isFinite(amount) ? amount : undefined,
    }));
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search transactions</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" aria-hidden="true" />
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(event) => setFilters((current) => ({ ...current, searchQuery: event.target.value }))}
            placeholder="Search transactions"
            className="min-h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-10 text-sm text-[#111111] placeholder:text-[#6B7280] focus:border-[#0B5D3B] focus:outline-none focus:ring-2 focus:ring-[#0B5D3B]/20"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters((current) => ({ ...current, searchQuery: '' }))}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6B7280] hover:bg-[#F7F8F6]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="transaction-filter-panel"
          onClick={() => {
            setDraft(filters);
            setIsOpen((open) => !open);
          }}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold ${
            isOpen || activeFilterCount > 0
              ? 'border-[#0B5D3B] bg-[#0B5D3B]/5 text-[#0B5D3B]'
              : 'border-[#E5E7EB] bg-white text-[#111111] hover:bg-[#F7F8F6]'
          }`}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      </div>

      {isOpen && (
        <div id="transaction-filter-panel" className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-sm font-medium text-[#111111]">
              Money in or out
              <select
                value={draft.type}
                onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as TransactionFilters['type'] }))}
                className="mt-1.5 min-h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm"
              >
                <option value="all">All transactions</option>
                <option value="expense">Spent</option>
                <option value="income">Received</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-[#111111]">
              Category
              <select
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                className="mt-1.5 min-h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-[#111111]">
              Date
              <select
                value={draft.dateRange}
                onChange={(event) => setDraft((current) => ({ ...current, dateRange: event.target.value as TransactionFilters['dateRange'] }))}
                className="mt-1.5 min-h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm"
              >
                <option value="all">Any time</option>
                <option value="today">Today</option>
                <option value="this_week">Past 7 days</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="custom">Choose dates</option>
              </select>
            </label>
            <fieldset>
              <legend className="text-sm font-medium text-[#111111]">Amount range</legend>
              <div className="mt-1.5 flex gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Minimum amount</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min ₹"
                    value={draft.minAmount ?? ''}
                    onChange={(event) => changeAmount('minAmount', event.target.value)}
                    className="min-h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm"
                  />
                </label>
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Maximum amount</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max ₹"
                    value={draft.maxAmount ?? ''}
                    onChange={(event) => changeAmount('maxAmount', event.target.value)}
                    className="min-h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          {draft.dateRange === 'custom' && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#111111]">
                From
                <input
                  type="date"
                  value={draft.startDate ?? ''}
                  onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-[#111111]">
                To
                <input
                  type="date"
                  value={draft.endDate ?? ''}
                  onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm"
                />
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
            <button type="button" onClick={clearFilters} className="text-sm font-medium text-[#6B7280] hover:text-[#111111]">
              Clear filters
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters(draft);
                setIsOpen(false);
              }}
              className="min-h-10 rounded-lg bg-[#0B5D3B] px-4 text-sm font-semibold text-white hover:bg-[#06452C]"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
};