import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixElement, suffixElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#111111] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#6B7280]">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#111111] placeholder:text-[#9CA3AF] transition-colors focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B] disabled:bg-[#F7F8F6] disabled:text-[#9CA3AF] ${
              prefixElement ? 'pl-9' : ''
            } ${suffixElement ? 'pr-9' : ''} ${
              error ? 'border-[#C84A4A] focus:ring-[#C84A4A] focus:border-[#C84A4A]' : 'border-[#E5E7EB]'
            } ${className}`}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center pointer-events-none text-[#6B7280]">
              {suffixElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[#C84A4A]">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
