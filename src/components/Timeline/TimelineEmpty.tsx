import { Link } from 'react-router-dom';

interface TimelineEmptyProps {
  variant?: 'timeline' | 'books';
  isOwner?: boolean;
  username?: string;
}

export function TimelineEmpty({
  variant = 'timeline',
  isOwner = true,
  username,
}: TimelineEmptyProps) {
  const getMessage = () => {
    if (variant === 'books') {
      if (isOwner) return 'まだ本がありません';
      return username
        ? `@${username}さんはまだ本を登録していません`
        : 'このユーザーはまだ本を登録していません';
    }
    if (isOwner) return 'まだ読書ログがありません';
    return username
      ? `@${username}さんはまだ読書ログを投稿していません`
      : 'このユーザーはまだ読書ログを投稿していません';
  };

  const getSubMessage = () => {
    if (!isOwner) return null;
    return '本を登録して、読書の記録を始めましょう。';
  };

  const subMessage = getSubMessage();

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
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
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{getMessage()}</h3>
      {subMessage && <p className="text-gray-500 mb-6">{subMessage}</p>}
      {isOwner && (
        <Link
          to="/books/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          本を登録する
        </Link>
      )}
    </div>
  );
}
