import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../hooks/useAuthContext';
import { Shield, Lock, User, ArrowRight, Loader2, AlertCircle, Clock } from 'lucide-react';

export default function LoginScreen() {
  const { signIn, isLockedOut, lockoutTime } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (isLockedOut && lockoutTime) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setErrorMsg(error.message || 'Credenciais inválidas. Verifique seu acesso.');
      }
    } catch (err) {
      console.error('Fatal Login Error:', err);
      setErrorMsg('Ocorreu um erro crítico no terminal de acesso.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 font-plex relative overflow-hidden">
      {/* Background Industrial Accent */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accentAmber/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accentBlue/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1A1A1A 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="premium-card p-10 relative overflow-hidden border-borderBrand/60 bg-white/70">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accentAmber/80 via-accentAmber to-accentAmber/80" />
          
          <div className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accentAmber/10 text-accentAmber mb-6 border border-accentAmber/20"
            >
              <Shield size={28} strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-3xl font-bold text-textPrimary tracking-tight font-sora">Acesso Restrito</h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="status-dot-pulse w-1.5 h-1.5" />
              <p className="text-[10px] text-textMuted uppercase font-bold tracking-[0.3em]">
                Zanardini Engenharia
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-xl bg-accentRed/5 border border-accentRed/10 flex items-center gap-3 text-accentRed"
                role="alert"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isLockedOut ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-accentRed/5 animate-ping" />
                <div className="relative w-full h-full bg-accentRed/10 rounded-full flex items-center justify-center border border-accentRed/20">
                  <Clock size={32} className="text-accentRed" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-textPrimary font-sora">Terminal Bloqueado</h2>
                <p className="text-xs text-textSecondary leading-relaxed px-4">
                  Múltiplas falhas detectadas. O acesso será reestabelecido em:
                </p>
                <div className="text-3xl font-bold font-mono text-accentRed tracking-widest mt-4">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-textMuted ml-1">
                  E-mail de Operação
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accentAmber transition-colors">
                    <User size={18} strokeWidth={2} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 border border-borderBrand/80 rounded-xl pl-12 pr-4 py-4 text-sm text-textPrimary focus:outline-none focus:ring-4 focus:ring-accentAmber/10 focus:border-accentAmber transition-all placeholder:text-textMuted/50"
                    placeholder="seu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-textMuted ml-1">
                  Chave de Acesso
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accentAmber transition-colors">
                    <Lock size={18} strokeWidth={2} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/50 border border-borderBrand/80 rounded-xl pl-12 pr-4 py-4 text-sm text-textPrimary focus:outline-none focus:ring-4 focus:ring-accentAmber/10 focus:border-accentAmber transition-all placeholder:text-textMuted/50"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 mt-8 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="static"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span>Validar Credenciais</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>
          )}
        </div>
        
        {/* Footer Details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-between items-center px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accentGreen/40" />
            <span>Sistema Seguro</span>
          </div>
          <span>v1.0.4 — NR-12 Control</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
