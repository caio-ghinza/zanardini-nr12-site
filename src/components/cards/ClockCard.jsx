import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ClockCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bento-card p-8 h-full flex flex-col items-center justify-center bg-surface"
    >
      <div className="text-center relative">
        <div className="flex items-baseline gap-2">
          <span className="text-serif text-7xl font-bold tracking-tighter text-white">
            {hours}:{minutes}
          </span>
          <span className="text-mono text-xl font-bold text-accentAmber/30 w-8">
            {seconds}
          </span>
        </div>
        <p className="text-[10px] text-textMuted uppercase tracking-[0.4em] mt-5 font-black">Curitiba / Brasil</p>
      </div>

      {/* Industrial Texture */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <div className="w-32 h-32 border-[10px] border-white rounded-full flex items-center justify-center">
             <div className="w-2 h-16 bg-white origin-bottom rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}
