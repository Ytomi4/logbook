# Design Document

## Overview

本の検索体験を向上させるため、NDL API を活用したページネーション機能と、クライアントサイドでの検索結果ソート機能を実装する。既存の `useBookSearch` フックと `NdlSearchResults` コンポーネントを拡張し、最小限の変更で機能を追加する。

## Steering Document Alignment

### Technical Standards (tech.md)
- **React 19 + TypeScript 5.9**: 既存のフック・コンポーネントパターンを継続
- **Zod バリデーション**: 新しいパラメータも Zod スキーマで検証
- **Hono API**: 既存の NDL 検索エンドポイントを拡張

### Project Structure (structure.md)
- **hooks/**: `useBookSearch.ts` を拡張
- **lib/**: 新規 `search-relevance.ts` でソートロジックを分離
- **services/**: `ndl.ts` に `idx` パラメータを追加
- **components/BookForm/**: `NdlSearchResults.tsx` を拡張

## Code Reuse Analysis

### Existing Components to Leverage
- **useBookSearch**: 検索状態管理、デバウンス、AbortController による中断処理を再利用
- **NdlSearchResults**: 検索結果の表示コンポーネントを拡張
- **searchNdl**: NDL API クライアントを拡張
- **Button**: 「もっと見る」ボタンに既存の Button コンポーネントを使用
- **Loading**: ローディング状態の表示に既存パターンを使用

### Integration Points
- **NDL OpenSearch API**: `idx` パラメータを追加してページネーション対応
- **validation.ts**: `ndlSearchSchema` を拡張して `idx` パラメータを追加

## Architecture

```mermaid
graph TD
    subgraph Frontend
        UI[NdlSearchResults]
        Hook[useBookSearch]
        Sort[search-relevance.ts]
        Service[ndl.ts]
    end

    subgraph Backend
        API[/api/ndl/search]
    end

    subgraph External
        NDL[NDL OpenSearch API]
    end

    UI -->|onLoadMore| Hook
    Hook -->|searchNdl| Service
    Hook -->|sortByRelevance| Sort
    Service -->|fetch| API
    API -->|fetch| NDL
    NDL -->|XML response| API
    API -->|JSON| Service
    Service -->|NdlSearchResults| Hook
    Sort -->|sorted results| Hook
    Hook -->|results, hasMore, loadMore| UI
```

### Modular Design Principles
- **Single File Responsibility**: ソートロジックは `search-relevance.ts` に分離
- **Component Isolation**: 「もっと見る」ボタンは NdlSearchResults 内に追加（小さな変更）
- **Service Layer Separation**: API 呼び出しは `ndl.ts`、状態管理は `useBookSearch.ts`
- **Utility Modularity**: 一致度計算は純粋関数として実装

## Components and Interfaces

### 1. search-relevance.ts（新規）
- **Purpose:** 検索結果のタイトル・著者名一致度を計算し、ソートする
- **Interfaces:**
  ```typescript
  function calculateRelevanceScore(book: NdlBook, query: string): number
  function sortByRelevance(books: NdlBook[], query: string): NdlBook[]
  ```
- **Dependencies:** `types/index.ts`（NdlBook 型）
- **Reuses:** なし（新規ユーティリティ）

### 2. useBookSearch（拡張）
- **Purpose:** 検索状態管理、ページネーション、ソート処理を統括
- **Interfaces（追加）:**
  ```typescript
  interface UseBookSearchResult {
    // 既存
    query: string;
    setQuery: (query: string) => void;
    results: NdlBook[];
    isLoading: boolean;
    error: string | null;
    search: (searchQuery?: string) => Promise<void>;
    clear: () => void;
    // 新規追加
    hasMore: boolean;
    isLoadingMore: boolean;
    loadMore: () => Promise<void>;
  }
  ```
- **Dependencies:** `services/ndl.ts`, `lib/search-relevance.ts`
- **Reuses:** 既存のデバウンス、AbortController パターン

### 3. NdlSearchResults（拡張）
- **Purpose:** 検索結果表示と「もっと見る」ボタン
- **Interfaces（変更）:**
  ```typescript
  interface NdlSearchResultsProps {
    results: NdlBook[];
    onSelect: (book: NdlBook) => void;
    isLoading?: boolean;
    // 新規追加
    hasMore?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
  }
  ```
- **Dependencies:** `common/Button`, `common/BookCover`
- **Reuses:** 既存の結果表示レイアウト

### 4. ndl.ts（拡張）
- **Purpose:** NDL API クライアント
- **Interfaces（変更）:**
  ```typescript
  interface NdlSearchParams {
    title?: string;
    author?: string;
    isbn?: string;
    cnt?: number;
    idx?: number;  // 新規追加
  }
  ```
- **Dependencies:** `services/api.ts`
- **Reuses:** 既存の apiClient

### 5. functions/api/ndl/search.ts（拡張）
- **Purpose:** NDL API プロキシエンドポイント
- **Interfaces（変更）:** `idx` パラメータを追加
- **Dependencies:** `lib/validation.ts`
- **Reuses:** 既存の XML パース処理

## Data Models

### NdlBook（既存・変更なし）
```typescript
interface NdlBook {
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  pubDate: string | null;
  ndlBibId: string;
}
```

### NdlSearchResults（変更）
```typescript
interface NdlSearchResults {
  totalResults: number;  // 既存だが、実際の総件数を返すよう修正
  items: NdlBook[];
}
```

### RelevanceScore（内部用・新規）
```typescript
interface BookWithScore {
  book: NdlBook;
  score: number;
}
```

## Error Handling

### Error Scenarios

1. **NDL API タイムアウト**
   - **Handling:** 既存のエラーハンドリングを継続（「検索に失敗しました」）
   - **User Impact:** エラーメッセージを表示、再検索可能

2. **500件制限到達**
   - **Handling:** `hasMore` を `false` に設定、ボタン非表示
   - **User Impact:** 「もっと見る」ボタンが消える（制限に達したことは明示しない）

3. **追加読み込み中のエラー**
   - **Handling:** `isLoadingMore` を `false` に戻し、エラーを表示
   - **User Impact:** 既存の結果は保持、再度「もっと見る」を押せる

4. **検索クエリ変更中の追加読み込み**
   - **Handling:** 追加読み込みをキャンセルし、新しい検索を優先
   - **User Impact:** 新しい検索結果のみ表示

## Testing Strategy

### Unit Testing

**search-relevance.ts**
- 完全一致、前方一致、部分一致の各ケースでスコア計算をテスト
- ソート結果が期待通りの順序になるかテスト
- 大文字小文字を区別しない一致をテスト
- 著者名による副次ソートをテスト

**useBookSearch（追加テスト）**
- `loadMore` が正しく `idx` を増加させるかテスト
- 検索クエリ変更時に `idx` がリセットされるかテスト
- `hasMore` が正しく計算されるかテスト

### Integration Testing

**BookRegistrationPage**
- 検索 → 結果表示 → もっと見る → 追加結果表示の流れをテスト
- ソート結果の順序が妥当かテスト（完全一致が上位）

### End-to-End Testing

- 実際の NDL API を使用して、ページネーションが動作するか確認
- 500件制限に達した場合の挙動を確認

## Implementation Notes

### 取得件数の設計
- **初回検索**: `cnt=30` で30件取得
- **追加読み込み**: `idx` を30ずつ増加、`cnt=30` で取得
- **最大件数**: NDL API の制限により 500件まで

### ソートアルゴリズム
```typescript
function calculateRelevanceScore(book: NdlBook, query: string): number {
  const title = book.title.toLowerCase();
  const author = (book.author ?? '').toLowerCase();
  const q = query.toLowerCase();

  // タイトル一致度（主）
  let score = 0;
  if (title === q) {
    score = 100;  // 完全一致
  } else if (title.startsWith(q)) {
    score = 80;   // 前方一致
  } else if (title.includes(q)) {
    score = 60;   // 部分一致
  } else {
    score = 40;   // その他（著者名のみ一致など）
  }

  // 著者名一致度（副次）
  if (author.includes(q)) {
    score += 10;
  }

  return score;
}
```

### ndlSearchSchema の更新
```typescript
export const ndlSearchSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  cnt: z.coerce.number().int().min(1).max(50).default(30),  // default を 30 に変更
  idx: z.coerce.number().int().min(1).default(1),  // 新規追加
});
```
