import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabNavigation } from '../../src/components/common/TabNavigation';

describe('TabNavigation', () => {
  describe('rendering', () => {
    it('renders both tabs', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation activeTab="timeline" onTabChange={onTabChange} />);

      expect(screen.getByText('タイムライン')).toBeInTheDocument();
      expect(screen.getByText('本の一覧')).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('applies active styles to timeline tab when active', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation activeTab="timeline" onTabChange={onTabChange} />);

      const timelineButton = screen.getByText('タイムライン').closest('button');
      expect(timelineButton).toHaveClass('bg-white');
    });

    it('applies active styles to books tab when active', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation activeTab="books" onTabChange={onTabChange} />);

      const booksButton = screen.getByText('本の一覧').closest('button');
      expect(booksButton).toHaveClass('bg-white');
    });
  });

  describe('click handlers', () => {
    it('calls onTabChange with "timeline" when timeline tab is clicked', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation activeTab="books" onTabChange={onTabChange} />);

      const timelineButton = screen.getByText('タイムライン').closest('button');
      fireEvent.click(timelineButton!);

      expect(onTabChange).toHaveBeenCalledWith('timeline');
    });

    it('calls onTabChange with "books" when books tab is clicked', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation activeTab="timeline" onTabChange={onTabChange} />);

      const booksButton = screen.getByText('本の一覧').closest('button');
      fireEvent.click(booksButton!);

      expect(onTabChange).toHaveBeenCalledWith('books');
    });
  });
});
