import { useState } from 'react';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { TabNavigation, HeaderActionButtons } from '../components/common';
import { UserInfo } from '../components/common/UserInfo';
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
    <div className="space-y-6">
      {/* Header with UserInfo and Action Buttons */}
      <div className="flex items-center justify-between">
        <UserInfo />
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
