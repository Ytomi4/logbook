import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineEmpty } from './TimelineEmpty';

const meta = {
  title: 'Timeline/TimelineEmpty',
  component: TimelineEmpty,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['timeline', 'books'],
      description: 'Empty state variant (timeline or books)',
    },
    isOwner: {
      control: 'boolean',
      description: 'Whether the viewer is the owner of the timeline',
    },
    username: {
      control: 'text',
      description: 'Username for visitor view',
    },
  },
} satisfies Meta<typeof TimelineEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OwnerTimeline: Story = {
  name: 'Owner - Timeline',
  args: {
    variant: 'timeline',
    isOwner: true,
  },
};

export const VisitorTimeline: Story = {
  name: 'Visitor - Timeline',
  args: {
    variant: 'timeline',
    isOwner: false,
    username: 'testuser',
  },
};

export const OwnerBooks: Story = {
  name: 'Owner - Books',
  args: {
    variant: 'books',
    isOwner: true,
  },
};

export const VisitorBooks: Story = {
  name: 'Visitor - Books',
  args: {
    variant: 'books',
    isOwner: false,
    username: 'testuser',
  },
};
