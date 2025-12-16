import { Link } from 'react-router-dom';
import type { Book, LogWithBook } from '../../types';
import { TimelineItem } from './TimelineItem';

interface TimelineGroupProps {
  book: Book;
  logs: LogWithBook[];
  isLastGroup?: boolean;
}

export function TimelineGroup({
  book,
  logs,
  isLastGroup = false,
}: TimelineGroupProps) {
  return (
    <div className="mb-6">
      {/* Book header */}
      <div className="flex items-start gap-3 mb-4 pl-8">
        <div className="flex-1">
          <Link
            to={`/books/${book.id}`}
            className="group flex items-center gap-2"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {book.isDeleted ? (
                <span className="text-gray-400">削除済み</span>
              ) : (
                book.title
              )}
            </h3>
            {!book.isDeleted && (
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </Link>
          {book.author && !book.isDeleted && (
            <p className="text-sm text-gray-500">{book.author}</p>
          )}
        </div>
      </div>

      {/* Logs */}
      <div>
        {logs.map((log, index) => (
          <TimelineItem
            key={log.id}
            log={log}
            isLast={isLastGroup && index === logs.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
