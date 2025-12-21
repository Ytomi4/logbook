import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { BooksEmpty } from './BooksEmpty';

const meta = {
  title: 'BookList/BooksEmpty',
  component: BooksEmpty,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    isOwner: {
      control: 'boolean',
      description: 'Whether the viewer is the owner of the book list',
    },
    username: {
      control: 'text',
      description: 'Username for visitor view',
    },
  },
} satisfies Meta<typeof BooksEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Owner: Story = {
  name: 'Owner View',
  args: {
    isOwner: true,
  },
};

export const Visitor: Story = {
  name: 'Visitor View',
  args: {
    isOwner: false,
    username: 'testuser',
  },
};
