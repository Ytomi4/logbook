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
} satisfies Meta<typeof TimelineEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
