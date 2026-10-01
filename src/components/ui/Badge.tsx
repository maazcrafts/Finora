import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'positive' | 'negative' | 'warning' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
}) => {
  const variantStyles = {
    neutral: 'bg-[#F7F8F6] text-[#6B7280] border border-[#E5E7EB]',
    positive: 'bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/20',
    negative: 'bg-[#C84A4A]/10 text-[#C84A4A] border border-[#C84A4A]/20',
    warning: 'bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20',
    brand: 'bg-[#0B5D3B]/10 text-[#0B5D3B] border border-[#0B5D3B]/20',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-tight ${sizeStyles[size]} ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};
