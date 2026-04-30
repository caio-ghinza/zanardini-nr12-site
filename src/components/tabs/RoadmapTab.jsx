import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ListChecks
} from 'lucide-react';
import { useRoadmap } from '../../hooks/useRoadmap';
import EmptyState from '../ui/EmptyState';
import ConfirmModal from '../ui/ConfirmModal';
import InputModal from '../ui/InputModal';
import AdminOnly from '../admin/AdminOnly';

export default function RoadmapTab() {
  const {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  } = useRoadmap();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, taskId: null });
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleDone = async (task) => {
    const isDone = task.status === 'concluido';
    await updateTask(task.id, { 
      status: isDone ? 'pendente' : 'concluido',
      completion_pct: isDone ? 0 : 100
    });
  };

  const handleAddTaskClick = () => {
    setAddModalOpen(true);
  };

  const confirmAddTask = async (name) => {
    await addTask({
      week_number: selectedWeek,
      task_name: name,
      responsible: 'CZ',
      priority: 'Media',
      status: 'pendente',
      completion_pct: 0
    });
  };

  const handleDeleteRequest = (id) => {
    setDeleteModal({ open: true, taskId: id });
  };

  const confirmDeleteTask = async () => {
    if (deleteModal.taskId) {
      await deleteTask(deleteModal.taskId);
    }
  };

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);
  const weekTasks = tasks.filter(t => t.week_number === selectedWeek);
  const isWeekCompleted = weekTasks.length > 0 && weekTasks.every(t => t.status === 'concluido');
  const inProgress = weekTasks.some(t => t.status === 'concluido') && !isWeekCompleted;
  const normalizePriority = (priority) => {
    const p = (priority || '').toLowerCase();
    if (p.includes('crit')) return 'Critica';
    if (p.includes('alta')) return 'Alta';
    if (p.includes('baix')) return 'Baixa';
    return 'Media';
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* TIMELINE OVERVIEW */}
      <div className="bento-card p-10">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-textPrimary">
             <Calendar size={16} className="text-accentAmber" />
             Cronograma de Execução
           </h3>
           <div className="flex gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accentAmber" /> Selecionado
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-borderBrand" /> Outras Semanas
              </span>
           </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-[800px]">
            {weeks.map(w => {
              const isSelected = selectedWeek === w;
              const hasTasks = tasks.some(t => t.week_number === w);
              const isDone = hasTasks && tasks.filter(t => t.week_number === w).every(t => t.status === 'concluido');

              return (
                <button 
                  key={w} 
                  onClick={() => setSelectedWeek(w)}
                  className="flex-1 flex flex-col items-center gap-2 group transition-all"
                >
                  <span className={`text-[9px] font-bold transition-colors ${isSelected ? 'text-accentAmber' : 'text-textMuted group-hover:text-textPrimary'}`}>
                    S{w}
                  </span>
                  <div className={`w-full h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                    isSelected ? 'bg-accentAmber/10 border-accentAmber shadow-lg shadow-accentAmber/10' : 
                    isDone ? 'bg-accentGreen/10 border-accentGreen/30' :
                    'bg-surfaceSubtle border-borderBrand group-hover:border-borderStrong'
                  }`}>
                    {isDone && <CheckCircle2 size={12} className="text-accentGreen" />}
                    {!isDone && hasTasks && <div className="w-1.5 h-1.5 rounded-full bg-accentAmber/40" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-textMuted mt-4 px-2">
           <span>Início do Projeto</span>
           <span>Marco Final (12 Semanas)</span>
        </div>
      </div>

      {/* SELECTED WEEK CARD */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-end px-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surfaceSubtle border border-borderBrand flex items-center justify-center font-bold text-lg text-textPrimary">
                {selectedWeek}
              </div>
              <div>
                <p className="text-[9px] text-textMuted uppercase font-bold tracking-[0.2em]">Planejamento Semanal</p>
                <h4 className="text-xl font-bold text-textPrimary">Semana {selectedWeek}</h4>
              </div>
           </div>
           <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
             isWeekCompleted ? 'bg-accentGreenLight text-accentGreen border-accentGreen/20' : 
             inProgress ? 'bg-accentBlueLight text-accentBlue border-accentBlue/20' : 
             'bg-surfaceSubtle text-textMuted border-borderBrand'
           }`}>
              {isWeekCompleted ? 'Concluída' : inProgress ? 'Em Execução' : 'Pendente'}
           </span>
        </div>

        <div className={`bento-card border-t-4 bg-white overflow-hidden shadow-xl`} style={{ borderTopColor: isWeekCompleted ? '#16A34A' : inProgress ? '#0284C7' : '#D97706' }}>
           <AnimatePresence mode="wait">
             {loading ? (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="p-20 flex justify-center"
               >
                 <div className="w-6 h-6 border-2 border-accentAmber/20 border-t-accentAmber rounded-full animate-spin" />
               </motion.div>
             ) : weekTasks.length === 0 ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="py-20"
               >
                 <EmptyState 
                   icon={ListChecks}
                   title="Nenhuma tarefa"
                   message={`Não há atividades registradas para a Semana ${selectedWeek}.`}
                   actionLabel="Adicionar Tarefa"
                   onAction={handleAddTaskClick}
                 />
               </motion.div>
             ) : (
               <motion.div 
                 key="tasks"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="divide-y divide-borderBrand"
               >
                 {weekTasks.map((task, idx) => (
                   <div key={task.id} className="p-6 flex items-start gap-5 transition-all hover:bg-surfaceSubtle group">
                     <AdminOnly>
                       <button 
                         onClick={() => toggleDone(task)}
                         className={`mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                           task.status === 'concluido' ? 'bg-accentGreen border-accentGreen text-white shadow-lg shadow-accentGreen/20' : 'border-borderBrand hover:border-accentAmber'
                         }`}
                       >
                         {task.status === 'concluido' && <CheckCircle2 size={14} />}
                       </button>
                     </AdminOnly>
                     
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className={`text-sm font-bold leading-tight ${task.status === 'concluido' ? 'text-textMuted line-through' : 'text-textPrimary'}`}>
                            {task.task_name}
                          </h5>
                           <AdminOnly>
                             <button 
                               onClick={() => handleDeleteRequest(task.id)}
                               className="p-1.5 text-textMuted hover:text-accentRed transition-all opacity-0 group-hover:opacity-100 rounded-lg hover:bg-accentRedLight/20"
                             >
                               <Trash2 size={14} />
                             </button>
                           </AdminOnly>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-white border border-borderBrand flex items-center justify-center text-[8px] font-bold text-textSecondary shadow-sm">
                              {task.responsible}
                            </div>
                            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Líder Técnico</span>
                          </div>
                          
                          <div className="h-3 w-px bg-borderBrand" />
                          
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            normalizePriority(task.priority) === 'Critica' ? 'bg-accentRedLight text-accentRed' :
                            normalizePriority(task.priority) === 'Alta' ? 'bg-accentAmberLight text-accentAmber' :
                            'bg-surfaceSubtle text-textMuted'
                          }`}>Prioridade {normalizePriority(task.priority)}</span>
                        </div>
                     </div>
                   </div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>

           <AdminOnly>
             <button 
               onClick={handleAddTaskClick}
               className="w-full p-5 border-t border-borderBrand text-[10px] font-bold uppercase tracking-[0.2em] text-textSecondary hover:bg-surfaceSubtle hover:text-accentAmber transition-all flex items-center justify-center gap-2 group"
             >
               <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
               Inserir Atividade na Semana {selectedWeek}
             </button>
           </AdminOnly>
        </div>
      </div>

      {/* Modals */}
      <InputModal 
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={confirmAddTask}
        title={`Nova Tarefa — Semana ${selectedWeek}`}
        placeholder="Descreva a atividade técnica..."
        label="Descrição da Atividade"
      />

      <ConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, taskId: null })}
        onConfirm={confirmDeleteTask}
        title="Remover Atividade"
        message="Deseja realmente excluir esta tarefa do cronograma? Esta ação é irreversível."
        confirmLabel="Excluir"
        isDestructive={true}
      />
    </div>
  );
}
