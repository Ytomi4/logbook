# Project Structure

## Directory Organization

```
logbook/
├── src/                          # フロントエンド（React）
│   ├── components/               # UI コンポーネント
│   │   ├── common/               # 汎用コンポーネント
│   │   │   ├── BookCover.tsx     # 本の表紙表示
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── HeaderActionButtons.tsx  # ヘッダーアクションボタン
│   │   │   ├── Input.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ShareButton.tsx   # 共有ボタン
│   │   │   ├── TabNavigation.tsx # タブナビゲーション
│   │   │   ├── Textarea.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── UserInfo.tsx      # ユーザー情報表示
│   │   │   └── index.ts          # バレルエクスポート
│   │   ├── BookForm/             # 本登録フォーム
│   │   │   ├── BookForm.tsx
│   │   │   ├── BookSearchInput.tsx
│   │   │   ├── NdlSearchResults.tsx
│   │   │   └── index.ts
│   │   ├── BookList/             # 本一覧表示
│   │   │   ├── BookGrid.tsx      # グリッド表示
│   │   │   ├── BookListView.tsx  # リスト表示
│   │   │   └── index.ts
│   │   ├── LogForm/              # ログ入力フォーム
│   │   │   ├── LogForm.tsx
│   │   │   ├── LogTypeSelector.tsx
│   │   │   ├── QuickAddLogModal.tsx  # クイック追加モーダル
│   │   │   ├── QuickLogModal.tsx
│   │   │   └── index.ts
│   │   └── Timeline/             # タイムライン表示
│   │       ├── QuoteDisplay.tsx
│   │       ├── Timeline.tsx
│   │       ├── TimelineEmpty.tsx
│   │       ├── TimelineGroup.tsx
│   │       ├── TimelineItem.tsx
│   │       ├── TimelineView.tsx  # タイムラインビュー
│   │       └── index.ts
│   ├── pages/                    # ページコンポーネント
│   │   ├── HomePage.tsx          # / - ホーム（タブ切り替え）
│   │   ├── TimelinePage.tsx      # タイムライン表示
│   │   ├── BookListPage.tsx      # /books - 本一覧
│   │   ├── BookDetailPage.tsx    # /books/:id - 本詳細
│   │   └── BookRegistrationPage.tsx  # /books/new - 本登録
│   ├── hooks/                    # カスタムフック
│   │   ├── useBookList.ts        # 本一覧ロジック
│   │   ├── useBookSearch.ts      # 本検索ロジック
│   │   ├── useKeyboardShortcuts.ts  # キーボードショートカット
│   │   ├── useLogForm.ts         # ログフォームロジック
│   │   ├── useTabNavigation.ts   # タブナビゲーションロジック
│   │   └── useTimeline.ts        # タイムラインデータ取得
│   ├── services/                 # API クライアント
│   │   ├── api.ts                # 共通 API 設定
│   │   ├── books.ts              # 本 API
│   │   ├── logs.ts               # ログ API
│   │   └── ndl.ts                # NDL 検索 API
│   ├── types/                    # 型定義
│   │   └── index.ts              # 共通型定義
│   ├── lib/                      # ユーティリティ
│   │   └── validation.ts         # バリデーション
│   ├── App.tsx                   # ルートコンポーネント
│   └── main.tsx                  # エントリーポイント
│
├── functions/                    # バックエンド（Cloudflare Pages Functions）
│   ├── api/                      # API エンドポイント
│   │   ├── _middleware.ts        # 共通ミドルウェア
│   │   ├── [[path]].ts           # キャッチオールルート（Hono）
│   │   ├── books/                # 本 API
│   │   │   ├── index.ts          # GET/POST /api/books
│   │   │   └── [bookId]/
│   │   │       ├── index.ts      # GET/PUT/DELETE /api/books/:id
│   │   │       └── logs.ts       # GET/POST /api/books/:id/logs
│   │   ├── logs/                 # ログ API
│   │   │   ├── index.ts          # GET /api/logs（タイムライン）
│   │   │   └── [logId].ts        # PUT/DELETE /api/logs/:id
│   │   └── ndl/                  # NDL 連携
│   │       └── search.ts         # GET /api/ndl/search
│   └── lib/                      # バックエンド共有ライブラリ
│       ├── db.ts                 # Drizzle DB 設定
│       └── utils.ts              # ユーティリティ
│
├── db/                           # データベース
│   └── migrations/               # マイグレーションファイル
│
├── tests/                        # テストファイル
│   ├── setup.ts                  # テストセットアップ
│   └── hooks/                    # フックのテスト
│       ├── useBookList.test.ts
│       └── useTabNavigation.test.ts
│
├── dist/                         # ビルド出力（gitignore）
│
├── .spec-workflow/               # Spec Workflow 設定
│   ├── steering/                 # Steering Documents
│   └── templates/                # テンプレート
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc                # Cloudflare Workers 設定
└── drizzle.config.ts             # Drizzle 設定
```

