import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { UsernameInput } from '../components/common/UsernameInput';
import { Button } from '../components/common/Button';

export function SetupPage() {
  const { user, isAuthenticated, isLoading: authLoading, refetchSession } = useAuth();
  const { updateUsername } = useProfile();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/enter', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!authLoading && user?.username) {
      navigate(`/${user.username}`, { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleValidationChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await updateUsername(username);
      if (success) {
        await refetchSession();
        navigate(`/${username}`, { replace: true });
      } else {
        setError('ハンドルネームの設定に失敗しました');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ハンドルネームの設定に失敗しました';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            アカウントを作成します
          </h1>
          <p className="text-gray-600">ハンドルネームを決めましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <UsernameInput
            value={username}
            onChange={setUsername}
            onValidationChange={handleValidationChange}
            disabled={isSubmitting}
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? '設定中...' : 'これで始める'}
          </Button>
        </form>
      </div>
    </div>
  );
}
