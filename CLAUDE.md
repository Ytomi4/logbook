# Logbook Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-17

## Active Technologies

- TypeScript 5.x + React 18, Vite, Cloudflare Workers, Hono (API framework) (001-reading-log-app)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x: Follow standard conventions

## Recent Changes

- 001-reading-log-app: Added TypeScript 5.x + React 18, Vite, Cloudflare Workers, Hono (API framework)

<!-- MANUAL ADDITIONS START -->

## Git Workflow

このプロジェクトではGit Flowベースのブランチ戦略を採用している。開発時は必ず以下のルールに従うこと。

### ブランチ運用

1. **機能開発時は必ずfeatureブランチを作成する**
   - `develop`から分岐: `git checkout -b feature/<feature-name> develop`
   - 命名規則: `feature/`, `fix/`, `hotfix/`, `refactor/`, `docs/`, `chore/`

2. **コミットは区切りごとに作成する**
   - Conventional Commits形式を使用（例: `feat:`, `fix:`, `docs:`）
   - 1つのコミットは1つの論理的な変更単位

3. **リモートへのpushはユーザーの指示を待つ**
   - 勝手にpushしない
   - ユーザーから「プッシュして」「リモートに反映して」等の指示があった場合のみ実行

4. **PRはdevelopブランチに対して作成する**
   - mainへの直接PRは避ける（リリース時のみ）
   - PRにはレビューコメントへの対応を含める
   - PR作成後、GitHub Copilotにレビューをリクエストする: `gh copilot-review <PR番号>`

5. **mainブランチへのマージ**
   - developからmainへのPRはユーザーの指示があった場合のみ作成
   - マージ後は本番環境に自動デプロイされる

### CI/CD

- `main` push → 本番環境（logbook-hmk.pages.dev）に自動デプロイ
- `develop` push → プレビュー環境（develop.logbook-hmk.pages.dev）に自動デプロイ
- D1マイグレーションは自動実行されない（手動で `npx wrangler d1 migrations apply logbook-db --remote`）

## Storybook

コンポーネントのカタログとして Storybook を使用している。

### 開発ルール

1. **新規コンポーネント作成時は必ず Stories を作成する**
   - コンポーネントと同じディレクトリに `*.stories.tsx` ファイルを配置
   - CSF 3.0 形式（`Meta` + `StoryObj`）を使用
   - `tags: ['autodocs']` を追加してProps自動ドキュメント化

2. **Stories の命名規則**
   - ファイル名: `ComponentName.stories.tsx`
   - title: `カテゴリ/ComponentName`（例: `Common/Button`, `Timeline/TimelineItem`）

3. **モックデータの共通化**
   - `src/stories/mocks/data.ts` に共通モックデータを定義
   - Stories 間で一貫したテストデータを使用

<!-- MANUAL ADDITIONS END -->
