# Tasks: 読書ログアプリケーション

**Input**: Design documents from `/specs/001-reading-log-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.yaml

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Frontend: `src/` (React SPA)
- Backend: `functions/api/` (Cloudflare Workers)
- Database: `db/` (Drizzle ORM)
- Tests: `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Vite + React project with Cloudflare template using `npm create cloudflare@latest`
- [x] T002 Install dependencies: react, hono, drizzle-orm, zod in package.json
- [x] T003 [P] Configure TypeScript with strict mode in tsconfig.json
- [x] T004 [P] Configure ESLint and Prettier in eslint.config.js and .prettierrc
- [x] T005 [P] Configure Vitest in vite.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create D1 database and add binding to wrangler.jsonc
- [x] T007 Define Drizzle ORM schema for books and logs in db/schema.ts
- [x] T008 Generate D1 migrations using drizzle-kit in db/migrations/
- [x] T009 Apply migrations to local D1 database
- [x] T010 [P] Create TypeScript types from schema in src/types/index.ts
- [x] T011 [P] Create Zod validation schemas in src/lib/validation.ts
- [x] T012 Create Hono app instance with CORS middleware in functions/api/_middleware.ts
- [x] T013 [P] Create API client base with fetch wrapper in src/services/api.ts
- [x] T014 [P] Create common UI components (Button, Input, Card, Loading) in src/components/common/
- [x] T015 Setup React Router for page routing in src/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - タイムラインでの読書ログ閲覧 (Priority: P1) 🎯 MVP

**Goal**: Git風のコミット履歴UIでタイムライン表示を実現

**Independent Test**: タイムライン画面にアクセスし、読書ログが時系列で表示されることを確認

### Implementation for User Story 1

- [x] T016 [US1] Implement GET /api/logs endpoint (timeline) in functions/api/logs/index.ts
- [x] T017 [US1] Create timeline API client function in src/services/logs.ts
- [x] T018 [US1] Create TimelineItem component with vertical axis and marker in src/components/Timeline/TimelineItem.tsx
- [x] T019 [US1] Create TimelineGroup component for book grouping in src/components/Timeline/TimelineGroup.tsx
- [x] T020 [US1] Create QuoteDisplay component with blockquote styling in src/components/Timeline/QuoteDisplay.tsx
- [x] T021 [US1] Create Timeline container component with infinite scroll in src/components/Timeline/Timeline.tsx
- [x] T022 [US1] Create useTimeline hook for data fetching and pagination in src/hooks/useTimeline.ts
- [x] T023 [US1] Create TimelinePage as main view in src/pages/TimelinePage.tsx
- [x] T024 [US1] Add loading and empty states to Timeline component

**Checkpoint**: User Story 1 complete - タイムライン表示が動作

---

## Phase 4: User Story 2 - 読書ログの登録 (Priority: P1)

**Goal**: 3ステップ以内でログを素早く登録

**Independent Test**: 本の詳細画面からログを追加し、タイムラインに反映されることを確認

### Implementation for User Story 2

- [ ] T025 [US2] Implement POST /api/books/{bookId}/logs endpoint in functions/api/books/[bookId]/logs.ts
- [ ] T026 [US2] Implement PUT /api/logs/{logId} endpoint in functions/api/logs/[logId].ts
- [ ] T027 [US2] Implement DELETE /api/logs/{logId} endpoint in functions/api/logs/[logId].ts
- [ ] T028 [US2] Create log API client functions (create, update, delete) in src/services/logs.ts
- [ ] T029 [US2] Create LogTypeSelector component (memo/quote toggle) in src/components/LogForm/LogTypeSelector.tsx
- [ ] T030 [US2] Create LogForm component with textarea in src/components/LogForm/LogForm.tsx
- [ ] T031 [US2] Create QuickLogModal for rapid entry in src/components/LogForm/QuickLogModal.tsx
- [ ] T032 [US2] Create useLogForm hook for form state management in src/hooks/useLogForm.ts
- [ ] T033 [US2] Add log creation trigger to BookDetail page in src/pages/BookDetailPage.tsx
- [ ] T034 [US2] Implement log edit functionality in TimelineItem component
- [ ] T035 [US2] Implement log delete with confirmation dialog

**Checkpoint**: User Stories 1 AND 2 complete - タイムライン表示とログ登録が動作

---

## Phase 5: User Story 3 - 本の登録 (Priority: P2)

**Goal**: タイトル入力だけで書誌情報を自動取得

**Independent Test**: 本のタイトルを入力して検索し、書誌情報を取得して登録できる

### Implementation for User Story 3

