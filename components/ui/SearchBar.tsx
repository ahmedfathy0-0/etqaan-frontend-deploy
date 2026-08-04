import React, { InputHTMLAttributes } from 'react';
import { Search01 } from '@dga-icons/react/duotone-rounded';

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {}

export function SearchBar({ className = '', ...props }: SearchBarProps) {
  return (
    <div className={`flex flex-row items-center justify-end p-3 gap-2 w-full h-[48px] border-[1.5px] border-neutral-800 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-neutral-200 transition-all ${className}`}>
      <input
        type="text"
        placeholder="أبحث عن"
        className="flex-1 bg-transparent border-none outline-none font-cairo font-medium text-base text-neutral-900 placeholder:text-neutral-800 text-right min-w-0"
        dir="rtl"
        {...props}
      />
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <Search01 aria-hidden="true" size={24} color="#404641" />
      </div>
    </div>
  );
}
