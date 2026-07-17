import React, { InputHTMLAttributes } from 'react';

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
      <div className="w-6 h-6 flex items-center justify-center text-neutral-800 shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21.0004 21L16.6504 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
