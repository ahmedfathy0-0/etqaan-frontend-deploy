import React from 'react';
import { TextField } from './TextField';
import { Button } from './Button';

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddMemberModal({ isOpen, onClose, onSubmit }: AddMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full md:w-[750px] bg-white rounded-t-[16px] md:rounded-[16px] shadow-2xl overflow-hidden animate-slide-up md:animate-fade-in flex flex-col items-center p-8 gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Close */}
        <div className="w-full flex justify-between items-center mb-2">
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 transition-colors p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="text-3xl font-bold font-cairo text-success-800 text-right w-full">إضافة عضو جديد</h2>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col items-center w-full max-w-[520px] gap-6">
          <TextField 
            label="اسم المستخدم" 
            placeholder="الاسم الكامل"
            type="text"
            required
          />
          
          <TextField 
            label="البريد الإلكتروني" 
            placeholder="Example@gmail.com"
            type="email"
            required
          />

          <TextField 
            label="الدور" 
            placeholder="اختر الدور"
            readOnly
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            className="cursor-pointer"
          />

          <div className="mt-4 w-full">
            <Button 
              type="submit" 
              variant="primary" 
              size="md"
              className="w-full"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3H14.5858C15.1162 3 15.6249 3.21071 16 3.58579L20.4142 8C20.7893 8.37508 21 8.88378 21 9.41421V17C21 19.2091 19.2091 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21V13H7V21M7 3V8H15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              حفظ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
