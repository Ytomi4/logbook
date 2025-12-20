import type { NdlBook } from '../../types';
import { BookCover } from '../common/BookCover';
import { getNdlThumbnailUrl } from '../../lib/ndl';

interface NdlSearchResultsProps {
  results: NdlBook[];
  onSelect: (book: NdlBook) => void;
  isLoading?: boolean;
}

export function NdlSearchResults({
  results,
  onSelect,
  isLoading = false,
}: NdlSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-500">
        検索中...
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
      {results.map((book, index) => (
        <button
          key={`${book.ndlBibId}-${index}`}
          type="button"
          onClick={() => onSelect(book)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-blue-50 flex gap-3"
        >
          <BookCover
            coverUrl={getNdlThumbnailUrl(book.isbn)}
            title={book.title}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 line-clamp-2">
              {book.title}
            </div>
            <div className="mt-1 text-sm text-gray-500 space-x-2">
              {book.author && <span>{book.author}</span>}
              {book.publisher && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{book.publisher}</span>
                </>
              )}
              {book.pubDate && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{book.pubDate}</span>
                </>
              )}
            </div>
            {book.isbn && (
              <div className="mt-1 text-xs text-gray-400">
                ISBN: {book.isbn}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
