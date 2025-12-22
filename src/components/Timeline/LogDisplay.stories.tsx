import type { Meta, StoryObj } from '@storybook/react';
import { LogDisplay } from './LogDisplay';

const meta = {
  title: 'Timeline/LogDisplay',
  component: LogDisplay,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LogDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlainText: Story = {
  args: {
    content: 'This is a simple note about the book. It contains my thoughts and observations.',
  },
};

export const SingleQuote: Story = {
  args: {
    content: '> The only way to do great work is to love what you do.',
  },
};

export const MultilineQuote: Story = {
  args: {
    content: '> This is the first line of a quote.\n> This is the second line of the same quote.\n> And the third line continues.',
  },
};

export const MixedContent: Story = {
  args: {
    content: '> The only way to do great work is to love what you do.\nThis quote by Steve Jobs really resonates with me.\n> Another inspiring quote from a different book.\nI should remember this for later.',
  },
};

export const QuoteFollowedByText: Story = {
  args: {
    content: '> Success is not final, failure is not fatal: it is the courage to continue that counts.\nThis Winston Churchill quote reminds me to keep pushing forward.',
  },
};

export const TextFollowedByQuote: Story = {
  args: {
    content: 'I found this passage particularly moving:\n> We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
  },
};

export const Empty: Story = {
  args: {
    content: '',
  },
};

export const LongContent: Story = {
  args: {
    content: `> In the beginning was the Word, and the Word was with God, and the Word was God.
This is one of the most profound openings in literature.

The author's use of repetition creates a powerful rhythm.

> All that we see or seem is but a dream within a dream.
Edgar Allan Poe's words echo through time.

I need to explore more of his poetry collection.`,
  },
};
