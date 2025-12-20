import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = useMemo(
    () => [
      {
        key: 'h',
        alt: true,
        description: 'ホームに移動（タイムライン）',
        action: () => navigate('/'),
      },
      {
        key: 'b',
        alt: true,
        description: 'ホームに移動（本一覧タブは手動で切替）',
        action: () => navigate('/'),
      },
      {
        key: 'n',
        alt: true,
        description: '本を新規登録',
        action: () => navigate('/books/new'),
      },
      {
        key: '/',
        description: '検索にフォーカス',
        action: () => {
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[type="search"], input[placeholder*="検索"]'
          );
          searchInput?.focus();
        },
      },
      {
        key: 'Escape',
        description: 'モーダルを閉じる / フォーカスを解除',
        action: () => {
          const activeElement = document.activeElement as HTMLElement;
          activeElement?.blur();
        },
      },
    ],
    [navigate]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow Escape in input fields
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return { shortcuts };
}

// Hook for displaying keyboard shortcuts help
export function useShortcutsHelp() {
  const shortcuts = [
    { keys: ['Alt', 'H'], description: 'ホームに移動' },
    { keys: ['Alt', 'B'], description: 'ホームに移動' },
    { keys: ['Alt', 'N'], description: '本を新規登録' },
    { keys: ['/'], description: '検索にフォーカス' },
    { keys: ['Esc'], description: 'モーダルを閉じる' },
  ];

  return { shortcuts };
}
