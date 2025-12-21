import { useState, useCallback, useEffect } from 'react';
import type { UserProfile } from '../types';
import { getProfile, updateProfile, uploadAvatar } from '../services/profile';

interface UseProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUsername: (username: string) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'プロフィールの取得に失敗しました';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUsername = useCallback(async (username: string): Promise<boolean> => {
    try {
      setError(null);
      const data = await updateProfile({ username });
      setProfile(data);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ハンドルネームの更新に失敗しました';
      setError(message);
      return false;
    }
  }, []);

  const updateAvatarFn = useCallback(async (file: File): Promise<boolean> => {
    try {
      setError(null);
      const result = await uploadAvatar(file);
      // Update profile with new avatar URL
      setProfile((prev) =>
        prev ? { ...prev, avatarUrl: result.avatarUrl } : null
      );
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'アバターの更新に失敗しました';
      setError(message);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    updateUsername,
    updateAvatar: updateAvatarFn,
    refresh: fetchProfile,
  };
}
