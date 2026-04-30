import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, UserPlus, UserMinus, Shield, User, Mail, Key, ShieldCheck, Loader2, Settings, AlertCircle } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAuthContext } from '../hooks/useAuthContext';
import { supabase } from '../supabase';

export default function AdminPanel({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'cliente' });
  const [formError, setFormError] = useState('');

  const { createUser, listUsers, loading: submitting, error: hookError } = useAdminUsers();
  const { profile: currentUser } = useAuthContext();

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await listUsers();
      setUsers(data || []);
    } catch {
      // erro exibido pelo hook
    } finally {
      setLoadingUsers(false);
    }
  }, [listUsers]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) fetchUsers();
  }, [isOpen, fetchUsers]);

  async function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');
    try {
      await createUser(newUser);
      setNewUser({ email: '', password: '', full_name: '', role: 'cliente' });
      await fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Erro ao criar usuário.');
    }
  }

  async function handleToggleActive(user) {
    if (user.id === currentUser?.id) return; // não se auto-desativa
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);
    if (!error) fetchUsers();
  }

  async function toggleRole(user) {
    if (user.id === currentUser?.id) return; // não muda próprio papel
    const nextRole = user.role === 'admin' ? 'cliente' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: nextRole })
      .eq('id', user.id);
    if (!error) fetchUsers();
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-[#E5E1D8] flex justify-between items-center bg-surfaceSubtle/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accentAmber/10 rounded-2xl flex items-center justify-center text-accentAmber">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-textPrimary font-['Sora']">Gestão de Contas</h2>
              <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mt-1">Controle de acessos e permissões</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-textMuted">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LISTA DE USUÁRIOS */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
                <Shield size={14} /> Usuários ({users.length})
              </h3>
              
              <div className="space-y-3">
                {loadingUsers ? (
                  <div className="py-20 flex flex-col items-center justify-center text-textMuted opacity-50">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p className="text-xs uppercase font-bold tracking-widest">Carregando usuários...</p>
                  </div>
                ) : (
                  users.map(user => {
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <div key={user.id} className={`p-4 bg-surfaceSubtle/50 border border-[#E5E1D8] rounded-2xl flex items-center justify-between group hover:bg-white hover:border-accentAmber/30 transition-all ${!user.is_active ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-accentAmber/10 text-accentAmber' : 'bg-blue-50 text-blue-500'}`}>
                            {user.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-textPrimary">
                              {user.full_name}
                              {isSelf && <span className="ml-2 text-[9px] font-bold text-accentAmber uppercase bg-accentAmber/10 px-1.5 py-0.5 rounded">Você</span>}
                            </p>
                            <p className="text-[10px] text-textMuted">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!isSelf && (
                            <>
                              <button 
                                onClick={() => toggleRole(user)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-tighter transition-all ${
                                  user.role === 'admin' 
                                  ? 'bg-accentAmber text-white' 
                                  : 'bg-blue-500 text-white opacity-40 hover:opacity-100'
                                }`}
                              >
                                {user.role}
                              </button>
                              
                              <button 
                                onClick={() => handleToggleActive(user)}
                                title={user.is_active ? 'Desativar acesso' : 'Reativar acesso'}
                                className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                  user.is_active 
                                    ? 'text-textMuted hover:text-accentRed hover:bg-accentRedLight' 
                                    : 'text-accentGreen hover:bg-accentGreen/10'
                                }`}
                              >
                                {user.is_active ? <UserMinus size={16} /> : <UserPlus size={16} />}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* FORMULÁRIO DE CRIAÇÃO */}
            <div className="lg:col-span-5">
              <div className="sticky top-0 bg-white border border-accentAmber/20 p-6 rounded-[24px] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-accentAmber flex items-center gap-2 mb-6">
                  <UserPlus size={16} /> Novo Operador
                </h3>
                
                {(formError || hookError) && (
                  <div className="mb-4 p-3 bg-accentRedLight border border-accentRed/20 rounded-xl flex items-center gap-2 text-accentRed text-xs font-bold">
                    <AlertCircle size={14} />
                    {formError || hookError}
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-textMuted ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                      <input 
                        required
                        type="text" 
                        value={newUser.full_name}
                        onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                        className="w-full bg-surfaceSubtle border border-[#E5E1D8] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accentAmber/10 outline-none"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-textMuted ml-1">E-mail</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                      <input 
                        required
                        type="email" 
                        value={newUser.email}
                        onChange={e => setNewUser({...newUser, email: e.target.value})}
                        className="w-full bg-surfaceSubtle border border-[#E5E1D8] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accentAmber/10 outline-none"
                        placeholder="operador@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-textMuted ml-1">Senha Inicial</label>
                    <div className="relative">
                      <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                      <input 
                        required
                        type="password" 
                        value={newUser.password}
                        onChange={e => setNewUser({...newUser, password: e.target.value})}
                        className="w-full bg-surfaceSubtle border border-[#E5E1D8] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accentAmber/10 outline-none"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-textMuted ml-1">Perfil</label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="w-full bg-surfaceSubtle border border-[#E5E1D8] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accentAmber/10 outline-none appearance-none"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <button 
                    disabled={submitting}
                    className="w-full bg-accentAmber text-white font-bold py-4 rounded-xl shadow-lg shadow-accentAmber/20 hover:bg-accentAmber/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
                    <span className="uppercase text-xs tracking-widest">Criar Acesso</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
