import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wifi, Battery, Globe, Zap } from 'lucide-react';

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
          <span className="text-accentAmber text-[10px] uppercase tracking-[0.4em] font-black">90 Dias / Sprint 1</span>
          <h1 className="text-serif text-5xl mt-3 font-medium text-white">Gestão <span className="text-accentAmber">Zanardini</span></h1>
        </div>
        <div className="flex gap-5 text-textMuted/30">
          <Globe size={18} title="Planta Global" />
          <ShieldCheck size={18} title="Categoria 4" />
          <Zap size={18} title="Energia Zero" className="text-green-500/50" />
        </div>
      </div>

      <div className="flex gap-12 mt-4 border-t border-white/5 pt-8">
        <div className="flex flex-col flex-1 max-w-[200px]">
          <span className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Budget R$ 180K (89% Alocado)</span>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accentAmber w-[89%]" />
            </div>
            <span className="text-xs text-mono text-white font-bold">89%</span>
          </div>
        </div>
        <div className="flex flex-col border-l border-white/5 pl-12">
          <span className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Risco Global</span>
          <span className="mt-2 text-xl font-medium text-white tracking-tight">PLe / <span className="text-accentRed">Categoria 4</span></span>
        </div>
      </div>
    </motion.div>
  );
}
