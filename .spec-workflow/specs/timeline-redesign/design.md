# Design Document: Timeline Redesign

## Overview

タイムラインと本一覧をタブで切り替え可能な統合ビューとして再設計する。Figma デザイン（node-id: 11:136）に基づき、縦ライン・ドットによるビジュアルタイムラインと書影表示を実現する。

**主な変更:**
1. `HomePage` コンポーネントでタブナビゲーションを実装
2. `TimelineView` / `BookListView` をタブ内コンテンツとして分離
3. 既存の Timeline コンポーネント群を Figma デザインに合わせてリファクタリング
4. 書影（coverUrl）のタイムライン表示対応

## Steering Document Alignment

### Technical Standards (tech.md)
- **React 19 + TypeScript**: 既存のコンポーネントパターンを継承
- **Tailwind CSS**: Figma デザインの色・サイズを Tailwind クラスで実装
- **カスタムフック**: タブ状態管理用フック `useTabNavigation` を追加

### Project Structure (structure.md)
- `src/components/` 配下に新規コンポーネントを配置
- 既存の `Timeline/` ディレクトリを活用しつつリファクタリング
- `src/hooks/` にタブ管理フックを追加

## Code Reuse Analysis

### Existing Components to Leverage
- **`Timeline.tsx`**: グループ化ロジック（`groupLogsByBook`）を再利用
- **`TimelineGroup.tsx`**: 書影表示を追加してリファクタリング
- **`TimelineItem.tsx`**: Figma デザインに合わせて簡素化
- **`QuoteDisplay.tsx`**: 引用表示はそのまま活用
- **`BookListPage.tsx`**: 本一覧のデータ取得・表示ロジックを抽出
- **`QuickLogModal.tsx`**: ヘッダーの「ログを追加」ボタンから呼び出し

### Integration Points
- **`useTimeline` hook**: タイムラインデータ取得は既存を使用
- **`getBooks` service**: 本一覧データ取得は既存を使用
- **`useKeyboardShortcuts`**: Alt+H/Alt+B をタブ切り替えに対応

## Architecture

```mermaid
graph TD
    subgraph HomePage
        HP[HomePage] --> TN[TabNavigation]
        HP --> TV[TimelineView]
        HP --> BLV[BookListView]
        HP --> HAB[HeaderActionButtons]
    end

    subgraph TimelineView
        TV --> TL[Timeline]
        TL --> TG[TimelineGroup]
        TG --> BC[BookCover]
        TG --> TI[TimelineItem]
        TI --> QD[QuoteDisplay]
    end

    subgraph BookListView
        BLV --> BG[BookGrid]
        BG --> BCard[BookCard]
    end

    subgraph Hooks
        TV --> UT[useTimeline]
        BLV --> UBL[useBookList]
        HP --> UTN[useTabNavigation]
    end

    subgraph Services
        UT --> LS[logs service]
        UBL --> BS[books service]
    end
```

### Modular Design Principles
- **Single File Responsibility**: 各コンポーネントは単一の役割
  - `TabNavigation`: タブ UI の表示のみ
  - `TimelineView`: タイムライン表示のコンテナ
  - `BookListView`: 本一覧表示のコンテナ
- **Component Isolation**: タブ内コンテンツは独立してテスト可能
- **Service Layer Separation**: データ取得は既存 hooks/services を利用

## Components and Interfaces

### HomePage (新規)
- **Purpose:** タブナビゲーションとビューの切り替えを管理するメインページ
- **Location:** `src/pages/HomePage.tsx`
- **Interfaces:**
  ```typescript
  // 内部状態のみ、props なし
  export function HomePage(): JSX.Element
  ```
- **Dependencies:** `TabNavigation`, `TimelineView`, `BookListView`, `HeaderActionButtons`, `useTabNavigation`

### TabNavigation (新規)
- **Purpose:** タイムライン/本一覧のタブ切り替え UI
- **Location:** `src/components/common/TabNavigation.tsx`
- **Interfaces:**
  ```typescript
  interface TabNavigationProps {
    activeTab: 'timeline' | 'books';
    onTabChange: (tab: 'timeline' | 'books') => void;
  }
  ```
