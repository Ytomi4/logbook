import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookCover } from '../../src/components/common/BookCover';

describe('BookCover', () => {
  describe('with coverUrl', () => {
    it('renders image when coverUrl is provided', () => {
      render(<BookCover coverUrl="https://example.com/cover.jpg" title="Test Book" />);

      const img = screen.getByRole('img', { name: 'Test Book' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg');
    });

    it('shows fallback icon on image error', () => {
      render(<BookCover coverUrl="https://example.com/invalid.jpg" title="Test Book" />);

      const img = screen.getByRole('img', { name: 'Test Book' });
      fireEvent.error(img);

      // After error, fallback should be shown (no img element)
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      // Fallback div with title should be present
      expect(screen.getByTitle('Test Book')).toBeInTheDocument();
    });
  });

  describe('without coverUrl', () => {
    it('renders fallback icon when coverUrl is null', () => {
      render(<BookCover coverUrl={null} title="Test Book" />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByTitle('Test Book')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies small size classes', () => {
      render(<BookCover coverUrl={null} title="Test Book" size="sm" />);

      const fallback = screen.getByTitle('Test Book');
      expect(fallback).toHaveClass('w-8', 'h-12');
    });

    it('applies medium size classes (default)', () => {
      render(<BookCover coverUrl={null} title="Test Book" />);

      const fallback = screen.getByTitle('Test Book');
      expect(fallback).toHaveClass('w-12', 'h-16');
    });

    it('applies large size classes', () => {
      render(<BookCover coverUrl={null} title="Test Book" size="lg" />);

      const fallback = screen.getByTitle('Test Book');
      expect(fallback).toHaveClass('w-16', 'h-24');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<BookCover coverUrl={null} title="Test Book" className="custom-class" />);

      const fallback = screen.getByTitle('Test Book');
      expect(fallback).toHaveClass('custom-class');
    });
  });
});
