import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, ShieldOff, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import AdminOnly from './AdminOnly';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useAuthContext } from '../../hooks/useAuthContext';
import { supabase } from '../../supabase';

export default function UserManagementPanel() {
  const { profile } = useAuthContext();
  const { listUsers, createUser, updatePassword, loading, error } = useAdminUsers();
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'cliente' });
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMsg('');
    try {
      await createUser(formData);
      setSuccessMsg('Usuário criado com sucesso!');
      setFormData({ full_name: '', email: '', password: '', role: 'cliente' });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      // erro tratado no hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (userId === profile.id) return;
    setActionLoading(true);
    try {
      if (currentStatus) {
        const { error } = await supabase.rpc('deactivate_user', { user_id: userId });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('reactivate_user', { user_id: userId });
        if (error) throw error;
      }
      fetchUsers();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = window.prompt('Digite a nova senha para este usuário:');
    if (!newPassword || newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setActionLoading(true);
    try {
      await updatePassword(userId, newPassword);
      alert('Senha atualizada com sucesso!');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="bento-card p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accentAmber/10 rounded-lg text-accentAmber">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-textPrimary">
                Gerenciamento de Usuários
              </h3>
              <p className="text-[10px] text-textMuted uppercase tracking-widest mt-1">
                Controle de acessos e permissões
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accentAmberHover transition-all shadow-lg shadow-accentAmber/20"
          >
            <UserPlus size={14} /> Novo Usuário
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-accentRed/10 border border-accentRed/20 text-accentRed text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 rounded-xl bg-accentGreen/10 border border-accentGreen/20 text-accentGreen text-xs font-bold uppercase tracking-widest">
            {successMsg}
          </div>
        )}

        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 bg-surfaceSubtle border border-borderBrand rounded-2xl space-y-4"
            onSubmit={handleCreateUser}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">Nome Completo</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accentAmber/20 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">E-mail</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accentAmber/20 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">Senha Provisória</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accentAmber/20 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-textMuted mb-2 block">Papel (Role)</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white border border-borderBrand rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-accentAmber/20 outline-none">
                  <option value="cliente">Cliente (Apenas Leitura)</option>
                  <option value="admin">Administrador (Total)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 border border-borderBrand rounded-xl text-[10px] font-bold uppercase tracking-widest text-textSecondary">Cancelar</button>
              <button type="submit" disabled={actionLoading} className="px-6 py-2 bg-textPrimary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">Criar Conta</button>
            </div>
          </motion.form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderBrand">
                <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-textMuted">Usuário</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-textMuted">Papel</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-textMuted">Status</th>
                <th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-textMuted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderBrand">
              {loading && users.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-xs text-textMuted">Carregando usuários...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="group">
                    <td className="py-4">
                      <p className="text-sm font-bold text-textPrimary">{u.full_name}</p>
                      <p className="text-[10px] font-mono text-textMuted">{u.email}</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-accentAmber/10 text-accentAmber' : 'bg-surfaceSubtle text-textSecondary'}`}>
                        {u.role === 'admin' ? <Shield size={10} /> : <ShieldOff size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${u.is_active ? 'bg-accentGreen/10 text-accentGreen' : 'bg-accentRed/10 text-accentRed'}`}>
                        {u.is_active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {u.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleResetPassword(u.id)} disabled={actionLoading} className="p-2 text-textMuted hover:text-accentAmber hover:bg-accentAmber/10 rounded-lg transition-colors" title="Redefinir Senha">
                          <KeyRound size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleActive(u.id, u.is_active)} 
                          disabled={actionLoading || u.id === profile.id} 
                          className={`p-2 rounded-lg transition-colors ${u.is_active ? 'text-textMuted hover:text-accentRed hover:bg-accentRed/10' : 'text-textMuted hover:text-accentGreen hover:bg-accentGreen/10'}`}
                          title={u.is_active ? 'Desativar Conta' : 'Reativar Conta'}
                        >
                          {u.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminOnly>
  );
}
