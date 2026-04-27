import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const machines = [
  {
    name: "Sopradora DKB6L (SUPER Machinery)",
    risk: "Extremo",
    logic: "CLP padrão monitorando porta",
    plr: "PLe / Categ. 4",
    action: "Instalar relé 2 canais + Válvula monitorada",
    progress: 15,
    color: "bg-accentRed"
  },
  {
    name: "Prensa Mecânica Chin Fong (250T)",
    risk: "Alto",
    logic: "Cortina de luz opcional inoperante",
    plr: "PLe / Categ. 4",
    action: "Enclausuramento trifacial + Cortina Tipo 4 + Calço QDC",
    progress: 45,
    color: "bg-accentCopper"
  },
  {
    name: "Célula Robótica Jifu MD10",
    risk: "Alto",
    logic: "Bimanuais em paralelo, violação ISO 10218-2",
    plr: "PLd / Categ. 3",
    action: "Scanner SICK S300 + Intertravamento de porta",
    progress: 10,
    color: "bg-accentCopper"
  },
  {
    name: "Alimentador NC",
    risk: "Médio",
    logic: "Acesso por rolos exposto",
    plr: "PLc / Categ. 2",
    action: "Medida Provisória (Isolamento administrativo)",
    progress: 100,
    color: "bg-accentAmber"
  }
];

export default function TabInventory() {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {machines.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bento-card p-6 border border-borderBrand hover:border-accentAmber/30 transition-all cursor-default group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-serif text-xl font-bold text-textPrimary group-hover:text-accentAmber transition-colors">{m.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${
                    m.risk === 'Extremo' ? 'bg-accentRedLight text-accentRed border-accentRed/20' : 
                    'bg-accentAmberLight text-accentAmber border-accentAmber/20'
                  }`}>
                    Risco {m.risk}
                  </span>
                  <span className="badge bg-surfaceSubtle text-textSecondary border-borderBrand">
                    Exigência: {m.plr}
                  </span>
                </div>
              </div>
              <div className="status-dot-pulse" />
            </div>

            <div className="space-y-4 mb-8 bg-surfaceSubtle/50 p-4 rounded-xl border border-borderBrand/50 group-hover:bg-white transition-colors">
              <div className="flex gap-3 items-start">
                <AlertTriangle size={14} className="text-accentRed mt-0.5 shrink-0" />
                <span className="text-xs text-textSecondary leading-relaxed"><b className="text-textPrimary">Anomalia:</b> {m.logic}</span>
              </div>
              <div className="flex gap-3 items-start">
                <Info size={14} className="text-accentAmber mt-0.5 shrink-0" />
                <span className="text-xs text-textSecondary leading-relaxed"><b className="text-accentAmber">Ação Corretiva:</b> {m.action}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] font-bold">
                <span className="text-textMuted">Status de Adequação</span>
                <span className="text-textPrimary font-mono">{m.progress}%</span>
              </div>
              <div className="w-full h-2 bg-surfaceSubtle rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${m.progress}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className={`h-full relative ${
                    m.progress === 100 ? 'bg-accentGreen' : 
                    m.progress > 40 ? 'bg-accentAmber' : 'bg-accentRed'
                  }`}
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>
              </div>
            </div>
            
            <button className="mt-6 w-full py-2.5 bg-transparent border border-borderBrand text-[9px] font-bold uppercase tracking-widest text-textMuted rounded-lg hover:bg-surfaceSubtle hover:text-textPrimary transition-all group-hover:border-accentAmber/20 group-hover:text-accentAmber">
              Visualizar APR Detalhada
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
