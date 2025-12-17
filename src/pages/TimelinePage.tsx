import { Timeline } from '../components/Timeline';
import { useTimeline } from '../hooks/useTimeline';
import { LoadingPage, ShareButton } from '../components/common';

export function TimelinePage() {
  const { logs, isLoading, error, hasMore, loadMore, sentinelRef } = useTimeline();

  // Show full page loading only on initial load
  if (isLoading && logs.length === 0) {
    return <LoadingPage text="タイムラインを読み込み中..." />;
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
        <ShareButton title="読書ログ タイムライン" />
      </div>

      <Timeline
        logs={logs}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}
