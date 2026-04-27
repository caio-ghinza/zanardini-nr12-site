import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Eletrônica Segura', value: 65000, color: '#D07A3A' },
  { name: 'Laser / Óptica', value: 56500, color: '#A65F2A' },
  { name: 'Mecânica / Grades', value: 34500, color: '#2A2D30' },
  { name: 'Diversos', value: 4220, color: '#606060' },
  { name: 'Reserva', value: 19780, color: '#10b981' },
];

const shoppingList = [
  { item: "Módulo Laser AKAS Viradeira", qty: 1, price: 35000 },
  { item: "Scanner de Área SICK S300", qty: 1, price: 21500 },
  { item: "Cortina de Luz Multifeixes (Tipo 4)", qty: "4 Pares", price: 19200 },
  { item: "Relés Categoria 4 (Pilz/Schmersal)", qty: 8, price: 15920 },
];

export default function TabFinance() {
  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      
      {/* Chart Column */}
      <div className="col-span-12 lg:col-span-5 h-[450px] bento-card p-8 flex flex-col items-center">
        <h3 className="text-serif text-xl font-medium self-start mb-2 text-white">Distribuição de Custos</h3>
        <p className="text-[10px] text-textMuted uppercase tracking-widest self-start mb-6 font-bold">Total CAPEX: R$ 180.000,00</p>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#1A1C1E', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] text-textMuted font-bold uppercase">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping List Column */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bento-card p-8 h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-accentAmber" size={20} />
              <h3 className="text-serif text-xl font-medium text-white">Lista de Compras (Cotações Nacionais)</h3>
            </div>
            <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full uppercase tracking-tighter">
              Contingência: R$ 19.780
            </span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] uppercase text-textMuted tracking-widest font-bold">Item Técnico</th>
                <th className="pb-4 text-[10px] uppercase text-textMuted tracking-widest font-bold text-center">Volume</th>
                <th className="pb-4 text-[10px] uppercase text-textMuted tracking-widest font-bold text-right">Valor Bruto</th>
              </tr>
            </thead>
            <tbody className="divide-y border-white/5 text-sm">
              {shoppingList.map((s, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5 font-medium text-textPrimary flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-accentAmber opacity-40 group-hover:opacity-100 transition-opacity" />
                    {s.item}
                  </td>
                  <td className="py-5 text-textSecondary text-center text-mono tracking-tighter">{s.qty}</td>
                  <td className="py-5 text-textPrimary text-right text-mono font-bold">R$ {s.price.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
