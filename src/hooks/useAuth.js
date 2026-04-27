import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

/**
 * Hook de Autenticação - Padrão Ouro ISO 9001
 * Resolve o problema do Refresh (F5) e garante estado consistente.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockoutTime, setLockoutTime] = useState(null);
  
  // Evita re-inicializações duplicadas no StrictMode
  const initialized = useRef(false);

  // ─── Busca de perfil ──────────────────────────────────────────────────────

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[Auth] Erro ao buscar perfil:', err.message);
      return null;
    }
  }, []);

  // ─── Ciclo de Vida (F5 Resilience) ────────────────────────────────────────

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let mounted = true;

    // 1. Caminho Ativo: Busca a sessão imediatamente após o reload
    const initialize = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (initialSession?.user) {
          if (mounted) setSession(initialSession);
          const userProfile = await fetchProfile(initialSession.user.id);
          if (mounted) setProfile(userProfile);
        }
      } catch (err) {
        console.error('[Auth] Erro na inicialização:', err);
      } finally {
        // 🚀 O SEGREDO: Libera o loading independente do resultado
        if (mounted) setLoading(false);
      }
    };

    initialize();

    // 2. Caminho Passivo: Ouve mudanças de estado futuras
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        // Evita flash de loading no boot inicial se o getSession já estiver resolvendo
        if (event === 'INITIAL_SESSION') return;

        setSession(newSession);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession?.user) {
            const p = await fetchProfile(newSession.user.id);
            if (mounted) {
              setProfile(p);
              if (!p) {
                // Se autenticou mas não tem perfil, desloga por segurança
                await supabase.auth.signOut();
                setSession(null);
              }
            }
          }
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSession(null);
        }
        
        // Garante que o loading morra em qualquer evento de auth
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ─── Operações de Auth ──────────────────────────────────────────────────

  const signIn = async (email, password) => {
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      return { error: new Error(validation.error.errors[0].message) };
    }

    const sanitizedEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (error) throw error;

      const userProfile = await fetchProfile(data.user.id);
      if (!userProfile) {
        await supabase.auth.signOut();
        return { error: new Error('Perfil não encontrado no sistema.') };
      }

      setSession(data.session);
      setProfile(userProfile);
      return { data };
    } catch (err) {
      console.error('[Auth] Erro no Login:', err);
      return { error: new Error('Falha na autenticação. Verifique suas credenciais.') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return {
    session,
    profile,
    loading,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin',
    isCliente: profile?.role === 'cliente'
  };
}
