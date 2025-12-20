# Requirements Document

## Introduction

Storybook をプロジェクトに導入し、UI コンポーネントの開発・テスト・ドキュメント化を効率化する。Storybook は React コンポーネントを独立した環境で開発・プレビューできるツールであり、コンポーネントカタログとして機能する。本機能により、デザインシステムの可視化と開発者体験の向上を実現する。

## Alignment with Product Vision

product.md の「シンプルさ優先」「高速な操作」の原則に沿い、Storybook 導入により以下を実現する：

- **デザインのブラッシュアップ（Future Vision）**: UI コンポーネントを一覧で確認でき、一貫性のあるデザインを維持しやすくなる
- **開発効率向上**: コンポーネントを独立して開発・テストでき、ページ全体を構築せずに UI を検証できる
- **ドキュメント化**: 各コンポーネントの Props やバリエーションを自動的にドキュメント化

## Requirements

### Requirement 1: Storybook 環境構築

**User Story:** As a 開発者, I want Storybook を起動できる環境を構築する, so that コンポーネントを独立して開発・確認できる

#### Acceptance Criteria

1. WHEN `npm run storybook` を実行 THEN Storybook 開発サーバーが起動 SHALL ブラウザでコンポーネントカタログを表示できる
2. IF Vite と TypeScript が設定されている THEN Storybook SHALL Vite ベースのビルダーを使用し、既存の設定と互換性を持つ
3. WHEN Tailwind CSS クラスを使用したコンポーネント THEN Storybook SHALL 正しくスタイルを適用して表示する
4. WHEN `npm run build-storybook` を実行 THEN 静的サイトとして Storybook SHALL ビルドできる

### Requirement 2: 共通コンポーネントの Stories 作成

**User Story:** As a 開発者, I want 共通コンポーネント（common/）の Stories を作成する, so that 各コンポーネントのバリエーションを一覧で確認できる

#### Acceptance Criteria

1. WHEN Storybook を開く THEN Button, Input, Textarea, Card, Modal, Toast, Loading コンポーネント SHALL 各々の Story として表示される
2. IF コンポーネントに Props バリエーションがある（例: Button の variant, size）THEN 各バリエーション SHALL 個別の Story として確認できる
3. WHEN コンポーネントの Story を選択 THEN Controls パネル SHALL Props を動的に変更してプレビューできる
4. WHEN コンポーネントの Story を選択 THEN Docs ページ SHALL Props の型情報と説明を自動生成して表示する

### Requirement 3: 機能コンポーネントの Stories 作成

**User Story:** As a 開発者, I want 機能別コンポーネント（BookForm, LogForm, Timeline, BookList）の Stories を作成する, so that 機能単位での UI 確認ができる

#### Acceptance Criteria

1. WHEN Storybook を開く THEN 以下のコンポーネント群 SHALL カテゴリ分けされて表示される:
   - BookForm: BookForm, BookSearchInput, NdlSearchResults
   - LogForm: LogForm, LogTypeSelector, QuickAddLogModal
   - Timeline: Timeline, TimelineItem, TimelineGroup, TimelineEmpty, QuoteDisplay
   - BookList: BookGrid, BookListView
2. IF コンポーネントがモックデータを必要とする THEN Stories SHALL 適切なモックデータを使用して表示する
3. WHEN コンポーネントが外部 API に依存する THEN Stories SHALL モックハンドラーを使用して API 呼び出しをシミュレートする

### Requirement 4: 開発ワークフローへの統合

**User Story:** As a 開発者, I want Storybook を既存の開発ワークフローに統合する, so that 日常的な開発作業で活用できる

#### Acceptance Criteria

1. WHEN 新しいコンポーネントを作成 THEN 開発者 SHALL 対応する Story ファイル（*.stories.tsx）を作成するガイドラインに従う
2. IF ESLint が設定されている THEN Storybook 関連ファイル SHALL 既存の Lint ルールに従う
3. WHEN package.json を確認 THEN `storybook` と `build-storybook` スクリプト SHALL 登録されている

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: 各 Story ファイルは1つのコンポーネントに対応する
- **Modular Design**: Stories は `*.stories.tsx` として対応するコンポーネントの隣に配置（Colocation パターン）
- **Dependency Management**: Storybook 関連の依存は devDependencies に追加
- **Clear Interfaces**: Stories は CSF 3.0（Component Story Format）に従う

### Performance
- Storybook 開発サーバーは 5 秒以内に起動すること
- Hot Module Replacement（HMR）が有効で、変更が即時反映されること
- 本番ビルドの既存のパフォーマンス要件（ページロード 1 秒以内）に影響を与えないこと

### Security
- Storybook は開発環境専用とし、本番デプロイには含めない
- devDependencies として追加し、本番バンドルサイズに影響を与えない

### Reliability
- 既存のテスト（Vitest）と共存できること
- 既存のビルド（`npm run build`）に影響を与えないこと

### Usability
- 開発者が直感的に Storybook を使用できること
- コンポーネントがカテゴリごとに整理されていること
- 各コンポーネントの Props が Controls パネルで操作できること
