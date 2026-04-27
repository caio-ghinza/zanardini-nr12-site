import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Factory, 
  FileText, 
  Clock, 
  ShieldCheck,
  Search,
  Bell
} from 'lucide-react';

// Import Tabs (to be created)
import MachineryTab from './components/tabs/MachineryTab';
import DocumentsTab from './components/tabs/DocumentsTab';

function App() {
  const [activeTab, setActiveTab] = useState('machinery');
  const [currentTime, setCurrentTime] = useState(new Date());

  const renderTab = () => {
    switch (activeTab) {
      case 'machinery': return <MachineryTab />;
      case 'documents': return <DocumentsTab />;
      default: return (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="p-12 border-2 border-dashed border-borderBrand rounded-card flex flex-col items-center justify-center text-textMuted bg-surface/50">
              <Activity size={48} className="mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">Aba {activeTab.toUpperCase()} em desenvolvimento</h3>
              <p className="text-sm">Iniciando a Fase correspondente do Plano de Implementação</p>
            </div>
          </div>
        </div>
      );
    }
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'machinery', label: 'Maquinário', icon: Factory },
    { id: 'documents', label: 'Documentos', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-textPrimary font-plex selection:bg-accentAmber/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-borderBrand px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="status-dot-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">
                System Active / <span className="text-accentAmber">Project NR-12</span>
              </span>
            </div>
            <div className="h-4 w-px bg-borderBrand" />
            <h1 className="text-xl font-bold tracking-tight text-textPrimary font-sora">
              NR-12 <span className="text-accentAmber">Industrial</span> Control Panel
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
          >
            <div className="hidden lg:flex items-center gap-4 text-right border-r border-borderBrand pr-8">
              <div>
                <p className="text-xs font-bold text-textPrimary">C. Zanardini</p>
                <p className="text-[10px] text-textMuted uppercase font-semibold tracking-wider">Lead NR-12 Engineer</p>
              </div>
              <div className="flex gap-2">
                <span className="badge bg-accentAmberLight text-accentAmber border-accentAmber/20">Audit Ready</span>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-sm font-bold font-mono tracking-tighter text-accentAmber">
                  {currentTime.toLocaleTimeString('pt-BR')}
                </p>
                <p className="text-[9px] text-textMuted uppercase font-bold tracking-widest">
                  Curitiba / PR
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 hover:bg-surfaceSubtle rounded-full transition-all relative border border-transparent hover:border-borderBrand"
              >
                <Bell size={20} className="text-textSecondary" />
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-accentRed rounded-full border-2 border-white shadow-sm" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Navigation */}
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
                  className={`tab-button group ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2.5 transition-transform group-hover:-translate-y-0.5">
                    <Icon size={16} className={isActive ? 'text-accentAmber' : 'text-textMuted group-hover:text-textPrimary transition-colors'} />
                    {tab.label}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accentAmber"
                    />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accentAmber transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar máquina..." 
              className="bg-surfaceSubtle border border-borderBrand rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber/50 w-64 transition-all placeholder:text-textMuted font-medium"
            />
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-[1600px] mx-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-borderBrand flex justify-between items-center text-[10px] text-textMuted font-bold uppercase tracking-widest">
        <p>© 2026 Zanardini Engenharia e Projetos — NR-12 Control Panel v1.0.0</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accentAmber">Protocolos de Segurança</a>
          <a href="#" className="hover:text-accentAmber">Suporte Técnico</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