## Naming Conventions

### Files
- **Components**: `PascalCase.tsx`（例: `BookForm.tsx`, `TimelineItem.tsx`）
- **Hooks**: `camelCase.ts`、`use` プレフィックス（例: `useTimeline.ts`）
- **Services**: `camelCase.ts`（例: `books.ts`, `api.ts`）
- **Types**: `camelCase.ts`（例: `index.ts`）
- **Tests**: `[filename].test.ts` または `[filename].test.tsx`
- **API Routes**: `camelCase.ts`、動的ルートは `[param].ts`

### Code
- **Types/Interfaces**: `PascalCase`（例: `Book`, `LogWithBook`, `CreateBookRequest`）
- **Functions/Methods**: `camelCase`（例: `getBooks`, `createLog`）
- **Constants**: `UPPER_SNAKE_CASE`（例: `API_BASE_URL`）
- **Variables**: `camelCase`（例: `bookId`, `isLoading`）
- **React Components**: `PascalCase`（例: `TimelinePage`, `QuickLogModal`）

## Import Patterns

### Import Order
1. React 関連（`react`, `react-dom`, `react-router-dom`）
2. 外部ライブラリ（`hono`, `drizzle-orm`, `zod`）
3. 内部モジュール（`@/components`, `@/hooks`）
4. 相対インポート（`./`, `../`）
5. スタイル（CSS）

### Module/Package Organization
```typescript
// 例: コンポーネントのインポート
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, ErrorBoundary, ToastProvider } from './components/common';
import { TimelinePage } from './pages/TimelinePage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
```

- 各 components ディレクトリには `index.ts` でバレルエクスポート
- 型定義は `types/index.ts` に集約

## Code Structure Patterns

### React Component Organization
```typescript
// 1. インポート
import { useState, useEffect } from 'react';
import { SomeComponent } from './SomeComponent';
import type { SomeType } from '../types';

// 2. 型定義（ローカル）
interface Props {
  // ...
}

// 3. コンポーネント本体
export function ComponentName({ prop1, prop2 }: Props) {
  // 3.1 State / Hooks
  const [state, setState] = useState();

  // 3.2 Effects
  useEffect(() => { /* ... */ }, []);

  // 3.3 Event Handlers
  const handleClick = () => { /* ... */ };

  // 3.4 Render
  return (
    <div>...</div>
  );
}
```

### Custom Hook Organization
```typescript
// 1. インポート
import { useState, useCallback } from 'react';
import { someService } from '../services/some';

// 2. Hook 本体
export function useSomething() {
  // State
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const fetchData = useCallback(async () => {
    // ...
  }, []);

  // Return
  return { data, loading, error, fetchData };
}
```

### API Service Organization
```typescript
// 1. 型インポート
import type { Book, CreateBookRequest } from '../types';

// 2. API 関数
export async function getBooks(): Promise<Book[]> {
  const response = await fetch('/api/books');
  return response.json();
}

export async function createBook(data: CreateBookRequest): Promise<Book> {
  // ...
}
```

## Code Organization Principles

1. **Single Responsibility**: 1ファイル = 1コンポーネント/1フック/1サービス
2. **Feature-based Grouping**: 機能ごとにコンポーネントをグループ化（BookForm, LogForm, Timeline）
3. **Colocation**: 関連するファイルは近くに配置
4. **Barrel Exports**: `index.ts` でディレクトリ単位のエクスポートを管理

## Module Boundaries

### Frontend / Backend 分離
- `src/` - フロントエンド専用（React, ブラウザ API）
- `functions/` - バックエンド専用（Cloudflare Workers, D1）
- `types/` - 型定義はフロントエンドで定義、API レスポンスとして共有

### コンポーネント階層
```
pages/          → ページ単位のコンポーネント（ルーティング対応）
  ↓ 使用
components/     → 再利用可能な UI コンポーネント
  ↓ 使用
hooks/          → ビジネスロジック・データ取得
  ↓ 使用
services/       → API 通信
```

### 依存方向
- `pages` → `components`, `hooks`
- `components` → `hooks`（一部）
- `hooks` → `services`
- `services` → `types`

## Code Size Guidelines

- **File size**: 300行以下を目安
- **Function size**: 50行以下を目安
- **Component**: 150行以下を目安（大きくなったら分割）
- **Nesting depth**: 最大3レベル

## Documentation Standards

- 複雑なロジックにはインラインコメント
- 型定義で自己文書化（JSDoc は必須ではない）
- README.md でプロジェクト概要とセットアップ手順を記載
