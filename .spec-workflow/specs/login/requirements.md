# Requirements Document

## Introduction

Google ソーシャルログインを実装し、ユーザー認証による個人データの分離を実現する。ヘッダーの右上にログイン状態に応じた UI を表示し、未ログイン時はログイン導線、ログイン後はユーザー情報を表示する。

## Alignment with Product Vision

この機能は product.md の Future Vision に記載されている「複数ユーザー対応: ユーザー認証と個人データの分離」を実現するための第一歩である。Google アカウントでの簡単なログインにより、ユーザーの参入障壁を下げつつ、将来の複数ユーザー対応の基盤を構築する。

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  未ログイン状態                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Header: [Logbook ロゴ]              [Google でログイン] │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼ クリック                        │
│                   Google OAuth 画面へ遷移                    │
│                            │                                 │
│                            ▼ 認証成功                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Header: [Logbook ロゴ]           [アイコン] [ユーザー名] │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ログイン状態                                                │
│                            │                                 │
│                            ▼ ユーザー情報クリック            │
│                      ドロップダウンメニュー                   │
│                        └─ [ログアウト]                       │
│                            │                                 │
│                            ▼ ログアウト                      │
│                      未ログイン状態に戻る                    │
└─────────────────────────────────────────────────────────────┘
```

## Requirements

### REQ-1: ログインボタンの表示

**User Story:** 未ログインユーザーとして、ヘッダーから簡単にログインしたい。複雑な登録フォームなしで始められるように。

#### Acceptance Criteria

1. WHEN ユーザーが未ログイン状態でアプリにアクセス THEN システム SHALL ヘッダー右上に「Google でログイン」ボタンを表示する
2. WHEN ユーザーが「Google でログイン」ボタンをクリック THEN システム SHALL Google OAuth 認証画面にリダイレクトする
3. IF ユーザーがログイン済み THEN システム SHALL 「Google でログイン」ボタンを非表示にする

### REQ-2: Google 認証フロー

**User Story:** ユーザーとして、Google アカウントでログインしたい。新しいパスワードを覚える必要なく、安全にアクセスするために。

#### Acceptance Criteria

1. WHEN ユーザーが Google 認証を完了 THEN システム SHALL ユーザー情報（名前、メール、アバター）を取得する
2. WHEN 初回ログイン THEN システム SHALL 新規ユーザーとして登録し、ホームページにリダイレクトする
3. WHEN 2回目以降のログイン THEN システム SHALL 既存ユーザーとして認証し、ホームページにリダイレクトする
4. WHEN Google 認証がキャンセルまたは失敗 THEN システム SHALL エラーメッセージを表示し、未ログイン状態を維持する

### REQ-3: ログイン後のユーザー情報表示

**User Story:** ログイン済みユーザーとして、自分がログインしていることを確認したい。どのアカウントでログインしているか分かるように。

#### Acceptance Criteria

1. WHEN ユーザーがログイン済み THEN システム SHALL ヘッダー右上に Google アカウントのアバター画像とユーザー名を表示する
2. WHEN ユーザーがユーザー情報エリアをクリック THEN システム SHALL ドロップダウンメニューを表示する
3. WHEN ドロップダウンメニューを表示 THEN システム SHALL 「ログアウト」オプションを含める

### REQ-4: ログアウト機能

**User Story:** ログイン済みユーザーとして、ログアウトしたい。共有デバイスでアカウントを安全に切り離すために。

#### Acceptance Criteria

1. WHEN ユーザーがログアウトを実行 THEN システム SHALL セッションを破棄する
2. WHEN ログアウト完了後 THEN システム SHALL ヘッダーに「Google でログイン」ボタンを表示する
3. WHEN ログアウト完了後 THEN システム SHALL 現在のページに留まる（リダイレクトしない）

### REQ-5: 認証状態の永続化

**User Story:** ログイン済みユーザーとして、ブラウザを閉じても次回アクセス時にログイン状態を維持したい。毎回ログインする手間を省くために。

#### Acceptance Criteria

1. WHEN ユーザーがログイン済みでブラウザを閉じる THEN システム SHALL セッション情報を永続化する
2. WHEN ユーザーが再度アプリにアクセス AND セッションが有効 THEN システム SHALL 自動的にログイン状態を復元する
3. IF セッションが期限切れ THEN システム SHALL 未ログイン状態として扱い、ログインボタンを表示する

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: 認証ロジックは Better Auth に委譲
- **Modular Design**: 認証クライアントは `src/lib/auth-client.ts` に集約
- **Dependency Management**: Better Auth パッケージのみ追加
- **Clear Interfaces**: Better Auth の型定義を活用

### Performance
- Google OAuth リダイレクト: 即時（ネットワーク依存）
- セッション検証: 100ms 以内
- ログイン後のリダイレクト: 500ms 以内

### Security
- OAuth 2.0 フロー（Google 標準）
- セッショントークンは HttpOnly Cookie で管理
- HTTPS 通信必須（Cloudflare 標準）
- CSRF 対策（Better Auth 内蔵）

### Reliability
- Google OAuth の可用性に依存
- セッション有効期限: 30日間
- エラー時の適切なフォールバック

### Usability
- ワンクリックでログイン開始
- Google アカウント選択画面は Google 標準 UI
- ログイン状態は視覚的に明確（アバター表示）

## Out of Scope (将来対応)

- メール/パスワード認証
- 他のソーシャルログイン（GitHub, Apple 等）
- ユーザーデータ（books/logs）との紐付け
- 認証必須化（現在は認証なしでも利用可能）
