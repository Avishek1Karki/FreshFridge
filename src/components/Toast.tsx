import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <aside
      aria-label="Notification"
      aria-live="polite"
      className="fixed bottom-22 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-[#27313c] text-[#e8f2ff] text-[13px] font-medium shadow-xl flex items-center gap-2 z-50 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
    >
      <span className="material-symbols-outlined text-[#88d982] text-[18px]">
        {type === 'warning' ? 'error_outline' : 'verified'}
      </span>
      <span>{message}</span>
    </aside>
  );
};
