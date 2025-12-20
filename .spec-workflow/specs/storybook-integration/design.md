# Design Document

## Overview

Storybook 10.x を React + Vite + TypeScript 環境に導入し、UI コンポーネントのカタログ・開発環境を構築する。Storybook の Vite ビルダーを使用することで、既存の Vite 設定との整合性を保ち、高速な開発体験を実現する。

> **Note**: Storybook 8.x は Vite 4/5/6 のみ対応。本プロジェクトは Vite 7.3.0 を使用しているため、Vite 7 対応の Storybook 10.x を採用する。Storybook 10 は ESM-only で、インストールサイズが大幅に削減されている。

## Steering Document Alignment

### Technical Standards (tech.md)

- **Vite 7 ベース**: Storybook の `@storybook/react-vite` ビルダーを使用し、既存の Vite 設定を活用
- **TypeScript 5.9**: Stories も TypeScript で記述（`.stories.tsx`）
- **Tailwind CSS 4**: Storybook 内でも Tailwind CSS が正しく動作するよう設定
- **ESLint / Prettier**: Stories ファイルも既存のコード品質ルールに従う

### Project Structure (structure.md)

- **Colocation パターン**: Stories はコンポーネントと同じディレクトリに配置
  - 例: `src/components/common/Button.tsx` → `src/components/common/Button.stories.tsx`
- **命名規則**: `[ComponentName].stories.tsx`（PascalCase）
- **Storybook 設定**: `.storybook/` ディレクトリをプロジェクトルートに配置

## Code Reuse Analysis

### Existing Components to Leverage

- **common/Button.tsx**: variant（primary, secondary, danger, ghost）と size（sm, md, lg）のバリエーションを Stories で表現
- **common/Input.tsx, Textarea.tsx**: フォーム入力コンポーネントの States を Stories 化
- **common/Modal.tsx**: 開閉状態を Args で制御する Stories
- **common/Card.tsx**: CardHeader, CardTitle, CardContent の組み合わせを Stories 化
- **common/Toast.tsx**: ToastProvider のラッパーを使用した通知表示 Stories
- **common/TabNavigation.tsx**: タイムライン/本一覧の切り替えタブ、activeTab の状態変化を Stories 化
- **common/Layout.tsx**: ヘッダー + コンテンツエリアのレイアウト、BrowserRouter デコレーターが必要

### Integration Points

- **Tailwind CSS**: `@tailwindcss/vite` プラグインを Storybook でも利用
- **Path Alias**: `@/` エイリアスを Storybook でも有効化
- **Mock Data**: 既存の型定義（`src/types/index.ts`）を活用してモックデータを作成

## Architecture

Storybook は開発ツールとして独立して動作し、本番ビルドには影響しない。

```mermaid
graph TD
    subgraph "Development Environment"
        A[npm run storybook] --> B[Storybook Dev Server :6006]
        B --> C[@storybook/react-vite]
        C --> D[Vite Builder]
        D --> E[React Components]
        D --> F[Tailwind CSS]
    end

    subgraph "Storybook Configuration"
        G[.storybook/main.ts] --> C
        H[.storybook/preview.ts] --> I[Global Decorators]
        I --> J[Tailwind Styles]
    end

    subgraph "Stories Structure"
        K[*.stories.tsx] --> L[CSF 3.0 Format]
        L --> M[Meta + StoryObj]
    end
```

### Modular Design Principles

- **Single File Responsibility**: 1つの Stories ファイルは1つのコンポーネントに対応
- **Component Isolation**: 各 Story は独立して動作し、他のコンポーネントに依存しない
- **Decorator Pattern**: 共通のラッパー（ToastProvider 等）は Decorators で適用
- **Args Pattern**: Props は Args として定義し、Controls パネルで動的に変更可能

## Components and Interfaces

### Storybook Configuration

#### .storybook/main.ts
- **Purpose**: Storybook のメイン設定ファイル
- **Interfaces**:
  - `stories`: Stories ファイルのパターン指定
  - `addons`: 使用するアドオン一覧
  - `framework`: `@storybook/react-vite` 指定
  - `viteFinal`: Vite 設定のカスタマイズ
