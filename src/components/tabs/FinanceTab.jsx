import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  Plus,
  ArrowRight,
  ShieldCheck,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import BudgetAddModal from '../machinery/BudgetAddModal';
import EmptyState from '../ui/EmptyState';
import ConfirmModal from '../ui/ConfirmModal';
import AdminOnly from '../admin/AdminOnly';

export default function FinanceTab() {
  const {
    budgetItems,
    loading,
    fetchBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, itemId: null });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBudget();
  }, [fetchBudget]);

  const budgetTotal = 180000;
  
  const budgetedTotal = budgetItems.reduce((acc, curr) => acc + (curr.quantity * curr.unit_price_brl), 0);
  const committedTotal = budgetItems
    .filter(item => ['pedido', 'entregue'].includes(item.status))
    .reduce((acc, curr) => acc + (curr.quantity * curr.unit_price_brl), 0);
  const remainingTotal = Math.max(0, budgetTotal - budgetedTotal);
  const pendingItemsCount = budgetItems.filter(item => item.status === 'previsto').length;

  // Agrupar dados para o gráfico baseado nos itens reais
  const categories = [...new Set(budgetItems.map(item => item.category))];
  const chartData = categories.map(cat => ({
    name: cat,
    value: budgetItems.filter(i => i.category === cat).reduce((acc, curr) => acc + (curr.unit_price_brl * curr.quantity), 0),
    color: cat.includes('Laser') ? '#D97706' : cat.includes('Eletrônica') ? '#0284C7' : cat.includes('Mecânica') ? '#64748B' : cat.includes('Hidráulica') ? '#0F766E' : '#7C3AED'
  }));

  if (remainingTotal > 0) {
    chartData.push({ name: 'Reserva Disponível', value: remainingTotal, color: '#16A34A' });
  }

  const cycleStatus = async (item) => {
    const statuses = ['previsto', 'pedido', 'entregue'];
    const nextIdx = (statuses.indexOf(item.status) + 1) % statuses.length;
    await updateBudgetItem(item.id, { status: statuses[nextIdx] });
  };

  const handleDeleteRequest = (id) => {
    setDeleteModal({ open: true, itemId: id });
  };

  const confirmDelete = async () => {
    if (deleteModal.itemId) {
      await deleteBudgetItem(deleteModal.itemId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* FINANCIAL KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Budget Total", value: `R$ ${budgetTotal.toLocaleString()}`, icon: DollarSign, color: "text-textPrimary" },
          { label: "Total Comprometido", value: `R$ ${committedTotal.toLocaleString()}`, icon: TrendingUp, color: "text-accentBlue" },
          { label: "Reserva Disponível", value: `R$ ${remainingTotal.toLocaleString()}`, icon: ShieldCheck, color: "text-accentGreen" },
          { label: "Itens Pendentes", value: pendingItemsCount, icon: ShoppingCart, color: "text-accentAmber" },
        ].map((stat, i) => (
          <div key={i} className="bento-card p-6 bg-white border-l-4" style={{ borderLeftColor: i === 2 ? '#16A34A' : '#E5E1D8' }}>
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
              {mounted && (
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
                      formatter={(value) => `R$ ${value.toLocaleString()}`}
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E1D8', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                      itemStyle={{ color: '#1A1A1A' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
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
              <div className="p-8 border-b border-borderBrand flex justify-between items-end bg-surfaceSubtle/30">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2 font-sora">Controle Financeiro</h2>
                  <p className="text-textSecondary text-sm">Gestão de orçamento para dispositivos de segurança.</p>
                </div>
                <AdminOnly>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-accentAmber text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accentAmberHover transition-all flex items-center gap-2 shadow-lg shadow-accentAmber/20"
                  >
                    <Plus size={18} />
                    Adicionar Item
                  </button>
                </AdminOnly>
              </div>

              <div className="flex-1 overflow-x-auto">
                {loading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-textMuted opacity-50">
                    <div className="w-8 h-8 border-4 border-accentAmber/30 border-t-accentAmber rounded-full animate-spin mb-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">Sincronizando Banco...</p>
                  </div>
                ) : budgetItems.length === 0 ? (
                  <div className="py-12">
                    <EmptyState 
                      icon={ShoppingCart}
                      title="Nenhum item orçado"
                      message="Seu planejamento financeiro está vazio. Adicione dispositivos, componentes ou serviços para rastrear o investimento."
                      actionLabel="Adicionar Primeiro Item"
                      onAction={() => setIsModalOpen(true)}
                    />
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-borderBrand bg-surfaceSubtle/10">
                        <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted">Item Técnico</th>
                        <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-center">Volume</th>
                        <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-right">Valor Total</th>
                        <th className="p-4 text-[9px] font-bold uppercase tracking-widest text-textMuted text-center">Status / Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderBrand">
                      {budgetItems.map((item) => (
                        <tr key={item.id} className="hover:bg-surfaceSubtle transition-all group">
                          <td className="p-4">
                             <p className="text-xs font-bold text-textPrimary">{item.item_name}</p>
                             <p className="text-[9px] text-textMuted uppercase font-bold mt-1 tracking-tighter">{item.category}</p>
                          </td>
                          <td className="p-4 text-xs text-center font-bold font-mono text-textMuted">x{item.quantity}</td>
                          <td className="p-4 text-xs text-right font-bold font-mono text-textPrimary">R$ {(item.unit_price_brl * item.quantity).toLocaleString()}</td>
                          <td className="p-4">
                             <div className="flex justify-center items-center gap-2">
                                <AdminOnly>
                                  <button 
                                    onClick={() => cycleStatus(item)}
                                    className={`badge cursor-pointer hover:scale-105 transition-transform flex items-center gap-1 ${
                                      item.status === 'entregue' ? 'bg-accentGreenLight text-accentGreen border-accentGreen/20' :
                                      item.status === 'pedido' ? 'bg-accentBlueLight text-accentBlue border-accentBlue/20' :
                                      'bg-accentAmberLight text-accentAmber border-accentAmber/20'
                                    }`}
                                  >
                                    {item.status}
                                    <RefreshCw size={8} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteRequest(item.id)}
                                    className="p-2 text-textMuted hover:text-accentRed transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </AdminOnly>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>


           </div>
        </div>
      </div>

      <BudgetAddModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addBudgetItem}
      />

      <ConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, itemId: null })}
        onConfirm={confirmDelete}
        title="Remover Item"
        message="Deseja realmente excluir este item do orçamento?"
        confirmLabel="Excluir"
        isDestructive={true}
      />
    </div>
  );
}


