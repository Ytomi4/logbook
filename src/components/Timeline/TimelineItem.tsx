import type { Log } from '../../types';
import { QuoteDisplay } from './QuoteDisplay';

interface TimelineItemProps {
  log: Log;
  isLast?: boolean;
}

export function TimelineItem({ log, isLast = false }: TimelineItemProps) {
  const formattedDate = new Date(log.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative pl-8 pb-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Marker dot */}
      <div
        className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          log.logType === 'quote'
            ? 'bg-amber-100 border-amber-400'
            : 'bg-blue-100 border-blue-400'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            log.logType === 'quote' ? 'bg-amber-500' : 'bg-blue-500'
          }`}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              log.logType === 'quote'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {log.logType === 'quote' ? '引用' : 'メモ'}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {log.logType === 'quote' ? (
          <QuoteDisplay content={log.content} />
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{log.content}</p>
        )}
      </div>
    </div>
  );
}