- **Dependencies**: `@storybook/react-vite`, `@storybook/addon-essentials`

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Tailwind CSS と path alias の設定を継承
    return config;
  },
};

export default config;
```

#### .storybook/preview.ts
- **Purpose**: グローバルなプレビュー設定（デコレーター、パラメータ）
- **Interfaces**:
  - `decorators`: 全 Stories に適用するラッパー
  - `parameters`: デフォルトパラメータ
- **Dependencies**: Tailwind CSS スタイル

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/index.css'; // Tailwind CSS

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

### Story File Structure（CSF 3.0）

```typescript
// Button.stories.tsx の例
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};
```

## Data Models

### Mock Data Types

既存の型定義（`src/types/index.ts`）を活用してモックデータを作成。

```typescript
// src/stories/mocks/data.ts
import type { Book, LogWithBook } from '../../types';

export const mockBook: Book = {
  id: 1,
  title: 'サンプル書籍',
  author: '著者名',
  isbn: '978-4-00-000000-0',
  coverUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockLogs: LogWithBook[] = [
  {
    id: 1,
    bookId: 1,
    type: 'memo',
    content: 'サンプルメモ',
    pageNumber: 42,
    createdAt: '2024-01-01T00:00:00Z',
    book: mockBook,
  },
];
```

## File Structure

```
logbook/
├── .storybook/                    # Storybook 設定
│   ├── main.ts                    # メイン設定
│   └── preview.ts                 # プレビュー設定
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx     # ← 追加
│   │   │   ├── Input.tsx
│   │   │   ├── Input.stories.tsx      # ← 追加
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.stories.tsx      # ← 追加
│   │   │   ├── TabNavigation.tsx
│   │   │   ├── TabNavigation.stories.tsx  # ← 追加
│   │   │   ├── Layout.tsx
│   │   │   ├── Layout.stories.tsx     # ← 追加
│   │   │   └── ...
│   │   ├── BookForm/
│   │   │   ├── BookForm.tsx
│   │   │   ├── BookForm.stories.tsx   # ← 追加
│   │   │   └── ...
│   │   ├── Timeline/
│   │   │   ├── TimelineItem.tsx
│   │   │   ├── TimelineItem.stories.tsx  # ← 追加
│   │   │   └── ...
│   │   └── ...
│   └── stories/
│       └── mocks/
│           └── data.ts                # モックデータ
└── package.json                       # scripts に storybook 追加
```

## Dependencies

### Production Dependencies
なし（Storybook は開発専用）

### Development Dependencies

> **Vite 7 互換性**: Storybook 10.x が Vite 7 に対応。ESM-only でインストールサイズも削減。

```json
{
  "devDependencies": {
    "@storybook/react": "^10.0.0",
    "@storybook/react-vite": "^10.0.0",
    "@storybook/addon-essentials": "^10.0.0",
    "@storybook/addon-interactions": "^10.0.0",
    "@storybook/test": "^10.0.0",
    "storybook": "^10.0.0"
  }
}
```

## Error Handling

### Error Scenarios

1. **Tailwind CSS が適用されない**
   - **Handling**: `.storybook/preview.ts` で `src/index.css` をインポート
   - **User Impact**: スタイルなしのコンポーネントが表示される → 設定修正で解決

2. **Path Alias (@/) が解決されない**
   - **Handling**: `viteFinal` で Vite の resolve.alias を継承
   - **User Impact**: インポートエラー → 設定修正で解決

3. **コンポーネントが API に依存している**
   - **Handling**: Stories 内でモックデータを使用、または Decorators でモックプロバイダーを提供
   - **User Impact**: Stories が正常に表示される

## Testing Strategy

### Unit Testing
- Stories ファイル自体のテストは不要（Storybook が動作確認ツール）
- 既存の Vitest テストは引き続き動作

### Integration Testing
- Storybook の `@storybook/addon-interactions` を使用した対話テストを将来的に検討
- `@storybook/test` で play 関数を使ったインタラクションテスト

### Visual Testing
- 将来的に Chromatic や Percy などのビジュアルリグレッションテストを検討
- 初期導入時はマニュアルでの目視確認

## npm Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```
