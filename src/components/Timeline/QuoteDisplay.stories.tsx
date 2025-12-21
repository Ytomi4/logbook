import type { Meta, StoryObj } from '@storybook/react';
import { QuoteDisplay } from './QuoteDisplay';

const meta = {
  title: 'Timeline/QuoteDisplay',
  component: QuoteDisplay,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
  },
} satisfies Meta<typeof QuoteDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'The only way to do great work is to love what you do.',
  },
};

export const LongQuote: Story = {
  args: {
    content: 'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.',
  },
};

export const MultilineQuote: Story = {
  args: {
    content: 'To be, or not to be, that is the question:\nWhether \'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles.',
  },
};

export const JapaneseQuote: Story = {
  args: {
    content: '吾輩は猫である。名前はまだ無い。',
  },
};
