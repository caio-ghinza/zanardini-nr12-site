import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, ShieldCheck } from 'lucide-react';

export default function ProfileCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-card p-8 h-full flex flex-col justify-between bg-surface"
    >
      <div className="flex justify-between items-start">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accentAmber/20 to-accentAmber/5 border border-accentAmber/30 flex items-center justify-center overflow-hidden">
            <span className="text-serif text-2xl font-bold text-accentAmber">CZ</span>
          </div>
          <div className="absolute -bottom-1 -right-1">
             <div className="status-dot-amber scale-75 border-4 border-surface" />
          </div>
        </div>
        <button className="text-textMuted hover:text-textPrimary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2">
          <h2 className="text-serif text-2xl font-semibold tracking-tight text-white">C. Zanardini</h2>
          <ShieldCheck size={16} className="text-accentAmber" />
        </div>
        <p className="text-textMuted text-[11px] uppercase tracking-widest font-bold mt-1">Lead NR-12 Project Engineer</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[9px] uppercase tracking-widest font-bold text-green-500">Audit Ready</span>
        <span className="px-3 py-1 rounded-lg bg-accentAmber/10 border border-accentAmber/20 text-[9px] uppercase tracking-widest font-bold text-accentAmber">PLe Specialist</span>
      </div>
    </motion.div>
  );
}
