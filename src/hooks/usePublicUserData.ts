import { useState, useCallback, useEffect } from 'react';
import type { PublicUser, LogWithBook, Book } from '../types';
import { getPublicTimeline, getPublicBooks } from '../services/publicTimeline';

interface UsePublicUserDataResult {
  user: PublicUser | null;
  logs: LogWithBook[];
  books: Book[];
  totalLogs: number;
  totalBooks: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  isNotFound: boolean;
  loadMoreLogs: () => Promise<void>;
  loadMoreBooks: () => Promise<void>;
  hasMoreLogs: boolean;
  hasMoreBooks: boolean;
  refreshTimeline: () => Promise<void>;
  refreshBooks: () => Promise<void>;
}

const LIMIT = 50;

export function usePublicUserData(username: string): UsePublicUserDataResult {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [logs, setLogs] = useState<LogWithBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [logsOffset, setLogsOffset] = useState(0);
  const [booksOffset, setBooksOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchInitialData = useCallback(async () => {
    if (!username) return;

    try {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      // Fetch timeline and books in parallel
      const [timelineData, booksData] = await Promise.all([
        getPublicTimeline(username, { limit: LIMIT, offset: 0 }),
        getPublicBooks(username, { limit: LIMIT, offset: 0 }),
      ]);

      setUser(timelineData.user);
      setLogs(timelineData.data);
      setTotalLogs(timelineData.total);
      setLogsOffset(timelineData.data.length);

      setBooks(booksData.data);
      setTotalBooks(booksData.total);
      setBooksOffset(booksData.data.length);
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setIsNotFound(true);
      } else {
        const message =
          err instanceof Error
            ? err.message
            : 'データの取得に失敗しました';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const loadMoreLogs = useCallback(async () => {
    if (isLoadingMore || logs.length >= totalLogs) return;

    try {
      setIsLoadingMore(true);
      const data = await getPublicTimeline(username, {
        limit: LIMIT,
        offset: logsOffset,
      });

      setLogs((prev) => [...prev, ...data.data]);
      setLogsOffset((prev) => prev + data.data.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ログの取得に失敗しました';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [username, logsOffset, isLoadingMore, logs.length, totalLogs]);

  const loadMoreBooks = useCallback(async () => {
    if (isLoadingMore || books.length >= totalBooks) return;

    try {
      setIsLoadingMore(true);
      const data = await getPublicBooks(username, {
        limit: LIMIT,
        offset: booksOffset,
      });

      setBooks((prev) => [...prev, ...data.data]);
      setBooksOffset((prev) => prev + data.data.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '本棚の取得に失敗しました';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [username, booksOffset, isLoadingMore, books.length, totalBooks]);

  const refreshTimeline = useCallback(async () => {
    if (!username) return;

    try {
      const data = await getPublicTimeline(username, { limit: LIMIT, offset: 0 });
      setLogs(data.data);
      setTotalLogs(data.total);
      setLogsOffset(data.data.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'ログの取得に失敗しました';
      setError(message);
    }
  }, [username]);

  const refreshBooks = useCallback(async () => {
    if (!username) return;

    try {
      const data = await getPublicBooks(username, { limit: LIMIT, offset: 0 });
      setBooks(data.data);
      setTotalBooks(data.total);
      setBooksOffset(data.data.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '本棚の取得に失敗しました';
      setError(message);
    }
  }, [username]);

  useEffect(() => {
    setLogs([]);
    setBooks([]);
    setLogsOffset(0);
    setBooksOffset(0);
    setIsNotFound(false);
    setError(null);
    fetchInitialData();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user,
    logs,
    books,
    totalLogs,
    totalBooks,
    isLoading,
    isLoadingMore,
    error,
    isNotFound,
    loadMoreLogs,
    loadMoreBooks,
    hasMoreLogs: logs.length < totalLogs,
    hasMoreBooks: books.length < totalBooks,
    refreshTimeline,
    refreshBooks,
  };
}
