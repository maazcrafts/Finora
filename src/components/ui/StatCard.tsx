import React from 'react';
import { formatIndianCurrency } from '../../utils/formatters';

interface StatCardProps {
  label: string;
  amount: number;
  comparisonText?: string;
  comparisonType?: 'positive' | 'negative' | 'neutral';
  secondaryInfo?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  amount,
  comparisonText,
  comparisonType = 'neutral',
  secondaryInfo,
}) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight tabular-nums">
          {formatIndianCurrency(amount)}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-xs text-[#6B7280]">
        {comparisonText && (
          <span
            className={`font-medium ${
              comparisonType === 'positive'
                ? 'text-[#16845B]'
                : comparisonType === 'negative'
                ? 'text-[#C84A4A]'
                : 'text-[#6B7280]'
            }`}
          >
            {comparisonText}
          </span>
        )}
        {comparisonText && secondaryInfo && <span aria-hidden="true">·</span>}
        {secondaryInfo && <span>{secondaryInfo}</span>}
      </div>
    </div>
  );
};
