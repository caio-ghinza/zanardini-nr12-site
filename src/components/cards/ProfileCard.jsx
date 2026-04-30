import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function ProfileCard() {
  const { profile } = useAuthContext();

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-card p-8 h-full flex flex-col justify-between bg-surface"
    >
      <div className="flex justify-between items-start">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accentAmber/20 to-accentAmber/5 border border-accentAmber/30 flex items-center justify-center overflow-hidden">
            <span className="text-serif text-2xl font-bold text-accentAmber">
              {getInitials(profile?.full_name)}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1">
             <div className="status-dot-amber scale-75 border-4 border-surface" />
          </div>
        </div>
        <div className="text-textMuted/20">
          <User size={20} />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2">
          <h2 className="text-serif text-2xl font-semibold tracking-tight text-white">{profile?.full_name || 'Usuário'}</h2>
          {profile?.role === 'admin' && <ShieldCheck size={16} className="text-accentAmber" />}
        </div>
        <p className="text-textMuted text-[11px] uppercase tracking-widest font-bold mt-1">
          {profile?.role === 'admin' ? 'Administrador Líder' : 'Cliente / Gestor'}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[9px] uppercase tracking-widest font-bold text-green-500">Sincronizado</span>
        <span className="px-3 py-1 rounded-lg bg-accentAmber/10 border border-accentAmber/20 text-[9px] uppercase tracking-widest font-bold text-accentAmber">Acesso NR-12</span>
      </div>
    </motion.div>
  );
}
