import { describe, it, expect } from 'vitest';
import { getNdlThumbnailUrl, NDL_THUMBNAIL_BASE } from '../../src/lib/ndl';

describe('getNdlThumbnailUrl', () => {
  describe('valid ISBN', () => {
    it('returns correct URL for valid ISBN-13', () => {
      const isbn = '9784422311074';
      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(`${NDL_THUMBNAIL_BASE}/9784422311074.jpg`);
    });

    it('returns correct URL for valid ISBN-10', () => {
      const isbn = '4422311077';
      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(`${NDL_THUMBNAIL_BASE}/4422311077.jpg`);
    });

    it('normalizes ISBN with hyphens', () => {
      const isbn = '978-4-422-31107-4';
      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(`${NDL_THUMBNAIL_BASE}/9784422311074.jpg`);
    });

    it('normalizes ISBN with spaces', () => {
      const isbn = '978 4 422 31107 4';
      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(`${NDL_THUMBNAIL_BASE}/9784422311074.jpg`);
    });

    it('normalizes ISBN with mixed hyphens and spaces', () => {
      const isbn = '978-4 422-31107 4';
      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(`${NDL_THUMBNAIL_BASE}/9784422311074.jpg`);
    });
  });

  describe('invalid ISBN', () => {
    it('returns null for null input', () => {
      const result = getNdlThumbnailUrl(null);
      expect(result).toBeNull();
    });

    it('returns null for undefined input', () => {
      const result = getNdlThumbnailUrl(undefined);
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = getNdlThumbnailUrl('');
      expect(result).toBeNull();
    });

    it('returns null for ISBN with wrong length (too short)', () => {
      const result = getNdlThumbnailUrl('123456789');
      expect(result).toBeNull();
    });

    it('returns null for ISBN with wrong length (too long)', () => {
      const result = getNdlThumbnailUrl('12345678901234');
      expect(result).toBeNull();
    });

    it('returns null for non-numeric ISBN', () => {
      const result = getNdlThumbnailUrl('978442231107X');
      expect(result).toBeNull();
    });

    it('returns null for ISBN with letters', () => {
      const result = getNdlThumbnailUrl('abcdefghij');
      expect(result).toBeNull();
    });
  });
});
