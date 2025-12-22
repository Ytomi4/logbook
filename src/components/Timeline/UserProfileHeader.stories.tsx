import type { Meta, StoryObj } from '@storybook/react';
import { UserProfileHeader } from './UserProfileHeader';

const meta = {
  title: 'Timeline/UserProfileHeader',
  component: UserProfileHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: 'yamada',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
};

export const NoAvatar: Story = {
  args: {
    username: 'tanaka',
    avatarUrl: undefined,
  },
};

export const LongUsername: Story = {
  args: {
    username: 'verylongusernameexample',
    avatarUrl: undefined,
  },
};

export const SingleCharUsername: Story = {
  args: {
    username: 'a',
    avatarUrl: undefined,
  },
};
