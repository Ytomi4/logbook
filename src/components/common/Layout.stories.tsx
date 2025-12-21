import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';

/**
 * Layout コンポーネントのストーリー
 *
 * ## ロゴの遷移先
 * - **未ログイン**: `/`（ホームページ）へ遷移
 * - **ログイン済み**: `/{username}`（自分のタイムライン）へ遷移
 *
 * ## ヘッダーの認証状態別表示
 * - ロード中: スケルトン表示（円形のアニメーション）
 * - 未ログイン: 「はじめる」ボタン
 * - ログイン済み: UserMenu コンポーネント
 *
 * 認証状態別の詳細な確認は UserMenu.stories.tsx を参照してください。
 */
const meta = {
  title: 'Common/Layout',
  component: Layout,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold mb-2">Page Content</h1>
        <p className="text-gray-600">
          This is the main content area inside the Layout component.
        </p>
      </div>
    ),
  },
};

export const WithMultipleCards: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold mb-2">Card 1</h2>
          <p className="text-gray-600">First card content.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold mb-2">Card 2</h2>
          <p className="text-gray-600">Second card content.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold mb-2">Card 3</h2>
          <p className="text-gray-600">Third card content.</p>
        </div>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    children: null,
  },
};
