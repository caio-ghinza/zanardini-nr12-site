import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Factory, Wallet, Activity } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Maquinário', icon: Factory },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'roadmap', label: 'Roadmap', icon: Activity },
  ];

  return (
    <nav className="flex gap-8 mb-10 border-b border-white/5 px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${isActive ? 'active' : 'text-textMuted hover:text-textSecondary'}`}
          >
            <div className="flex items-center gap-2 pb-3">
              <Icon size={18} />
              <span className="uppercase tracking-widest text-[10px] font-bold">{tab.label}</span>
            </div>
            {isActive && (
              <motion.div 
                layoutId="tab-indicator"
                className="tab-indicator"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
