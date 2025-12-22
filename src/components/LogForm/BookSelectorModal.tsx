import type { Book } from '../../types';
import { Modal } from '../common/Modal';

interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  selectedBook: Book | null;
  onSelect: (book: Book) => void;
}

export function BookSelectorModal({
  isOpen,
  onClose,
  books,
  selectedBook,
  onSelect,
}: BookSelectorModalProps) {
  const handleSelect = (book: Book) => {
    onSelect(book);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="本を選択">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ログを追加する本を選択してください
        </p>
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
                onClick={() => handleSelect(book)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedBook?.id === book.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
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
    </Modal>
  );
}
