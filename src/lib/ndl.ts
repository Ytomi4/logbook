/**
 * NDL (National Diet Library) thumbnail URL utilities
 */

export const NDL_THUMBNAIL_BASE = 'https://ndlsearch.ndl.go.jp/thumbnail';

/**
 * Generate NDL thumbnail URL from ISBN
 * @param isbn - ISBN string (10 or 13 digits, with or without hyphens)
 * @returns NDL thumbnail URL or null if ISBN is invalid
 */
export function getNdlThumbnailUrl(isbn: string | null | undefined): string | null {
  if (!isbn) {
    return null;
  }

  // Remove hyphens and spaces
  const normalizedIsbn = isbn.replace(/[-\s]/g, '');

  // Validate ISBN format (10 or 13 digits)
  if (!/^\d{10}$|^\d{13}$/.test(normalizedIsbn)) {
    return null;
  }

  return `${NDL_THUMBNAIL_BASE}/${normalizedIsbn}.jpg`;
}
