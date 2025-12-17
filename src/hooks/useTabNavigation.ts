import { useState } from 'react';

export type TabType = 'timeline' | 'books';

interface UseTabNavigationReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function useTabNavigation(
  defaultTab: TabType = 'timeline'
): UseTabNavigationReturn {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  return {
    activeTab,
    setActiveTab,
  };
}
