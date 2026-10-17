import React from 'react';
import { Button } from './Button';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#E5E7EB] bg-[#F7F8F6]/60">
      <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] mb-4 shadow-xs">
        {icon || <FolderOpen className="h-6 w-6 text-[#6B7280]" />}
      </div>
      <h3 className="text-base font-semibold text-[#111111] tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280] max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
