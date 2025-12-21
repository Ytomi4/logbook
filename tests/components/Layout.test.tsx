import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '../../src/components/common/Layout';
import { useAuth } from '../../src/hooks/useAuth';
import { useProfile } from '../../src/hooks/useProfile';

vi.mock('../../src/hooks/useAuth');
vi.mock('../../src/hooks/useProfile');

const mockUseAuth = useAuth as Mock;
const mockUseProfile = useProfile as Mock;

const mockAuthenticatedUser = {
  name: '山田太郎',
  email: 'taro@example.com',
  image: 'https://example.com/avatar.jpg',
  username: 'yamada_taro',
  avatarUrl: null,
};

function renderLayout(children = <div>Test Content</div>) {
  return render(
    <MemoryRouter>
      <Layout>{children}</Layout>
    </MemoryRouter>
  );
}

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProfile.mockReturnValue({
      profile: null,
      isLoading: false,
      error: null,
      updateUsername: vi.fn(),
      updateAvatar: vi.fn(),
      refresh: vi.fn(),
    });
  });

  describe('logo navigation', () => {
    it('links to home page when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout();

      const logoLink = screen.getByRole('link', { name: /logbook/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('links to home page when user is authenticated but has no username', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockAuthenticatedUser, username: null },
        isAuthenticated: true,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout();

      const logoLink = screen.getByRole('link', { name: /logbook/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('links to user timeline when user is authenticated with username', () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        isAuthenticated: true,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout();

      const logoLink = screen.getByRole('link', { name: /logbook/i });
      expect(logoLink).toHaveAttribute('href', '/yamada_taro');
    });
  });

  describe('header right side', () => {
    it('shows skeleton when loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        signOut: vi.fn(),
      });

      renderLayout();

      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('shows "はじめる" button when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout();

      expect(screen.getByRole('link', { name: 'はじめる' })).toBeInTheDocument();
    });

    it('shows UserMenu when authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: mockAuthenticatedUser,
        isAuthenticated: true,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout();

      expect(screen.getByRole('button', { name: 'ユーザーメニュー' })).toBeInTheDocument();
    });
  });

  describe('content rendering', () => {
    it('renders children in main area', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signOut: vi.fn(),
      });

      renderLayout(<div>Custom Content</div>);

      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });
});
