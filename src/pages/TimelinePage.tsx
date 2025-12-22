import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicUserData } from '../hooks/usePublicUserData';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { Layout } from '../components/common/Layout';
import { TabNavigation, Loading, Button } from '../components/common';
import { Timeline } from '../components/Timeline/Timeline';
import { TimelineEmpty } from '../components/Timeline/TimelineEmpty';
import { UserProfileHeader } from '../components/Timeline/UserProfileHeader';
import { BookGrid } from '../components/BookList';
import { BooksEmpty } from '../components/BookList/BooksEmpty';
import { InlineLogForm } from '../components/LogForm';
import { useAuth } from '../hooks/useAuth';
import type { Book } from '../types';

export function TimelinePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { activeTab, setActiveTab } = useTabNavigation();

  const {
    user,
    logs,
    books,
    isLoading,
    isLoadingMore,
    error,
    isNotFound,
    loadMoreLogs,
    loadMoreBooks,
    hasMoreLogs,
    hasMoreBooks,
    refreshTimeline,
  } = usePublicUserData(username || '');

  // Check if the current user is viewing their own timeline
  const isOwner = currentUser?.id === user?.id;

  const handleLogAdded = useCallback(() => {
    refreshTimeline();
  }, [refreshTimeline]);

  // Calculate default book for InlineLogForm
  const defaultBook = useMemo((): Book | null => {
    // Use the book from the most recent log
    const firstLog = logs[0];
    if (firstLog?.book) {
      return firstLog.book;
    }
    // Fall back to first book in the list
    const firstBook = books[0];
    if (firstBook) {
      return firstBook;
    }
    return null;
  }, [logs, books]);

  if (isLoading && !user) {
    return (
      <Layout>
        <div className="py-12">
          <Loading size="lg" text="読み込み中..." />
        </div>
      </Layout>
    );
  }

  if (isNotFound) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ユーザーが見つかりません
          </h3>
          <p className="text-gray-500">
            @{username} というユーザーは存在しないか、削除されました。
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            エラーが発生しました
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Centered User Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <UserProfileHeader
            username={user?.username || 'guest'}
            avatarUrl={user?.avatarUrl ?? undefined}
          />
          {/* Centered Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Inline Log Form - only for owner on timeline tab */}
        {isOwner && activeTab === 'timeline' && (
          <InlineLogForm
            books={books}
            defaultBook={defaultBook}
            onSuccess={handleLogAdded}
          />
        )}

        {/* Content */}
        <div>
          {activeTab === 'timeline' ? (
            logs.length > 0 ? (
              <div>
                <Timeline
                  logs={logs}
                  isLoading={isLoadingMore}
                  hasMore={hasMoreLogs}
                  onLoadMore={loadMoreLogs}
                  currentUserId={currentUser?.id}
                />
                {isLoadingMore && (
                  <div className="py-4">
                    <Loading size="sm" />
                  </div>
                )}
                {hasMoreLogs && !isLoadingMore && (
                  <div className="text-center py-4">
                    <Button onClick={loadMoreLogs} variant="secondary">
                      もっと読み込む
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <TimelineEmpty
                variant="timeline"
                isOwner={isOwner}
                username={user?.username}
              />
            )
          ) : books.length > 0 ? (
            <div>
              <BookGrid books={books} />
              {isLoadingMore && (
                <div className="py-4">
                  <Loading size="sm" />
                </div>
              )}
              {hasMoreBooks && !isLoadingMore && (
                <div className="text-center py-4">
                  <Button onClick={loadMoreBooks} variant="secondary">
                    もっと読み込む
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <BooksEmpty isOwner={isOwner} username={user?.username} />
          )}
        </div>
      </div>
    </Layout>
  );
}
