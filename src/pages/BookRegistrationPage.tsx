import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { NdlBook, CreateBookRequest } from '../types';
import { createBook } from '../services/books';
import { useBookSearch } from '../hooks/useBookSearch';
import { BookSearchInput, NdlSearchResults, BookFormWithNdl } from '../components/BookForm';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common';

export function BookRegistrationPage() {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    results,
    isLoading: isSearching,
    error: searchError,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useBookSearch();
  const [selectedBook, setSelectedBook] = useState<NdlBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const handleSelectNdlBook = (book: NdlBook) => {
    setSelectedBook(book);
    setQuery('');
  };

  const handleSubmit = async (data: CreateBookRequest) => {
    setIsSubmitting(true);
    try {
      const book = await createBook(data);
      navigate(`/books/${book.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedBook(null);
    setShowManualForm(false);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/books" className="hover:text-gray-700">
          本一覧
        </Link>
        <span>/</span>
        <span className="text-gray-900">本を追加</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>本を追加</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedBook && !showManualForm ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                タイトルを入力して国会図書館から本を検索するか、手動で入力してください。
              </p>

              <BookSearchInput
                value={query}
                onChange={setQuery}
                isLoading={isSearching}
              />

              {searchError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {searchError}
                </div>
              )}

              <NdlSearchResults
                results={results}
                onSelect={handleSelectNdlBook}
                isLoading={isSearching}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMore}
              />

              {!isSearching && query.length === 0 && (
                <div className="text-center py-4">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    または手動で入力
                  </button>
                </div>
              )}

              {!isSearching && query.length > 0 && results.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="mb-2">検索結果がありません</p>
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    手動で入力する
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedBook && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    選択した本の情報を確認・編集できます
                  </p>
                </div>
              )}

              <BookFormWithNdl
                ndlBook={selectedBook || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
