# Implementation Plan: 読書ログアプリケーション

**Branch**: `001-reading-log-app` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-reading-log-app/spec.md`

## Summary

読書ログをタイムライン形式で記録・閲覧できるWebアプリケーション。Git風のコミット履歴UIで読書プロセスを可視化する。React SPA + Cloudflare Workers + D1によるシンプルなサーバーレス構成で、国会図書館APIと連携した書誌情報自動取得機能を持つ。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18, Vite, Cloudflare Workers, Hono (API framework)
**Storage**: Cloudflare D1 (SQLite)
**Testing**: Vitest (unit/integration)
**Target Platform**: Cloudflare Pages + Workers (Edge)
**Project Type**: Web application (SPA + serverless API)
**Performance Goals**: Timeline renders 100 logs in <2s, NDL search responds in <3s
**Constraints**: Single-user MVP, no authentication required, all data public
**Scale/Scope**: Single user, hundreds of books/logs expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ Pass | TypeScript for type safety, ESLint/Prettier configured |
| II. Testing Standards | ✅ Pass | Vitest for unit/integration tests |
| III. UX Consistency | ✅ Pass | Single design system, Git-style timeline, loading states defined |
| IV. Performance | ✅ Pass | SC-003/SC-006 define measurable targets |
| V. Dependency Management | ✅ Pass | Minimal deps: React, Hono, Drizzle only |
| VI. Security First | ✅ Pass | No secrets in code, input validation via Zod, edge deployment |
| VII. Simplicity (KISS) | ✅ Pass | SPA + Workers, no SSR complexity, single DB |

## Project Structure

### Documentation (this feature)

```text
specs/001-reading-log-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/          # React UI components
│   ├── Timeline/        # Timeline view components
│   ├── BookForm/        # Book registration form
│   ├── LogForm/         # Log entry form (memo/quote)
│   └── common/          # Shared UI components
├── pages/               # Page components (routes)
├── hooks/               # Custom React hooks
├── services/            # API client functions
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions

functions/               # Cloudflare Workers (Pages Functions)
├── api/
│   ├── books/           # Book CRUD endpoints
│   ├── logs/            # Log CRUD endpoints
│   └── ndl/             # NDL search proxy
└── _middleware.ts       # CORS, error handling

db/
├── schema.ts            # Drizzle ORM schema
└── migrations/          # D1 migrations

tests/
├── unit/                # Component & utility tests
└── integration/         # API integration tests

public/                  # Static assets
```

**Structure Decision**: Web application with SPA frontend and serverless API. Using Cloudflare Pages Functions convention (`/functions` directory) for Workers integration. Single repository monorepo structure for simplicity.

## Complexity Tracking

> **No violations detected.** Architecture follows KISS principle with minimal dependencies.
