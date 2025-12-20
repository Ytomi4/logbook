# Requirements Document

## Introduction

本機能は、国立国会図書館サーチ（NDLサーチ）が提供する書影APIを活用し、本の表紙画像（書影）をアプリ内で表示する機能です。

現在、本の登録時にNDLサーチから書誌情報（タイトル、著者、出版社、ISBN等）を取得していますが、書影は取得していません。本機能により、ISBNを持つ本について書影を自動的に取得・表示し、視覚的に本を識別しやすくします。

**NDL書影API仕様:**
- エンドポイント: `https://ndlsearch.ndl.go.jp/thumbnail/{isbn}.jpg`
- ISBNは13桁、ハイフンなしで指定
- 書影がない場合は404を返す
- 非営利目的での利用、出所記載が必要

## Alignment with Product Vision

product.md に記載された以下のビジョンと合致します:

- **本の管理**: 書影により本の視覚的識別が容易になり、管理体験が向上
- **シンプルさ優先**: 既存のISBNを活用し、追加の入力なしで自動取得
- **高速な操作**: 書影キャッシュにより、2回目以降の表示を高速化

## Requirements

### Requirement 1: NDL書影URLの取得と保存

**User Story:** As a ユーザー, I want 本を登録する際にNDLから書影URLを自動取得してほしい, so that 手動で表紙画像を探す手間が省ける

#### Acceptance Criteria

1. WHEN 本をNDL検索結果から登録する THEN システム SHALL ISBNが存在する場合、NDL書影URLを生成して本のデータに保存する
2. WHEN ISBNが存在しない本を登録する THEN システム SHALL coverUrlをnullとして保存する
3. WHEN 既存の本のISBNを編集する THEN システム SHALL 書影URLを再生成して更新する

### Requirement 2: 書影の表示

**User Story:** As a ユーザー, I want 本一覧やタイムラインで書影が表示されてほしい, so that 視覚的に本を識別できる

#### Acceptance Criteria

1. WHEN 本一覧ページを表示する THEN システム SHALL 各本の書影を表示する（coverUrlがある場合）
2. WHEN タイムラインを表示する THEN システム SHALL ログに関連する本の書影を表示する
3. WHEN 本詳細ページを表示する THEN システム SHALL 書影を大きく表示する
4. IF 書影の読み込みに失敗する THEN システム SHALL フォールバックアイコンを表示する

### Requirement 3: 書影のフォールバック処理

**User Story:** As a ユーザー, I want 書影がない本でも適切な代替表示がほしい, so that UIが崩れない

#### Acceptance Criteria

1. WHEN coverUrlがnull THEN システム SHALL デフォルトの本アイコンを表示する
2. WHEN 書影画像の読み込みが失敗（404等） THEN システム SHALL エラーをキャッチしてフォールバックアイコンを表示する
3. WHEN フォールバック表示する THEN システム SHALL 本のタイトルをtitle属性で設定する

### Requirement 4: NDL検索結果での書影プレビュー

**User Story:** As a ユーザー, I want NDL検索結果に書影が表示されてほしい, so that 登録前に本を視覚的に確認できる

#### Acceptance Criteria

1. WHEN NDL検索結果を表示する THEN システム SHALL ISBNを持つ結果に書影を表示する
2. WHEN 書影のプレビューが失敗する THEN システム SHALL フォールバックアイコンを表示する

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: 書影URL生成ロジックは独立したユーティリティ関数として実装
- **Modular Design**: 既存のBookCoverコンポーネントを活用し、新規コンポーネントの追加を最小化
- **Dependency Management**: NDL書影APIへの依存はフロントエンドの画像読み込みのみ（APIプロキシ不要）
- **Clear Interfaces**: coverUrlフィールドを通じた明確なインターフェース

### Performance
- 書影画像は遅延読み込み（lazy loading）を適用
- 画像読み込みエラー時は即座にフォールバック表示に切り替え
- ブラウザキャッシュを活用（NDLサーバーのCache-Controlに従う）

### Security
- 外部URL（NDLサーチ）からの画像読み込みのみ、ユーザー入力の画像URLは許可しない
- XSS対策: 画像URLはシステムが生成したものに限定

### Reliability
- NDL書影APIが利用不可の場合もアプリケーションは正常動作
- 404エラー時のグレースフルデグラデーション

### Usability
- 書影のサイズは表示コンテキストに応じて適切に調整（sm/md/lg）
- 書影がない場合も視覚的に統一されたUI
