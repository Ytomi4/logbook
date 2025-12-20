import { useState, useEffect, useCallback } from 'react';
import type { BookWithLogCount } from '../types';
import { getBooks, deleteBook as deleteBookApi } from '../services/books';
import { ApiClientError } from '../services/api';

interface UseBookListReturn {
  books: BookWithLogCount[];
  isLoading: boolean;
  error: string | null;
  deleteBook: (bookId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useBookList(): UseBookListReturn {
  const [books, setBooks] = useState<BookWithLogCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('本の読み込みに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const deleteBook = useCallback(
    async (bookId: string) => {
      try {
        await deleteBookApi(bookId);
        await fetchBooks();
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('削除に失敗しました');
        }
        throw err;
      }
    },
    [fetchBooks]
  );

  return {
    books,
    isLoading,
    error,
    deleteBook,
    refetch: fetchBooks,
  };
}
