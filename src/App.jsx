import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
import { UIProvider } from './components/ui/UIContext';

import Navigation from './components/Navigation';
import MachineryTab from './components/tabs/MachineryTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import FinanceTab from './components/tabs/FinanceTab';
import RoadmapTab from './components/tabs/RoadmapTab';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import { Settings } from 'lucide-react';

function AppContent() {
  const { profile, loading, signOut } = useAuthContext();
  const [activeTab, setActiveTab] = useState('machinery');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accentAmber/20 border-t-accentAmber rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || !profile.is_active) {
    return <LoginScreen />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'machinery': return <MachineryTab />;
      case 'finance': return <FinanceTab />;
      case 'documents': return <DocumentsTab />;
      case 'roadmap': return <RoadmapTab />;
      default: return null;
    }
  };

  return (
    <UIProvider>
      <div className="min-h-screen bg-background pb-safe-area">
        {/* HEADER / NAVIGATION BAR */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-borderBrand pt-safe-area">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 md:h-20 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 md:gap-6"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="status-dot-pulse shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-textMuted leading-tight">
                  Zanardini <span className="hidden xs:inline">Engenharia</span> - <span className="text-accentAmber">NR-12</span>
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 md:gap-8"
            >
              <div className="hidden lg:flex items-center gap-4 text-right border-r border-borderBrand pr-8">
                <div>
                  <p className="text-xs font-bold text-textPrimary">{profile.full_name}</p>
                  <p className="text-[10px] text-textMuted uppercase font-semibold tracking-wider">
                    {profile.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </p>
                </div>
                {profile.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="p-2 hover:bg-accentAmber/10 text-textMuted hover:text-accentAmber rounded-xl transition-all"
                    title="Configurações de Administrador"
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3 md:gap-5">
                <div className="text-right hidden xs:block">
                  <p className="text-[12px] md:text-sm font-bold font-mono tracking-tighter text-accentAmber">
                    {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[8px] md:text-[9px] text-textMuted uppercase font-bold tracking-widest">
                    Curitiba / PR
                  </p>
                </div>
                <button 
                  onClick={signOut}
                  className="px-3 md:px-4 py-1.5 md:py-2 border border-borderBrand text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:bg-surfaceSubtle transition-all rounded-lg active:scale-95"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <main className="max-w-[1600px] mx-auto p-4 md:p-8">
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
        <footer className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 border-t border-borderBrand flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] md:text-[10px] text-textMuted font-bold uppercase tracking-widest text-center md:text-left">
          <p>© 2026 Zanardini Engenharia — NR-12 Control Panel</p>
          <div className="flex gap-4 md:gap-8">
            <a href="#" className="hover:text-accentAmber">Protocolos</a>
            <a href="#" className="hover:text-accentAmber">Suporte</a>
          </div>
        </footer>

        {/* ADMIN PANEL MODAL */}
        <AdminPanel 
          isOpen={isAdminPanelOpen} 
          onClose={() => setIsAdminPanelOpen(false)} 
        />
      </div>
    </UIProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
