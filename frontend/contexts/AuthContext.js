'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';
import {
  clearSession,
  getToken,
  getUser,
  setToken,
  setUser,
} from '@/lib/auth';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((token, nextUser) => {
    setToken(token);
    setUser(nextUser);
    setUserState(nextUser);
  }, []);

  const clearAuth = useCallback(() => {
    clearSession();
    setUserState(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      applySession(data.token, data.user);
      return data.user;
    },
    [applySession]
  );

  const logout = useCallback(() => {
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);

  const refreshMe = useCallback(async () => {
    const data = await authService.fetchMe();
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getToken();
      const cachedUser = getUser();

      if (!token) {
        if (!cancelled) {
          setUserState(null);
          setLoading(false);
        }
        return;
      }

      // Affiche immediatement l'utilisateur en cache pour eviter un flash,
      // puis revalide aupres du backend.
      if (cachedUser && !cancelled) {
        setUserState(cachedUser);
      }

      try {
        const data = await authService.fetchMe();
        if (!cancelled) {
          setUser(data.user);
          setUserState(data.user);
        }
      } catch {
        if (!cancelled) {
          clearAuth();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshMe,
    }),
    [user, loading, login, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };