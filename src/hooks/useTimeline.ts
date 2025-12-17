import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';
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
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useTimeline(): UseTimelineResult {
  const [logs, setLogs] = useState<LogWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadMore]);

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
    sentinelRef,
  };
}
