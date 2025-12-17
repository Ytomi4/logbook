import type { TabType } from '../../hooks/useTabNavigation';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-[14px] h-9 p-[5px] w-fit">
      {/* Timeline Tab */}
      <button
        type="button"
        onClick={() => onTabChange('timeline')}
        className={`flex items-center justify-center gap-[5px] px-3 py-1 rounded-[14px] h-full min-w-[140px] transition-colors ${
          activeTab === 'timeline'
            ? 'bg-white border border-transparent shadow-sm'
            : 'border border-transparent hover:bg-white/50'
        }`}
      >
        {/* Clock Icon */}
        <svg
          className="w-4 h-4 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-gray-900">タイムライン</span>
      </button>

      {/* Books Tab */}
      <button
        type="button"
        onClick={() => onTabChange('books')}
        className={`flex items-center justify-center gap-[7px] px-3 py-1 rounded-[14px] h-full min-w-[140px] transition-colors ${
          activeTab === 'books'
            ? 'bg-white border border-transparent shadow-sm'
            : 'border border-transparent hover:bg-white/50'
        }`}
      >
        {/* Book Icon */}
        <svg
          className="w-4 h-4 text-gray-900"
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
        <span className="text-sm text-gray-900">本の一覧</span>
      </button>
    </div>
  );
}
