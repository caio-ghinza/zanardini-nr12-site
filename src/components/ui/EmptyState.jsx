import React from 'react';
import { motion } from 'framer-motion';
import { Ghost, Plus } from 'lucide-react';
import AdminOnly from '../admin/AdminOnly';

export default function EmptyState({ icon: Icon = Ghost, title, message, actionLabel, onAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-16 h-16 bg-surfaceSubtle rounded-2xl flex items-center justify-center text-textMuted mb-6 border border-borderBrand/50 shadow-sm">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-textPrimary font-sora tracking-tight">{title}</h3>
      <p className="text-sm text-textMuted mt-2 max-w-xs leading-relaxed">{message}</p>
      
      {onAction && actionLabel && (
        <AdminOnly>
          <button 
            onClick={onAction}
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-white border border-borderBrand text-xs font-bold uppercase tracking-widest rounded-xl hover:border-accentAmber hover:text-accentAmber transition-all shadow-sm group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            {actionLabel}
          </button>
        </AdminOnly>
      )}
    </motion.div>
  );
}
