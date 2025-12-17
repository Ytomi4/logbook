# Research: 読書ログアプリケーション

**Date**: 2025-12-17
**Branch**: `001-reading-log-app`

## Technology Decisions

### 1. Frontend Framework

**Decision**: Vite + React SPA (Cloudflare Vite Plugin)

**Rationale**:
- シングルユーザーMVPにはSSR不要、SPA構成が最もシンプル
- Cloudflare Vite Plugin（2025年4月GA）により開発環境でWorkers runtimeが動作、本番との整合性を確保
- Viteのミリ秒レベルHMRで高速開発が可能
- Cloudflare Pagesへのデプロイが容易（git push → 自動デプロイ）

**Alternatives Considered**:
- **Next.js**: Cloudflare PagesでのSSRサポートが不完全。Vercel前提の機能が多く、Cloudflareでは推奨されない
- **React Router v7 (Remix)**: フルスタックフレームワークとしては優秀だが、MVPにはSSRが過剰。設定ファイルが増え複雑化する
- **Astro**: コンテンツサイト向けの設計。インタラクティブなアプリにはVite + Reactが直接的

### 2. Database/Storage

**Decision**: Cloudflare D1 (SQLite)

**Rationale**:
- Book → Logs のリレーション構造にSQLが最適
- タイムラインクエリ（ORDER BY, フィルタリング, ページネーション）がSQL標準で実現可能
- FTS5によるフルテキスト検索が組み込み
- 無料枠が潤沢（5GB storage, 5M reads/day）、シングルユーザーなら無料運用可能
- Cloudflare Workers/Pagesとのシームレスな統合

**Alternatives Considered**:
- **KV**: Eventually consistent（最大60秒遅延）、リレーションデータには不向き
- **Durable Objects**: リアルタイム協調向け、読書ログには過剰
- **Supabase**: 外部サービス依存が増える、ネットワークホップ追加
- **PlanetScale**: 2024年に無料枠終了、外部キー非サポート

### 3. Backend/API

**Decision**: Cloudflare Workers (Serverless Functions)

**Rationale**:
- Cloudflareエコシステム統一（Pages + D1 + Workers）
- NDL APIのCORSプロキシが必須（後述）
- 自動スケーリング、エッジでの低レイテンシ
- 無料枠が潤沢（100k requests/day）

**Alternatives Considered**:
- **別サーバー（Express等）**: インフラ管理が必要、サーバーレスの利点を失う
- **クライアント直接呼び出し**: NDL APIがCORS非対応のため不可

### 4. NDL (国会図書館) API

**Decision**: OpenSearch API via Cloudflare Worker Proxy

**API Details**:
- Endpoint: `https://ndlsearch.ndl.go.jp/api/opensearch`
- Format: RSS 2.0 XML
- 仕様バージョン: 1.3 (2025年3月26日)

**CORS Status**: 非対応（ブラウザ直接呼び出し不可）

**Implementation**:
```
Browser → Worker (/api/ndl/search) → NDL API → Worker → Browser
```
- WorkerがCORSヘッダーを追加
- XML→JSON変換でフロント処理を簡素化
- Cloudflare Cache APIでレスポンスキャッシュ可能

**Search Capabilities**:
- タイトル、著者、出版社検索
- ISBN/ISSN完全一致（10/13桁自動変換）
- 日付範囲クエリ
- NDC（日本十進分類法）フィルタリング

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React SPA - Vite)                             │
│  - Book management UI                                   │
│  - Reading log forms (memo/quote)                       │
│  - Public timeline view                                 │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/HTTPS
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Pages (Static Assets)                       │
└─────────────────┬───────────────────────────────────────┘
                  │ /api/* routes
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Workers (Edge Functions)                    │
│  - /api/books → D1 CRUD                                 │
│  - /api/logs → D1 reading log management                │
│  - /api/ndl/search → Proxy to NDL (CORS fix)            │
└─────────────────┬───────────────────────────────────────┘
          ┌───────┴────────┐
          ▼                ▼
┌──────────────────┐  ┌─────────────────────────┐
│ Cloudflare D1    │  │ NDL OpenSearch API      │
│ (SQLite)         │  │ (External, no CORS)     │
└──────────────────┘  └─────────────────────────┘
```

## Cost Estimation

**Expected**: $0/month (free tier)

| Service | Free Tier | Usage Estimate |
|---------|-----------|----------------|
| Cloudflare Pages | Unlimited bandwidth | Sufficient |
| Cloudflare Workers | 100k req/day | Sufficient |
| Cloudflare D1 | 5GB, 5M reads/day | Sufficient |

## References

- [Cloudflare Vite Plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Cloudflare D1 Overview](https://developers.cloudflare.com/d1/)
- [NDL Search API Specifications](https://ndlsearch.ndl.go.jp/help/api/specifications)
- [CORS Header Proxy with Workers](https://developers.cloudflare.com/workers/examples/cors-header-proxy/)
