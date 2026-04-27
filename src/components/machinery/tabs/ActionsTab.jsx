import React from 'react';
import { PlusCircle, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';

export default function ActionsTab({ 
  extraData, 
  addMachineAction, 
  togglePartStatus, 
  deletePart 
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex gap-4">
        <input 
          id="newActionInput" 
          type="text" 
          placeholder="Adicionar nova ação (ex: Sensor de cortina)..."
          className="flex-1 p-4 rounded-xl border border-borderBrand bg-surfaceSubtle focus:bg-white outline-none focus:ring-1 focus:ring-accentAmber/50 transition-all text-sm"
        />
        <button 
          onClick={() => { const input = document.getElementById('newActionInput'); addMachineAction(input.value); input.value = ''; }}
          className="px-8 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accentAmberHover transition-all flex items-center gap-2"
        >
          <PlusCircle size={14} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {extraData.parts.length === 0 && (
          <div className="py-20 text-center opacity-20">
            <AlertTriangle size={48} className="mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma ação técnica pendente</p>
          </div>
        )}
        {extraData.parts.map((p, i) => (
          <div 
            key={p.id || i} 
            className="p-5 rounded-2xl border border-borderBrand flex items-center justify-between hover:bg-surfaceSubtle transition-all group bg-white shadow-sm"
          >
             <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => togglePartStatus(p)}>
               <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${p.status === 'instalado' ? 'bg-accentGreen border-accentGreen shadow-lg' : 'border-borderBrand'}`}>
                 {p.status === 'instalado' && <ShieldCheck size={14} className="text-white" />}
               </div>
               <span className={`font-bold text-sm ${p.status === 'instalado' ? 'line-through text-textMuted' : 'text-textPrimary'}`}>{p.part_name}</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-bold uppercase py-1 px-3 rounded-full bg-surfaceSubtle text-textMuted">{p.status}</span>
               <button onClick={() => deletePart(p.id)} className="p-2 opacity-0 group-hover:opacity-100 text-textMuted hover:text-accentRed transition-all">
                  <Trash2 size={16} />
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
