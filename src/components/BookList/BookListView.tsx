import { Link } from 'react-router-dom';
import { BookGrid } from './BookGrid';
import { useBookList } from '../../hooks/useBookList';
import { Loading, Button, Card, CardContent } from '../common';

export function BookListView() {
  const { books, isLoading, error, deleteBook, refetch } = useBookList();

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
        <Button onClick={refetch}>再読み込み</Button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">まだ本が登録されていません</p>
          <Link to="/books/new">
            <Button>最初の本を追加</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <BookGrid books={books} onDelete={deleteBook} />;
}
