# Contributing to Logbook

このドキュメントでは、プロジェクトへの貢献方法とブランチルールについて説明します。

## ブランチ戦略

このプロジェクトでは **Git Flow** ベースのブランチ戦略を採用しています。

### ブランチ構成

```
main (本番)
  ↑
develop (開発統合)
  ↑
feature/* | fix/* | refactor/* | docs/* | chore/* (作業ブランチ)
```

### メインブランチ

| ブランチ | 用途 | 保護ルール |
|---------|------|-----------|
| `main` | 本番環境用。常にデプロイ可能な状態を維持 | 保護あり |
| `develop` | 開発統合用。次回リリースの機能を統合 | 保護あり |

### 作業ブランチ

作業ブランチは `develop` から分岐し、作業完了後に `develop` へマージします。

| プレフィックス | 用途 | 例 |
|--------------|------|-----|
| `feature/` | 新機能開発 | `feature/user-auth`, `feature/export-csv` |
| `fix/` | バグ修正 | `fix/login-error`, `fix/null-pointer` |
| `hotfix/` | 本番緊急修正 | `hotfix/security-patch` |
| `refactor/` | リファクタリング | `refactor/api-structure` |
| `docs/` | ドキュメント更新 | `docs/api-readme` |
| `chore/` | 雑務（依存関係更新等） | `chore/update-deps` |

### ブランチ命名規則

```
<type>/<short-description>
```

- **type**: 上記プレフィックスのいずれか
- **short-description**: ケバブケース（小文字、ハイフン区切り）で簡潔に記述

**良い例:**
- `feature/book-search`
- `fix/timeline-scroll-issue`
- `refactor/database-queries`

**悪い例:**
- `feature/BookSearch` (キャメルケース不可)
- `new-feature` (プレフィックスなし)
- `feature/implement_the_new_search_functionality` (長すぎる)

## ワークフロー

### 1. 新機能・修正の開発

```bash
# develop から最新を取得
git checkout develop
git pull origin develop

# 作業ブランチを作成
git checkout -b feature/your-feature-name

# 作業してコミット
git add .
git commit -m "feat: add new feature"

# リモートにプッシュ
git push -u origin feature/your-feature-name

# PR を作成（develop へ）
gh pr create --base develop
```

### 2. 緊急修正（Hotfix）

```bash
# main から分岐
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 修正してコミット
git add .
git commit -m "fix: resolve critical bug"

# main へ PR を作成
gh pr create --base main

# マージ後、develop にも反映
git checkout develop
git merge main
git push origin develop
```

### 3. リリース

```bash
# develop から main へ PR を作成
gh pr create --base main --head develop --title "Release vX.Y.Z"
```

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従います。

### フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 一覧

| Type | 説明 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの意味に影響しない変更（空白、フォーマット等） |
| `refactor` | バグ修正でも機能追加でもないコード変更 |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセスやツールの変更 |

### 例

```
feat(timeline): add infinite scroll support

Implement virtual scrolling for better performance
with large datasets.

Closes #123
```

```
fix(auth): resolve token expiration issue
```

## プルリクエスト

### PR 作成前のチェックリスト

- [ ] コードがリントを通過する (`npm run lint`)
- [ ] すべてのテストが通過する (`npm test`)
- [ ] 新機能にはテストを追加している
- [ ] 必要に応じてドキュメントを更新している

### PR テンプレート

```markdown
## Summary
変更内容の概要

## Changes
- 変更点1
- 変更点2

## Test plan
- [ ] テスト項目1
- [ ] テスト項目2
```

### マージ戦略

| マージ先 | 戦略 | 理由 |
|---------|------|------|
| `feature/*` → `develop` | Squash merge | コミット履歴をクリーンに保つ |
| `develop` → `main` | Merge commit | リリース履歴を明確に残す |
| `hotfix/*` → `main` | Merge commit | 緊急対応の記録を残す |

## ブランチ保護ルール

### `main` ブランチ

- プルリクエスト必須
- ステータスチェック通過必須
- Force push 禁止
- 削除禁止
- 古いレビューは自動的に無効化

### `develop` ブランチ

- ステータスチェック通過必須
- Force push 禁止
- 削除禁止

## 質問・サポート

問題や質問がある場合は、[Issues](https://github.com/Ytomi4/logbook/issues) で報告してください。
