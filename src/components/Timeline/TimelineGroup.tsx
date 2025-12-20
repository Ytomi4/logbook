import { Link } from 'react-router-dom';
import type { Book, LogWithBook } from '../../types';
import { TimelineItem } from './TimelineItem';
import { BookCover } from '../common';

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
    <div className="relative mb-8">
      {/* Book header - no dots or lines */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={`/books/${book.id}`}
          className="flex items-center gap-3 group"
        >
          <BookCover
            coverUrl={book.coverUrl}
            title={book.title}
            size="md"
          />
          <div className="min-w-0">
            {book.isDeleted ? (
              <span className="text-lg font-bold text-gray-400">削除済み</span>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-sm text-gray-500 truncate">{book.author}</p>
                )}
              </>
            )}
          </div>
        </Link>
      </div>

      {/* Logs - vertical line is rendered inside each TimelineItem */}
      {logs.length > 0 && (
        <div className="relative pl-8">
          {logs.map((log, index) => (
            <TimelineItem
              key={log.id}
              log={log}
              isLast={isLastGroup && index === logs.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
