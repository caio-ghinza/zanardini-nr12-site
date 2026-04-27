import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function LocationMapCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="premium-card h-48 overflow-hidden group"
    >
      {/* Fake Wireframe Map */}
      <div className="absolute inset-0 bg-[#121416]">
        <svg width="100%" height="100%" className="opacity-20">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Decorative lines/paths */}
          <path d="M 0 100 Q 150 50 300 150" stroke="#D07A3A" strokeWidth="1" fill="none" strokeDasharray="4 4" className="opacity-40" />
          <path d="M 50 0 L 250 200" stroke="white" strokeWidth="0.5" fill="none" className="opacity-20" />
          <path d="M 200 0 L 100 200" stroke="white" strokeWidth="0.5" fill="none" className="opacity-20" />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <MapPin size={24} className="text-accentAmber fill-accentAmber/20" />
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -inset-2 rounded-full border border-accentAmber"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pt-10">
        <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Planta Industrial</p>
        <p className="text-xs text-textPrimary mt-1">Unidade Produtiva - Célula Robotizada</p>
      </div>
    </motion.div>
  );
}
