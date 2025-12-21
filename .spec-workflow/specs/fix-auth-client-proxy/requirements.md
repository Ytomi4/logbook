# Requirements Document: fix-auth-client-proxy

## Introduction

`auth-client.ts` の Proxy 実装が better-auth クライアントの内部動作と干渉し、ログアウト機能が動作しない問題を修正する。

PR #12（eec47a4）で導入された遅延初期化パターンにおいて、`bind()` によるコンテキスト変更が better-auth の内部 Proxy を破壊し、`fetchOptions.method.toUpperCase` のようなプロパティアクセスが API パスとして誤解釈される。

## Alignment with Product Vision

- **ユーザー認証（Key Features #6）**: better-auth によるソーシャルログイン対応が正常に動作することは必須
- **シンプルさ優先（Product Principles #1）**: ログイン・ログアウトという基本操作が確実に動作する必要がある
- **データの永続性（Product Principles #3）**: 認証が正常に動作しないと、ユーザーデータへのアクセスが不安定になる

## Background

### 問題の発生経緯

1. PR #12 で Copilot レビューの指摘に対応し、SSR/ビルド時のブラウザグローバル参照問題を解決するため遅延初期化パターンを導入（eec47a4）
2. Proxy の `get` トラップ内で `value.bind(client)` を使用してメソッドをバインド
3. better-auth クライアントは内部で Proxy を使用しており、メソッドチェーンを API パスに変換する仕組みを持つ
4. `bind()` により内部 Proxy の `this` コンテキストが変更され、プロパティアクセスが API パスとして誤解釈される

### エラー内容

```
TypeError: Failed to execute 'fetch' on 'Window': '[object Promise]' is not a valid HTTP method.
GET https://develop.logbook-hmk.pages.dev/api/auth/fetch-options/method/to-upper-case 404
```

## Requirements

### REQ-1: ログアウト機能の修正

**User Story:** ログイン済みユーザーとして、ログアウトボタンをクリックしたら正常にログアウトできるようにしたい。セッションが終了し、未認証状態に戻れることを期待する。

#### Acceptance Criteria

1. WHEN ログイン済みユーザーがログアウトボタンをクリック THEN システム SHALL セッションを終了し、ユーザーを未認証状態に遷移させる
2. WHEN ログアウト処理が完了 THEN システム SHALL コンソールにエラーを出力しない
3. WHEN ログアウト処理が完了 THEN システム SHALL `/api/auth/sign-out` エンドポイントに正しくリクエストを送信する

### REQ-2: 遅延初期化パターンの維持

**User Story:** 開発者として、SSR やビルド時にブラウザグローバル（`location` など）にアクセスしないようにしたい。ビルドエラーを防ぐため。

#### Acceptance Criteria

1. WHEN モジュールがインポートされる THEN システム SHALL ブラウザグローバル（`window.location` など）に即座にアクセスしない
2. WHEN `authClient` のメソッドが初めて呼び出される THEN システム SHALL その時点で better-auth クライアントを初期化する
3. IF SSR 環境でモジュールがインポートされる THEN システム SHALL エラーを発生させない

### REQ-3: 認証機能の回帰テスト

**User Story:** 開発者として、認証クライアントの動作を検証するテストが欲しい。今後の変更で同様の問題が再発しないようにしたい。

#### Acceptance Criteria

1. WHEN `authClient.signOut()` が呼び出される THEN テスト SHALL 正しいエンドポイントにリクエストが送信されることを検証する
2. WHEN `authClient.signIn.social()` が呼び出される THEN テスト SHALL 正しいエンドポイントにリクエストが送信されることを検証する
3. WHEN `authClient.useSession()` が呼び出される THEN テスト SHALL セッション情報を正しく取得できることを検証する

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: `auth-client.ts` は認証クライアントのエクスポートのみを担当する
- **Modular Design**: 遅延初期化ロジックは明確に分離する
- **Clear Interfaces**: 外部に公開する `authClient` の型は変更しない（後方互換性）

### Performance

- 遅延初期化により、初回メソッド呼び出し時のわずかなオーバーヘッドは許容する
- 2回目以降の呼び出しではオーバーヘッドがないこと

### Security

- 認証フローに影響する変更のため、セキュリティ上の脆弱性を導入しないこと
- セッション管理は better-auth の標準動作に準拠すること

### Reliability

- 本番環境（Cloudflare Pages）およびプレビュー環境で動作すること
- ローカル開発環境（localhost:8788）で動作すること

### Testability

- 認証クライアントの動作を検証するユニットテストを追加すること
- モック可能な設計を維持すること

## Out of Scope

- better-auth ライブラリ自体の修正
- 認証フロー全体のリファクタリング
- 新しい認証プロバイダの追加
