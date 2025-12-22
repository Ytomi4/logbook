import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { QuoteButton } from './QuoteButton';

const meta = {
  title: 'LogForm/QuoteButton',
  component: QuoteButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof QuoteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithShortcutHint: Story = {
  args: {
    showShortcut: true,
  },
};
