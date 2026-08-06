import React, { useEffect, useRef } from "react";
import { Cancel01 } from "@dga-icons/react/duotone-rounded";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  headerColorClass?: string; // e.g. "bg-gradient-to-r from-blue-600 to-purple-600"
  maxWidth?: string; // e.g. "max-w-md", "max-w-2xl"
  overflowVisible?: boolean; // Allow dropdowns to escape modal bounds
}

export default function Modal({
  isOpen,
  onClose,
  title, // optional now, handled inline if needed
  children,
  maxWidth = "max-w-md",
  overflowVisible = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use portal if available, otherwise naive render (for now just naive render is fine in Next.js app dir usually, but portal is safer for z-index)
  // Since we are in app dir, we can just render at root if we want, but sticky positioning works.
  // Let's stick to simple fixed overlay for now.

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center z-[100] lg:p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-t-[16px] lg:rounded-[16px] w-full ${maxWidth} shadow-2xl relative ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} transform transition-all animate-slideUp lg:animate-scaleIn`}
        role="dialog"
        aria-modal="true"
      >

        {/* Body */}
        <div className={`w-full p-4 lg:p-6 ${overflowVisible ? 'overflow-visible' : 'max-h-[90vh] overflow-y-auto custom-scrollbar'}`}>
          {/* Close button inside the content flow so dropdown can render above without overlap */}
          <div className="flex justify-start mb-3">
            <button
              onClick={onClose}
              className="p-2 text-neutral-900 hover:text-neutral-700 bg-neutral-300 hover:bg-neutral-300 rounded-full transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <Cancel01 aria-hidden="true" size={20} />
            </button>
          </div>
          {title && (
            <div className="pb-2">
              <h2 className="text-xl font-bold font-arabic text-[#17481B]">{title}</h2>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
