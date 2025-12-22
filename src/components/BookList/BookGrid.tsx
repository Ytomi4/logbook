import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book, BookWithLogCount } from '../../types';
import { Card, CardContent, Button, BookCover } from '../common';

interface BookGridProps {
  books: (Book | BookWithLogCount)[];
  onDelete?: (bookId: string) => Promise<void>;
}

function hasLogCount(book: Book | BookWithLogCount): book is BookWithLogCount {
  return 'logCount' in book && typeof book.logCount === 'number';
}

export function BookGrid({ books, onDelete }: BookGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const handleDelete = async (bookId: string) => {
    if (!onDelete) return;

    setDeletingId(bookId);
    try {
      await onDelete(bookId);
      setShowDeleteConfirm(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="relative group">
          <CardContent className="p-4">
            <Link
              to={`/books/${book.id}`}
              className="flex gap-3 hover:opacity-80 transition-opacity"
            >
              <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h2>
                {book.author && (
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {book.author}
                  </p>
                )}
                {book.publisher && (
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {book.publisher}
                  </p>
                )}
                {hasLogCount(book) && (
                  <div className="mt-2 text-xs text-gray-500">
                    ログ: {book.logCount}件
                  </div>
                )}
              </div>
            </Link>

            {/* Delete button */}
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(book.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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

            {/* Delete confirmation */}
            {showDeleteConfirm === book.id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-4 rounded-lg">
                <p className="text-sm text-gray-800 mb-3 text-center">
                  「{book.title}」を削除しますか？
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={deletingId === book.id}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    loading={deletingId === book.id}
                  >
                    削除
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
