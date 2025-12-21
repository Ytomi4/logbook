import type { Meta, StoryObj } from '@storybook/react';
import { UserInfo } from './UserInfo';

const meta = {
  title: 'Common/UserInfo',
  component: UserInfo,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: '山田太郎',
  },
};

export const WithAvatar: Story = {
  args: {
    name: '田中花子',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: '佐藤次郎',
    avatarUrl: undefined,
  },
};

export const Guest: Story = {
  args: {
    name: 'ゲスト',
  },
};

export const LongName: Story = {
  args: {
    name: 'とても長い名前のユーザーさん',
    avatarUrl: undefined,
  },
};

export const SingleCharName: Story = {
  args: {
    name: 'A',
    avatarUrl: undefined,
  },
};

export const EmptyName: Story = {
  args: {
    name: undefined,
  },
};
