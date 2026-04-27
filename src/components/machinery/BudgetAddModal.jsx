import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, DollarSign, Tag, Package, List } from 'lucide-react';
import { useUI } from '../ui/UIContext';

export default function BudgetAddModal({ isOpen, onClose, onAdd }) {
  const { addToast } = useUI();
  const [formData, setFormData] = useState({
    item_name: '',
    category: 'Mecânica / Grades',
    unit_price_brl: '',
    quantity: 1,
    status: 'previsto'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item_name || !formData.unit_price_brl) {
      addToast('Por favor, preencha o nome e o valor.', 'error');
      return;
    }

    setLoading(true);
    const { error } = await onAdd({
      ...formData,
      unit_price_brl: parseFloat(formData.unit_price_brl),
      quantity: parseInt(formData.quantity)
    });

    setLoading(false);
    if (!error) {
      addToast('Item adicionado ao orçamento!', 'success');
      onClose();
      setFormData({
        item_name: '',
        category: 'Mecânica / Grades',
        unit_price_brl: '',
        quantity: 1,
        status: 'previsto'
      });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-surface border border-borderBrand rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle/30">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Novo Item de Budget</h2>
            <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mt-1">CAPEX / Adequação NR-12</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
              <Package size={12} /> Nome do Item Técnico
            </label>
            <input 
              autoFocus
              type="text"
              value={formData.item_name}
              onChange={e => setFormData({...formData, item_name: e.target.value})}
              className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl p-4 text-sm focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber outline-none transition-all"
              placeholder="Ex: Scanner Laser SICK S300"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <List size={12} /> Categoria
              </label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl p-4 text-sm focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber outline-none transition-all appearance-none"
              >
                <option>Mecânica / Grades</option>
                <option>Eletrônica Segura</option>
                <option>Laser / Óptica</option>
                <option>Hidráulica Segura</option>
                <option>LOTO / Treinamento</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <Tag size={12} /> Status Inicial
              </label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl p-4 text-sm focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber outline-none transition-all appearance-none"
              >
                <option value="previsto">Previsto</option>
                <option value="pedido">Pedido</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <DollarSign size={12} /> Valor Unitário (R$)
              </label>
              <input 
                type="number"
                step="0.01"
                value={formData.unit_price_brl}
                onChange={e => setFormData({...formData, unit_price_brl: e.target.value})}
                className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl p-4 text-sm focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber outline-none transition-all"
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                Quantos Itens?
              </label>
              <input 
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-surfaceSubtle border border-borderBrand rounded-xl p-4 text-sm focus:ring-2 focus:ring-accentAmber/20 focus:border-accentAmber outline-none transition-all"
                min="1"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-borderBrand rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-surfaceSubtle transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-accentAmber text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accentAmberHover transition-all flex items-center justify-center gap-2 shadow-lg shadow-accentAmber/20 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Salvar Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
