import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E5E7EB]">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#111111] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 sm:mt-1.5 text-sm sm:text-base text-[#6B7280]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          {actions}
        </div>
      )}
    </div>
  );
};
