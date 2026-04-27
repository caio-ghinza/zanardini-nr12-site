import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, DollarSign } from 'lucide-react';

export default function KPIWidgets() {
  const kpis = [
    { label: "Máquinas em Risco", value: "8", icon: AlertCircle, color: "text-accentRed" },
    { label: "Multa Evitada", value: "R$ 450k+", icon: TrendingDown, color: "text-accentAmber" },
    { label: "CAPEX Restante", value: "R$ 19.780", icon: DollarSign, color: "text-accentAmberDeep" },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.5 }}
          className="bento-card p-6 flex flex-col justify-between"
        >
          <div className={`${kpi.color} mb-4`}>
            <kpi.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">{kpi.label}</p>
            <h4 className="text-serif text-3xl mt-1 font-semibold text-white">{kpi.value}</h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
