import { useState, useCallback } from 'react';
import type { CreateLogRequest, UpdateLogRequest, Log } from '../types';
import { createLog, updateLog, deleteLog } from '../services/logs';
import { ApiClientError } from '../services/api';

interface UseLogFormOptions {
  bookId?: string;
  onSuccess?: () => void;
}

interface UseLogFormResult {
  isLoading: boolean;
  error: string | null;
  create: (data: CreateLogRequest) => Promise<Log | null>;
  update: (logId: string, data: UpdateLogRequest) => Promise<Log | null>;
  remove: (logId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useLogForm({ bookId, onSuccess }: UseLogFormOptions = {}): UseLogFormResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CreateLogRequest): Promise<Log | null> => {
      if (!bookId) {
        setError('Book ID is required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const log = await createLog(bookId, data);
        onSuccess?.();
        return log;
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to create log');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [bookId, onSuccess]
  );

  const update = useCallback(
    async (logId: string, data: UpdateLogRequest): Promise<Log | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const log = await updateLog(logId, data);
        onSuccess?.();
        return log;
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to update log');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  const remove = useCallback(
    async (logId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteLog(logId);
        onSuccess?.();
        return true;
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to delete log');
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    create,
    update,
    remove,
    clearError,
  };
}
