import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { BookWithLogCount } from '../types';
import { getBooks, deleteBook } from '../services/books';
import { Loading, Button, Card, CardContent } from '../components/common';
import { ApiClientError } from '../services/api';

export function BookListPage() {
  const [books, setBooks] = useState<BookWithLogCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('本の読み込みに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (bookId: string) => {
    setDeletingId(bookId);
    try {
      await deleteBook(bookId);
      await fetchBooks();
      setShowDeleteConfirm(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('削除に失敗しました');
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading size="lg" text="読み込み中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBooks}>再読み込み</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">本一覧</h1>
        <Link to="/books/new">
          <Button>本を追加</Button>
        </Link>
      </div>

      {/* Book List */}
      {books.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              まだ本が登録されていません
            </p>
            <Link to="/books/new">
              <Button>最初の本を追加</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="relative group">
              <CardContent className="p-4">
                <Link
                  to={`/books/${book.id}`}
                  className="block hover:opacity-80 transition-opacity"
                >
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
                  <div className="mt-2 text-xs text-gray-500">
                    ログ: {book.logCount}件
                  </div>
                </Link>

                {/* Delete button */}
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
      )}
    </div>
  );
}
