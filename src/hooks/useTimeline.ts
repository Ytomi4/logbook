import { useState, useEffect, useCallback } from 'react';
import type { LogWithBook } from '../types';
import { getTimeline } from '../services/logs';
import { ApiClientError } from '../services/api';

const PAGE_SIZE = 20;

interface UseTimelineResult {
  logs: LogWithBook[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useTimeline(): UseTimelineResult {
  const [logs, setLogs] = useState<LogWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const hasMore = logs.length < total;

  const fetchLogs = useCallback(async (currentOffset: number, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTimeline({
        limit: PAGE_SIZE,
        offset: currentOffset,
      });

      if (append) {
        setLogs((prev) => [...prev, ...response.data]);
      } else {
        setLogs(response.data);
      }
      setTotal(response.total);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load timeline');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const newOffset = offset + PAGE_SIZE;
      setOffset(newOffset);
      fetchLogs(newOffset, true);
    }
  }, [isLoading, hasMore, offset, fetchLogs]);

  const refresh = useCallback(() => {
    setOffset(0);
    fetchLogs(0);
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
