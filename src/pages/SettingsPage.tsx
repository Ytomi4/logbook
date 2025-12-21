import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Layout } from '../components/common/Layout';
import { AvatarUploader } from '../components/common/AvatarUploader';
import { UsernameInput } from '../components/common/UsernameInput';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, refetchSession } = useAuth();
  const { profile, isLoading: profileLoading, updateUsername, updateAvatar } = useProfile();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/enter', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  const handleValidationChange = useCallback((valid: boolean) => {
    setIsUsernameValid(valid);
  }, []);

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      try {
        const success = await updateAvatar(file);
        if (success) {
          await refetchSession();
          setToast({ message: 'アバターを更新しました', type: 'success' });
        } else {
          setToast({ message: 'アバターの更新に失敗しました', type: 'error' });
        }
      } catch {
        setToast({ message: 'アバターの更新に失敗しました', type: 'error' });
      }
    },
    [updateAvatar, refetchSession]
  );

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUsernameValid || isSubmitting || username === profile?.username) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateUsername(username);
      if (success) {
        await refetchSession();
        setToast({ message: 'ハンドルネームを更新しました', type: 'success' });
      } else {
        setToast({ message: 'ハンドルネームの更新に失敗しました', type: 'error' });
      }
    } catch {
      setToast({ message: 'ハンドルネームの更新に失敗しました', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">アカウント設定</h1>

        {/* Avatar Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            プロフィール画像
          </h2>
          <AvatarUploader
            currentImageUrl={profile?.avatarUrl || profile?.image || null}
            onUpload={handleAvatarUpload}
          />
        </div>

        {/* Username Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            ハンドルネーム
          </h2>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <UsernameInput
              value={username}
              onChange={setUsername}
              onValidationChange={handleValidationChange}
              disabled={isSubmitting}
              label=""
            />
            <Button
              type="submit"
              disabled={!isUsernameValid || isSubmitting || username === profile?.username}
            >
              {isSubmitting ? '更新中...' : 'ハンドルネームを更新'}
            </Button>
          </form>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}
