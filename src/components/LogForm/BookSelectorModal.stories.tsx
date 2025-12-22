import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BookSelectorModal } from './BookSelectorModal';
import { mockBooks, emptyBooks } from '../../stories/mocks/data';

const meta = {
  title: 'LogForm/BookSelectorModal',
  component: BookSelectorModal,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    onSelect: fn(),
  },
} satisfies Meta<typeof BookSelectorModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    books: mockBooks,
    selectedBook: null,
  },
};

export const WithSelectedBook: Story = {
  args: {
    isOpen: true,
    books: mockBooks,
    selectedBook: mockBooks[0],
  },
};

export const EmptyBooks: Story = {
  args: {
    isOpen: true,
    books: emptyBooks,
    selectedBook: null,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    books: mockBooks,
    selectedBook: null,
  },
};
