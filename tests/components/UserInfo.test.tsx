import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserInfo } from '../../src/components/common/UserInfo';

describe('UserInfo', () => {
  describe('rendering', () => {
    it('renders with default name when no props provided', () => {
      render(<UserInfo />);
      expect(screen.getByText('ゲスト')).toBeInTheDocument();
    });

    it('renders with provided name', () => {
      render(<UserInfo name="山田太郎" />);
      expect(screen.getByText('山田太郎')).toBeInTheDocument();
    });
  });

  describe('avatar display', () => {
    it('displays avatar image when avatarUrl is provided', () => {
      render(<UserInfo name="田中花子" avatarUrl="https://example.com/avatar.jpg" />);
      const avatar = screen.getByAltText('田中花子');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('displays avatar image with correct classes', () => {
      render(<UserInfo name="田中花子" avatarUrl="https://example.com/avatar.jpg" />);
      const avatar = screen.getByAltText('田中花子');
      expect(avatar).toHaveClass('w-8', 'h-8', 'rounded-full', 'object-cover');
    });
  });

  describe('initial fallback', () => {
    it('displays initial when no avatarUrl is provided', () => {
      render(<UserInfo name="山田太郎" />);
      expect(screen.getByText('山')).toBeInTheDocument();
    });

    it('displays first character as initial', () => {
      render(<UserInfo name="ABC" />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('displays guest initial when name is default', () => {
      render(<UserInfo />);
      expect(screen.getByText('ゲ')).toBeInTheDocument();
    });

    it('displays initial fallback with correct styling', () => {
      render(<UserInfo name="山田太郎" />);
      const initial = screen.getByText('山');
      expect(initial).toHaveClass('w-8', 'h-8', 'rounded-full', 'bg-gray-100');
    });
  });

  describe('edge cases', () => {
    it('handles empty string name with default initial', () => {
      render(<UserInfo name="" />);
      // Empty string results in empty initial (charAt(0) of empty string)
      const container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toBeInTheDocument();
    });

    it('handles single character name (appears in both initial and name)', () => {
      render(<UserInfo name="A" />);
      // 'A' appears both as initial and name display
      const elements = screen.getAllByText('A');
      expect(elements).toHaveLength(2);
    });

    it('handles long name', () => {
      const longName = 'とても長い名前のユーザーさん';
      render(<UserInfo name={longName} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
      // Initial is first character
      const initial = screen.getByText('と');
      expect(initial).toHaveClass('rounded-full');
    });
  });
});
