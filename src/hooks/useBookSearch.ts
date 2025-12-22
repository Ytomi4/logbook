import { useState, useCallback, useRef, useEffect } from 'react';
import type { NdlBook } from '../types';
import { searchNdl } from '../services/ndl';
import { ApiClientError } from '../services/api';
import { sortByRelevance } from '../lib/search-relevance';

const ITEMS_PER_PAGE = 30;
const MAX_RESULTS = 500;

interface UseBookSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: NdlBook[];
  isLoading: boolean;
  error: string | null;
  search: (searchQuery?: string) => Promise<void>;
  clear: () => void;
  // Pagination
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
}

export function useBookSearch(debounceMs: number = 500): UseBookSearchResult {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<NdlBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchQueryRef = useRef<string>('');

  // Calculate hasMore: more results available and under 500 limit
  const fetchedCount = allResults.length;
  const hasMore = fetchedCount < totalResults && fetchedCount < MAX_RESULTS;

  // Sort results by relevance
  const results = searchQueryRef.current
    ? sortByRelevance(allResults, searchQueryRef.current)
    : allResults;

  const search = useCallback(async (searchQuery?: string) => {
    const q = searchQuery ?? query;

    if (!q.trim()) {
      setAllResults([]);
      setTotalResults(0);
      setCurrentIdx(1);
      searchQueryRef.current = '';
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Reset pagination state for new search
    setCurrentIdx(1);
    setIsLoading(true);
    setError(null);
    searchQueryRef.current = q.trim();

    try {
      const response = await searchNdl({ title: q.trim(), cnt: ITEMS_PER_PAGE, idx: 1 });
      setAllResults(response.items);
      setTotalResults(response.totalResults);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('検索に失敗しました');
      }
      setAllResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!searchQueryRef.current || isLoadingMore || !hasMore) {
      return;
    }

    const nextIdx = currentIdx + ITEMS_PER_PAGE;

    // Check 500 limit
    if (nextIdx > MAX_RESULTS) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await searchNdl({
        title: searchQueryRef.current,
        cnt: ITEMS_PER_PAGE,
        idx: nextIdx,
      });

      // Merge new results with existing ones
      setAllResults(prev => [...prev, ...response.items]);
      setCurrentIdx(nextIdx);
      setTotalResults(response.totalResults);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('追加読み込みに失敗しました');
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentIdx, hasMore, isLoadingMore]);

  const clear = useCallback(() => {
    setQuery('');
    setAllResults([]);
    setTotalResults(0);
    setCurrentIdx(1);
    setError(null);
    searchQueryRef.current = '';
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
      setAllResults([]);
      setTotalResults(0);
      setCurrentIdx(1);
      searchQueryRef.current = '';
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
    hasMore,
    isLoadingMore,
    loadMore,
  };
}
