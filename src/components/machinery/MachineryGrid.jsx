import React from 'react';
import MachineCard from './MachineCard';

export default function MachineryGrid({ machines, onMachineClick, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
        <div className="w-12 h-12 rounded-full border-4 border-borderBrand border-t-accentAmber animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando com Supabase...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {machines.map((m, i) => (
        <MachineCard 
          key={m.id || i} 
          machine={m} 
          index={i} 
          onClick={() => onMachineClick(m)} 
        />
      ))}
    </div>
  );
}
