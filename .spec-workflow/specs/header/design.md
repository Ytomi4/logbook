# Design Document: Header

## Overview

ヘッダーはアプリケーション全体で共通して使用されるナビゲーションコンポーネントである。左側にブランドロゴ、右側に認証状態に応じたユーザー情報を表示する。Layout コンポーネント内に実装されており、User Profile Setup 機能と連携してハンドルネーム・アバター画像を表示する。

**Note**: 本設計は User Profile Setup（`user-profile-setup/design.md`）の設計方針に準拠する。

## Steering Document Alignment

### Technical Standards (tech.md)

- **フレームワーク**: React 19 + TypeScript 5.9
- **スタイリング**: Tailwind CSS 4（ユーティリティファースト）
- **ルーティング**: React Router DOM 7（`<Link>` コンポーネント使用）
- **状態管理**: React hooks（useState, useEffect）
- **認証**: useAuth カスタムフック経由で認証状態を取得

### Project Structure (structure.md)

- **配置場所**: `src/components/common/` ディレクトリ
- **命名規則**: PascalCase.tsx（Layout.tsx, UserMenu.tsx, UserInfo.tsx）
- **バレルエクスポート**: `src/components/common/index.ts` で一括エクスポート
- **コンポーネントサイズ**: 150行以下を目安

## Code Reuse Analysis

### Existing Components to Leverage

| コンポーネント | 場所 | 状態 |
|---------------|------|------|
| **Layout** | `src/components/common/Layout.tsx` | 実装済み（User Profile Setup で対応） |
| **UserMenu** | `src/components/common/UserMenu.tsx` | 実装済み（@username 形式、メールなし） |
| **UserInfo** | `src/components/common/UserInfo.tsx` | 実装済み（アバター + ハンドルネーム） |
| **Button** | `src/components/common/Button.tsx` | 「はじめる」ボタンに使用 |
| **useAuth** | `src/hooks/useAuth.ts` | 実装済み（username, avatarUrl 対応） |

### Integration Points

- **React Router**: ロゴクリックで `/` へ、「はじめる」ボタンで `/enter` へ遷移
- **認証システム**: useAuth フック経由で user, isAuthenticated, isLoading, signOut を取得

## Architecture

```mermaid
graph TD
    subgraph Layout.tsx
        Header[Header Section]
        Logo[Brand Logo]
        AuthArea[Auth Area]
    end

    Header --> Logo
    Header --> AuthArea

    AuthArea --> |isLoading| Skeleton[Skeleton]
    AuthArea --> |isAuthenticated| UserMenu
    AuthArea --> |!isAuthenticated| StartButton[はじめるボタン]

    UserMenu --> UserInfo
    UserMenu --> Dropdown[Dropdown Menu]

    Dropdown --> Username[@username]
    Dropdown --> Settings[アカウント設定]
    Dropdown --> Logout[ログアウト]
```

## Components and Interfaces

### Layout（ヘッダー部分）

- **Purpose**: アプリケーション全体のレイアウトとヘッダーを提供
- **Interfaces**:
  ```typescript
  interface LayoutProps {
    children: ReactNode;
  }
  ```
- **Dependencies**: useAuth, UserMenu, Link (react-router-dom)
- **Reuses**: 既存の Layout.tsx を改修

### UserMenu

- **Purpose**: ログインユーザーのドロップダウンメニューを表示
- **Interfaces**:
  ```typescript
  interface User {
    username: string | null;   // ハンドルネーム
    avatarUrl: string | null;  // カスタムアバター
    image: string | null;      // Google 画像（フォールバック用）
  }

  interface UserMenuProps {
    user: User;
    onLogout: () => void;
  }
  ```
- **Dependencies**: UserInfo, useState, useRef, useEffect, Link
- **Status**: 実装済み（アバターフォールバックの修正が必要）

### UserInfo

- **Purpose**: アバター画像とユーザー名を表示
- **Interfaces**:
  ```typescript
  interface UserInfoProps {
    name?: string;
    avatarUrl?: string;
  }
  ```
- **Dependencies**: なし
- **Reuses**: 既存コンポーネントをそのまま利用

### 「はじめる」ボタン（Layout 内）

- **Purpose**: 未ログインユーザー向けのエントリーポイント
- **Implementation**: `<Link to="/enter"><Button>はじめる</Button></Link>`
- **Dependencies**: Link (react-router-dom), Button
- **Status**: 実装済み（User Profile Setup で対応）

## Data Models

### User（ヘッダー表示用）

```typescript
interface HeaderUser {
  username: string | null;   // ハンドルネーム（@username形式で表示）
  avatarUrl: string | null;  // カスタムアバター画像URL
  image: string | null;      // Google 画像（avatarUrl のフォールバック用）
}

// Note: email, name（Google名）はヘッダーでは表示しない
// image（Google画像）はアバターのフォールバックとしてのみ使用
```

### アバター表示のフォールバック戦略

アバター画像は以下の優先順位で表示する（空表示を避ける）:

```typescript
// 表示用アバターURL の決定ロジック
const displayAvatarUrl = user.avatarUrl ?? user.image ?? undefined;
```

