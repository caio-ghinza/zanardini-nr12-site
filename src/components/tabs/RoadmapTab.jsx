import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { supabase } from '../../supabase';

export default function RoadmapTab() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('roadmap_tasks').select('*');
      if (error) throw error;
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const phases = [
    {
      id: 1,
      name: "Fase 1 — Diagnóstico",
      weeks: "S1 - S2",
      color: "bg-accentAmber",
      status: "Concluído",
      tasks: [
        { name: "Levantamento As-Built", res: "CZ", prio: "Critica", done: true },
        { name: "Emissão Inventário Formal", res: "CZ", prio: "Alta", done: true },
        { name: "Checklist Físico NR-12", res: "RT", prio: "Media", done: true },
      ]
    },
    {
      id: 2,
      name: "Fase 2 — Engenharia",
      weeks: "S3 - S6",
      color: "bg-accentBlue",
      status: "Em Progresso",
      tasks: [
        { name: "Elaboração das APRs", res: "CZ", prio: "Critica", done: false },
        { name: "Projeto de Hardwiring", res: "Eng", prio: "Alta", done: false },
        { name: "Processo de Compras", res: "CZ", prio: "Alta", done: false },
      ]
    },
    {
      id: 3,
      name: "Fase 3 — Execução",
      weeks: "S7 - S10",
      color: "bg-accentGreen",
      status: "Pendente",
      tasks: [
        { name: "Instalação Dispositivos", res: "Ops", prio: "Critica", done: false },
        { name: "Testes e Comissionamento", res: "RT", prio: "Alta", done: false },
      ]
    }
  ];

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 pb-12">
      {/* TIMELINE OVERVIEW */}
      <div className="bento-card p-10 overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
             <Calendar size={16} className="text-accentAmber" />
             Cronograma de Execução (12 Semanas)
           </h3>
           <div className="flex gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accentAmber" /> Planejado
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-borderBrand" /> Em Aberto
              </span>
           </div>
        </div>

        <div className="min-w-[800px]">
          <div className="flex gap-1 mb-8">
            {weeks.map(w => (
              <div key={w} className="flex-1 flex flex-col items-center gap-2">
                <span className={`text-[9px] font-bold ${w === 4 ? 'text-accentAmber' : 'text-textMuted'}`}>S{w}</span>
                <div className={`w-full h-8 rounded-lg border-2 transition-all ${
                   w <= 2 ? 'bg-accentAmber/10 border-accentAmber' :
                   w <= 4 ? 'bg-accentBlue/10 border-accentBlue border-dashed animate-pulse' :
                   'bg-surfaceSubtle border-borderBrand'
                }`}>
                   {w === 4 && <div className="h-full w-1/2 bg-accentBlue" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-textMuted px-2">
             <span>Semana 1</span>
             <span>Semana 12 (Marco Final)</span>
          </div>
        </div>
      </div>

      {/* PHASE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {phases.map((phase) => (
          <div key={phase.id} className="space-y-4">
            <div className="flex justify-between items-end px-2">
               <div>
                  <p className="text-[9px] text-textMuted uppercase font-bold tracking-[0.2em]">{phase.weeks}</p>
                  <h4 className="text-lg font-bold">{phase.name}</h4>
               </div>
               <span className={`text-[9px] font-bold uppercase tracking-widest ${phase.status === 'Concluído' ? 'text-accentGreen' : phase.status === 'Em Progresso' ? 'text-accentBlue' : 'text-textMuted'}`}>
                  {phase.status}
               </span>
            </div>

            <div className={`bento-card border-t-4 bg-white`} style={{ borderTopColor: phase.status === 'Concluído' ? 'var(--tw-accentGreen)' : phase.status === 'Em Progresso' ? 'var(--tw-accentBlue)' : 'var(--tw-borderBrand)' }}>
               {phase.tasks.map((task, idx) => (
                 <div key={idx} className={`p-5 flex items-start gap-4 transition-all hover:bg-surfaceSubtle cursor-pointer ${idx !== phase.tasks.length - 1 ? 'border-b border-borderBrand' : ''}`}>
                   <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.done ? 'bg-accentGreen border-accentGreen text-white' : 'border-borderBrand'}`}>
                     {task.done && <CheckCircle2 size={12} />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h5 className={`text-xs font-bold leading-none mb-2 ${task.done ? 'text-textMuted line-through' : 'text-textPrimary'}`}>{task.name}</h5>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-5 h-5 rounded-full bg-surfaceSubtle border border-borderBrand flex items-center justify-center text-[8px] font-bold">{task.res}</div>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            task.prio === 'Critica' ? 'bg-accentRedLight text-accentRed' :
                            task.prio === 'Alta' ? 'bg-accentAmberLight text-accentAmber' :
                            'bg-surfaceSubtle text-textMuted'
                          }`}>{task.prio}</span>
                        </div>
                        {task.done ? <ShieldCheck size={14} className="text-accentGreen" /> : <Clock size={14} className="text-textMuted" />}
                      </div>
                   </div>
                 </div>
               ))}
               <button className="w-full p-4 border-t border-borderBrand text-[9px] font-bold uppercase tracking-[0.2em] text-textSecondary hover:bg-surfaceSubtle transition-all flex items-center justify-center gap-2">
                 <Plus size={14} />
                 Adicionar Tarefa
               </button>
            </div>
          </div>
        ))}

        {/* Phase 4 (Skeleton/Future) */}
        <div className="space-y-4 opacity-40 grayscale">
            <div className="px-2">
                <p className="text-[9px] text-textMuted uppercase font-bold tracking-[0.2em]">S11 - S12</p>
                <h4 className="text-lg font-bold">Fase 4 — Validação</h4>
            </div>
            <div className="bento-card h-[280px] border-2 border-dashed border-borderBrand flex flex-col items-center justify-center">
               <AlertCircle size={32} className="text-borderBrand mb-4" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-borderStrong">Aguardando Fase 2</p>
            </div>
        </div>
      </div>
    </div>
  );
}
