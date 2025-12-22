import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NdlSearchResults } from './NdlSearchResults';
import type { NdlBook } from '../../types';

// Mock NdlBook data
const mockBooks: NdlBook[] = [
  {
    title: 'JavaScript入門',
    author: '山田太郎',
    publisher: '技術評論社',
    isbn: '9784123456789',
    pubDate: '2024',
    ndlBibId: 'R100000001-I000000001-00',
  },
  {
    title: 'React実践ガイド',
    author: '佐藤花子',
    publisher: 'オライリー・ジャパン',
    isbn: '9784987654321',
    pubDate: '2023',
    ndlBibId: 'R100000001-I000000002-00',
  },
  {
    title: 'TypeScript完全ガイド',
    author: '鈴木一郎',
    publisher: '翔泳社',
    isbn: null,
    pubDate: '2024',
    ndlBibId: 'R100000001-I000000003-00',
  },
];

const meta = {
  title: 'BookForm/NdlSearchResults',
  component: NdlSearchResults,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
    hasMore: {
      control: 'boolean',
    },
    isLoadingMore: {
      control: 'boolean',
    },
  },
  args: {
    onSelect: fn(),
    onLoadMore: fn(),
  },
} satisfies Meta<typeof NdlSearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    results: mockBooks,
  },
};

export const WithLoadMore: Story = {
  args: {
    results: mockBooks,
    hasMore: true,
  },
};

export const LoadingMore: Story = {
  args: {
    results: mockBooks,
    hasMore: true,
    isLoadingMore: true,
  },
};

export const NoMoreResults: Story = {
  args: {
    results: mockBooks,
    hasMore: false,
  },
};

export const Loading: Story = {
  args: {
    results: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    results: [],
  },
};

export const ManyResults: Story = {
  args: {
    results: [
      ...mockBooks,
      ...mockBooks.map((book, i) => ({
        ...book,
        ndlBibId: `${book.ndlBibId}-${i}`,
        title: `${book.title} (${i + 4})`,
      })),
    ],
    hasMore: true,
  },
};
