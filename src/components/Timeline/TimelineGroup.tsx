import { Link } from 'react-router-dom';
import type { Book, Log, LogWithBook } from '../../types';
import { TimelineItem } from './TimelineItem';
import { BookCover } from '../common';
import { isRegistrationLogOnly, filterLogsForDisplay } from '../../lib/timeline';

interface TimelineGroupProps {
  book: Book;
  logs: LogWithBook[];
  isLastGroup?: boolean;
  currentUserId?: string;
  onLogUpdate?: (updatedLog: Log) => void;
  onLogDelete?: (logId: string) => Promise<void>;
  isDeletingLogId?: string;
}

export function TimelineGroup({
  book,
  logs,
  isLastGroup = false,
  currentUserId,
  onLogUpdate,
  onLogDelete,
  isDeletingLogId,
}: TimelineGroupProps) {
  // Check if this is a registration-only book (show book cover only)
  const registrationOnly = isRegistrationLogOnly(logs);
  // Always filter out registration logs - they are never displayed in timeline
  const displayLogs = filterLogsForDisplay(logs);

  // Debug: verify filtering is working
  console.log('TimelineGroup:', {
    bookTitle: book.title,
    originalLogs: logs.map(l => ({ id: l.id, logType: l.logType })),
    displayLogs: displayLogs.map(l => ({ id: l.id, logType: l.logType })),
    registrationOnly,
  });

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
                {/* Show registration date when registration-only */}
                {registrationOnly && logs[0] && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(logs[0].createdAt).toLocaleDateString('ja-JP')} に登録
                  </p>
                )}
              </>
            )}
          </div>
        </Link>
      </div>

      {/* Logs - vertical line is rendered inside each TimelineItem */}
      {displayLogs.length > 0 && (
        <div className="relative pl-8">
          {displayLogs.map((log, index) => (
            <TimelineItem
              key={log.id}
              log={log}
              isLast={isLastGroup && index === displayLogs.length - 1}
              currentUserId={currentUserId}
              onUpdate={onLogUpdate}
              onDelete={onLogDelete}
              isDeleting={isDeletingLogId === log.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
