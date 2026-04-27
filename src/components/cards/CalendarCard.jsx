import React from 'react';
import { motion } from 'framer-motion';

export default function CalendarCard() {
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const currentDay = new Date().getDay();
  const date = new Date().getDate();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="premium-card p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-serif text-xl font-medium">Cronograma de Sprints</h3>
        <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest">NR-12 | Q2 2026</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, ix) => (
          <div key={day} className="text-center">
            <span className="text-[9px] text-textMuted block mb-2">{day}</span>
            <div className={`
              h-9 w-full rounded-xl flex items-center justify-center text-xs transition-all
              ${ix === currentDay ? 'bg-accentAmber text-background font-bold shadow-lg shadow-accentAmber/20' : 'hover:bg-white/5 text-textSecondary'}
            `}>
              {date + (ix - currentDay)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
