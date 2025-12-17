import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BookWithLogs, Log } from '../types';
import { getBook } from '../services/books';
import { deleteLog } from '../services/logs';
import { LogForm } from '../components/LogForm';
import { TimelineItem } from '../components/Timeline/TimelineItem';
import { Loading, Card, CardHeader, CardTitle, CardContent, ShareButton } from '../components/common';
import { useLogForm } from '../hooks/useLogForm';
import { ApiClientError } from '../services/api';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookWithLogs | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const bookData = await getBook(id);
      setBook(bookData);
      setLogs(bookData.logs || []);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('本のデータの読み込みに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { isLoading: isSubmitting, create } = useLogForm({
    bookId: id,
    onSuccess: fetchData,
  });

  const handleDelete = async (logId: string) => {
    setDeletingLogId(logId);
    try {
      await deleteLog(logId);
      await fetchData();
    } finally {
      setDeletingLogId(null);
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
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">本が見つかりませんでした</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">
          ホーム
        </Link>
        <span>/</span>
        <span className="text-gray-900 line-clamp-1">{book.title}</span>
      </div>

      {/* Book Info */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <div className="text-sm text-gray-600 space-y-1">
                {book.author && <p>著者: {book.author}</p>}
                {book.publisher && <p>出版社: {book.publisher}</p>}
                {book.isbn && <p>ISBN: {book.isbn}</p>}
              </div>
            </div>
            <ShareButton title={`${book.title} - 読書ログ`} />
          </div>
        </CardContent>
      </Card>

      {/* Add Log Form */}
      <Card>
        <CardHeader>
          <CardTitle>ログを追加</CardTitle>
        </CardHeader>
        <CardContent>
          <LogForm
            onSubmit={create}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Logs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          読書ログ ({logs.length})
        </h2>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            まだログがありません。上のフォームからログを追加しましょう。
          </p>
        ) : (
          <div className="space-y-0">
            {logs.map((log, index) => (
              <TimelineItem
                key={log.id}
                log={log}
                isLast={index === logs.length - 1}
                onDelete={handleDelete}
                isDeleting={deletingLogId === log.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
