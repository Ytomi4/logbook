import type { Meta, StoryObj } from '@storybook/react';
import { TimelineItem } from './TimelineItem';
import { mockMemoLog, mockQuoteLog, mockRegistrationLog } from '../../stories/mocks/data';

const meta = {
  title: 'Timeline/TimelineItem',
  component: TimelineItem,
  tags: ['autodocs'],
  argTypes: {
    isLast: { control: 'boolean' },
    isDeleting: { control: 'boolean' },
    currentUserId: { control: 'text' },
  },
} satisfies Meta<typeof TimelineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MemoType: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
  },
};

export const QuoteType: Story = {
  args: {
    log: mockQuoteLog,
    isLast: false,
  },
};

export const RegistrationType: Story = {
  args: {
    log: mockRegistrationLog,
    isLast: false,
  },
};

export const LastItem: Story = {
  args: {
    log: mockMemoLog,
    isLast: true,
  },
};

// Owner view - shows edit and delete buttons
export const OwnerView: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
    currentUserId: 'user-1', // Same as log.userId
    onDelete: async (logId) => {
      console.log('Delete log:', logId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onUpdate: (updatedLog) => {
      console.log('Updated log:', updatedLog);
    },
  },
};

// Visitor view - no edit/delete buttons
export const VisitorView: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
    currentUserId: 'user-other', // Different from log.userId
    onDelete: async (logId) => {
      console.log('Delete log:', logId);
    },
  },
};

// Owner view for registration log - no edit/delete (registration logs cannot be edited)
export const OwnerViewRegistration: Story = {
  args: {
    log: mockRegistrationLog,
    isLast: false,
    currentUserId: 'user-1',
    onDelete: async (logId) => {
      console.log('Delete log:', logId);
    },
  },
};

export const WithDeleteButton: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
    currentUserId: 'user-1',
    onDelete: async (logId) => {
      console.log('Delete log:', logId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Deleting: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
    currentUserId: 'user-1',
    onDelete: async () => {},
    isDeleting: true,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div>
      <TimelineItem log={mockMemoLog} currentUserId="user-1" />
      <TimelineItem log={mockQuoteLog} currentUserId="user-1" />
      <TimelineItem
        log={{
          ...mockMemoLog,
          id: 'log-3',
          content: 'Another memo entry with different content.',
        }}
        isLast={true}
        currentUserId="user-1"
      />
    </div>
  ),
};
