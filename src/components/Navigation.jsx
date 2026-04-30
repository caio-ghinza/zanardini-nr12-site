import { motion } from 'framer-motion';
import { 
  Factory, 
  Wallet, 
  Activity, 
  FileText
} from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Navigation({ activeTab, setActiveTab }) {
  const { profile } = useAuthContext();

  const tabs = [
    { id: 'machinery', label: 'Maquinário', icon: Factory },
    ...(profile?.role === 'admin' ? [{ id: 'finance', label: 'Financeiro', icon: Wallet }] : []),
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Activity },
  ];

  return (
    <nav className="bg-surface border-b border-borderBrand sticky top-16 md:top-[73px] z-40 shadow-sm overflow-x-auto scrollbar-hide">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex justify-between items-center min-w-max md:min-w-0">
        <div className="flex gap-0 md:gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button group relative h-12 md:h-14 px-4 md:px-6 flex items-center justify-center transition-all ${isActive ? 'text-accentAmber' : 'text-textMuted hover:text-textPrimary'}`}
              >
                <div className="flex items-center gap-2 md:gap-2.5 transition-transform group-hover:-translate-y-0.5">
                  <Icon size={14} className="md:w-4 md:h-4" />
                  <span className="uppercase tracking-widest text-[9px] md:text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
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
        
      </div>
    </nav>
  );
}

