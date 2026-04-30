import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase';

export function useAuth() {
  const [session, setSession]         = useState(null);
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [lockoutTime, setLockoutTime] = useState(null);
  
  const initializedRef = useRef(false);

  // ─── RPCs de segurança ────────────────────────────────────────────────────

  const checkServerLockout = useCallback(async (email) => {
    try {
      const { data, error } = await supabase.rpc('check_auth_status', {
        target_email: email.trim().toLowerCase()
      });
      if (error || !data) return false;
      if (data.is_locked) {
        setLockoutTime(new Date(data.locked_until).getTime());
        return true;
      }
      setLockoutTime(null);
      return false;
    } catch {
      return false;
    }
  }, []);

  const handleFailedAttempt = useCallback(async (email) => {
    try {
      await supabase.rpc('register_auth_failure', {
        target_email: email.trim().toLowerCase()
      });
      await checkServerLockout(email);
    } catch {
      // Ignorado
    }
  }, [checkServerLockout]);

  // ─── Busca de perfil ──────────────────────────────────────────────────────

  const fetchProfile = useCallback(async (userId) => {
    const t0 = Date.now();
    try {
      console.log('[Auth] Query profiles iniciando...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Busca tudo para garantir compatibilidade
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        console.log(`[Auth] Perfil real carregado em ${Date.now() - t0}ms`);
      } else {
        console.warn(`[Auth] Perfil não encontrado após ${Date.now() - t0}ms`);
      }
      return data;
    } catch (err) {
      console.error(`[Auth] Erro na query de perfil:`, err.message);
      return null;
    }
  }, []);

  // ─── Inicialização e Gestão de Estado ─────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    // 1. LIMPEZA DE LOCKS
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('-auth-token-lock')) localStorage.removeItem(key);
      }
    } catch { /* localStorage inacessível — ignorado */ }

    const finishBoot = (sess, prof) => {
      if (!mounted || initializedRef.current) return;
      setSession(sess);
      setProfile(prof);
      setLoading(false);
      initializedRef.current = true;
      console.log('[Auth] Boot Instantâneo Concluído.');
    };

    // 2. BOOT IMEDIATO (Não espera eventos, vai direto ao ponto)
    const runInstantBoot = async () => {
      console.log('[Auth] Iniciando Boot Instantâneo...');
      try {
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (sess?.user && mounted) {
          const p = await fetchProfile(sess.user.id);
          finishBoot(sess, p);
        } else {
          finishBoot(null, null);
        }
      } catch {
        finishBoot(null, null);
      }
    };

    runInstantBoot();

    // 3. LISTENER (Apenas para sincronizar ações futuras)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        // Se o boot já foi feito, apenas atualizamos se houver mudança real
        if (initializedRef.current) {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setProfile(null);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setSession(newSession);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ─── Login ────────────────────────────────────────────────────────────────

  const signIn = async (email, password) => {
    const sanitizedEmail = email.trim().toLowerCase();
    
    try {
      // Verificar lockout ANTES de tentar credenciais
      const locked = await checkServerLockout(sanitizedEmail);
      if (locked) {
        return { error: new Error('Acesso bloqueado temporariamente. Tente novamente mais tarde.') };
      }

      console.log('[Auth] Tentando login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (error) {
        console.error('[Auth] Erro no signInWithPassword:', error.message);
        // Registrar tentativa falha no servidor
        await handleFailedAttempt(sanitizedEmail);
        return { error: new Error('Credenciais inválidas.') };
      }

      console.log('[Auth] Login auth OK. Buscando perfil...');
      const userProfile = await fetchProfile(data.user.id);
      
      if (!userProfile) {
        console.warn('[Auth] Usuário sem perfil no banco.');
        return { error: new Error('Usuário sem perfil configurado.') };
      }

      // Reset tentativas após login bem-sucedido
      try {
        await supabase.rpc('reset_auth_attempts', { target_email: sanitizedEmail });
      } catch {
        // Não crtico se falhar
      }
      setLockoutTime(null);

      setSession(data.session);
      setProfile(userProfile);

      return { data };
    } catch (err) {
      console.error('[Auth] Erro crítico no fluxo de login:', err);
      return { error: new Error('Erro interno no terminal de acesso.') };
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
    isCliente: profile?.role === 'cliente',
    lockoutTime,
    isLockedOut: !!(lockoutTime && lockoutTime > new Date().getTime())
  };
}
