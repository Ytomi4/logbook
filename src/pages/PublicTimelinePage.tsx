import { useParams } from 'react-router-dom';
import { usePublicTimeline } from '../hooks/usePublicTimeline';
import { Layout } from '../components/common/Layout';
import { Timeline } from '../components/Timeline/Timeline';
import { Loading, Button } from '../components/common';

export function PublicTimelinePage() {
  const { username } = useParams<{ username: string }>();
  const { user, logs, isLoading, error, isNotFound, loadMore, hasMore } =
    usePublicTimeline(username || '');

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
        {/* User header */}
        {user && (
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {logs.length > 0 ? (
          <div>
            <Timeline
              logs={logs}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
            {isLoading && (
              <div className="py-4">
                <Loading size="sm" />
              </div>
            )}
            {hasMore && !isLoading && (
              <div className="text-center py-4">
                <Button onClick={loadMore} variant="secondary">
                  もっと読み込む
                </Button>
              </div>
            )}
          </div>
        ) : (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              まだログがありません
            </h3>
            <p className="text-gray-500">
              {user?.name}さんはまだ読書ログを投稿していません。
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
