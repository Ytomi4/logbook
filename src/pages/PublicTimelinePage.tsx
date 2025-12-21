import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicUserData } from '../hooks/usePublicUserData';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { Layout } from '../components/common/Layout';
import { TabNavigation, Loading, Button, UserInfo, HeaderActionButtons } from '../components/common';
import { Timeline } from '../components/Timeline/Timeline';
import { TimelineEmpty } from '../components/Timeline/TimelineEmpty';
import { PublicBookGrid } from '../components/BookList/PublicBookGrid';
import { BooksEmpty } from '../components/BookList/BooksEmpty';
import { QuickAddLogModal } from '../components/LogForm/QuickAddLogModal';
import { useAuth } from '../hooks/useAuth';

export function PublicTimelinePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { activeTab, setActiveTab } = useTabNavigation();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

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
        {/* Header with UserInfo and Action Buttons */}
        <div className="flex items-center justify-between">
          <UserInfo
            name={user ? `@${user.username}` : 'ゲスト'}
            avatarUrl={user?.avatarUrl ?? undefined}
          />
          {isOwner && (
            <HeaderActionButtons onAddLog={() => setIsQuickLogOpen(true)} />
          )}
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
              <PublicBookGrid books={books} />
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

        {/* Quick Add Log Modal - only for owner */}
        {isOwner && (
          <QuickAddLogModal
            isOpen={isQuickLogOpen}
            onClose={() => setIsQuickLogOpen(false)}
            onSuccess={handleLogAdded}
          />
        )}
      </div>
    </Layout>
  );
}
