import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu } from './UserMenu';

const meta = {
  title: 'Common/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  argTypes: {
    onLogout: {
      action: 'logout',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAvatar: Story = {
  args: {
    user: {
      name: '山田 太郎',
      email: 'taro@example.com',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
    onLogout: () => {},
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: {
      name: '田中 花子',
      email: 'hanako@example.com',
      image: null,
    },
    onLogout: () => {},
  },
};

export const LongName: Story = {
  args: {
    user: {
      name: 'とても長い名前のユーザーさん',
      email: 'very-long-email-address@example.com',
      image: null,
    },
    onLogout: () => {},
  },
};
