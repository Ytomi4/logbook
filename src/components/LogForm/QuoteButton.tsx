import { useEffect, useState } from 'react';

interface QuoteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  showShortcut?: boolean;
}

// Detect if device has coarse pointer (touch device)
function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isTouch;
}

// Quote icon (opening quote mark)
function QuoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );
}

export function QuoteButton({
  onClick,
  disabled = false,
  showShortcut = true,
}: QuoteButtonProps) {
  const isTouchDevice = useIsTouchDevice();
  const shouldShowShortcut = showShortcut && !isTouchDevice;

  // Detect macOS for shortcut display
  const isMac =
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutText = isMac ? '\u2318\u21e7Q' : 'Ctrl+Shift+Q';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-1 min-w-[44px] min-h-[44px] p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
      title={`引用をトグル (${shortcutText})`}
      aria-label="引用をトグル"
    >
      <QuoteIcon />
      {shouldShowShortcut && (
        <span className="text-xs text-gray-400 hidden sm:inline">
          {shortcutText}
        </span>
      )}
    </button>
  );
}
