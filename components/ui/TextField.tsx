import React, { InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function TextField({
  label,
  icon,
  helperText,
  className = '',
  id,
  ...props
}: TextFieldProps) {
  const inputId = id || `textfield-${label.replace(/\s+/g, '-')}`;

  return (
    <div className={`flex flex-col items-end gap-3 w-full ${className}`}>
      <label 
        htmlFor={inputId} 
        className="font-cairo font-medium text-xl md:text-2xl text-success-800 text-right w-full"
      >
        {label}
      </label>
      
      <div className="flex flex-row items-center p-2 gap-2 w-full h-[48px] border border-[#A3C3D7] rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-success-200 focus-within:border-success-400 transition-all">
        <input
          id={inputId}
          className="flex-1 h-full bg-transparent border-none outline-none font-cairo font-medium text-base text-neutral-800 placeholder:text-neutral-700 text-right min-w-0 px-2"
          dir="rtl"
          {...props}
        />
        {icon && (
          <div className="w-6 h-6 flex items-center justify-center text-neutral-700 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {helperText && (
        <span className="font-cairo font-normal text-sm text-neutral-700 text-right w-full">
          {helperText}
        </span>
      )}
    </div>
  );
}
