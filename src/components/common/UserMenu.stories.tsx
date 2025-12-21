import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <div className="flex justify-end p-4">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: '山田 太郎',
      email: 'taro@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      username: 'yamada_taro',
      avatarUrl: null,
    },
    onLogout: () => {},
  },
};

export const WithCustomAvatar: Story = {
  args: {
    user: {
      name: '田中 花子',
      email: 'hanako@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      username: 'tanaka_hanako',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
    },
    onLogout: () => {},
  },
};

export const WithGoogleAvatar: Story = {
  args: {
    user: {
      name: '佐藤 次郎',
      email: 'jiro@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      username: 'sato_jiro',
      avatarUrl: null,
    },
    onLogout: () => {},
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: {
      name: '鈴木 三郎',
      email: 'saburo@example.com',
      image: null,
      username: 'suzuki_saburo',
      avatarUrl: null,
    },
    onLogout: () => {},
  },
};

export const WithoutUsername: Story = {
  args: {
    user: {
      name: 'ゲストユーザー',
      email: 'guest@example.com',
      image: null,
      username: null,
      avatarUrl: null,
    },
    onLogout: () => {},
  },
};

export const LongUsername: Story = {
  args: {
    user: {
      name: 'とても長い名前のユーザー',
      email: 'long@example.com',
      image: null,
      username: 'very_long_username_here',
      avatarUrl: null,
    },
    onLogout: () => {},
  },
};
