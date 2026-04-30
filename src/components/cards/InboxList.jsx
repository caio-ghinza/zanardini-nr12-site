import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, MessageSquare } from 'lucide-react';

const messages = [];

export default function InboxList() {
  return (
    <div className="bento-card p-6 flex flex-col h-full bg-surfaceDark/50 min-h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-accentAmber" size={20} />
          <h3 className="text-serif text-xl font-medium text-white">Ações Críticas</h3>
        </div>
        <Search size={16} className="text-textMuted cursor-pointer hover:text-textPrimary" />
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-4 py-10">
             <Mail size={48} className="mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-white">Nenhuma ação crítica pendente</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.6 }}
              className={`
                p-5 rounded-xl cursor-pointer transition-all border border-transparent
                ${msg.unread ? 'bg-white/5 border-white/10' : 'hover:bg-white/5'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-semibold ${msg.unread ? 'text-white' : 'text-textSecondary'}`}>
                  {msg.from}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${msg.tagColor}`}>{msg.tag}</span>
              </div>
              <h4 className="text-[11px] font-bold mt-1 text-accentAmber/80 uppercase tracking-widest">{msg.subject}</h4>
              <p className="text-xs mt-3 text-textMuted leading-relaxed line-clamp-2">{msg.preview}</p>
            </motion.div>
          ))
        )}
      </div>
      
      <button className="mt-8 w-full py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-[0.25em] text-textSecondary">
        Acessar Comunicados
      </button>
    </div>
  );
}
