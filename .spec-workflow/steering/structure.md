# Project Structure

## Directory Organization

```
logbook/
├── src/                          # フロントエンド（React）
│   ├── components/               # UI コンポーネント
│   │   ├── common/               # 汎用コンポーネント（Button, Modal, Layout 等）
│   │   └── [Feature]/            # 機能単位でグループ化（BookForm, Timeline, Landing 等）
│   ├── pages/                    # ページコンポーネント（ルーティング対応）
│   ├── hooks/                    # カスタムフック（use*.ts）
│   ├── services/                 # API クライアント
│   ├── types/                    # 型定義
│   ├── lib/                      # ユーティリティ
│   └── stories/                  # Storybook 共通設定・モックデータ
│
├── functions/                    # バックエンド（Cloudflare Pages Functions）
│   ├── api/                      # API エンドポイント
│   │   ├── auth/                 # 認証 API（better-auth）
│   │   ├── avatar/               # アバターアップロード
│   │   ├── books/                # 本 CRUD
│   │   ├── logs/                 # ログ CRUD
│   │   ├── ndl/                  # NDL 書誌検索連携
│   │   ├── profile/              # プロファイル管理
│   │   ├── username/             # ユーザー名チェック
│   │   └── users/                # 公開ユーザー API
│   ├── avatars/                  # アバター画像配信
│   └── lib/                      # バックエンド共有ライブラリ
│
├── db/                           # データベース
│   └── migrations/               # Drizzle マイグレーションファイル（*.sql）
│
├── .storybook/                   # Storybook 設定
├── .spec-workflow/               # Spec Workflow 設定・ドキュメント
│
└── [Config Files]                # package.json, tsconfig.json, vite.config.ts 等
```

## Naming Conventions

### Files

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| Components | `PascalCase.tsx` | `BookForm.tsx`, `TimelineItem.tsx` |
| Stories | `PascalCase.stories.tsx` | `Button.stories.tsx` |
| Hooks | `camelCase.ts` + `use` prefix | `useTimeline.ts`, `useAuth.ts` |
| Services | `camelCase.ts` | `books.ts`, `api.ts` |
| Types | `camelCase.ts` | `index.ts` |
| Tests | `*.test.ts` or `*.test.tsx` | `useBookList.test.ts` |
| API Routes | `camelCase.ts`, dynamic: `[param].ts` | `index.ts`, `[bookId].ts` |

### Code

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| Types/Interfaces | `PascalCase` | `Book`, `LogWithBook`, `CreateBookRequest` |
| Functions | `camelCase` | `getBooks`, `createLog` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL` |
| Variables | `camelCase` | `bookId`, `isLoading` |
| React Components | `PascalCase` | `TimelinePage`, `QuickLogModal` |

## Import Patterns

### Import Order

1. React 関連（`react`, `react-dom`, `react-router-dom`）
2. 外部ライブラリ（`hono`, `drizzle-orm`, `zod`）
3. 内部モジュール（`@/components`, `@/hooks`）
4. 相対インポート（`./`, `../`）
5. スタイル（CSS）

### Barrel Exports

各ディレクトリには `index.ts` を配置し、外部からのインポートを簡潔にする。

```typescript
// components/common/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export { Layout } from './Layout';

// 使用側
import { Button, Modal, Layout } from './components/common';
```

## Code Structure Patterns

### React Component

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import type { SomeType } from '../types';

// 2. Types (local)
interface Props {
  // ...
}

// 3. Component
export function ComponentName({ prop1, prop2 }: Props) {
  // 3.1 State / Hooks
  const [state, setState] = useState();

  // 3.2 Effects
  useEffect(() => { /* ... */ }, []);

  // 3.3 Event Handlers
  const handleClick = () => { /* ... */ };

  // 3.4 Render
  return <div>...</div>;
}
```

### Custom Hook

```typescript
export function useSomething() {
  // State
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const fetchData = useCallback(async () => { /* ... */ }, []);

  // Return
  return { data, loading, error, fetchData };
}
```

### API Service

```typescript
import type { Book, CreateBookRequest } from '../types';

export async function getBooks(): Promise<Book[]> {
  const response = await fetch('/api/books');
  return response.json();
}

export async function createBook(data: CreateBookRequest): Promise<Book> {
  // ...
}
```

## Module Boundaries

### Frontend / Backend 分離

| Directory | Scope | Environment |
|-----------|-------|-------------|
| `src/` | フロントエンド専用 | Browser |
| `functions/` | バックエンド専用 | Cloudflare Workers |

型定義はフロントエンド（`src/types/`）で定義し、API レスポンスとして暗黙的に共有。

### Dependency Direction

```
pages/          → ページ単位（ルーティング対応）
  ↓ uses
components/     → 再利用可能な UI
  ↓ uses
hooks/          → ビジネスロジック・データ取得
  ↓ uses
services/       → API 通信
  ↓ uses
types/          → 型定義
```

- 上位レイヤーは下位レイヤーに依存可能
- 逆方向の依存は禁止

## Code Organization Principles

1. **Single Responsibility** - 1ファイル = 1コンポーネント / 1フック / 1サービス
2. **Feature-based Grouping** - 機能単位でコンポーネントをグループ化
3. **Colocation** - 関連ファイルは近くに配置（Component + Stories + Test）
4. **Barrel Exports** - `index.ts` でディレクトリ単位のエクスポート管理

## Code Size Guidelines

| 対象 | 目安 |
|------|------|
| File | 300行以下 |
| Function | 50行以下 |
| Component | 150行以下（超えたら分割検討） |
| Nesting depth | 最大3レベル |

## Documentation Standards

- 複雑なロジックにはインラインコメント
- 型定義で自己文書化（JSDoc は必須ではない）
- README.md でプロジェクト概要とセットアップ手順を記載
