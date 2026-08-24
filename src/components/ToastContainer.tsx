import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div
      id="global-toast-container"
      className="fixed top-3 sm:top-5 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-3 max-w-lg mx-auto"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 32,
              mass: 0.8
            }}
            id={`toast-${toast.id}`}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer w-full max-w-md py-2.5 px-3.5 sm:px-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl transition-all select-none ${
              toast.type === 'success'
                ? 'bg-[#18181B]/95 text-white border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-emerald-950/30'
                : toast.type === 'error'
                ? 'bg-[#18181B]/95 text-white border-rose-500/30 ring-1 ring-rose-500/20 shadow-rose-950/30'
                : 'bg-[#18181B]/95 text-white border-[#3F3F46] ring-1 ring-white/10 shadow-black/40'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0">
              {toast.type === 'success' && (
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-semibold text-white tracking-tight leading-tight truncate">
                {toast.title}
              </p>
              <p className="text-[11px] text-neutral-300 font-normal leading-snug line-clamp-1 mt-0.5">
                {toast.message}
              </p>
            </div>

            {/* Quick Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
