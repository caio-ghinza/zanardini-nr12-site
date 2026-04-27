import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const events = [
  { time: '08:30', title: 'Escrutínio: Inventário de Máquinas', tag: 'Sprint 1' },
  { time: '10:00', title: 'APR: Prensas Chin Fong 250T', tag: 'Prioridade' },
  { time: '14:30', title: 'Cotação: Bloqueio LOTO (SICK/Pilz)', tag: 'Financeiro' },
  { time: '16:00', title: 'Handshake: Robô Jifu vs Prensa', tag: 'Integração' },
];

export default function AgendaList() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="premium-card p-6"
    >
      <h3 className="text-serif text-xl font-medium mb-6">Agenda de Hoje</h3>
      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20 cursor-pointer"
          >
            <div className="mt-1.5 h-2 w-2 rounded-full bg-accentAmber shrink-0 shadow-[0_0_8px_rgba(217,119,6,0.5)] group-hover:scale-125 transition-transform" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-textSecondary font-medium group-hover:text-textPrimary transition-colors">{event.time}</span>
                <span className="text-[9px] uppercase tracking-widest text-textMuted px-2 py-0.5 rounded-full border border-borderBrand group-hover:border-accentAmber/30 group-hover:text-accentAmber transition-all">
                  {event.tag}
                </span>
              </div>
              <p className="text-sm mt-1 text-textPrimary group-hover:text-accentAmber transition-colors font-medium">{event.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
