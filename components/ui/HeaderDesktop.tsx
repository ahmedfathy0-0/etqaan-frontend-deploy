import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export interface HeaderDesktopProps {
  activePath?: string;
  onAddClick?: () => void;
  avatarUrl?: string;
}

export function HeaderDesktop({ activePath = '/', onAddClick, avatarUrl }: HeaderDesktopProps) {
  const navLinks = [
    { label: 'مقولات تشجيعية', href: '/quotes' },
    { label: 'الحلقات', href: '/sessions' },
    { label: 'المستخدمين', href: '/users' },
    { label: 'لوحة التحكم', href: '/dashboard' },
  ];

  return (
    <header className="flex flex-row justify-between items-center w-full max-w-[1280px] h-[114px] px-6 mx-auto bg-transparent">
      {/* Left side: Avatar + Nav Links */}
      <div className="flex flex-row items-center gap-6">
        <div className="w-[66px] h-[66px] rounded-full bg-gray-200 overflow-hidden shadow-sm shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-success-100 text-success-800 text-2xl font-bold">
              م
            </div>
          )}
        </div>

        <nav className="flex flex-row items-center justify-center gap-6 px-4">
          {navLinks.map((link) => {
            const isActive = activePath === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`font-cairo font-bold text-lg leading-7 text-right transition-colors ${
                  isActive ? 'text-success-800' : 'text-neutral-900 hover:text-success-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side: Add Button */}
      <div className="shrink-0">
        <Button 
          variant="secondary" 
          size="md" 
          onClick={onAddClick}
          className="w-auto px-6 h-[56px] min-w-[116px]"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          إضافة
        </Button>
      </div>
    </header>
  );
}
