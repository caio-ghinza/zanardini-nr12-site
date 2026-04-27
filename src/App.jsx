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

function AppContent() {
  const { profile, loading, signOut } = useAuthContext();
  const [activeTab, setActiveTab] = useState('machinery');
  const [currentTime, setCurrentTime] = useState(new Date());

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
      <div className="min-h-screen bg-background">
        {/* HEADER / NAVIGATION BAR */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-borderBrand">
          <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="status-dot-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted">
                  Zanardini Engenharia - <span className="text-accentAmber">Adequação NR-12</span>
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-8"
            >
              <div className="hidden lg:flex items-center gap-4 text-right border-r border-borderBrand pr-8">
                <div>
                  <p className="text-xs font-bold text-textPrimary">{profile.full_name}</p>
                  <p className="text-[10px] text-textMuted uppercase font-semibold tracking-wider">
                    {profile.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </p>
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
                <button 
                  onClick={signOut}
                  className="px-4 py-2 border border-borderBrand text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:bg-surfaceSubtle transition-all rounded-lg"
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
