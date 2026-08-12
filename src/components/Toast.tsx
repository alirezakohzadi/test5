'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  duration?: number;
}

const SingleToast: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  duration: number;
}> = ({ toast, onDismiss, duration }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss, duration]);

  return (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-auto relative overflow-hidden flex items-center justify-between p-4 rounded-2xl glass-panel shadow-2xl border border-white/80 bg-white/95 text-[#191C1D]"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            toast.type === 'success'
              ? 'bg-[#0D7366]/10 text-[#0D7366]'
              : toast.type === 'warning'
              ? 'bg-[#D4AF37]/20 text-[#8A6D0B]'
              : 'bg-sky-50 text-sky-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Info className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#191C1D]">{toast.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors mr-2"
        aria-label="بستن"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 20-second countdown visual indicator */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 right-0 h-1 ${
          toast.type === 'success'
            ? 'bg-[#0D7366]'
            : toast.type === 'warning'
            ? 'bg-[#D4AF37]'
            : 'bg-sky-500'
        }`}
      />
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, duration = 20000 }) => {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onDismiss={onDismiss} duration={duration} />
        ))}
      </AnimatePresence>
    </div>
  );
};
