import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-9.5',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
  };

  const variantClasses = {
    primary:
      'bg-[#0B5D3B] text-white hover:bg-[#06452C] active:bg-[#043320] shadow-sm',
    secondary:
      'bg-[#F7F8F6] text-[#111111] hover:bg-[#EAECE8] border border-[#E5E7EB]',
    outline:
      'bg-white text-[#111111] hover:bg-[#F7F8F6] border border-[#E5E7EB]',
    danger:
      'bg-[#C84A4A] text-white hover:bg-[#A83737] shadow-sm',
    ghost:
      'text-[#6B7280] hover:text-[#111111] hover:bg-[#F7F8F6]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
