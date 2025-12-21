# Design Document: Homepage Landing

## Overview

ホームページ（`/`）は Logbook サービスのランディングページとして、サービスの価値を簡潔に伝え、ユーザーを利用開始へと導く。シンプルで視覚的に魅力的なデザインを目指し、ファーストビューで完結する構成とする。

## Steering Document Alignment

### Technical Standards (tech.md)

- **フレームワーク**: React 19 + TypeScript 5.9
- **スタイリング**: Tailwind CSS 4（ユーティリティファースト）
- **ルーティング**: React Router DOM 7（`<Link>` コンポーネント使用）
- **認証**: useAuth フック経由で認証状態を取得

### Project Structure (structure.md)

- **配置場所**: `src/pages/LandingPage.tsx`
- **コンポーネント**: `src/components/Landing/` に分離
- **命名規則**: PascalCase.tsx
- **バレルエクスポート**: `src/components/Landing/index.ts`

## Code Reuse Analysis

### Existing Components to Leverage

| コンポーネント | 場所 | 使用方法 |
|---------------|------|---------|
| **Layout** | `src/components/common/Layout.tsx` | ヘッダー付きレイアウト |
| **Button** | `src/components/common/Button.tsx` | CTAボタン |
| **useAuth** | `src/hooks/useAuth.ts` | 認証状態の取得 |

### New Components

| コンポーネント | 場所 | 目的 |
|---------------|------|------|
| **LandingPage** | `src/pages/LandingPage.tsx` | メインページコンポーネント |
| **HeroSection** | `src/components/Landing/HeroSection.tsx` | キャッチコピーとCTA |
| **FeatureSection** | `src/components/Landing/FeatureSection.tsx` | 特徴一覧 |
| **FeatureCard** | `src/components/Landing/FeatureCard.tsx` | 個別の特徴カード |

## Architecture

```mermaid
graph TD
    subgraph LandingPage
        Layout --> Content[Page Content]
        Content --> Hero[HeroSection]
        Content --> Features[FeatureSection]
    end

    Hero --> |未ログイン| LoginButton[はじめるボタン]
    Hero --> |ログイン済| TimelineButton[タイムラインを見る]

    LoginButton --> |click| EnterPage[/enter]
    TimelineButton --> |click| UserTimeline[/{username}]

    Features --> Feature1[FeatureCard 1]
    Features --> Feature2[FeatureCard 2]
    Features --> Feature3[FeatureCard 3]
```

## Components and Interfaces

### 1. LandingPage (`src/pages/LandingPage.tsx`)

- **Purpose**: ホームページのメインコンポーネント
- **Interfaces**:
  ```typescript
  // Props なし（ルートコンポーネント）
  export function LandingPage(): JSX.Element
  ```
- **Dependencies**: Layout, HeroSection, FeatureSection, useAuth
- **Behavior**:
  - useAuth から認証状態を取得
  - HeroSection と FeatureSection を組み合わせて表示

### 2. HeroSection (`src/components/Landing/HeroSection.tsx`)

- **Purpose**: キャッチコピーとCTAボタンを表示
- **Interfaces**:
  ```typescript
  interface HeroSectionProps {
    isAuthenticated: boolean;
    username?: string;
  }
  ```
- **Dependencies**: Button, Link
- **Behavior**:
  - キャッチコピーを表示:
    - 「何を読んだか」だけでなく、「どう読んだか」を残せるアプリです
    - 印象に残った単語、後から振り返りたい一文
    - 読んでいる途中でも「ログ」という形で、感想や引用を残せます
  - 認証状態に応じてCTAボタンを切り替え
    - 未ログイン: 「はじめる」→ `/enter`
    - ログイン済: 「タイムラインを見る」→ `/{username}`

### 3. FeatureSection (`src/components/Landing/FeatureSection.tsx`)

- **Purpose**: サービスの主要な特徴を表示
- **Interfaces**:
  ```typescript
  // Props なし（静的コンテンツ）
  export function FeatureSection(): JSX.Element
  ```
- **Dependencies**: FeatureCard
- **Behavior**:
  - 3つの FeatureCard を横並び（デスクトップ）または縦並び（モバイル）で表示

### 4. FeatureCard (`src/components/Landing/FeatureCard.tsx`)

