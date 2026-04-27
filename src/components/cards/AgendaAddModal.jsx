import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, X } from 'lucide-react';

export default function AgendaAddModal({ isOpen, onClose, onConfirm }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTime('08:00');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !time.trim()) return;
    onConfirm(title, time);
    onClose();
  };

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
                <div className="p-2 rounded-lg bg-accentAmberLight text-accentAmber">
                  <CalendarPlus size={20} />
                </div>
                <h3 className="text-lg font-bold text-textPrimary">Novo Evento</h3>
              </div>
              <button onClick={onClose} className="text-textMuted hover:text-textPrimary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">
                  Título do Compromisso
                </label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Auditoria de Campo..."
                  className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">
                  Horário
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber transition-all"
                />
              </div>
            </form>

            <div className="p-6 border-t border-borderBrand bg-surfaceSubtle flex gap-4 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:text-textPrimary transition-all border border-borderBrand rounded-lg bg-white/50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="px-8 py-2.5 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-accentAmberHover transition-all shadow-lg shadow-accentAmber/20 disabled:opacity-50 disabled:shadow-none"
              >
                Agendar Evento
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
