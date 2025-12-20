import { useCallback, useState } from 'react';
import { authClient } from '../lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
}

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthResult {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        username: (session.user as { username?: string }).username ?? null,
      }
    : null;

  const isAuthenticated = !!session?.user;

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      await authClient.signIn.social({
        provider: 'google',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(message);
      console.error('Sign in error:', err);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await authClient.signOut();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ログアウトに失敗しました';
      setError(message);
      console.error('Sign out error:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    error,
    signInWithGoogle,
    signOut,
    clearError,
  };
}
