import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Factory, 
  Wallet, 
  Activity, 
  FileText,
  Search 
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'machinery', label: 'Maquinário', icon: Factory },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Activity },
  ];


  return (
    <nav className="bg-surface border-b border-borderBrand sticky top-[73px] z-40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button group relative h-14 px-6 flex items-center justify-center transition-all ${isActive ? 'text-accentAmber' : 'text-textMuted hover:text-textPrimary'}`}
              >
                <div className="flex items-center gap-2.5 transition-transform group-hover:-translate-y-0.5">
                  <Icon size={16} />
                  <span className="uppercase tracking-widest text-[10px] font-bold">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accentAmber"
                  />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="relative group hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accentAmber transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar máquina..." 
            className="bg-surfaceSubtle border border-borderBrand rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber/50 w-64 transition-all placeholder:text-textMuted font-medium"
          />
        </div>
      </div>
    </nav>
  );
}

