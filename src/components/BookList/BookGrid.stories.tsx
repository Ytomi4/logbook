import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { BookGrid } from './BookGrid';
import { mockBooksWithLogCount } from '../../stories/mocks/data';

const meta = {
  title: 'BookList/BookGrid',
  component: BookGrid,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof BookGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    books: mockBooksWithLogCount,
  },
};

export const SingleBook: Story = {
  args: {
    books: [mockBooksWithLogCount[0]],
  },
};

export const WithDeleteButton: Story = {
  args: {
    books: mockBooksWithLogCount,
    onDelete: async (bookId) => {
      console.log('Delete book:', bookId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Empty: Story = {
  args: {
    books: [],
  },
};
