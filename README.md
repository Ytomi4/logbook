# Booklog

読書ログをタイムライン形式で記録・閲覧するWebアプリケーション。

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Backend: Cloudflare Workers + Hono
- Database: Cloudflare D1 (SQLite)
- ORM: Drizzle

## Setup

```bash
npm install
```

## Local Development

### 1. D1 データベースの作成

```bash
npx wrangler d1 create booklog-db
```

出力された `database_id` を `wrangler.jsonc` に設定:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "booklog-db",
      "database_id": "<your-database-id>"
    }
  ]
}
```

### 2. マイグレーション実行

```bash
npm run db:migrate
```

### 3. 開発サーバー起動

```bash
npm run dev:api
```

http://localhost:8787 でアクセス可能。

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server のみ起動 |
| `npm run dev:api` | Vite + Workers (API) を同時起動 |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | ESLint 実行 |
| `npm run test` | テスト実行 |
| `npm run db:generate` | Drizzle マイグレーション生成 |
| `npm run db:migrate` | ローカル D1 にマイグレーション適用 |

## Deploy to Cloudflare

### 初回デプロイ

```bash
# Cloudflare にログイン
npx wrangler login

# Pages プロジェクト作成 & デプロイ
npx wrangler pages deploy dist --project-name booklog
```

### 本番 D1 マイグレーション

```bash
npx wrangler d1 migrations apply booklog-db --remote
```

### 継続的デプロイ

```bash
npm run build
npx wrangler pages deploy dist --project-name booklog
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt + H` | タイムラインに移動 |
| `Alt + B` | 本一覧に移動 |
| `Alt + N` | 本を新規登録 |
| `/` | 検索にフォーカス |
| `Esc` | モーダルを閉じる |