- [ ] T036 [US3] Implement GET /api/ndl/search endpoint (NDL proxy) in functions/api/ndl/search.ts
- [ ] T037 [US3] Implement POST /api/books endpoint in functions/api/books/index.ts
- [ ] T038 [US3] Implement GET /api/books endpoint in functions/api/books/index.ts
- [ ] T039 [US3] Implement GET /api/books/{bookId} endpoint in functions/api/books/[bookId]/index.ts
- [ ] T040 [US3] Implement PUT /api/books/{bookId} endpoint in functions/api/books/[bookId]/index.ts
- [ ] T041 [US3] Implement DELETE /api/books/{bookId} endpoint (soft delete) in functions/api/books/[bookId]/index.ts
- [ ] T042 [US3] Create book and NDL API client functions in src/services/books.ts
- [ ] T043 [US3] Create NDL API client function in src/services/ndl.ts
- [ ] T044 [US3] Create BookSearchInput component with debounce in src/components/BookForm/BookSearchInput.tsx
- [ ] T045 [US3] Create NdlSearchResults component for candidate display in src/components/BookForm/NdlSearchResults.tsx
- [ ] T046 [US3] Create BookForm component for manual entry in src/components/BookForm/BookForm.tsx
- [ ] T047 [US3] Create useBookSearch hook for NDL integration in src/hooks/useBookSearch.ts
- [ ] T048 [US3] Create BookRegistrationPage in src/pages/BookRegistrationPage.tsx
- [ ] T049 [US3] Create BookListPage showing all books in src/pages/BookListPage.tsx
- [ ] T050 [US3] Implement book delete with "削除済み" handling

**Checkpoint**: User Stories 1, 2, AND 3 complete - フル機能が動作

---

## Phase 6: User Story 4 - 公開タイムラインの閲覧 (Priority: P3)

**Goal**: URLを知っている人なら誰でもタイムラインを閲覧可能

**Independent Test**: ログインせずにタイムラインURLにアクセスし、公開ログが表示される

### Implementation for User Story 4

- [ ] T051 [US4] Ensure all API endpoints work without authentication
- [ ] T052 [US4] Create BookDetailPage for viewing book-specific logs in src/pages/BookDetailPage.tsx
- [ ] T053 [US4] Add click-through navigation from timeline to book detail
- [ ] T054 [US4] Add share button to copy timeline URL
- [ ] T055 [US4] Configure meta tags for OGP (Open Graph Protocol) in index.html

**Checkpoint**: All user stories complete

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T056 [P] Add responsive design for mobile in src/index.css
- [ ] T057 [P] Add error boundary component in src/components/common/ErrorBoundary.tsx
- [ ] T058 [P] Add toast notifications for success/error feedback in src/components/common/Toast.tsx
- [ ] T059 Implement pagination/infinite scroll for large datasets
- [ ] T060 Add keyboard shortcuts for quick log entry
- [ ] T061 Run quickstart.md validation checklist
- [ ] T062 Deploy to Cloudflare Pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): タイムライン閲覧
  - US2 (P1): ログ登録 - depends on US1 components (Timeline)
  - US3 (P2): 本の登録 - independent, but US2 needs books
  - US4 (P3): 公開閲覧 - depends on US1
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies
- **User Story 2 (P1)**: Can start after Foundational - Shares Timeline components with US1
- **User Story 3 (P2)**: Can start after Foundational - US2 requires books to exist
- **User Story 4 (P3)**: Can start after US1 - Extends public viewing

### Recommended Execution Order

1. Phase 1 → Phase 2 (sequential, blocking)
2. US3 (本の登録) - books must exist before logs
3. US1 (タイムライン閲覧) + US2 (ログ登録) - can run in parallel after US3
4. US4 (公開閲覧)
5. Phase 7 (Polish)

### Within Each User Story

- API endpoint before frontend service
- Frontend service before UI components
- UI components before page integration

### Parallel Opportunities

- T003, T004, T005 (Phase 1 config files)
- T010, T011, T013, T014 (Phase 2 types and common components)
- T056, T057, T058 (Phase 7 polish tasks)

---

## Parallel Example: User Story 3 (Book Registration)

```bash
# Launch API endpoints in parallel (different files):
Task: "Implement POST /api/books endpoint in functions/api/books/index.ts"
Task: "Implement GET /api/ndl/search endpoint in functions/api/ndl/search.ts"

# Launch UI components in parallel:
Task: "Create BookSearchInput component in src/components/BookForm/BookSearchInput.tsx"
Task: "Create NdlSearchResults component in src/components/BookForm/NdlSearchResults.tsx"
Task: "Create BookForm component in src/components/BookForm/BookForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 5: User Story 3 (本の登録) - 必須：ログの前に本が必要
4. Complete Phase 3: User Story 1 (タイムライン閲覧)
5. Complete Phase 4: User Story 2 (ログ登録)
6. **STOP and VALIDATE**: Test core functionality
7. Deploy MVP

### Incremental Delivery

1. Setup + Foundational → 基盤完成
2. US3 (本の登録) → 本を登録できる
3. US1 + US2 (タイムライン + ログ) → コア機能完成 → **MVP リリース**
4. US4 (公開閲覧) → 共有機能追加
5. Polish → 品質向上

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- NDL API requires CORS proxy (Worker) - cannot call directly from browser
