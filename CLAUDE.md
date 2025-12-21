# Logbook Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-17

## Tech Stack

- TypeScript 5.9 + React 19 + Vite 7
- Cloudflare Workers + Pages + D1 + R2
- Hono 4 (API) + Drizzle ORM + better-auth
- Storybook 10

## Commands

```bash
npm run dev:api     # 開発サーバー（Vite + Wrangler）
npm run dev         # フロントエンドのみ
npm run storybook   # Storybook起動
npm test            # テスト実行
npm run lint        # Lint実行
npm run build       # ビルド
npm run db:migrate  # DBマイグレーション（ローカル）
```

## Documentation

詳細は `.spec-workflow/steering/` を参照:
- `product.md` - プロダクト概要・機能
- `tech.md` - 技術スタック詳細
- `structure.md` - ディレクトリ構造・命名規則

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

## 並行開発（Git Worktree）

仕様検討と実装を並行して進める場合、git worktree を使って別ワークスペースを作成する。

### ディレクトリ構成

```text
~/sandbox/
├── booklog/           # メイン（実装用）
└── booklog-spec/      # 仕様検討用 worktree
```

### セットアップ

```bash
# 仕様検討用 worktree を作成
git worktree add ../booklog-spec -b spec/<feature-name>

# worktree 一覧を確認
git worktree list

# 完了後の削除
git worktree remove ../booklog-spec
```

### 運用ルール

1. **役割の分離**
   - 仕様検討用: `.spec-workflow/` 配下のみ編集
   - 実装用: `src/` 配下を編集
   - 同じファイルを両方で編集しない（コンフリクト防止）

2. **セッション管理**
   - 各 worktree で独立した Claude Code セッションを起動
   - セッション名を付けると管理しやすい: `claude --resume <session-name>`

3. **マージフロー**
   ```
   spec/<feature>  ──(仕様確定)──▶  feature/<feature> にマージ
                                          │
                                          ▼
                                   tasks に沿って実装
   ```

4. **共有リソース**
   - spec-workflow ダッシュボード（localhost:5000）は1つで共有
   - `.git` ディレクトリを共有するため、コミットは両方から見える

<!-- MANUAL ADDITIONS END -->
