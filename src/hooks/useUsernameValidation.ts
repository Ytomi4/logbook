import { useState, useCallback, useEffect, useRef } from 'react';
import { usernameSchema } from '../lib/validation';
import { isReservedUsername } from '../lib/reserved-usernames';
import { checkUsername } from '../services/profile';

interface UseUsernameValidationResult {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  checkUsernameValue: (username: string) => void;
}

export function useUsernameValidation(): UseUsernameValidationResult {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkUsernameValue = useCallback((username: string) => {
    // Cancel previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset state for empty input
    if (!username) {
      setIsValid(false);
      setError(null);
      setIsChecking(false);
      return;
    }

    // Client-side validation first
    const parseResult = usernameSchema.safeParse(username);
    if (!parseResult.success) {
      setIsValid(false);
      setError(parseResult.error.issues[0]?.message || 'Invalid username');
      setIsChecking(false);
      return;
    }

    // Check reserved usernames
    if (isReservedUsername(username)) {
      setIsValid(false);
      setError('このユーザー名は使用できません');
      setIsChecking(false);
      return;
    }

    // Debounced server check
    setIsChecking(true);
    setError(null);

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();

      try {
        const result = await checkUsername(username);

        if (result.available) {
          setIsValid(true);
          setError(null);
        } else {
          setIsValid(false);
          switch (result.reason) {
            case 'taken':
              setError('このユーザー名は既に使用されています');
              break;
            case 'reserved':
              setError('このユーザー名は使用できません');
              break;
            case 'invalid':
              setError(result.message || 'ユーザー名の形式が正しくありません');
              break;
            default:
              setError('ユーザー名を確認できませんでした');
          }
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setIsValid(false);
        setError('ユーザー名の確認に失敗しました');
      } finally {
        setIsChecking(false);
      }
    }, 300);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isValid,
    isChecking,
    error,
    checkUsernameValue,
  };
}
