import { useState } from 'react';
import { supabase } from '../supabase';

export function useAdminUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const invokeAdminFunction = async (action, payload = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      const { data, error: invokeError } = await supabase.functions.invoke('admin-users', {
        body: { action, payload }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Erro ao comunicar com o servidor');
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async ({ email, password, full_name, role }) => {
    return invokeAdminFunction('create_user', { email, password, full_name, role });
  };

  const updatePassword = async (user_id, new_password) => {
    return invokeAdminFunction('update_password', { user_id, new_password });
  };

  const listUsers = async () => {
    const res = await invokeAdminFunction('list_users');
    return res.users;
  };

  return { createUser, updatePassword, listUsers, loading, error };
}
