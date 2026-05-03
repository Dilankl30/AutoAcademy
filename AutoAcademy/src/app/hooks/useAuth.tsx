import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email: string;
  username?: string;
  plan?: 'Básico' | 'Intermedio' | 'Completo' | null;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a96c109b`;
const ADMIN_EMAIL = 'admin@autoacademy.com';

const isDefaultAdmin = (email?: string | null) => email?.toLowerCase() === ADMIN_EMAIL;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    accessToken: null,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAuthState({ user: null, loading: false, accessToken: null });
        return;
      }

      const response = await fetch(`${API_BASE}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.profile) {
        setAuthState({
          user: {
            id: data.profile.id,
            email: data.profile.email,
            username: data.profile.username || data.profile.full_name || undefined,
            plan: data.profile.plan || data.profile.current_plan || data.profile.package_plan || null,
            is_admin: isDefaultAdmin(data.profile.email) || data.profile.is_admin || false,
          },
          loading: false,
          accessToken: token,
        });
      } else {
        localStorage.removeItem('access_token');
        setAuthState({ user: null, loading: false, accessToken: null });
      }
    } catch (error) {
      console.error('Session check error:', error);
      setAuthState({ user: null, loading: false, accessToken: null });
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('access_token', data.session.access_token);

      setAuthState({
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || undefined,
          plan: data.user.user_metadata?.plan || null,
          is_admin: isDefaultAdmin(data.user.email) || isDefaultAdmin(email),
        },
        loading: false,
        accessToken: data.session.access_token,
      });

      // Refresh to get profile data
      await checkSession();

      return { success: true };
    } catch (error: any) {
      console.error('Signin error:', error);
      throw error;
    }
  };


  const verifyEmailCode = async (email: string, code: string) => {
    const response = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Código inválido o expirado');
    return data;
  };



  const resendVerificationCode = async (email: string) => {
    const response = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo reenviar el código');
    return data;
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_BASE}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem('access_token');
      setAuthState({ user: null, loading: false, accessToken: null });
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    accessToken: authState.accessToken,
    signUp,
    signIn,
    signOut,
    verifyEmailCode,
    resendVerificationCode,
  };
}
