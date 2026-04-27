import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Edit2, Check, X } from 'lucide-react';

export default function DetailsTab({ selectedMachine, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    model: selectedMachine?.model || '',
    manufacturer: selectedMachine?.manufacturer || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!selectedMachine) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdate(selectedMachine.id, formData);
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      model: selectedMachine.model || '',
      manufacturer: selectedMachine.manufacturer || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
      <div className="space-y-8 text-left">
        <section className="bg-white p-6 rounded-2xl border border-borderBrand/50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted border-l-2 border-accentAmber pl-3">Especificações Técnicas</h5>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 hover:bg-surfaceSubtle rounded-lg text-textMuted hover:text-accentAmber transition-all flex items-center gap-2 border border-transparent hover:border-borderBrand"
              >
                <Edit2 size={12} />
                <span className="text-[9px] font-bold uppercase">Editar</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="px-3 py-1.5 hover:bg-accentRedLight rounded-lg text-accentRed transition-all flex items-center gap-1 border border-transparent hover:border-accentRed/20"
                >
                  <X size={12} />
                  <span className="text-[9px] font-bold uppercase">Cancelar</span>
                </button>
                <button 
                  disabled={isSaving}
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-accentGreen text-white rounded-lg hover:bg-accentGreen/90 transition-all flex items-center gap-1 shadow-sm shadow-accentGreen/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Check size={12} />}
                  <span className="text-[9px] font-bold uppercase">Salvar</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'bg-white border-accentAmber/30 ring-1 ring-accentAmber/10' : 'bg-surfaceSubtle/50 border-borderBrand'}`}>
              <p className="text-[9px] text-textMuted uppercase font-bold mb-1.5 tracking-wider">Modelo Comercial</p>
              {isEditing ? (
                <input 
                  type="text"
                  autoFocus
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none text-textPrimary placeholder:text-textMuted"
                  placeholder="Ex: DKB6L"
                />
              ) : (
                <p className="text-sm font-bold text-textPrimary">{selectedMachine.model}</p>
              )}
            </div>
            <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'bg-white border-accentAmber/30 ring-1 ring-accentAmber/10' : 'bg-surfaceSubtle/50 border-borderBrand'}`}>
              <p className="text-[9px] text-textMuted uppercase font-bold mb-1.5 tracking-wider">Fabricante</p>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold outline-none text-textPrimary placeholder:text-textMuted"
                  placeholder="Ex: SUPER Machinery"
                />
              ) : (
                <p className="text-sm font-bold text-textPrimary">{selectedMachine.manufacturer}</p>
              )}
            </div>
          </div>
        </section>
        
        <section className="bg-white p-6 rounded-2xl border border-borderBrand/50 shadow-sm">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-6 border-l-2 border-accentRed pl-3">Análise de Risco Preliminar (APR)</h5>
          <div className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
            selectedMachine.risk_level === 'extremo' ? 'border-accentRed bg-accentRedLight/10' : 'border-accentAmber bg-accentAmberLight/10'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-bold text-textPrimary">Categoria NR-12: {selectedMachine.risk_level?.toUpperCase()}</p>
              <div className={`p-1.5 rounded-full ${selectedMachine.risk_level === 'extremo' ? 'bg-accentRed text-white' : 'bg-accentAmber text-white'}`}>
                <ShieldCheck size={14} />
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-white/20">
              <p className="text-[10px] text-textSecondary uppercase font-bold tracking-wider mb-1">Ponto de Perigo Identificado:</p>
              <p className="text-xs font-medium text-textPrimary leading-relaxed">{selectedMachine.anomaly || 'Nenhuma anomalia crítica informada.'}</p>
            </div>
          </div>
        </section>
        
        <section>
           <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-4 ml-1">Prescrição Técnica</h5>
           <div className="relative group">
             <div className="absolute inset-0 bg-accentAmber/5 rounded-2xl blur-xl group-hover:bg-accentAmber/10 transition-colors" />
             <div className="relative p-6 bg-white border border-accentAmber/20 rounded-2xl shadow-sm">
               <p className="text-sm text-textPrimary leading-relaxed font-medium italic">
                 "{selectedMachine.action_required || "Nenhum detalhe técnico de adequação inserido para esta unidade."}"
               </p>
             </div>
           </div>
        </section>
      </div>
      
      <div className="space-y-8 text-left">
        <div className="bento-card p-8 bg-white border-borderBrand shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-6">Status da Adequação Global</h5>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-6xl font-bold font-mono tracking-tighter text-textPrimary group-hover:text-accentAmber transition-colors">{selectedMachine.compliance_pct}%</span>
              <span className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest">Auditado</span>
            </div>
            <div className="w-full bg-surfaceSubtle h-3 rounded-full overflow-hidden shadow-inner border border-borderBrand/50">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${selectedMachine.compliance_pct}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full relative ${
                  selectedMachine.compliance_pct > 80 ? 'bg-accentGreen' : 
                  selectedMachine.compliance_pct > 30 ? 'bg-accentAmber' : 'bg-accentRed'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20" 
                />
              </motion.div>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-surfaceSubtle rounded-full opacity-50 group-hover:scale-125 transition-transform" />
        </div>

        <div className="p-8 border-2 border-dashed border-borderBrand rounded-[32px] flex flex-col items-center justify-center text-center bg-surfaceSubtle/10 hover:bg-surfaceSubtle/20 transition-colors group cursor-default">
          <div className="w-16 h-16 rounded-2xl bg-white border border-borderBrand flex items-center justify-center text-accentAmber mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <ShieldCheck size={32} className="opacity-80" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-1">Certificação ART & Software</p>
          <p className="text-sm font-bold text-accentGreen flex items-center gap-2">
            <Check size={16} />
            Protocolo Sincronizado
          </p>
          <p className="text-[10px] text-textMuted mt-4 max-w-[200px]">Este ativo possui laudo técnico vigente e validação de software de segurança.</p>
        </div>
      </div>
    </div>
  );
}
