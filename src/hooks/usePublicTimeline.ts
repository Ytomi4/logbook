import { useState, useCallback, useEffect } from 'react';
import type { PublicUser, LogWithBook } from '../types';
import { getPublicTimeline } from '../services/publicTimeline';

interface UsePublicTimelineResult {
  user: PublicUser | null;
  logs: LogWithBook[];
  total: number;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const LIMIT = 50;

export function usePublicTimeline(username: string): UsePublicTimelineResult {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [logs, setLogs] = useState<LogWithBook[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchTimeline = useCallback(
    async (initialLoad = false) => {
      if (!username) return;

      try {
        setIsLoading(true);
        setError(null);

        const currentOffset = initialLoad ? 0 : offset;
        const data = await getPublicTimeline(username, {
          limit: LIMIT,
          offset: currentOffset,
        });

        setUser(data.user);
        setTotal(data.total);

        if (initialLoad) {
          setLogs(data.data);
          setOffset(data.data.length);
        } else {
          setLogs((prev) => [...prev, ...data.data]);
          setOffset((prev) => prev + data.data.length);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setIsNotFound(true);
        } else {
          const message =
            err instanceof Error
              ? err.message
              : 'タイムラインの取得に失敗しました';
          setError(message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [username, offset]
  );

  const loadMore = useCallback(async () => {
    if (!isLoading && logs.length < total) {
      await fetchTimeline(false);
    }
  }, [fetchTimeline, isLoading, logs.length, total]);

  useEffect(() => {
    setLogs([]);
    setOffset(0);
    setIsNotFound(false);
    setError(null);
    fetchTimeline(true);
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user,
    logs,
    total,
    isLoading,
    error,
    isNotFound,
    loadMore,
    hasMore: logs.length < total,
  };
}