| 優先度 | ソース | 説明 |
|--------|--------|------|
| 1 | `avatarUrl` | カスタムアバター（ユーザーがアップロード） |
| 2 | `image` | Google 画像（認証時に自動取得） |
| 3 | イニシャル | 上記がない場合は名前の頭文字を表示 |

**DB スキーマとの整合性**:
- `users.avatar_url`: カスタムアバター（NULL 許容）
- `users.image`: Google 画像（認証時に自動保存）
- 両方のカラムが存在するため、フォールバック戦略を実装可能

### AuthState（useAuth の戻り値）

```typescript
interface UseAuthResult {
  user: HeaderUser | null;   // ヘッダー表示に必要な情報のみ
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  clearError: () => void;
}
```

## UI Design

### ヘッダーレイアウト

```
┌────────────────────────────────────────────────────────┐
│  [📖] Logbook                          [ユーザー情報]  │
└────────────────────────────────────────────────────────┘
```

### 認証状態別の右側表示

| 状態 | 表示内容 |
|-----|---------|
| ロード中 | グレーの円形スケルトン（w-8 h-8） |
| 未ログイン | 「はじめる」ボタン → /enter へ遷移 |
| ログイン済 | アバター + 名前 + ドロップダウン矢印 |

### ドロップダウンメニュー構成

```
┌──────────────────┐
│ @username        │  ← ハンドルネーム（太字）
├──────────────────┤
│ アカウント設定    │  → /settings へ遷移
├──────────────────┤
│ ログアウト       │  → signOut() 実行
└──────────────────┘
```

**Note**: メールアドレスは個人情報保護のため表示しない

## Current Implementation

User Profile Setup 機能の実装時に、ヘッダーの実装も完了している。

### Layout.tsx（実装済み）

```typescript
// 未ログイン時: 「はじめる」ボタン → /enter へ遷移
<Link to="/enter">
  <Button>はじめる</Button>
</Link>

// ログイン時: UserMenu を表示
<UserMenu user={user} onLogout={signOut} />
```

### UserMenu.tsx（要修正）

```typescript
// 現在の実装（問題あり）: avatarUrl のみ使用
<UserInfo name={user.username ?? 'ゲスト'} avatarUrl={user.avatarUrl ?? undefined} />

// 修正後: Google 画像へのフォールバックを追加
<UserInfo
  name={user.username ?? 'ゲスト'}
  avatarUrl={user.avatarUrl ?? user.image ?? undefined}
/>

// ドロップダウン: @username のみ表示（メールなし）
<div className="px-4 py-2 border-b border-gray-100">
  <p className="text-sm font-medium text-gray-900 truncate">
    @{user.username ?? 'ゲスト'}
  </p>
</div>
<Link to="/settings">アカウント設定</Link>
<button onClick={onLogout}>ログアウト</button>
```

**修正が必要な理由**: 現在の実装では `avatarUrl` が null の場合にイニシャル表示になるが、Google 画像（`image`）が存在する場合はそれを表示すべき。

### LoginButton.tsx

- `/enter` ページで Google ログインボタンとして使用
- ヘッダーでは使用しない（「はじめる」ボタンは Button コンポーネント）

## Error Handling

### Error Scenarios

1. **認証状態取得失敗**
   - **Handling**: useAuth 内で error を null に設定し、isAuthenticated = false として扱う
   - **User Impact**: 未ログイン状態として「はじめる」ボタンが表示される

2. **ログアウト失敗**
   - **Handling**: useAuth 内でエラーをキャッチし、error state に設定
   - **User Impact**: コンソールにエラーログ出力、UI は変化なし（現状維持）

3. **アバター画像読み込み失敗**
   - **Handling**: UserInfo コンポーネントでフォールバック（イニシャル表示）
   - **User Impact**: 名前の頭文字が表示される

## Accessibility

### キーボードナビゲーション

- **Tab**: ロゴ → ユーザーメニューボタン → ドロップダウン項目の順に移動
- **Enter/Space**: ボタンのアクティベート、ドロップダウンの開閉
- **Escape**: ドロップダウンを閉じる

### ARIA 属性

```typescript
// UserMenu ボタン
<button
  aria-expanded={isOpen}
  aria-haspopup="true"
  aria-controls="user-menu-dropdown"
  aria-label="ユーザーメニュー"
>

// ドロップダウン
<div
  id="user-menu-dropdown"
  role="menu"
  aria-orientation="vertical"
>
  <button role="menuitem">...</button>
  <Link role="menuitem">...</Link>
</div>
```

### フォーカス管理

- ドロップダウン開閉時にフォーカスを適切に管理（既存実装を維持）

## Testing Strategy

### Unit Testing

- **UserMenu**: ドロップダウンの開閉、外側クリックで閉じる、Escape キーで閉じる
- **UserInfo**: アバター表示、フォールバック表示
- **Layout ヘッダー部分**: 認証状態に応じた表示切り替え

### Integration Testing

- ロゴクリックで `/` へ遷移
- 「はじめる」ボタンクリックで `/enter` へ遷移
- 「アカウント設定」クリックで `/settings` へ遷移
- ログアウトボタンで signOut が呼ばれる

### Storybook

- **UserMenu Stories**: 開閉状態、ユーザー情報のバリエーション
- **Layout Stories**: 認証状態別の表示（ロード中、未ログイン、ログイン済）
