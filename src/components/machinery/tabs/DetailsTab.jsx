import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X, FileText, AlertTriangle } from 'lucide-react';
import { useAuthContext } from '../../../hooks/useAuthContext';

export default function DetailsTab({ selectedMachine, onUpdate, extraData }) {
  const { profile } = useAuthContext();
  const isAdmin = profile?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    model: selectedMachine?.model || '',
    manufacturer: selectedMachine?.manufacturer || '',
    action_required: selectedMachine?.action_required || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // LÓGICA AVANÇADA DE ADEQUAÇÃO
  const stats = useMemo(() => {
    if (!selectedMachine) return { pct: null, status: 'awaiting', pending: 20, total: 0 };
    const verif = extraData?.verifications || {};
    const values = Object.values(verif);
    const totalAnswered = values.length;
    const pending = 20 - totalAnswered;

    const compliant = values.filter(v => v === 'compliant').length;
    const nonCompliant = values.filter(v => v === 'non_compliant').length;
    const na = values.filter(v => v === 'na').length;

    // Se ninguém respondeu
    if (totalAnswered === 0) return { pct: null, status: 'awaiting', pending: 20, total: 0 };

    // Cálculo: Conforme / (Conforme + N. Conforme)
    const denominator = compliant + nonCompliant;
    
    // Caso especial: Tudo N/A (é considerado 100% seguro)
    if (denominator === 0 && na > 0) return { pct: 100, status: 'complete', pending: 0, total: na };

    const pct = denominator === 0 ? 0 : Math.round((compliant / denominator) * 100);
    
    return {
      pct,
      status: pending === 0 ? 'complete' : 'partial',
      pending,
      total: totalAnswered
    };
  }, [extraData?.verifications, selectedMachine]);

  const getBarColor = (pct) => {
    if (pct === null) return 'bg-borderBrand';
    if (pct < 50) return 'bg-accentRed';
    if (pct < 75) return 'bg-accentAmber';
    if (pct < 90) return 'bg-blue-500';
    return 'bg-accentGreen';
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdate(selectedMachine.id, { 
      ...formData, 
      compliance_pct: stats.pct || 0 
    });
    if (success) setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      model: selectedMachine.model || '',
      manufacturer: selectedMachine.manufacturer || '',
      action_required: selectedMachine.action_required || ''
    });
    setIsEditing(false);
  };

  if (!selectedMachine) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-left">
      <div className="space-y-8">
        {/* ESPECIFICAÇÕES */}
        <section className="bg-white p-6 rounded-2xl border border-borderBrand/50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted border-l-2 border-accentAmber pl-3">Especificações Técnicas</h5>
            {isAdmin && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 hover:bg-surfaceSubtle rounded-lg text-textMuted hover:text-accentAmber transition-all flex items-center gap-2 border border-transparent hover:border-borderBrand">
                <Edit2 size={12} />
                <span className="text-[9px] font-bold uppercase">Editar</span>
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-3 py-1.5 hover:bg-accentRedLight rounded-lg text-accentRed transition-all flex items-center gap-1 border border-transparent hover:border-accentRed/20">
                  <X size={12} />
                  <span className="text-[9px] font-bold uppercase">Cancelar</span>
                </button>
                <button disabled={isSaving} onClick={handleSave} className="px-4 py-1.5 bg-accentGreen text-white rounded-lg hover:bg-accentGreen/90 transition-all flex items-center gap-1 shadow-sm shadow-accentGreen/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Check size={12} />}
                  <span className="text-[9px] font-bold uppercase">Salvar</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'bg-white border-accentAmber/30 ring-1 ring-accentAmber/10' : 'bg-surfaceSubtle/50 border-borderBrand'}`}>
              <p className="text-[9px] text-textMuted uppercase font-bold mb-1.5 tracking-wider">Modelo Comercial</p>
              {isEditing ? (
                <input type="text" autoFocus value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none text-textPrimary" />
              ) : (
                <p className="text-sm font-bold text-textPrimary">{selectedMachine.model || '—'}</p>
              )}
            </div>
            <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'bg-white border-accentAmber/30 ring-1 ring-accentAmber/10' : 'bg-surfaceSubtle/50 border-borderBrand'}`}>
              <p className="text-[9px] text-textMuted uppercase font-bold mb-1.5 tracking-wider">Fabricante</p>
              {isEditing ? (
                <input type="text" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none text-textPrimary" />
              ) : (
                <p className="text-sm font-bold text-textPrimary">{selectedMachine.manufacturer || '—'}</p>
              )}
            </div>
          </div>
        </section>
        
        {/* PRESCRIÇÃO */}
        <section>
           <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-4 ml-1">Prescrição Técnica NR-12</h5>
           <div className="relative group">
             <div className="absolute inset-0 bg-accentAmber/5 rounded-2xl blur-xl group-hover:bg-accentAmber/10 transition-colors" />
             <div className={`relative p-6 border rounded-2xl shadow-sm transition-all ${isEditing ? 'bg-white border-accentAmber/40 ring-2 ring-accentAmber/5' : 'bg-white border-accentAmber/20'}`}>
                {isEditing ? (
                  <textarea rows={4} value={formData.action_required} onChange={(e) => setFormData({...formData, action_required: e.target.value})} className="w-full bg-transparent border-none p-0 text-sm text-textPrimary leading-relaxed font-medium italic outline-none resize-none" />
                ) : (
                  <p className="text-sm text-textPrimary leading-relaxed font-medium italic">
                    "{selectedMachine.action_required || "Nenhum detalhe técnico de adequação inserido para esta unidade."}"
                  </p>
                )}
             </div>
           </div>
        </section>
      </div>
      
      <div className="space-y-8">
        {/* STATUS GLOBAL (REPROJETADO) */}
        <div className="bento-card p-8 bg-white border-borderBrand shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-6 flex justify-between items-center">
              Status da Adequação Global
              <AnimatePresence>
                {stats.status === 'partial' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 bg-accentAmber/10 text-accentAmber px-2 py-1 rounded-lg animate-pulse"
                  >
                    <AlertTriangle size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-tighter">{stats.pending} PENDENTES</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </h5>

            <div className="flex items-baseline gap-3 mb-4">
              <span className={`text-6xl font-bold font-mono tracking-tighter transition-colors ${stats.pct === null ? 'text-textMuted' : 'text-textPrimary group-hover:text-accentAmber'}`}>
                {stats.pct === null ? '—' : `${stats.pct}%`}
              </span>
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest">
                {stats.status === 'awaiting' ? 'Aguardando Inspeção' : stats.status === 'partial' ? 'Parcial' : 'Completo'}
              </span>
            </div>

            <div className="w-full bg-surfaceSubtle h-4 rounded-full overflow-hidden shadow-inner border border-borderBrand/50 relative">
              {stats.pct !== null ? (
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${stats.pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full relative ${getBarColor(stats.pct)}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                </motion.div>
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_10px,#f8fafc_10px,#f8fafc_20px)]" />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-tight">
                {stats.status === 'awaiting' ? 'Nenhuma verificação iniciada' : `Baseado em ${stats.total} de 20 verificações`}
              </p>
              {stats.pct !== null && (
                <div className={`w-2 h-2 rounded-full ${getBarColor(stats.pct)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
              )}
            </div>
          </div>
          
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-surfaceSubtle rounded-full opacity-50 group-hover:scale-125 transition-transform" />
        </div>

        {/* NOTA EXPLICATIVA */}
        <div className="p-6 bg-surfaceSubtle/30 border border-borderBrand rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl text-textMuted">
            <FileText size={16} />
          </div>
          <p className="text-[11px] text-textSecondary leading-relaxed italic">
            O status de adequação ignora itens marcados como **N/A** (Não Aplicável). O percentual reflete apenas os pontos críticos de segurança identificados e avaliados até o momento.
          </p>
        </div>
      </div>
    </div>
  );
}
