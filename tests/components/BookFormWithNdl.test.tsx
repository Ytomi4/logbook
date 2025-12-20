import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookFormWithNdl } from '../../src/components/BookForm/BookForm';
import type { NdlBook } from '../../src/types';
import { getNdlThumbnailUrl, NDL_THUMBNAIL_BASE } from '../../src/lib/ndl';

describe('BookFormWithNdl', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('coverUrl generation from NDL book', () => {
    it('generates coverUrl from ISBN when NDL book has ISBN', () => {
      const ndlBook: NdlBook = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        isbn: '9784422311074',
        pubDate: '2020',
        ndlBibId: 'R100000001-I000000001-00',
      };

      render(<BookFormWithNdl ndlBook={ndlBook} onSubmit={mockOnSubmit} />);

      // Verify the form is rendered with the book data
      expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Publisher')).toBeInTheDocument();
      expect(screen.getByDisplayValue('9784422311074')).toBeInTheDocument();
    });

    it('generates correct NDL thumbnail URL from ISBN', () => {
      const isbn = '9784422311074';
      const expectedUrl = `${NDL_THUMBNAIL_BASE}/${isbn}.jpg`;

      const result = getNdlThumbnailUrl(isbn);
      expect(result).toBe(expectedUrl);
    });

    it('returns null coverUrl when NDL book has no ISBN', () => {
      const ndlBook: NdlBook = {
        title: 'Book Without ISBN',
        author: 'Author',
        publisher: null,
        isbn: null,
        pubDate: null,
        ndlBibId: 'R100000001-I000000002-00',
      };

      render(<BookFormWithNdl ndlBook={ndlBook} onSubmit={mockOnSubmit} />);

      // Form should still render
      expect(screen.getByDisplayValue('Book Without ISBN')).toBeInTheDocument();

      // getNdlThumbnailUrl should return null for null ISBN
      expect(getNdlThumbnailUrl(null)).toBeNull();
    });

    it('normalizes hyphenated ISBN in coverUrl', () => {
      const hyphenatedIsbn = '978-4-422-31107-4';
      const expectedUrl = `${NDL_THUMBNAIL_BASE}/9784422311074.jpg`;

      const result = getNdlThumbnailUrl(hyphenatedIsbn);
      expect(result).toBe(expectedUrl);
    });
  });

  describe('form submission with coverUrl', () => {
    it('includes coverUrl in submitted data when ISBN exists', async () => {
      const ndlBook: NdlBook = {
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        isbn: '9784422311074',
        pubDate: '2020',
        ndlBibId: 'R100000001-I000000001-00',
      };

      render(<BookFormWithNdl ndlBook={ndlBook} onSubmit={mockOnSubmit} />);

      // Find and click submit button
      const submitButton = screen.getByRole('button', { name: '登録する' });
      submitButton.click();

      // Wait for async submit
      await vi.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      // Verify coverUrl is included in the submitted data
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.coverUrl).toBe(`${NDL_THUMBNAIL_BASE}/9784422311074.jpg`);
      expect(submittedData.title).toBe('Test Book');
      expect(submittedData.isbn).toBe('9784422311074');
    });

    it('does not include coverUrl when ISBN is missing', async () => {
      const ndlBook: NdlBook = {
        title: 'Book Without ISBN',
        author: 'Author',
        publisher: null,
        isbn: null,
        pubDate: null,
        ndlBibId: 'R100000001-I000000002-00',
      };

      render(<BookFormWithNdl ndlBook={ndlBook} onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: '登録する' });
      submitButton.click();

      await vi.waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.coverUrl).toBeUndefined();
    });
  });
});
