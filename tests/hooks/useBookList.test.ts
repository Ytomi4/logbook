import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBookList } from '../../src/hooks/useBookList';
import * as booksService from '../../src/services/books';
import { ApiClientError } from '../../src/services/api';

vi.mock('../../src/services/books');

const mockBooks = [
  {
    id: '1',
    title: 'Test Book 1',
    author: 'Author 1',
    publisher: null,
    coverUrl: null,
    isbn: null,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    logCount: 5,
  },
  {
    id: '2',
    title: 'Test Book 2',
    author: 'Author 2',
    publisher: null,
    coverUrl: null,
    isbn: null,
    isDeleted: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    logCount: 3,
  },
];

describe('useBookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial fetch', () => {
    it('fetches books on mount', async () => {
      vi.mocked(booksService.getBooks).mockResolvedValue(mockBooks);

      const { result } = renderHook(() => useBookList());

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch error', async () => {
      vi.mocked(booksService.getBooks).mockRejectedValue(
        new ApiClientError('Failed to fetch')
      );

      const { result } = renderHook(() => useBookList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.books).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch');
    });

    it('handles unknown error', async () => {
      vi.mocked(booksService.getBooks).mockRejectedValue(new Error('Unknown'));

      const { result } = renderHook(() => useBookList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('本の読み込みに失敗しました');
    });
  });

  describe('deleteBook', () => {
    it('deletes book and refetches', async () => {
      vi.mocked(booksService.getBooks).mockResolvedValue(mockBooks);
      vi.mocked(booksService.deleteBook).mockResolvedValue(undefined);

      const { result } = renderHook(() => useBookList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // After initial fetch, getBooks should be called once
      expect(booksService.getBooks).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.deleteBook('1');
      });

      // deleteBook should be called
      expect(booksService.deleteBook).toHaveBeenCalledWith('1');
      // getBooks should be called again for refetch
      expect(booksService.getBooks).toHaveBeenCalledTimes(2);
    });

    it('throws error on delete failure', async () => {
      vi.mocked(booksService.getBooks).mockResolvedValue(mockBooks);
      vi.mocked(booksService.deleteBook).mockRejectedValue(
        new ApiClientError('Delete failed')
      );

      const { result } = renderHook(() => useBookList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify that deleteBook throws the error
      await expect(result.current.deleteBook('1')).rejects.toThrow('Delete failed');
    });
  });

  describe('refetch', () => {
    it('refetches books', async () => {
      vi.mocked(booksService.getBooks).mockResolvedValue(mockBooks);

      const { result } = renderHook(() => useBookList());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(booksService.getBooks).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refetch();
      });

      expect(booksService.getBooks).toHaveBeenCalledTimes(2);
    });
  });
});
