import React from 'react';
import { CategoryBudget } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CategoryBudgetCardProps {
  categoryBudget: CategoryBudget;
  onSelectCategory?: (category: string) => void;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  categoryBudget,
  onSelectCategory,
}) => {
  const { category, limit, spent } = categoryBudget;
  const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const isOverBudget = spent > limit;
  const isClose = percentage >= 85 && !isOverBudget;
  const remaining = limit - spent;

  return (
    <div
      onClick={() => onSelectCategory && onSelectCategory(category)}
      className="p-4 sm:p-5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#0B5D3B]/40 transition-colors cursor-pointer shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#F7F8F6] border border-[#E5E7EB] flex items-center justify-center text-[#111111]">
            {getCategoryIcon(category, 'h-4 w-4')}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111111]">{category}</h4>
            <span className="text-xs text-[#6B7280] tabular-nums">
              Limit: {formatIndianCurrency(limit)}
            </span>
          </div>
        </div>

        <div className="text-right">
          {isOverBudget ? (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B7791F] bg-[#B7791F]/10 px-2 py-0.5 rounded-md">
              <AlertTriangle className="h-3 w-3" />
              <span>{percentage}% used</span>
            </div>
          ) : isClose ? (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B7791F] bg-[#B7791F]/10 px-2 py-0.5 rounded-md">
              <span>{percentage}%</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16845B] bg-[#16845B]/10 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="h-3 w-3" />
              <span>{percentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-[#F7F8F6] overflow-hidden border border-[#E5E7EB]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget || isClose ? 'bg-[#B7791F]' : 'bg-[#0B5D3B]'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280]">
        <span className="tabular-nums">
          <strong className="text-[#111111] font-semibold">
            {formatIndianCurrency(spent)}
          </strong>
          {' / '}
          {formatIndianCurrency(limit)}
        </span>
        <span className="tabular-nums">
          {isOverBudget ? (
            <span className="text-[#B7791F] font-medium">
              {formatIndianCurrency(Math.abs(remaining))} over
            </span>
          ) : (
            <span>{formatIndianCurrency(remaining)} left</span>
          )}
        </span>
      </div>
    </div>
  );
};
