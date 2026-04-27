import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MachineCard({ machine, onClick }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'extremo': return 'text-accentRed bg-accentRedLight/20';
      case 'alto': return 'text-accentAmber bg-accentAmberLight/20';
      case 'medio': return 'text-accentBlue bg-accentBlueLight/20';
      default: return 'text-textMuted bg-surfaceSubtle';
    }
  };

  const openGaps = machine.document_gaps || [];
  const hasCriticalGap = openGaps.some(g => g.severity === 'critico');

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bento-card group cursor-pointer border border-borderBrand hover:border-accentAmber/40 transition-all overflow-hidden flex flex-col h-full bg-white shadow-sm hover:shadow-xl"
    >
      {/* IMAGEM E STATUS */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={machine.cover_image_url || `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80`} 
          alt={machine.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-textPrimary/90 via-textPrimary/20 to-transparent opacity-80" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`badge backdrop-blur-md border-white/20 ${getRiskColor(machine.risk_level)}`}>
            {machine.risk_level}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-left">
          <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-accentAmber transition-colors">{machine.name}</h3>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{machine.model} • {machine.manufacturer}</p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-5 flex-1 flex flex-col bg-surface transition-colors group-hover:bg-white">
        {/* BARRA DE CONFORMIDADE */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Conformidade NR-12</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tracking-tighter">{machine.compliance_pct}</span>
              <span className="text-[10px] text-textMuted font-bold">%</span>
            </div>
          </div>
          <div className="h-2 w-full bg-surfaceSubtle rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${machine.compliance_pct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className={`h-full relative ${
                machine.compliance_pct > 80 ? 'bg-accentGreen' : 
                machine.compliance_pct > 40 ? 'bg-accentAmber' : 'bg-accentRed'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* SEÇÃO DE GAPS (BLOCO 3) */}
        {openGaps.length > 0 ? (
          <div className={`mt-2 p-4 rounded-xl border transition-all duration-300 ${
            hasCriticalGap ? 'bg-accentRedLight/10 border-accentRed/20 hover:bg-accentRedLight/20' : 
            'bg-accentAmberLight/10 border-accentAmber/20 hover:bg-accentAmberLight/20'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1 rounded-full ${hasCriticalGap ? 'bg-accentRed text-white' : 'bg-accentAmber text-white'}`}>
                <AlertCircle size={12} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {openGaps.length} {openGaps.length === 1 ? 'gap documental' : 'gaps documentais'}
              </span>
            </div>
            
            <div className="space-y-2">
              {openGaps.slice(0, 3).map((gap, i) => (
                <div key={gap.id || i} className="flex items-center justify-between text-[10px]">
                  <span className="text-textPrimary font-medium truncate pr-2 max-w-[140px] group-hover:text-black transition-colors">{gap.title}</span>
                  <span className={`font-bold uppercase px-2 py-0.5 rounded-md text-[9px] ${
                    gap.severity === 'critico' ? 'bg-accentRed text-white' : 
                    gap.severity === 'alto' ? 'bg-accentAmber text-white' : 'bg-accentBlue text-white'
                  }`}>
                    {gap.severity}
                  </span>
                </div>
              ))}
              {openGaps.length > 3 && (
                <p className="text-[9px] text-textMuted font-bold mt-2 uppercase italic tracking-wider">+ {openGaps.length - 3} itens pendentes</p>
              )}
            </div>

            <button className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-accentAmber hover:text-accentAmberHover transition-all mt-4 pt-3 border-t border-accentAmber/10 w-full group/btn">
              Ver Dossiê Completo
              <ArrowRight size={10} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        ) : machine.compliance_pct >= 80 && (
          <div className="mt-2 flex items-center gap-2 text-accentGreen bg-accentGreenLight/20 p-4 rounded-xl border border-accentGreen/20">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Conformidade Plena Identificada</span>
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center justify-end">
          <button className="p-2 hover:bg-surfaceSubtle rounded-lg transition-all text-textMuted hover:text-textPrimary active:scale-90">
            <MoreVertical size={18} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
