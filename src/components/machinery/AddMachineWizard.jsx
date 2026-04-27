import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShieldCheck } from 'lucide-react';
import { useUI } from '../ui/UIContext';

export default function AddMachineWizard({ isOpen, onClose, onCreateMachine }) {
  const { addToast } = useUI();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    model: '',
    risk_level: 'medio'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await onCreateMachine({
        ...formData,
        compliance_pct: 0,
        status: 'pendente'
      });

      if (error) throw error;
      addToast('Máquina cadastrada com sucesso!', 'success');
      onClose();
    } catch (err) {
      console.error('Error saving machine:', err);
      addToast('Erro ao salvar no Supabase.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-background/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-2xl border border-brand shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-brand flex justify-between items-center bg-surfaceSubtle/30">
           <div>
             <h3 className="text-lg font-bold">Novo Registro NR-12</h3>
             <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest">Passo {step} de 3</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-textMuted">
             <Plus size={20} className="rotate-45" />
           </button>
        </div>

        <div className="p-8 space-y-6">
           {step === 1 && (
             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 text-left">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Nome da Máquina</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Sopradora Principal" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full p-3 rounded-xl border border-brand bg-surfaceSubtle focus:bg-white outline-none focus:ring-1 focus:ring-accentAmber/50 transition-all text-sm" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Fabricante</label>
                     <input 
                       type="text" 
                       placeholder="Ex: Moretti" 
                       value={formData.manufacturer}
                       onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                       className="w-full p-3 rounded-xl border border-brand bg-surfaceSubtle outline-none text-sm" 
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted">Modelo</label>
                     <input 
                       type="text" 
                       placeholder="Ex: MK-200" 
                       value={formData.model}
                       onChange={(e) => setFormData({...formData, model: e.target.value})}
                       className="w-full p-3 rounded-xl border border-brand bg-surfaceSubtle outline-none text-sm" 
                     />
                   </div>
                </div>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted block mb-4">Nível de Risco Identificado (APR)</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Extremo (PLe / Cat 4)', value: 'extremo' },
                    { label: 'Alto (PLd / Cat 3)', value: 'alto' },
                    { label: 'Médio (PLc / Cat 2)', value: 'medio' },
                    { label: 'Baixo (PLb / Cat 1)', value: 'baixo' }
                  ].map((level) => (
                    <div 
                      key={level.value} 
                      onClick={() => setFormData({...formData, risk_level: level.value})}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${formData.risk_level === level.value ? 'border-accentAmber bg-accentAmberLight/20' : 'border-brand hover:border-accentAmber'}`}
                    >
                       <span className="text-xs font-bold text-textPrimary">{level.label}</span>
                       <div className={`w-4 h-4 rounded-full border-2 transition-all ${formData.risk_level === level.value ? 'border-accentAmber bg-accentAmber' : 'border-brand'}`} />
                    </div>
                  ))}
                </div>
             </motion.div>
           )}

           {step === 3 && (
             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accentGreenLight flex items-center justify-center text-accentGreen mb-6">
                   <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Pronto para Auditar</h4>
                <p className="text-sm text-textMuted max-w-[300px]">A máquina será inserida no inventário com compliance zero até que a primeira inspeção seja concluída.</p>
             </motion.div>
           )}
        </div>

        <div className="p-6 border-t border-brand bg-surfaceSubtle/30 flex justify-between gap-4">
           {step > 1 ? (
             <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:text-textPrimary">
                Voltar
             </button>
           ) : <div />}
           
           <button 
             disabled={isSaving}
             onClick={() => step < 3 ? setStep(step + 1) : handleSave()}
             className="px-8 py-2.5 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-accentAmberHover transition-all shadow-md shadow-accentAmber/20 disabled:opacity-50"
           >
              {isSaving ? 'Salvando...' : step === 3 ? 'Finalizar Cadastro' : 'Próximo Passo'}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