- **Dependencies:** なし（純粋な UI コンポーネント）

### HeaderActionButtons (新規)
- **Purpose:** 「ログを追加」「本を追加」ボタン群
- **Location:** `src/components/common/HeaderActionButtons.tsx`
- **Interfaces:**
  ```typescript
  interface HeaderActionButtonsProps {
    onAddLog: () => void;
  }
  ```
- **Dependencies:** `Button`, React Router `Link`

### TimelineView (新規)
- **Purpose:** タイムラインタブのコンテンツコンテナ
- **Location:** `src/components/Timeline/TimelineView.tsx`
- **Interfaces:**
  ```typescript
  export function TimelineView(): JSX.Element
  ```
- **Dependencies:** `Timeline`, `useTimeline`
- **Reuses:** 既存の `useTimeline` hook

### BookListView (新規)
- **Purpose:** 本一覧タブのコンテンツコンテナ
- **Location:** `src/components/BookList/BookListView.tsx`
- **Interfaces:**
  ```typescript
  export function BookListView(): JSX.Element
  ```
- **Dependencies:** `BookGrid`, `useBookList`
- **Reuses:** 既存の `BookListPage` のロジックを抽出

### BookGrid (新規)
- **Purpose:** 本一覧のグリッド表示
- **Location:** `src/components/BookList/BookGrid.tsx`
- **Interfaces:**
  ```typescript
  interface BookGridProps {
    books: BookWithLogCount[];
    onDelete?: (bookId: string) => Promise<void>;
  }
  ```
- **Dependencies:** `BookCard`

### BookCover (新規)
- **Purpose:** 書影のサムネイル表示
- **Location:** `src/components/common/BookCover.tsx`
- **Interfaces:**
  ```typescript
  interface BookCoverProps {
    coverUrl: string | null;
    title: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  ```
- **Dependencies:** なし

### TimelineGroup (リファクタリング)
- **Purpose:** 本ごとのロググループ表示（書影追加）
- **Location:** `src/components/Timeline/TimelineGroup.tsx`
- **Changes:**
  - 書影サムネイル（`BookCover`）を追加
  - 縦ライン・ドットのスタイル調整
- **Interfaces:**
  ```typescript
  interface TimelineGroupProps {
    book: Book;
    logs: LogWithBook[];
    isLastGroup?: boolean;
  }
  ```
- **Dependencies:** `BookCover`, `TimelineItem`

### TimelineItem (リファクタリング)
- **Purpose:** 個別ログエントリの表示（Figma デザインに合わせて簡素化）
- **Location:** `src/components/Timeline/TimelineItem.tsx`
- **Changes:**
  - カード枠を削除、シンプルな表示に変更
  - ドットスタイルを Figma に合わせて調整
  - 削除ボタンのみ残す（編集機能は本詳細ページで）
- **Interfaces:**
  ```typescript
  interface TimelineItemProps {
    log: Log;
    isLast?: boolean;
    onDelete?: (logId: string) => Promise<void>;
    isDeleting?: boolean;
  }
  ```

### useTabNavigation (新規フック)
- **Purpose:** タブ状態管理とキーボードショートカット連携
- **Location:** `src/hooks/useTabNavigation.ts`
- **Interfaces:**
  ```typescript
  type TabType = 'timeline' | 'books';

  interface UseTabNavigationReturn {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
  }

  export function useTabNavigation(defaultTab?: TabType): UseTabNavigationReturn
  ```
- **Dependencies:** React hooks

### useBookList (新規フック)
- **Purpose:** 本一覧のデータ取得・削除処理
- **Location:** `src/hooks/useBookList.ts`
- **Interfaces:**
  ```typescript
  interface UseBookListReturn {
    books: BookWithLogCount[];
    isLoading: boolean;
    error: string | null;
    deleteBook: (bookId: string) => Promise<void>;
    refetch: () => Promise<void>;
  }

  export function useBookList(): UseBookListReturn
  ```
