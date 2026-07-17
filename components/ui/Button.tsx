import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
  size?: 'sm' | 'md' | 'icon-only';
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "flex flex-row justify-center items-center gap-4 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed";
  
  const variants = {
    'primary': "bg-success-800 text-success-50 hover:bg-success-900 border border-transparent",
    'secondary': "bg-warning-600 text-warning-50 hover:bg-warning-700 border border-transparent",
    'outline-primary': "bg-transparent text-success-900 border-2 border-success-700 hover:bg-success-50",
    'outline-secondary': "bg-transparent text-warning-900 border-2 border-warning-600 hover:bg-warning-50",
  };

  const sizes = {
    'sm': "h-[40px] px-4 rounded-2xl w-full",
    'md': "h-[56px] px-4 rounded-2xl w-full",
    'icon-only': "w-[56px] h-[56px] p-0 rounded-full",
  };

  const textSizes = {
    'sm': "text-sm font-bold font-cairo",
    'md': "text-lg font-bold font-cairo",
    'icon-only': "",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      )}
      {size !== 'icon-only' && children && (
        <span className={textSizes[size]}>
          {children}
        </span>
      )}
    </button>
  );
}
