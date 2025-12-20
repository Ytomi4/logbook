import { useCallback } from 'react';
import { authClient } from '../lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const { data: session, isPending } = authClient.useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }
    : null;

  const isAuthenticated = !!session?.user;

  const signInWithGoogle = useCallback(async () => {
    await authClient.signIn.social({
      provider: 'google',
    });
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    signInWithGoogle,
    signOut,
  };
}
