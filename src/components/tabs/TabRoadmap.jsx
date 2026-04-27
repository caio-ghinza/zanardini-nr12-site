import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, ShieldCheck } from 'lucide-react';

const phases = [
  {
    id: 1,
    title: "Fase 1 - Diagnóstico",
    weeks: "Semanas 1-2",
    items: ["Inventário As-Built", "Check-list físico", "Interdições imediatas"],
    status: "In Progress",
    statusColor: "text-accentCyan",
    bg: "bg-surface"
  },
  {
    id: 2,
    title: "Fase 2 - Engenharia",
    weeks: "Semanas 3-6",
    items: ["Elaboração de APRs NBR ISO 12100", "Projetos de Hardwiring", "Ordens de compra"],
    status: "Upcoming",
    statusColor: "text-textMuted",
    bg: "bg-surfaceDark"
  },
  {
    id: 3,
    title: "Fase 3 - Implementação",
    weeks: "Semanas 7-10",
    items: ["Instalação eletromecânica", "Comissionamento", "Treinamento LOTO"],
    status: "Upcoming",
    statusColor: "text-textMuted",
    bg: "bg-surfaceDark"
  },
  {
    id: 4,
    title: "Fase 4 - Validação",
    weeks: "Semanas 11-12",
    items: ["Laudos técnicos finais", "Emissão de ART", "Dossiê Fotográfico MTE"],
    status: "Upcoming",
    statusColor: "text-textMuted",
    bg: "bg-surfaceDark"
  }
];

export default function TabRoadmap() {
  return (
    <div className="pb-12 max-w-5xl">
      <div className="relative border-l border-white/5 ml-8 pl-12 space-y-12">
        {phases.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bento-card p-8 ${phase.status === 'In Progress' ? 'ring-1 ring-accentAmber/30' : ''}`}
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[61px] top-10 w-4 h-4 rounded-full border-4 border-background ${phase.status === 'In Progress' ? 'bg-accentAmber shadow-[0_0_12px_rgba(208,122,58,0.5)]' : 'bg-textMuted'}`} />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-textMuted">{phase.weeks}</span>
                <h3 className="text-serif text-2xl font-medium text-white mt-1">{phase.title}</h3>
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${phase.statusColor}`}>
                {phase.status === 'In Progress' ? <Clock size={12} /> : <Calendar size={12} />}
                {phase.status}
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              {phase.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-textSecondary group">
                  <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'In Progress' ? 'bg-accentAmber' : 'bg-white/10'}`} />
                  {item}
                </li>
              ))}
            </ul>

            {phase.status === 'In Progress' && (
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-textMuted uppercase font-bold tracking-widest">Responsável Técnico: Caio Z.</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(dot => (
                    <div key={dot} className={`w-1 h-1 rounded-full ${dot <= 2 ? 'bg-accentAmber' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
