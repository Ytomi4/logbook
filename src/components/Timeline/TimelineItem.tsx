import { useState } from 'react';
import type { Log, UpdateLogRequest } from '../../types';
import { QuoteDisplay } from './QuoteDisplay';
import { LogForm } from '../LogForm';
import { Button } from '../common';

interface TimelineItemProps {
  log: Log;
  isLast?: boolean;
  onEdit?: (logId: string, data: UpdateLogRequest) => Promise<void>;
  onDelete?: (logId: string) => Promise<void>;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export function TimelineItem({
  log,
  isLast = false,
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
}: TimelineItemProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = new Date(log.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleEdit = async (data: UpdateLogRequest) => {
    if (onEdit) {
      await onEdit(log.id, data);
      setIsEditMode(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(log.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="relative pl-8 pb-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Marker dot */}
      <div
        className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          log.logType === 'quote'
            ? 'bg-amber-100 border-amber-400'
            : 'bg-blue-100 border-blue-400'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            log.logType === 'quote' ? 'bg-amber-500' : 'bg-blue-500'
          }`}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        {isEditMode ? (
          <LogForm
            initialLogType={log.logType}
            initialContent={log.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditMode(false)}
            isEditing
            isLoading={isEditing}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    log.logType === 'quote'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {log.logType === 'quote' ? '引用' : 'メモ'}
                </span>
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>

              {/* Actions */}
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="編集"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
              )}
            </div>

            {log.logType === 'quote' ? (
              <QuoteDisplay content={log.content} />
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap">{log.content}</p>
            )}

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800 mb-3">
                  このログを削除しますか？この操作は取り消せません。
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
                    削除する
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
