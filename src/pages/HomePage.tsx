import { useState } from 'react';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { TabNavigation, HeaderActionButtons } from '../components/common';
import { TimelineView } from '../components/Timeline';
import { BookListView } from '../components/BookList';
import { QuickAddLogModal } from '../components/LogForm/QuickAddLogModal';

export function HomePage() {
  const { activeTab, setActiveTab } = useTabNavigation();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  const handleLogAdded = () => {
    // Refresh the page to show new log
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* App Icon */}
            <svg
              className="w-8 h-8 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">読書ログ</h1>
          </div>
          <p className="text-gray-500">読書の記録を時系列で振り返りましょう</p>
        </div>
        <HeaderActionButtons onAddLog={() => setIsQuickLogOpen(true)} />
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div>
        {activeTab === 'timeline' ? <TimelineView /> : <BookListView />}
      </div>

      {/* Quick Add Log Modal */}
      <QuickAddLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={handleLogAdded}
      />
    </div>
  );
}
