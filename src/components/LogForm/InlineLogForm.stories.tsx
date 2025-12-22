import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { InlineLogForm } from './InlineLogForm';
import { mockBooks, emptyBooks } from '../../stories/mocks/data';

const meta = {
  title: 'LogForm/InlineLogForm',
  component: InlineLogForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-xl p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    onSuccess: fn(),
  },
} satisfies Meta<typeof InlineLogForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    books: mockBooks,
    defaultBook: mockBooks[0],
  },
};

export const WithDifferentDefaultBook: Story = {
  args: {
    books: mockBooks,
    defaultBook: mockBooks[1],
  },
};

export const NoDefaultBook: Story = {
  args: {
    books: mockBooks,
    defaultBook: null,
  },
};

export const NoBooks: Story = {
  args: {
    books: emptyBooks,
    defaultBook: null,
  },
};
