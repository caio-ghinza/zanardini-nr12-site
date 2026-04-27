import React from 'react';
import { motion } from 'framer-motion';
import { SkipBack, Play, SkipForward, Repeat } from 'lucide-react';

export default function NowPlayingCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="premium-card p-6 overflow-hidden"
    >
      <div className="flex gap-4 items-center relative z-10">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-accentAmber to-accentAmberHover p-3 flex items-center justify-center shadow-lg shadow-accentAmber/20">
          <div className="flex items-end gap-[2px] h-6">
            {[0.6, 0.8, 1.2, 0.9, 1.1, 0.7, 1.0].map((duration, i) => (
              <motion.div 
                key={i} 
                animate={{ height: [8, 24, 12, 20, 8] }}
                transition={{ 
                  duration: duration, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
                className="w-1 bg-white/90 rounded-full" 
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-accentAmber uppercase tracking-widest font-bold">Industrial Flow</p>
            <div className="h-1 w-1 rounded-full bg-accentAmber animate-pulse" />
          </div>
          <h4 className="text-serif text-lg font-medium tracking-tight text-textPrimary">Vibração & Ruído</h4>
          <p className="text-xs text-textMuted mt-0.5">Sopradora DKB6L - Ativa</p>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <div className="flex justify-between items-center text-[10px] text-textMuted font-mono mb-2">
          <span>02:14</span>
          <span>04:30</span>
        </div>
        <div className="w-full h-1.5 bg-surfaceSubtle rounded-full overflow-hidden mb-6 group cursor-pointer relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '48%' }}
            className="h-full bg-accentAmber rounded-full relative z-10" 
          />
          <div className="absolute inset-0 bg-accentAmber/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex justify-center items-center gap-8 text-textSecondary">
          <motion.button 
            whileHover={{ scale: 1.1, color: '#D97706' }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <SkipBack size={18} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(217, 119, 6, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full border border-accentAmber/30 flex items-center justify-center bg-accentAmber/5 text-accentAmber focus:outline-none"
          >
            <Play size={20} className="fill-accentAmber translate-x-0.5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, color: '#D97706' }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none"
          >
            <SkipForward size={18} />
          </motion.button>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accentAmber/5 rounded-full blur-3xl" />
    </motion.div>
  );
}
