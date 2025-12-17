import { useMemo, type RefObject } from 'react';
import type { LogWithBook, Book } from '../../types';
import { TimelineGroup } from './TimelineGroup';
import { TimelineEmpty } from './TimelineEmpty';
import { Loading } from '../common';

interface TimelineProps {
  logs: LogWithBook[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  sentinelRef?: RefObject<HTMLDivElement | null>;
}

interface GroupedLogs {
  book: Book;
  logs: LogWithBook[];
}

function groupLogsByBook(logs: LogWithBook[]): GroupedLogs[] {
  const groups: GroupedLogs[] = [];

  for (const log of logs) {
    const lastGroup = groups[groups.length - 1];

    // If same book as last group, add to that group
    if (lastGroup && lastGroup.book.id === log.book.id) {
      lastGroup.logs.push(log);
    } else {
      // Start a new group
      groups.push({
        book: log.book,
        logs: [log],
      });
    }
  }

  return groups;
}

export function Timeline({
  logs,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  sentinelRef,
}: TimelineProps) {
  const groupedLogs = useMemo(() => groupLogsByBook(logs), [logs]);

  if (!isLoading && logs.length === 0) {
    return <TimelineEmpty />;
  }

  return (
    <div className="relative">
      {groupedLogs.map((group, index) => (
        <TimelineGroup
          key={`${group.book.id}-${group.logs[0]?.id}`}
          book={group.book}
          logs={group.logs}
          isLastGroup={index === groupedLogs.length - 1 && !hasMore}
        />
      ))}

      {isLoading && (
        <div className="py-8">
          <Loading size="md" text="読み込み中..." />
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      {sentinelRef && <div ref={sentinelRef} className="h-1" />}

      {!isLoading && hasMore && onLoadMore && !sentinelRef && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            もっと読み込む
          </button>
        </div>
      )}
    </div>
  );
}
