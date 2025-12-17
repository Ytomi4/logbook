import { useState } from 'react';
import type { CreateBookRequest, NdlBook } from '../../types';
import { Button, Input } from '../common';

interface BookFormProps {
  initialData?: Partial<CreateBookRequest>;
  onSubmit: (data: CreateBookRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function BookForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = '登録する',
}: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [publisher, setPublisher] = useState(initialData?.publisher || '');
  const [isbn, setIsbn] = useState(initialData?.isbn || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim() || undefined,
        publisher: publisher.trim() || undefined,
        isbn: isbn.trim() || undefined,
        ndlBibId: initialData?.ndlBibId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="本のタイトル"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          著者
        </label>
        <Input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="著者名"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
          出版社
        </label>
        <Input
          id="publisher"
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          placeholder="出版社名"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
          ISBN
        </label>
        <Input
          id="isbn"
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="ISBN（10桁または13桁）"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
        )}
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

interface BookFormWithNdlProps extends Omit<BookFormProps, 'initialData'> {
  ndlBook?: NdlBook;
}

export function BookFormWithNdl({ ndlBook, ...props }: BookFormWithNdlProps) {
  const initialData: Partial<CreateBookRequest> | undefined = ndlBook
    ? {
        title: ndlBook.title,
        author: ndlBook.author || undefined,
        publisher: ndlBook.publisher || undefined,
        isbn: ndlBook.isbn || undefined,
        ndlBibId: ndlBook.ndlBibId,
      }
    : undefined;

  return <BookForm {...props} initialData={initialData} />;
}
