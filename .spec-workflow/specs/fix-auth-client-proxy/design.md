# Design Document: fix-auth-client-proxy

## Overview

`auth-client.ts` の Proxy 実装を修正し、better-auth クライアントとの互換性を回復する。遅延初期化パターンは維持しつつ、`bind()` による内部 Proxy の破壊を防ぐ。また、今後の回帰を防ぐためのテストを追加する。

## Steering Document Alignment

### Technical Standards (tech.md)

- **better-auth 1.4**: 認証ライブラリとして使用。内部 Proxy の動作を尊重する
- **Vitest 3 + Testing Library**: テストフレームワークとして使用
- **TypeScript ファースト**: 型安全な実装を維持

### Project Structure (structure.md)

- `src/lib/auth-client.ts`: 認証クライアント（修正対象）
- `tests/lib/auth-client.test.ts`: 認証クライアントのテスト（新規作成）
- テストファイルは `tests/lib/` ディレクトリに配置

## Code Reuse Analysis

### Existing Components to Leverage

- **auth-client.ts**: 既存の遅延初期化ロジックを修正して再利用
- **tests/setup.ts**: 既存のテストセットアップを使用
- **useAuth.ts**: 変更なし（`authClient` のインターフェースは維持）

### Integration Points

- **better-auth/react**: `createAuthClient` の戻り値を正しく処理
- **useAuth.ts**: `authClient.signOut()`, `authClient.signIn.social()`, `authClient.useSession()` を使用

## Architecture

### 問題の根本原因

```
┌─────────────────────────────────────────────────────────────────┐
│ 現在の実装                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  authClient (Proxy)                                             │
│       │                                                         │
│       ▼                                                         │
│  get(_target, 'signOut')                                        │
│       │                                                         │
│       ▼                                                         │
│  value = client['signOut']  ← better-auth の内部 Proxy          │
│       │                                                         │
│       ▼                                                         │
│  return value.bind(client)  ← ここで内部 Proxy の this が変更   │
│       │                                                         │
│       ▼                                                         │
│  signOut() 呼び出し時、内部で this.fetchOptions にアクセス      │
│       │                                                         │
│       ▼                                                         │
│  bind された client には fetchOptions がないため                │
│  Proxy が 'fetchOptions.method.toUpperCase' を API パスと解釈   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 修正後の設計

```
┌─────────────────────────────────────────────────────────────────┐
│ 修正後の実装                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  authClient (Proxy)                                             │
│       │                                                         │
│       ▼                                                         │
│  get(_target, 'signOut')                                        │
│       │                                                         │
│       ▼                                                         │
│  return client['signOut']  ← better-auth の内部 Proxy をそのまま返す
│       │                                                         │
│       ▼                                                         │
│  signOut() 呼び出し時、内部 Proxy の this コンテキストが正常    │
│       │                                                         │
│       ▼                                                         │
│  正しい API エンドポイント (/api/auth/sign-out) にリクエスト    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Modular Design Principles

- **Single File Responsibility**: `auth-client.ts` は認証クライアントのエクスポートのみを担当
- **Component Isolation**: Proxy のラッパーロジックは最小限に
- **Utility Modularity**: テストヘルパーは必要に応じて分離

## Components and Interfaces

### auth-client.ts（修正）

- **Purpose**: better-auth クライアントを遅延初期化してエクスポート
- **Interfaces**: `authClient` オブジェクト（`createAuthClient` の戻り値と同じ型）
- **Dependencies**: `better-auth/react`, `better-auth/client/plugins`
- **Changes**:
  - `get` トラップで `bind()` を削除
  - プロパティをそのまま返す

```typescript
// 修正前
get(_target, prop) {
  const client = getAuthClientInstance();
  const value = (client as Record<string, unknown>)[prop as string];
  if (typeof value === 'function') {
    return value.bind(client);  // ← 削除
  }
  return value;
}

// 修正後
get(_target, prop) {
  const client = getAuthClientInstance();
  return (client as Record<string, unknown>)[prop as string];
}
```

### auth-client.test.ts（新規）

- **Purpose**: 認証クライアントの動作を検証
- **Interfaces**: Vitest テストケース
- **Dependencies**: `vitest`, `auth-client.ts`
- **Test Cases**:
  1. `authClient` が正しくエクスポートされること
  2. メソッド呼び出しが正しく動作すること
  3. 遅延初期化が正しく機能すること

## Data Models

変更なし。既存の better-auth のセッション/ユーザーモデルをそのまま使用。

## Error Handling

### Error Scenarios

1. **モジュールインポート時のエラー**
   - **Handling**: 遅延初期化により、ブラウザグローバルへのアクセスを遅延
   - **User Impact**: なし（ビルド時にエラーが発生しない）

2. **認証メソッド呼び出し時のエラー**
   - **Handling**: better-auth の標準エラーハンドリングに委譲
   - **User Impact**: useAuth フック経由でエラーメッセージを表示

## Testing Strategy

### Unit Testing

**ファイル**: `tests/lib/auth-client.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// テスト対象
describe('authClient', () => {
  // 1. エクスポートの検証
  it('exports authClient object', () => {
    // authClient がオブジェクトとしてエクスポートされていることを確認
  });

  // 2. メソッドアクセスの検証
  it('provides access to signOut method', () => {
    // authClient.signOut が関数として取得できることを確認
  });

  // 3. ネストされたプロパティアクセスの検証
  it('provides access to nested properties like signIn.social', () => {
    // authClient.signIn.social が関数として取得できることを確認
  });

  // 4. 遅延初期化の検証
  it('initializes lazily on first access', () => {
    // モジュールインポート時点では createAuthClient が呼ばれていないことを確認
  });
});
```

### Integration Testing

**既存の認証フロー**: 手動テストで確認

1. ログイン → ログアウトのフローが正常に動作すること
2. プレビュー環境（develop.logbook-hmk.pages.dev）で動作すること
3. 本番環境（logbook-hmk.pages.dev）で動作すること

### End-to-End Testing

現時点では E2E テストは追加しない。将来的に Playwright 等を導入する際に検討。

## Implementation Notes

### bind() が不要な理由

better-auth のクライアントは、メソッドを直接呼び出しても正しく動作するように設計されている。内部 Proxy が適切な `this` コンテキストを管理しているため、外部から `bind()` を行う必要がない。

実際、`bind()` を行うと逆に内部 Proxy の動作が壊れる。これは JavaScript の Proxy の特性によるもので、`bind()` は新しい関数オブジェクトを作成し、元の Proxy のトラップが呼び出されなくなる。

### 後方互換性

`authClient` の公開インターフェース（型）は変更しない。使用側のコード（`useAuth.ts` など）に変更は不要。