- **Purpose**: 個別の特徴をカード形式で表示
- **Interfaces**:
  ```typescript
  interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  ```
- **Dependencies**: なし
- **Behavior**:
  - アイコン、タイトル、説明文を表示
  - ホバー時に軽いアニメーション効果

## UI Design

### ページレイアウト

```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
│  [📖 Logbook]                    [はじめる/Menu]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ┌─────────────────────┐               │
│              │                     │               │
│              │ 「何を読んだか」だけで│               │
│              │ なく「どう読んだか」  │               │
│              │ を残せるアプリです   │               │
│              │                     │               │
│              │   [ はじめる ]       │               │
│              │                     │               │
│              └─────────────────────┘               │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ 🕐          │ │ 📝          │ │ 📚          │  │
│  │ タイムライン │ │ ログの      │ │ 簡単な      │  │
│  │ 形式        │ │ 記録        │ │ 登録        │  │
│  │             │ │             │ │             │  │
│  │ 読んでいる  │ │ 印象に残った │ │ 国会図書館  │  │
│  │ 途中の記録も │ │ 単語、一文を │ │ 検索で書影  │  │
│  │ 振り返れます │ │ 簡単に残せる │ │ 付きの登録  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### モバイルレイアウト

```
┌───────────────────────┐
│       Header          │
├───────────────────────┤
│                       │
│ 「何を読んだか」だけ  │
│ でなく「どう読んだか」│
│ を残せるアプリです    │
│                       │
│    [ はじめる ]       │
│                       │
├───────────────────────┤
│ ┌───────────────────┐ │
│ │ 🕐 タイムライン形式 │ │
│ │ 読んでいる途中の...│ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 📝 ログの記録     │ │
│ │ 印象に残った単語...│ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 📚 簡単な登録     │ │
│ │ 国会図書館検索... │ │
│ └───────────────────┘ │
│                       │
└───────────────────────┘
```

### スタイリング

| 要素 | スタイル |
|------|---------|
| **キャッチコピー（主）** | text-4xl md:text-5xl font-bold text-gray-900 |
| **キャッチコピー（副）** | text-xl md:text-2xl text-gray-600 mt-4 |
| **CTAボタン** | bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg |
| **特徴カード** | bg-white rounded-xl p-6 shadow-sm |
| **特徴アイコン** | w-12 h-12 text-blue-600 |
| **特徴タイトル** | text-lg font-semibold text-gray-900 |
| **特徴説明** | text-sm text-gray-600 |
| **背景** | bg-gray-50（全体）または bg-gradient-to-b from-white to-gray-50 |

## Routing

### ルーター設定の更新

```typescript
// src/App.tsx
<Route path="/" element={<LandingPage />} />
```

### 既存ルートとの整合性

- `/` - LandingPage（新規）
- `/enter` - ログインページ（既存）
- `/:username` - ユーザータイムライン（既存）

**Note**: `/:username` は動的パラメータのため、`/` との競合はない。

## Error Handling

### Error Scenarios

1. **認証状態取得失敗**
   - **Handling**: 未ログイン状態として表示
   - **User Impact**: 「はじめる」ボタンが表示される

2. **ユーザー名未設定（ログイン済みだが username が null）**
   - **Handling**: セットアップページへの誘導またはホームボタンを表示
   - **User Impact**: タイムラインボタンは `/home` または `/setup` へ遷移

## Accessibility

### キーボードナビゲーション

- Tab キーでCTAボタンにフォーカス可能
- Enter キーでボタンをアクティベート

### スクリーンリーダー対応

- 適切な見出しレベル（h1 for キャッチコピー）
- 画像には alt テキストを設定
- ボタンには明確なラベル

### カラーコントラスト

- テキストと背景のコントラスト比は WCAG AA 準拠
- CTAボタンは十分なコントラストを確保

## Testing Strategy

### Unit Testing

- HeroSection: 認証状態に応じたボタン表示
- FeatureCard: Props の正しい表示

### Integration Testing

- LandingPage: 認証状態によるCTA遷移先の確認
- ルーティング: `/` へのアクセスで LandingPage が表示

### Storybook

- **HeroSection Stories**: 未ログイン/ログイン済み
- **FeatureCard Stories**: 各特徴のバリエーション
- **LandingPage Stories**: 全体レイアウト
