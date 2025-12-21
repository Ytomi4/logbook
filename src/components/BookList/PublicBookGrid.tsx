import { Link } from 'react-router-dom';
import type { Book } from '../../types';
import { Card, CardContent, BookCover } from '../common';

interface PublicBookGridProps {
  books: Book[];
}

export function PublicBookGrid({ books }: PublicBookGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id}>
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
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
