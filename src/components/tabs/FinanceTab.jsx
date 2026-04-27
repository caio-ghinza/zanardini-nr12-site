import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../supabase';
import seedData from '../../data/seedData.json';

export default function FinanceTab() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudget();
  }, []);

  async function fetchBudget() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('budget_items').select('*');
      if (error) throw error;
      setBudgetItems(data && data.length > 0 ? data : seedData.budget);
    } catch (err) {
      console.error(err);
      setBudgetItems(seedData.budget);
    } finally {
      setLoading(false);
    }
  }

  async function addFinanceItem(newItem) {
    try {
      const { error } = await supabase.from('budget_items').insert([newItem]);
      if (error) throw error;
      fetchBudget();
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar item financeiro.');
    }
  }

  const budgetTotal = 180000;
  
  const budgetedTotal = budgetItems.reduce((acc, curr) => acc + (curr.quantity * curr.unit_price_brl), 0);
  const committedTotal = budgetItems
    .filter(item => ['pedido', 'entregue'].includes(item.status))
    .reduce((acc, curr) => acc + (curr.quantity * curr.unit_price_brl), 0);
  const remainingTotal = budgetTotal - budgetedTotal;
  const pendingItems = budgetItems.filter(item => item.status === 'previsto').length;

  const chartData = [
    { name: 'Laser / Óptica', value: 56500, color: '#D97706' },
    { name: 'Eletrônica Segura', value: 39620, color: '#0284C7' },
    { name: 'Mecânica / Grades', value: 32000, color: '#64748B' },
    { name: 'Hidráulica Segura', value: 17000, color: '#0F766E' },
    { name: 'LOTO / Treinamento', value: 2500, color: '#7C3AED' },
    { name: 'Reserva', value: remainingTotal, color: '#16A34A' },
  ];

  return (
    <div className="space-y-8">
      {/* FINANCIAL KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Budget Total", value: `R$ ${budgetTotal.toLocaleString()}`, icon: DollarSign, color: "text-textPrimary" },
          { label: "Total Comprometido", value: `R$ ${committedTotal.toLocaleString()}`, icon: TrendingUp, color: "text-accentBlue" },
          { label: "Reserva Disponível", value: `R$ ${remainingTotal.toLocaleString()}`, icon: ShieldCheck, color: "text-accentGreen" },
          { label: "Itens Pendentes", value: pendingItems, icon: ShoppingCart, color: "text-accentAmber" },
        ].map((stat, i) => (
          <div key={i} className="bento-card p-6 bg-white border-l-4" style={{ borderLeftColor: i === 2 ? 'var(--tw-accentGreen)' : 'var(--tw-borderBrand)' }}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted">{stat.label}</span>
            </div>
            <h4 className="text-2xl font-bold">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* DONUT CHART */}
        <div className="col-span-12 lg:col-span-5 h-[500px] bento-card p-8 flex flex-col items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest self-start mb-2">Distribuição por Categoria</h3>
            <p className="text-[10px] text-textMuted uppercase tracking-widest self-start mb-8">Ponto de Equilíbrio: R$ 180k</p>
            
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E1D8', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    itemStyle={{ color: '#1A1A1A' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
              {chartData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[9px] text-textMuted font-bold uppercase">{d.name}</span>
                </div>
              ))}
            </div>
        </div>

        {/* SHOPPING LIST */}
        <div className="col-span-12 lg:col-span-7">
           <div className="bento-card min-h-full flex flex-col">
              <div className="p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle/30">
                 <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Controle Financeiro & CAPEX</h2>
          <p className="text-textSecondary text-sm">Gestão de orçamento para dispositivos de segurança e mão de obra.</p>
        </div>
        <button 
          onClick={() => addFinanceItem({
            category: 'Outros',
            item_name: 'Novo Item - ' + new Date().toLocaleDateString(),
            quantity: 1,
            unit_price_brl: 1500,
            status: 'previsto'
          })}
          className="px-6 py-3 bg-accentAmber text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accentAmberHover transition-all flex items-center gap-2 shadow-lg shadow-accentAmber/20"
        >
          <Plus size={18} />
          Adicionar Item
        </button>
      </div>
        </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-borderBrand bg-surfaceSubtle/10">
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted">Item</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-center">Volume</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-right">Valor Bruto</th>
                      <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderBrand">
                    {budgetItems.slice(0, 7).map((item, i) => (
                      <tr key={i} className="hover:bg-surfaceSubtle transition-all cursor-pointer group">
                        <td className="p-4">
                           <p className="text-xs font-bold text-textPrimary">{item.item_name}</p>
                           <p className="text-[9px] text-textMuted uppercase font-bold mt-1 tracking-tighter">{item.category}</p>
                        </td>
                        <td className="p-4 text-xs text-center font-bold font-mono text-textMuted">x{item.quantity}</td>
                        <td className="p-4 text-xs text-right font-bold font-mono text-textPrimary">R$ {(item.unit_price_brl * item.quantity).toLocaleString()}</td>
                        <td className="p-4">
                           <div className="flex justify-center">
                              <span className={`badge ${
                                item.status === 'entregue' ? 'bg-accentGreenLight text-accentGreen border-accentGreen/20' :
                                item.status === 'pedido' ? 'bg-accentBlueLight text-accentBlue border-accentBlue/20' :
                                'bg-accentAmberLight text-accentAmber border-accentAmber/20'
                              }`}>
                                {item.status}
                              </span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-accentAmberLight border-t border-borderBrand flex justify-between items-center group cursor-pointer hover:bg-accentAmberHover transition-all">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-xl shadow-sm">
                      <ArrowUpRight className="text-accentAmber" size={20} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-accentAmber group-hover:text-white uppercase tracking-widest">ROI de Prevenção</p>
                      <p className="text-sm font-bold text-textPrimary group-hover:text-white">R$ 180k investidos previnem ~R$ 840k em multas</p>
                   </div>
                 </div>
                 <ArrowRight className="text-accentAmber group-hover:text-white group-hover:translate-x-2 transition-all" size={20} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
