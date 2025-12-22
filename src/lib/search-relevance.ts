import type { NdlBook } from '../types';

/**
 * Calculate relevance score for a book based on query match.
 * - 100: Exact title match
 * - 80: Title starts with query (prefix match)
 * - 60: Title contains query (partial match)
 * - 40: No title match
 * - +10: Author contains query (bonus)
 */
export function calculateRelevanceScore(book: NdlBook, query: string): number {
  const title = book.title.toLowerCase();
  const author = (book.author ?? '').toLowerCase();
  const q = query.toLowerCase();

  // Title relevance (primary)
  let score = 0;
  if (title === q) {
    score = 100; // Exact match
  } else if (title.startsWith(q)) {
    score = 80; // Prefix match
  } else if (title.includes(q)) {
    score = 60; // Contains match
  } else {
    score = 40; // No title match
  }

  // Author bonus (secondary)
  if (author.includes(q)) {
    score += 10;
  }

  return score;
}

/**
 * Sort books by relevance score in descending order.
 * Returns a new array without modifying the input.
 */
export function sortByRelevance(books: NdlBook[], query: string): NdlBook[] {
  return [...books].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, query);
    const scoreB = calculateRelevanceScore(b, query);
    return scoreB - scoreA;
  });
}
