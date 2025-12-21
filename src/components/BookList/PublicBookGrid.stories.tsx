import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { PublicBookGrid } from './PublicBookGrid';
import { mockBooks, mockBookWithCover } from '../../stories/mocks/data';

const meta = {
  title: 'BookList/PublicBookGrid',
  component: PublicBookGrid,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A read-only book grid for displaying books on public user pages. Unlike BookGrid, it does not include delete functionality.',
      },
    },
  },
} satisfies Meta<typeof PublicBookGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    books: mockBooks,
  },
};

export const SingleBook: Story = {
  args: {
    books: [mockBooks[0]],
  },
};

export const WithCoverImages: Story = {
  args: {
    books: [mockBookWithCover, { ...mockBookWithCover, id: 'book-4', title: 'Another Book with Cover' }],
  },
};

export const Empty: Story = {
  args: {
    books: [],
  },
};

export const ManyBooks: Story = {
  args: {
    books: Array.from({ length: 9 }, (_, i) => ({
      ...mockBooks[0],
      id: `book-${i + 1}`,
      title: `Book ${i + 1}: A Sample Book Title`,
      author: `Author ${i + 1}`,
    })),
  },
};
