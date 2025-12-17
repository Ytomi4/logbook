import { Link } from 'react-router-dom';

interface HeaderActionButtonsProps {
  onAddLog: () => void;
}

export function HeaderActionButtons({ onAddLog }: HeaderActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Add Log Button - Primary (Black) */}
      <button
        type="button"
        onClick={onAddLog}
        className="flex items-center gap-2 h-9 px-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        {/* Plus Icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-sm">ログを追加</span>
      </button>

      {/* Add Book Button - Secondary (White with border) */}
      <Link
        to="/books/new"
        className="flex items-center gap-2 h-9 px-3 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {/* Book Plus Icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span className="text-sm">本を追加</span>
      </Link>
    </div>
  );
}
