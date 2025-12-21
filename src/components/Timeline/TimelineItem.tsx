import { useState } from 'react';
import type { Log } from '../../types';
import { QuoteDisplay } from './QuoteDisplay';
import { Button } from '../common';
import { useLogEdit } from '../../hooks/useLogEdit';

interface TimelineItemProps {
  log: Log;
  isLast?: boolean;
  onDelete?: (logId: string) => Promise<void>;
  isDeleting?: boolean;
  currentUserId?: string;
  onUpdate?: (updatedLog: Log) => void;
}

export function TimelineItem({
  log,
  isLast = false,
  onDelete,
  isDeleting = false,
  currentUserId,
  onUpdate,
}: TimelineItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = currentUserId && log.userId === currentUserId;

  const {
    isEditing,
    editedContent,
    editedLogType,
    isSaving,
    error: editError,
    startEdit,
    cancelEdit,
    setEditedContent,
    setEditedLogType,
    saveEdit,
  } = useLogEdit(log.id, onUpdate);

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
  const isRegistration = log.logType === 'registration';

  // Registration logs cannot be edited
  const canEdit = isOwner && !isRegistration;
  const canDelete = isOwner && onDelete && !isRegistration;

  return (
    <div className="relative pl-8 pb-6 group">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-black/10" />
      )}

      {/* Marker dot */}
      <div
        className={`absolute left-0 top-0 w-4 h-4 rounded-full ${
          isRegistration
            ? 'bg-blue-400'
            : isQuote
              ? 'border-2 border-gray-500 bg-transparent'
              : 'bg-gray-500'
        }`}
      />

      {/* Content */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Edit mode */
            <div className="space-y-3">
              {/* Log type selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditedLogType('memo')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    editedLogType === 'memo'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  メモ
                </button>
                <button
                  type="button"
                  onClick={() => setEditedLogType('quote')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    editedLogType === 'quote'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  引用
                </button>
              </div>

              {/* Content textarea */}
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="内容を入力..."
              />

              {/* Error message */}
              {editError && (
                <p className="text-sm text-red-600">{editError}</p>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={saveEdit}
                  loading={isSaving}
                >
                  保存
                </Button>
              </div>
            </div>
          ) : (
            /* Display mode */
            <>
              {isRegistration ? (
                <p className="text-gray-500 text-sm">
                  {log.content} 読み始めました
                </p>
              ) : isQuote ? (
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
            </>
          )}
        </div>

        {/* Action buttons (Edit and Delete) */}
        {!isEditing && !showDeleteConfirm && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {/* Edit button */}
            {canEdit && (
              <button
                type="button"
                onClick={() => startEdit(log)}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
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

            {/* Delete button */}
            {canDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
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
    </div>
  );
}
