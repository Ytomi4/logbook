import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HeroSection } from '../../../src/components/Landing/HeroSection';

function renderHeroSection(props: {
  isAuthenticated: boolean;
  username?: string | null;
}) {
  return render(
    <MemoryRouter>
      <HeroSection {...props} />
    </MemoryRouter>
  );
}

describe('HeroSection', () => {
  describe('when user is not authenticated', () => {
    it('shows "はじめる" button', () => {
      renderHeroSection({ isAuthenticated: false });

      const button = screen.getByRole('link', { name: 'はじめる' });
      expect(button).toBeInTheDocument();
    });

    it('links to /enter', () => {
      renderHeroSection({ isAuthenticated: false });

      const button = screen.getByRole('link', { name: 'はじめる' });
      expect(button).toHaveAttribute('href', '/enter');
    });
  });

  describe('when user is authenticated', () => {
    it('shows "タイムラインを見る" button', () => {
      renderHeroSection({ isAuthenticated: true, username: 'testuser' });

      const button = screen.getByRole('link', { name: 'タイムラインを見る' });
      expect(button).toBeInTheDocument();
    });

    it('links to user timeline', () => {
      renderHeroSection({ isAuthenticated: true, username: 'testuser' });

      const button = screen.getByRole('link', { name: 'タイムラインを見る' });
      expect(button).toHaveAttribute('href', '/testuser');
    });
  });

  describe('when user is authenticated but has no username', () => {
    it('shows "はじめる" button as fallback', () => {
      renderHeroSection({ isAuthenticated: true, username: null });

      const button = screen.getByRole('link', { name: 'はじめる' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('displays the main catchphrase', () => {
      renderHeroSection({ isAuthenticated: false });

      expect(
        screen.getByText(/「何を読んだか」だけでなく/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/「どう読んだか」を残せるアプリです/)
      ).toBeInTheDocument();
    });

    it('displays the sub-catchphrase', () => {
      renderHeroSection({ isAuthenticated: false });

      expect(
        screen.getByText(/印象に残った単語、後から振り返りたい一文/)
      ).toBeInTheDocument();
    });
  });
});
