import { useState, useEffect } from 'react';
import type { Book, BookWithLogCount, CreateLogRequest } from '../../types';
import { Modal } from '../common/Modal';
import { LogForm } from './LogForm';
import { createLog } from '../../services/logs';
import { getBooks } from '../../services/books';
import { Loading } from '../common';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickLogModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickLogModalProps) {
  const [books, setBooks] = useState<BookWithLogCount[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingBooks(true);
      getBooks()
        .then(setBooks)
        .finally(() => setIsLoadingBooks(false));
    } else {
      setSelectedBook(null);
    }
  }, [isOpen]);

  const handleSubmit = async (data: CreateLogRequest) => {
    if (!selectedBook) return;

    setIsSubmitting(true);
    try {
      await createLog(selectedBook.id, data);
      onSuccess?.();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedBook(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedBook ? `ログを追加 - ${selectedBook.title}` : 'ログを追加'}
    >
      {isLoadingBooks ? (
        <div className="py-8">
          <Loading size="md" text="本を読み込み中..." />
        </div>
      ) : !selectedBook ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">ログを追加する本を選択してください</p>
          {books.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              本が登録されていません。先に本を追加してください。
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {books.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => setSelectedBook(book)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900 truncate">
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="text-sm text-gray-500 truncate">{book.author}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setSelectedBook(null)}
            className="text-sm text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-1"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            別の本を選択
          </button>
          <LogForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </Modal>
  );
}
