import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ToastMessage } from '../types/pos';

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-medium transition-all animate-bounce bg-emerald-600">
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span>{toast.message}</span>
    </div>
  );
};
