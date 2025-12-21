import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { UserMenu } from '../../src/components/common/UserMenu';

const mockUser = {
  name: '山田太郎',
  email: 'taro@example.com',
  image: 'https://example.com/google-avatar.jpg',
  username: 'yamada_taro',
  avatarUrl: null,
};

const mockUserWithCustomAvatar = {
  ...mockUser,
  avatarUrl: 'https://example.com/custom-avatar.jpg',
};

function renderUserMenu(user = mockUser, onLogout = vi.fn()) {
  return render(
    <BrowserRouter>
      <UserMenu user={user} onLogout={onLogout} />
    </BrowserRouter>
  );
}

describe('UserMenu', () => {
  describe('rendering', () => {
    it('renders user menu button with username', () => {
      renderUserMenu();
      expect(screen.getByText('yamada_taro')).toBeInTheDocument();
    });

    it('displays guest when username is null', () => {
      renderUserMenu({ ...mockUser, username: null });
      expect(screen.getByText('ゲスト')).toBeInTheDocument();
    });

    it('uses custom avatar when avatarUrl is provided', () => {
      renderUserMenu(mockUserWithCustomAvatar);
      const avatar = screen.getByAltText('yamada_taro');
      expect(avatar).toHaveAttribute('src', 'https://example.com/custom-avatar.jpg');
    });

    it('falls back to Google image when avatarUrl is null', () => {
      renderUserMenu(mockUser);
      const avatar = screen.getByAltText('yamada_taro');
      expect(avatar).toHaveAttribute('src', 'https://example.com/google-avatar.jpg');
    });

    it('shows initial when both avatarUrl and image are null', () => {
      renderUserMenu({ ...mockUser, image: null, avatarUrl: null });
      expect(screen.getByText('y')).toBeInTheDocument();
    });
  });

  describe('dropdown toggle', () => {
    it('opens dropdown when button is clicked', () => {
      renderUserMenu();
      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('closes dropdown when button is clicked again', () => {
      renderUserMenu();
      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });

      fireEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('dropdown content', () => {
    it('shows username in dropdown', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      expect(screen.getByText('@yamada_taro')).toBeInTheDocument();
    });

    it('shows account settings link', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      expect(screen.getByRole('menuitem', { name: 'アカウント設定' })).toBeInTheDocument();
    });

    it('shows logout button', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      expect(screen.getByRole('menuitem', { name: 'ログアウト' })).toBeInTheDocument();
    });
  });

  describe('menu item clicks', () => {
    it('closes dropdown when account settings is clicked', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      fireEvent.click(screen.getByRole('menuitem', { name: 'アカウント設定' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onLogout and closes dropdown when logout is clicked', () => {
      const onLogout = vi.fn();
      renderUserMenu(mockUser, onLogout);
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      fireEvent.click(screen.getByRole('menuitem', { name: 'ログアウト' }));
      expect(onLogout).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('keyboard interaction', () => {
    it('closes dropdown when Escape key is pressed', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      expect(screen.getByRole('menu')).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('outside click', () => {
    it('closes dropdown when clicking outside', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      expect(screen.getByRole('menu')).toBeInTheDocument();
      fireEvent.mouseDown(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has aria-expanded attribute on button', () => {
      renderUserMenu();
      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });

      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-haspopup attribute on button', () => {
      renderUserMenu();
      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('has aria-controls attribute on button', () => {
      renderUserMenu();
      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });
      expect(button).toHaveAttribute('aria-controls', 'user-menu-dropdown');
    });

    it('dropdown has aria-orientation attribute', () => {
      renderUserMenu();
      fireEvent.click(screen.getByRole('button', { name: 'ユーザーメニュー' }));

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');
    });
  });
});
