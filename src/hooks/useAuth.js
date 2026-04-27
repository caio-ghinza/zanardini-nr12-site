import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[Auth] Profile fetch error:', err.message);
      return null;
    }
  }, []);

  // ─── Inicialização e Gestão de Estado ─────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    // Função central para finalizar o boot
    const finishBoot = (sess, prof) => {
      if (!mounted || initializedRef.current) return;
      console.log('[Auth] Finalizando boot. Sessão:', !!sess, 'Perfil:', !!prof);
      setSession(sess);
      setProfile(prof);
      setLoading(false);
      initializedRef.current = true;
    };

    // 1. Inicia o listener IMEDIATAMENTE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[Auth] Evento:', event, '| Sessão:', !!newSession);
        
        if (!mounted) return;

        // Se o boot já terminou, apenas atualizamos o estado normalmente
        if (initializedRef.current) {
          setSession(newSession);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (newSession?.user) {
              const p = await fetchProfile(newSession.user.id);
              if (mounted) {
                setProfile(p);
                if (!p) {
                   await supabase.auth.signOut();
                   setSession(null);
                }
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
          return;
        }

        // Se ainda estamos no boot e recebemos uma sessão válida
        if (newSession?.user) {
          const p = await fetchProfile(newSession.user.id);
          finishBoot(newSession, p);
        } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
          // Se for o evento inicial e não houver usuário, boot limpo
          finishBoot(null, null);
        }
      }
    );

    // 2. Fallback: Se o listener não resolveu o boot em 1.5s, tenta getSession()
    const fallbackTimer = setTimeout(async () => {
      if (!initializedRef.current && mounted) {
        console.log('[Auth] Fallback getSession acionado...');
        try {
          const { data: { session: sess } } = await supabase.auth.getSession();
          if (sess?.user) {
            const p = await fetchProfile(sess.user.id);
            finishBoot(sess, p);
          } else {
            finishBoot(null, null);
          }
        } catch (e) {
          console.error('[Auth] Erro no fallback:', e);
          finishBoot(null, null);
        }
      }
    }, 1500);

    // 3. Failsafe final: Se nada resolveu em 8s, libera o loading de qualquer jeito
    const absoluteFailsafe = setTimeout(() => {
      if (!initializedRef.current && mounted) {
        console.warn('[Auth] Failsafe absoluto acionado!');
        setLoading(false);
        initializedRef.current = true;
      }
    }, 8000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
      clearTimeout(absoluteFailsafe);
    };
  }, [fetchProfile]);

  // ─── Login ────────────────────────────────────────────────────────────────

  const signIn = async (email, password) => {
    const sanitizedEmail = email.trim().toLowerCase();

    const isLocked = await checkServerLockout(sanitizedEmail);
    if (isLocked) {
      return { error: new Error('Conta bloqueada temporariamente.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (error) {
        await handleFailedAttempt(sanitizedEmail);
        return { error: new Error('Credenciais inválidas.') };
      }

      await supabase.rpc('reset_auth_attempts', { target_email: sanitizedEmail }).catch(() => {});

      const userProfile = await fetchProfile(data.user.id);
      
      if (!userProfile) {
        await supabase.auth.signOut();
        return { error: new Error('Perfil não encontrado.') };
      }

      setSession(data.session);
      setProfile(userProfile);

      return { data };
    } catch (err) {
      return { error: new Error('Erro de conexão.') };
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
    isLockedOut: !!(lockoutTime && lockoutTime > Date.now())
  };
}
