import { useState } from 'react';
import type { Log } from '../../types';
import { QuoteDisplay } from './QuoteDisplay';
import { Button } from '../common';

interface TimelineItemProps {
  log: Log;
  isLast?: boolean;
  onDelete?: (logId: string) => Promise<void>;
  isDeleting?: boolean;
}

export function TimelineItem({
  log,
  isLast = false,
  onDelete,
  isDeleting = false,
}: TimelineItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = new Date(log.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(log.id);
      setShowDeleteConfirm(false);
    }
  };

  const isQuote = log.logType === 'quote';

  return (
    <div className="relative pl-8 pb-6 group">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-black/10" />
      )}

      {/* Marker dot */}
      <div
        className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
          isQuote
            ? 'border-2 border-gray-500 bg-transparent'
            : 'bg-gray-500'
        }`}
      />

      {/* Content */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {isQuote ? (
            <QuoteDisplay content={log.content} />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {log.content}
            </p>
          )}

          {/* Timestamp */}
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-3">
                このログを削除しますか？
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  キャンセル
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={isDeleting}
                >
                  削除
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Delete button */}
        {onDelete && !showDeleteConfirm && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex-shrink-0"
            title="削除"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
