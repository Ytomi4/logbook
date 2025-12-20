import type { Meta, StoryObj } from '@storybook/react';
import { TimelineItem } from './TimelineItem';
import { mockMemoLog, mockQuoteLog } from '../../stories/mocks/data';

const meta = {
  title: 'Timeline/TimelineItem',
  component: TimelineItem,
  tags: ['autodocs'],
  argTypes: {
    isLast: { control: 'boolean' },
    isDeleting: { control: 'boolean' },
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

export const LastItem: Story = {
  args: {
    log: mockMemoLog,
    isLast: true,
  },
};

export const WithDeleteButton: Story = {
  args: {
    log: mockMemoLog,
    isLast: false,
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
    onDelete: async () => {},
    isDeleting: true,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div>
      <TimelineItem log={mockMemoLog} />
      <TimelineItem log={mockQuoteLog} />
      <TimelineItem
        log={{
          ...mockMemoLog,
          id: 'log-3',
          content: 'Another memo entry with different content.',
        }}
        isLast={true}
      />
    </div>
  ),
};
