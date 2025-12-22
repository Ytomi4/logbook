import { describe, it, expect } from 'vitest';
import {
  calculateRelevanceScore,
  sortByRelevance,
} from '../../src/lib/search-relevance';
import type { NdlBook } from '../../src/types';

// Helper to create mock NdlBook
function createMockBook(
  title: string,
  author: string | null = null
): NdlBook {
  return {
    title,
    author,
    publisher: null,
    isbn: null,
    pubDate: null,
    ndlBibId: `test-${title.replace(/\s+/g, '-')}`,
  };
}

describe('calculateRelevanceScore', () => {
  describe('title matching', () => {
    it('returns 100 for exact title match', () => {
      const book = createMockBook('JavaScript入門');
      expect(calculateRelevanceScore(book, 'JavaScript入門')).toBe(100);
    });

    it('returns 80 for prefix match', () => {
      const book = createMockBook('JavaScript入門 第2版');
      expect(calculateRelevanceScore(book, 'JavaScript入門')).toBe(80);
    });

    it('returns 60 for contains match', () => {
      const book = createMockBook('プロフェッショナルJavaScript');
      expect(calculateRelevanceScore(book, 'JavaScript')).toBe(60);
    });

    it('returns 40 for no title match', () => {
      const book = createMockBook('Python入門');
      expect(calculateRelevanceScore(book, 'JavaScript')).toBe(40);
    });
  });

  describe('author bonus', () => {
    it('adds 10 bonus when author contains query', () => {
      const book = createMockBook('Python入門', '山田太郎');
      expect(calculateRelevanceScore(book, '山田')).toBe(50); // 40 (no title match) + 10 (author bonus)
    });

    it('adds author bonus to exact title match', () => {
      const book = createMockBook('山田', '山田太郎');
      expect(calculateRelevanceScore(book, '山田')).toBe(110); // 100 + 10 (author contains '山田')
    });

    it('handles null author without error', () => {
      const book = createMockBook('JavaScript入門', null);
      expect(calculateRelevanceScore(book, '山田')).toBe(40);
    });
  });

  describe('case insensitivity', () => {
    it('matches regardless of case', () => {
      const book = createMockBook('JavaScript入門');
      expect(calculateRelevanceScore(book, 'javascript入門')).toBe(100);
    });

    it('matches uppercase query to lowercase title', () => {
      const book = createMockBook('react handbook');
      expect(calculateRelevanceScore(book, 'REACT')).toBe(80);
    });
  });
});

describe('sortByRelevance', () => {
  it('sorts books by relevance score descending', () => {
    const books = [
      createMockBook('プロフェッショナルJavaScript'), // 60 (contains)
      createMockBook('JavaScript入門'), // 100 (exact)
      createMockBook('JavaScript入門 第2版'), // 80 (prefix)
      createMockBook('Python入門'), // 40 (no match)
    ];

    const sorted = sortByRelevance(books, 'JavaScript入門');

    expect(sorted[0].title).toBe('JavaScript入門');
    expect(sorted[1].title).toBe('JavaScript入門 第2版');
    expect(sorted[2].title).toBe('プロフェッショナルJavaScript');
    expect(sorted[3].title).toBe('Python入門');
  });

  it('does not modify the original array (pure function)', () => {
    const books = [
      createMockBook('B Book'),
      createMockBook('A Book'),
    ];
    const originalOrder = [...books];

    sortByRelevance(books, 'A');

    expect(books[0].title).toBe(originalOrder[0].title);
    expect(books[1].title).toBe(originalOrder[1].title);
  });

  it('handles empty array', () => {
    const result = sortByRelevance([], 'test');
    expect(result).toEqual([]);
  });

  it('considers author bonus in sorting', () => {
    const books = [
      createMockBook('プログラミング入門', '他の著者'),
      createMockBook('プログラミング入門', '山田太郎'),
    ];

    const sorted = sortByRelevance(books, '山田');

    // Both have score 40 for title, but second has +10 for author
    expect(sorted[0].author).toBe('山田太郎');
    expect(sorted[1].author).toBe('他の著者');
  });
});
