import React from 'react';
import { Search, PlusCircle, Cpu } from 'lucide-react';
import AdminOnly from '../admin/AdminOnly';

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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-white p-1 rounded-2xl border border-borderBrand/50 shadow-sm overflow-x-auto scrollbar-hide min-w-0">
          <div className="flex gap-1 min-w-max">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'sopradora', label: 'Sopradoras' },
              { id: 'prensa_hidraulica', label: 'Prensas' },
              { id: 'robo', label: 'Robôs' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterType === type.id ? 'bg-accentAmber text-white shadow-lg shadow-accentAmber/20' : 'text-textMuted hover:text-textPrimary'}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <AdminOnly>
          <button 
            onClick={onAddMachine}
            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-black text-white rounded-2xl font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-black/10 active:scale-95"
          >
            <PlusCircle size={16} />
            <span className="whitespace-nowrap">Nova Máquina</span>
          </button>
        </AdminOnly>
      </div>
    </div>
  );
}
