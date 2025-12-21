# Requirements Document: Header

## Introduction

ヘッダーはアプリケーション全体のナビゲーションとユーザー認証状態の表示を担うコア UI コンポーネントである。全ページで共通して使用され、ブランディング、ナビゲーション、ユーザーアクションの統一されたアクセスポイントを提供する。

## Alignment with Product Vision

ヘッダーは Logbook アプリケーションの一貫した UX を実現する基盤コンポーネントとして、以下の目標をサポートする：
- シンプルで直感的なナビゲーション体験
- 認証状態に応じた適切な UI 表示
- 主要アクションへの素早いアクセス

## Requirements

### Requirement 1: ブランドロゴとホームナビゲーション

**User Story:** ユーザーとして、どのページからでもロゴをクリックしてホームに戻れるようにしたい

#### Acceptance Criteria

1. WHEN ページが表示される THEN ヘッダー左側に本アイコン付きの「Logbook」ロゴ SHALL 表示される
2. WHEN ユーザーがロゴをクリックする THEN システム SHALL ホームページ（`/`）へ遷移する
3. WHEN ロゴがホバーされる THEN システム SHALL 視覚的なフィードバックを提供する

### Requirement 2: 認証状態に応じた右側表示

**User Story:** ユーザーとして、自分のログイン状態に応じて適切なアクションが表示されてほしい

#### Acceptance Criteria

1. WHEN 認証状態がロード中 THEN システム SHALL グレーの円形スケルトンアニメーションを表示する
2. WHEN ユーザーがログイン済み THEN システム SHALL ユーザーメニュー（UserMenu）を表示する
3. WHEN ユーザーが未ログイン THEN システム SHALL 「はじめる」ボタンを表示する
4. WHEN 未ログインユーザーが「はじめる」ボタンをクリックする THEN システム SHALL エントリーページ（`/enter`）へ遷移する

### Requirement 3: ユーザーメニュー（ドロップダウン）

**User Story:** ログインユーザーとして、アカウント関連のアクションにアクセスしたい

#### Acceptance Criteria

1. WHEN ログインユーザーがユーザーメニューボタンをクリックする THEN システム SHALL ドロップダウンメニューを表示する
2. WHEN ドロップダウンが開いている AND ユーザーが外側をクリックする THEN システム SHALL ドロップダウンを閉じる
3. WHEN ドロップダウンが開いている AND ユーザーが Escape キーを押す THEN システム SHALL ドロップダウンを閉じる
4. WHEN ドロップダウンが表示される THEN システム SHALL 以下の項目を表示する：
   - ユーザー名（`@username` 形式）
   - 「アカウント設定」リンク
   - 「ログアウト」ボタン
5. WHEN ユーザーが「アカウント設定」をクリックする THEN システム SHALL 設定ページ（`/settings`）へ遷移する
6. WHEN ユーザーが「ログアウト」をクリックする THEN システム SHALL ログアウト処理を実行する

### Requirement 4: アクセシビリティ

**User Story:** すべてのユーザーとして、キーボードやスクリーンリーダーでもヘッダーを利用したい

#### Acceptance Criteria

1. WHEN ユーザーメニューが表示される THEN システム SHALL 適切な ARIA ラベルを提供する
2. WHEN ドロップダウンが開く THEN システム SHALL フォーカス管理を適切に行う
3. WHEN キーボードナビゲーションが使用される THEN システム SHALL Tab キーでの移動をサポートする

### Requirement 5: ヘッダーアクションボタン（HomePage 専用）

**User Story:** ホームページにいるログインユーザーとして、読書ログや本を素早く追加したい

#### Acceptance Criteria

1. WHEN ログインユーザーがホームページを表示する THEN システム SHALL ヘッダー領域にアクションボタンを表示する
2. WHEN ユーザーが「ログを追加」ボタンをクリックする THEN システム SHALL クイックログモーダルを開く
3. WHEN ユーザーが「本を追加」ボタンをクリックする THEN システム SHALL 書籍登録ページ（`/books/new`）へ遷移する
4. WHEN アクションボタンが表示される THEN 「ログを追加」ボタン SHALL プライマリスタイル（黒背景）で表示される
5. WHEN アクションボタンが表示される THEN 「本を追加」ボタン SHALL セカンダリスタイル（白背景・枠線）で表示される

### Requirement 6: ユーザー情報表示（HomePage 専用）

**User Story:** ホームページにいるログインユーザーとして、自分のプロフィール情報を確認したい

#### Acceptance Criteria

1. WHEN ログインユーザーがホームページを表示する THEN システム SHALL ユーザー情報（UserInfo）を表示する
2. WHEN ユーザー情報が表示される THEN システム SHALL アバター画像とユーザー名を含める

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: ヘッダーは Layout コンポーネント内で定義、アクションボタンとユーザーメニューは独立したコンポーネントとして分離
- **Modular Design**: UserMenu、UserInfo、HeaderActionButtons は再利用可能な独立コンポーネント
- **Dependency Management**: useAuth フックへの依存のみ
- **Clear Interfaces**: 各コンポーネントは明確な Props インターフェースを持つ

### Performance
- 認証状態のロード中はスケルトン表示で体感速度を向上
- ドロップダウンの開閉は即座に反応する

### Security
- ログアウト処理は認証システムの signOut 関数を通じて安全に実行
- ユーザー情報は認証済みセッションからのみ取得

### Reliability
- 認証状態の取得失敗時は未ログイン状態として表示
- ネットワークエラー時もヘッダー自体は正常に表示

### Usability
- モバイルファーストのレスポンシブデザイン
- タッチターゲットは最低 44px x 44px
- クリック可能な要素には視覚的なホバーフィードバック
