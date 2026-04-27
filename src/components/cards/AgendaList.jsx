import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useAgenda } from '../../hooks/useAgenda';
import EmptyState from '../ui/EmptyState';
import { CalendarDays } from 'lucide-react';
import AgendaAddModal from './AgendaAddModal';
import ConfirmModal from '../ui/ConfirmModal';
import AdminOnly from '../admin/AdminOnly';

export default function AgendaList() {
  const { events, loading, fetchEvents, addEvent, deleteEvent } = useAgenda();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, eventId: null });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async (title, time) => {
    await addEvent({
      title,
      event_time: time,
      event_date: new Date().toISOString().split('T')[0],
      type: 'Geral'
    });
  };

  const handleDeleteRequest = (id) => {
    setDeleteModal({ open: true, eventId: id });
  };

  const confirmDelete = async () => {
    if (deleteModal.eventId) {
      await deleteEvent(deleteModal.eventId);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-serif text-xl font-medium">Agenda de Hoje</h3>
        <AdminOnly>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-accentAmber"
          >
            <Plus size={18} />
          </button>
        </AdminOnly>
      </div>

      <div className="space-y-4">
        {loading && events.length === 0 ? (
          <div className="py-10 flex justify-center">
             <div className="w-4 h-4 border-2 border-accentAmber/30 border-t-accentAmber rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="py-6">
            <EmptyState 
              icon={CalendarDays}
              title="Nada agendado"
              message="Você não possui compromissos registrados para o dia de hoje."
              actionLabel="Criar Evento"
              onAction={() => setIsAddOpen(true)}
            />
          </div>
        ) : events.map((event, i) => (
          <motion.div 
            key={event.id} 
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20 cursor-pointer"
          >
            <div className="mt-1.5 h-2 w-2 rounded-full bg-accentAmber shrink-0 shadow-[0_0_8px_rgba(217,119,6,0.5)] group-hover:scale-125 transition-transform" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-textSecondary font-medium group-hover:text-textPrimary transition-colors">
                  {event.event_time.substring(0, 5)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-textMuted px-2 py-0.5 rounded-full border border-borderBrand group-hover:border-accentAmber/30 group-hover:text-accentAmber transition-all">
                    {event.type}
                  </span>
                  <AdminOnly>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteRequest(event.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-textMuted hover:text-accentRed transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </AdminOnly>
                </div>
              </div>
              <p className="text-sm mt-1 text-textPrimary group-hover:text-accentAmber transition-colors font-medium">{event.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AgendaAddModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddEvent}
      />

      <ConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, eventId: null })}
        onConfirm={confirmDelete}
        title="Excluir Evento"
        message="Deseja remover este compromisso da sua agenda?"
        confirmLabel="Excluir"
        isDestructive={true}
      />
    </motion.div>
  );
}


