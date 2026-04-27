import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <UIContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto min-w-[300px] bg-white border border-borderBrand shadow-2xl rounded-2xl p-4 flex items-center gap-4"
            >
              <div className={`p-2 rounded-xl ${
                toast.type === 'success' ? 'bg-accentGreenLight text-accentGreen' :
                toast.type === 'error' ? 'bg-accentRedLight text-accentRed' :
                'bg-accentAmberLight text-accentAmber'
              }`}>
                {toast.type === 'success' ? <CheckCircle2 size={20} /> :
                 toast.type === 'error' ? <AlertCircle size={20} /> :
                 <Info size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-textPrimary">{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-textMuted hover:text-textPrimary transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
