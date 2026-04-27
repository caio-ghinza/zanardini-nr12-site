import React from 'react';
import { Search, PlusCircle, Cpu } from 'lucide-react';

export default function MachineryToolbar({ 
  search, 
  setSearch, 
  filterType, 
  setFilterType, 
  onAddMachine,
  onAutoScan,
  batchProgress
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* BUSCA */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
        <input 
          type="text" 
          placeholder="Buscar máquina ou modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-borderBrand/50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-accentAmber/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* FILTROS */}
      <div className="flex gap-3">
        <div className="flex bg-white p-1 rounded-2xl border border-borderBrand/50 shadow-sm">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'sopradora', label: 'Sopradoras' },
            { id: 'prensa_hidraulica', label: 'Prensas' },
            { id: 'robo', label: 'Robôs' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filterType === type.id ? 'bg-accentAmber text-white shadow-lg shadow-accentAmber/20' : 'text-textMuted hover:text-textPrimary'}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* BOTÃO IA AUTO-SCAN */}
        <button 
          onClick={onAutoScan}
          disabled={!!batchProgress}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
            batchProgress 
            ? 'bg-surfaceSubtle text-textMuted border-borderBrand animate-pulse' 
            : 'bg-white text-accentAmber border-accentAmber/30 hover:bg-accentAmber hover:text-white hover:border-accentAmber'
          }`}
        >
          <Cpu size={18} className={batchProgress ? 'animate-spin' : ''} />
          {batchProgress ? `${batchProgress.current}/${batchProgress.total}` : 'IA Auto-Scan'}
        </button>

        <button 
          onClick={onAddMachine}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-black/10"
        >
          <PlusCircle size={18} />
          Nova Máquina
        </button>
      </div>
    </div>
  );
}