- **Dependencies:** `books` service
- **Reuses:** `BookListPage` のロジックを抽出

## Data Models

既存の型を使用。新規の型定義は不要。

### 使用する既存型
```typescript
// Book (types/index.ts)
interface Book {
  id: string;
  title: string;
  author: string | null;
  coverUrl: string | null;  // 書影表示に使用
  // ...
}

// LogWithBook (types/index.ts)
interface LogWithBook extends Log {
  book: Book;
}

// BookWithLogCount (types/index.ts)
interface BookWithLogCount extends Book {
  logCount: number;
}
```

### 新規型（ローカル定義）
```typescript
// TabType (useTabNavigation.ts 内)
type TabType = 'timeline' | 'books';
```

## UI Design Details

### カラーパレット（Figma より）
| 用途 | 色 | Tailwind |
|------|-----|----------|
| 背景 | #FFFFFF | `bg-white` |
| タブ背景（非選択） | #ECECF0 | `bg-gray-100` |
| テキスト（メイン） | #0A0A0A | `text-gray-900` |
| テキスト（サブ） | #717182 | `text-gray-500` |
| ドット（本） | #030213 | `bg-gray-900` |
| ドット（ログ） | #717182 | `bg-gray-500` |
| 縦ライン | rgba(0,0,0,0.1) | `bg-gray-200` |
| ボタン（プライマリ） | #030213 | `bg-gray-900` |

### サイズ
| 要素 | サイズ |
|------|--------|
| タブ高さ | 36px |
| タブ角丸 | 14px |
| ドット（本） | 16px |
| ドット（ログ） | 16px |
| 縦ライン幅 | 2px |
| 書影サムネイル | 48x64px |
| 書影角丸 | 4px |

## Error Handling

### Error Scenarios
1. **タイムライン読み込み失敗**
   - **Handling:** `useTimeline` の既存エラーハンドリングを継続
   - **User Impact:** エラーメッセージと再読み込みボタンを表示

2. **本一覧読み込み失敗**
   - **Handling:** `useBookList` でエラー状態を管理
   - **User Impact:** エラーメッセージと再読み込みボタンを表示

3. **書影画像の読み込み失敗**
   - **Handling:** `BookCover` コンポーネントで `onError` をハンドル
   - **User Impact:** デフォルトの本アイコンにフォールバック

## Testing Strategy

### Unit Testing
- `TabNavigation`: タブクリックで正しいコールバックが呼ばれるか
- `BookCover`: coverUrl の有無でレンダリングが切り替わるか
- `useTabNavigation`: 初期値とタブ切り替えの状態管理
- `useBookList`: データ取得・削除・エラーハンドリング

### Integration Testing
- `HomePage`: タブ切り替えで正しいビューが表示されるか
- `TimelineView`: データフェッチからレンダリングまでの流れ
- `BookListView`: データフェッチからレンダリングまでの流れ

### End-to-End Testing
- タイムラインタブでログが正しく表示される
- 本一覧タブで本が正しく表示される
- タブ切り替えがスムーズに動作する
- 「ログを追加」ボタンでモーダルが開く
- 「本を追加」ボタンで本登録ページに遷移する
- キーボードショートカット（Alt+H, Alt+B）が動作する

## Migration Notes

### ルーティング変更
- `/` → `HomePage`（タイムライン + 本一覧の統合ビュー）
- `/books` → 削除（`HomePage` の本一覧タブに統合）
- `/books/new`, `/books/:id` → 変更なし

### 既存ページの扱い
- `TimelinePage.tsx` → 削除または `TimelineView` に統合
- `BookListPage.tsx` → ロジックを `useBookList` と `BookListView` に分離後、削除検討

### キーボードショートカット
- `Alt+H`: タイムラインタブをアクティブに
- `Alt+B`: 本一覧タブをアクティブに
- `useKeyboardShortcuts` を更新して `useTabNavigation` と連携
