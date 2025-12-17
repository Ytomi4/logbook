import { useState, useCallback, useRef, useEffect } from 'react';
import type { NdlBook } from '../types';
import { searchNdl } from '../services/ndl';
import { ApiClientError } from '../services/api';

interface UseBookSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: NdlBook[];
  isLoading: boolean;
  error: string | null;
  search: (searchQuery?: string) => Promise<void>;
  clear: () => void;
}

export function useBookSearch(debounceMs: number = 500): UseBookSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NdlBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (searchQuery?: string) => {
    const q = searchQuery ?? query;

    if (!q.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchNdl({ title: q.trim(), cnt: 10 });
      setResults(response.items);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('検索に失敗しました');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        search();
      }, debounceMs);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceMs, search]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clear,
  };
}
