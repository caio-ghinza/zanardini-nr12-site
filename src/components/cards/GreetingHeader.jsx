import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap } from 'lucide-react';

export default function GreetingHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bento-card p-10 h-full flex flex-col justify-center bg-surfaceDark/50"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-accentAmber text-[10px] uppercase tracking-[0.4em] font-black">Sistema de Engenharia</span>
          <h1 className="text-serif text-5xl mt-3 font-medium text-white">Gestão <span className="text-accentAmber">Zanardini</span></h1>
          <p className="text-xs text-textMuted mt-2 uppercase tracking-widest font-bold">Adequação NR-12 e Segurança Industrial</p>
        </div>
        <div className="flex gap-5 text-textMuted/30">
          <Globe size={18} title="Planta Industrial" />
          <ShieldCheck size={18} title="Conformidade" />
          <Zap size={18} title="Segurança" className="text-accentAmber/30" />
        </div>
      </div>

      <div className="flex gap-12 mt-4 border-t border-white/5 pt-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Status do Sistema</span>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
            <span className="text-xs text-white font-bold uppercase tracking-widest">Sincronizado com Supabase</span>
          </div>
        </div>
        <div className="flex flex-col border-l border-white/5 pl-12">
          <span className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Ambiente</span>
          <span className="mt-2 text-xl font-medium text-white tracking-tight uppercase">Produção <span className="text-accentAmber">Auditada</span></span>
        </div>
      </div>
    </motion.div>
  );
}
