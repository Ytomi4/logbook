# Technology Stack

## Project Type

SPA（Single Page Application）形式の Web アプリケーション。フロントエンドは React、バックエンドは Cloudflare Workers 上で動作する API サーバー。

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript 5.9
- **Runtime**: Node.js（開発）、Cloudflare Workers（本番）
- **Language-specific tools**: npm（パッケージ管理）、tsc（TypeScript コンパイラ）

### Key Dependencies/Libraries

**Frontend:**
- **React 19**: UI ライブラリ
- **React Router DOM 7**: クライアントサイドルーティング
- **Tailwind CSS 4**: ユーティリティファースト CSS フレームワーク
- **Vite 7**: 開発サーバー・ビルドツール

**Backend:**
- **Hono 4**: 軽量 Web フレームワーク（Cloudflare Workers 最適化）
- **Drizzle ORM 0.45**: TypeScript ファースト ORM
- **Zod 4**: スキーマバリデーション

### Application Architecture

**クライアント-サーバー型 SPA アーキテクチャ**

```
┌─────────────────┐     ┌─────────────────────────────┐
│   React SPA     │────▶│   Cloudflare Workers (API)  │
│   (Frontend)    │◀────│         + Hono              │
└─────────────────┘     └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │     Cloudflare D1           │
                        │       (SQLite)              │
                        └─────────────────────────────┘
```

- **Frontend**: コンポーネントベースの React アプリケーション
- **Backend**: RESTful API（Hono フレームワーク）
- **Database**: Cloudflare D1（エッジ SQLite）

### Data Storage
- **Primary storage**: Cloudflare D1（SQLite 互換）
- **ORM**: Drizzle ORM（型安全なクエリビルダー）
- **Data formats**: JSON（API 通信）

### External Integrations
- **APIs**: 国立国会図書館検索 API（NDL Search API）- 書誌情報取得
- **Protocols**: HTTP/REST
- **Authentication**: なし（現時点では単一ユーザー想定）

### Monitoring & Dashboard Technologies
- **Dashboard Framework**: React 19
- **Real-time Communication**: なし（即時 API 呼び出し）
- **State Management**: React hooks（useState, useEffect）
- **Visualization Libraries**: なし（カスタム CSS）

## Development Environment

### Build & Development Tools
- **Build System**: Vite 7（ESBuild ベース）
- **Package Management**: npm
- **Development workflow**:
  - `npm run dev` - Vite 開発サーバー
  - `npm run dev:api` - Wrangler 経由で Workers + Vite 同時起動

### Code Quality Tools
- **Static Analysis**: ESLint 9 + TypeScript ESLint
- **Formatting**: Prettier 3
- **Testing Framework**: Vitest 3 + Testing Library
- **Documentation**: なし（コード内コメント）

### Version Control & Collaboration
- **VCS**: Git
- **Branching Strategy**: develop ブランチで開発、main へマージ
- **Code Review Process**: Pull Request ベース

### Dashboard Development
- **Live Reload**: Vite HMR（Hot Module Replacement）
- **Port Management**:
  - Vite: 5173
  - Wrangler: 8787（プロキシ）
- **Multi-Instance Support**: 開発環境は単一インスタンス

## Deployment & Distribution

- **Target Platform(s)**: Cloudflare Pages + Workers
- **Distribution Method**: SaaS（Web ブラウザからアクセス）
- **Installation Requirements**: モダンブラウザのみ
- **Update Mechanism**: デプロイ時に自動更新

### デプロイコマンド
```bash
npm run build
npx wrangler pages deploy dist --project-name logbook
npx wrangler d1 migrations apply logbook-db --remote  # DB マイグレーション
```

## Technical Requirements & Constraints

### Performance Requirements
- ページロード: 1秒以内
- API レスポンス: 200ms 以内
- エッジコンピューティングによる低遅延

### Compatibility Requirements
- **Platform Support**: モダンブラウザ（Chrome, Firefox, Safari, Edge）
- **Dependency Versions**: Node.js 18+（開発時）
- **Standards Compliance**: ES2022+, CSS3

### Security & Compliance
- **Security Requirements**:
  - HTTPS 通信（Cloudflare 標準）
  - 入力値バリデーション（Zod）
- **Compliance Standards**: 特になし（個人利用想定）
- **Threat Model**: XSS 対策（React の自動エスケープ）

### Scalability & Reliability
- **Expected Load**: 個人利用（低負荷）
- **Availability Requirements**: Cloudflare のインフラに依存
- **Growth Projections**: 将来的に複数ユーザー対応を検討

## Technical Decisions & Rationale

### Decision Log

1. **Cloudflare Workers + D1**:
   - サーバーレスでインフラ管理不要
   - エッジコンピューティングで低遅延
   - 無料枠で個人利用に最適

2. **Hono フレームワーク**:
   - Cloudflare Workers に最適化された軽量フレームワーク
   - Express ライクな API で学習コスト低

3. **Drizzle ORM**:
   - TypeScript ファーストで型安全
   - D1 との相性が良い
   - 軽量で Workers 環境に適合

4. **React 19 + Vite**:
   - 高速な開発体験（HMR）
   - 最新の React 機能を活用
   - ビルド速度が速い

5. **Tailwind CSS**:
   - ユーティリティファーストで迅速な UI 開発
   - カスタム CSS を最小限に

## Known Limitations

- **認証機能なし**: 現在は単一ユーザー想定。複数ユーザー対応には認証実装が必要
- **オフライン対応なし**: Service Worker 未実装
- **画像アップロードなし**: 本の表紙画像は外部 URL のみ対応
- **検索機能が限定的**: 全文検索未実装
