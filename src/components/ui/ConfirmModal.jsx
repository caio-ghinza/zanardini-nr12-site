import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirmar", 
  cancelLabel = "Cancelar",
  isDestructive = false
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md overflow-hidden rounded-2xl border border-borderBrand shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDestructive ? 'bg-accentRedLight text-accentRed' : 'bg-accentAmberLight text-accentAmber'}`}>
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold text-textPrimary">{title}</h3>
              </div>
              <button onClick={onClose} className="text-textMuted hover:text-textPrimary transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <p className="text-sm text-textSecondary leading-relaxed">
                {message}
              </p>
            </div>

            <div className="p-6 border-t border-borderBrand bg-surfaceSubtle flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:text-textPrimary transition-all border border-borderBrand rounded-lg bg-white/50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-lg transition-all shadow-lg ${
                  isDestructive ? 'bg-accentRed hover:bg-accentRed/90 shadow-accentRed/20' : 'bg-accentAmber hover:bg-accentAmberHover shadow-accentAmber/20'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
