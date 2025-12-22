import { useState, useCallback, useEffect } from 'react';
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

  // Sync selectedBook with defaultBook when it changes (e.g., after adding a new log)
  useEffect(() => {
    setSelectedBook(defaultBook);
  }, [defaultBook]);

  const handleSubmit = useCallback(
    async (data: CreateLogRequest) => {
      if (!selectedBook) return;

      setIsSubmitting(true);
      try {
        await createLog(selectedBook.id, data);
        onSuccess();
      } catch (error) {
        // Re-throw so LogForm can handle and display the error
        throw error;
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
    <div className="space-y-4">
      {/* Book Selector Row */}
      <div className="flex items-center gap-3">
        {/* Book Selector Button - Compact */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left max-w-xs"
          aria-label="本を選択"
        >
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-sm font-medium text-gray-900 truncate">
            {selectedBook ? selectedBook.title : '本を選択'}
          </span>
        </button>

        {/* Add Book Link */}
        <Link
          to="/books/new"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>本を追加</span>
        </Link>
      </div>

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
