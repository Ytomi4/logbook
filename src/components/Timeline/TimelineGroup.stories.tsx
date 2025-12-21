import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { TimelineGroup } from './TimelineGroup';
import {
  mockBook,
  mockBookWithCover,
  mockLogWithBook,
  mockQuoteLogWithBook,
  mockRegistrationLogWithBook,
} from '../../stories/mocks/data';

const meta = {
  title: 'Timeline/TimelineGroup',
  component: TimelineGroup,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    isLastGroup: { control: 'boolean' },
    currentUserId: { control: 'text' },
  },
} satisfies Meta<typeof TimelineGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Normal book with multiple logs
export const WithMultipleLogs: Story = {
  args: {
    book: mockBook,
    logs: [mockLogWithBook, mockQuoteLogWithBook],
    isLastGroup: false,
  },
};

// Book with cover and logs
export const WithCoverAndLogs: Story = {
  args: {
    book: mockBookWithCover,
    logs: [
      { ...mockLogWithBook, book: mockBookWithCover },
      { ...mockQuoteLogWithBook, book: mockBookWithCover },
    ],
    isLastGroup: false,
  },
};

// Registration-only book (shows only book cover with registration date)
export const RegistrationOnly: Story = {
  args: {
    book: mockBook,
    logs: [mockRegistrationLogWithBook],
    isLastGroup: false,
  },
};

// Mixed logs including registration
export const MixedLogsWithRegistration: Story = {
  args: {
    book: mockBook,
    logs: [
      mockRegistrationLogWithBook,
      mockLogWithBook,
      mockQuoteLogWithBook,
    ],
    isLastGroup: false,
  },
};

// Owner view - shows edit/delete buttons
export const OwnerView: Story = {
  args: {
    book: mockBook,
    logs: [mockLogWithBook, mockQuoteLogWithBook],
    isLastGroup: false,
    currentUserId: 'user-1',
    onLogDelete: async (logId) => {
      console.log('Delete log:', logId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onLogUpdate: (updatedLog) => {
      console.log('Updated log:', updatedLog);
    },
  },
};

// Visitor view - no edit/delete buttons
export const VisitorView: Story = {
  args: {
    book: mockBook,
    logs: [mockLogWithBook, mockQuoteLogWithBook],
    isLastGroup: false,
    currentUserId: 'user-other',
    onLogDelete: async (logId) => {
      console.log('Delete log:', logId);
    },
  },
};

// Last group in timeline
export const LastGroup: Story = {
  args: {
    book: mockBook,
    logs: [mockLogWithBook],
    isLastGroup: true,
  },
};

// Deleted book
export const DeletedBook: Story = {
  args: {
    book: { ...mockBook, isDeleted: true },
    logs: [mockLogWithBook],
    isLastGroup: false,
  },
};
