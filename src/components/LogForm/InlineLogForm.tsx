import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Book, CreateLogRequest } from '../../types';
import { LogForm } from './LogForm';
import { BookSelectorModal } from './BookSelectorModal';
import { createLog } from '../../services/logs';

interface InlineLogFormProps {
  books: Book[];
  defaultBook: Book | null;
  onSuccess: () => void;
}

export function InlineLogForm({
  books,
  defaultBook,
  onSuccess,
}: InlineLogFormProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(defaultBook);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (data: CreateLogRequest) => {
      if (!selectedBook) return;

      setIsSubmitting(true);
      try {
        await createLog(selectedBook.id, data);
        onSuccess();
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedBook, onSuccess]
  );

  const handleBookSelect = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  // No books registered
  if (books.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          ログを追加するには、まず本を登録してください
        </p>
        <Link
          to="/books/new"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          本を登録する
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Book Selector */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
      >
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <div className="flex-1 min-w-0">
          {selectedBook ? (
            <>
              <p className="font-medium text-gray-900 truncate">
                {selectedBook.title}
              </p>
              {selectedBook.author && (
                <p className="text-sm text-gray-500 truncate">
                  {selectedBook.author}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">本を選択してください</p>
          )}
        </div>
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Log Form */}
      {selectedBook && (
        <LogForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      )}

      {/* Book Selector Modal */}
      <BookSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        books={books}
        selectedBook={selectedBook}
        onSelect={handleBookSelect}
      />
    </div>
  );
}
