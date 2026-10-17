import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'white',
  padding = 'md',
}) => {
  const bgClasses = variant === 'white' ? 'bg-white' : 'bg-[#F7F8F6]';
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-xl border border-[#E5E7EB] ${bgClasses} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
