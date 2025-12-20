import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabNavigation } from './TabNavigation';
import type { TabType } from '../../hooks/useTabNavigation';

const meta = {
  title: 'common/TabNavigation',
  component: TabNavigation,
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'radio',
      options: ['timeline', 'books'],
    },
  },
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Timeline: Story = {
  args: {
    activeTab: 'timeline',
    onTabChange: () => {},
  },
};

export const Books: Story = {
  args: {
    activeTab: 'books',
    onTabChange: () => {},
  },
};

// Interactive story with state
const InteractiveTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  return (
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <p className="mt-4 text-sm text-gray-600">
        Active tab: <strong>{activeTab}</strong>
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTabNavigation />,
};
