# Tasks Document: User Timeline

## Phase 1: Database & Types

- [x] 1. Add user_id columns to books and logs tables
  - File: `db/migrations/XXXX_add_user_id_to_books_and_logs.sql`, `db/schema.ts`
  - Add `user_id` column to `books` table (NOT NULL, FK to users)
  - Add `user_id` column to `logs` table (NOT NULL, FK to users)
  - Add indexes for user queries (`idx_books_user_id`, `idx_logs_user_id`)
  - Update Drizzle schema definitions
  - Purpose: Enable user-specific data filtering
  - _Leverage: `db/schema.ts`, existing migration patterns in `db/migrations/`_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Engineer with Drizzle ORM and D1 expertise | Task: Create migration to add user_id columns to books and logs tables, referencing users table. Update db/schema.ts with new column definitions and relations. Follow existing migration patterns. | Restrictions: Do not modify existing columns, ensure backward compatibility, use proper foreign key constraints. Must handle existing data (if any) appropriately. | _Leverage: db/schema.ts, db/migrations/ | _Requirements: REQ-2 | Success: Migration applies cleanly, schema.ts reflects new columns, indexes are created. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 2. Update TypeScript types for registration log
  - File: `src/types/index.ts`
  - Add `'registration'` to `LogType` union type
  - Update `Log` and `Book` interfaces to include `userId` field
  - Add `isRegistrationLog()` type guard function
  - Purpose: Type safety for registration log feature
  - _Leverage: `src/types/index.ts` existing type definitions_
  - _Requirements: REQ-4, REQ-5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Update LogType to include 'registration', add userId to Log and Book interfaces, create isRegistrationLog type guard. Follow existing type patterns. | Restrictions: Do not break existing type usage, maintain backward compatibility with existing code. | _Leverage: src/types/index.ts | _Requirements: REQ-4, REQ-5 | Success: Types compile without errors, existing code still works, new types available. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 2: Backend Services

- [x] 3. Create registration log service
  - File: `functions/lib/registrationLog.ts`
  - Implement `createRegistrationLog(db, bookId, userId)` function
  - Set `log_type: 'registration'`, `content: '📖'`
  - Use book's `created_at` for log timestamp
  - Purpose: Encapsulate registration log creation logic
  - _Leverage: `functions/lib/db.ts`, `db/schema.ts`_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Hono/Cloudflare Workers expertise | Task: Create functions/lib/registrationLog.ts with createRegistrationLog function. Use Drizzle ORM to insert registration log with emoji content and matching timestamp. | Restrictions: Keep function pure and testable, handle errors gracefully, do not commit transaction (caller handles). | _Leverage: functions/lib/db.ts, db/schema.ts | _Requirements: REQ-4 | Success: Function creates registration log correctly, returns created log, integrates with Drizzle. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 4. Modify Books API to add user association and registration log
  - File: `functions/api/books/index.ts`
  - POST: Get user_id from Better Auth session
  - POST: Set user_id on new book
  - POST: Call `createRegistrationLog()` after book creation
  - GET: Filter books by authenticated user's user_id
  - Purpose: Associate books with users and auto-create registration log
  - _Leverage: `functions/api/books/index.ts`, `functions/lib/registrationLog.ts`, Better Auth session_
  - _Requirements: REQ-2, REQ-4_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Hono and Better Auth expertise | Task: Modify POST /api/books to extract user_id from session, set on book, and create registration log. Modify GET to filter by user_id. Use existing auth patterns. | Restrictions: Registration log failure should not fail book creation (log error only), maintain existing response format. | _Leverage: functions/api/books/index.ts, functions/lib/registrationLog.ts, existing auth middleware | _Requirements: REQ-2, REQ-4 | Success: Books are associated with users, registration log created on book creation, GET returns only user's books. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 5. Modify Logs API to add user association and ownership check
  - Files: `functions/api/logs/index.ts`, `functions/api/logs/[logId].ts`, `functions/api/books/[bookId]/logs.ts`
  - GET /api/logs: Filter by authenticated user's user_id
  - POST /api/books/:bookId/logs: Set user_id on new log
  - PUT /api/logs/:logId: Check ownership, return 403 if not owner
  - DELETE /api/logs/:logId: Check ownership, return 403 if not owner
  - Purpose: Ensure users can only access/modify their own logs
  - _Leverage: Existing API files, Better Auth session_
  - _Requirements: REQ-2, REQ-3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with security focus | Task: Add user_id filtering to GET, ownership to POST, and ownership checks (403) to PUT/DELETE in logs APIs. Extract user from session. | Restrictions: Must return 403 Forbidden for unauthorized access (not 404), maintain existing response formats. | _Leverage: functions/api/logs/index.ts, functions/api/logs/[logId].ts, functions/api/books/[bookId]/logs.ts | _Requirements: REQ-2, REQ-3 | Success: Logs are user-scoped, ownership checks prevent unauthorized modifications. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 6. Implement Public Timeline API with user filtering
  - File: `functions/api/users/[username]/timeline.ts`
  - Replace TODO/empty response with actual implementation
  - Query logs by user_id (resolve username → user_id first)
  - Join with books table for LogWithBook response
  - Return paginated results
  - Purpose: Enable public viewing of user timelines
  - _Leverage: `functions/api/users/[username]/timeline.ts`, `functions/api/users/[username]/index.ts`_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Implement GET /api/users/:username/timeline to return user's logs with book info. Resolve username to user_id, query logs with book join, return paginated LogWithBook[]. | Restrictions: Return 404 if user not found, follow existing pagination patterns, maintain response format compatibility with usePublicTimeline hook. | _Leverage: functions/api/users/[username]/timeline.ts, functions/api/users/[username]/index.ts | _Requirements: REQ-1 | Success: API returns user's logs with books, 404 for unknown users, pagination works. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 3: Frontend Logic

- [x] 7. Create timeline display logic utilities
  - File: `src/lib/timeline.ts`
  - Implement `shouldShowRegistrationLog(logs: Log[]): boolean`
  - Implement `isRegistrationLogOnly(logs: Log[]): boolean`
  - Implement `filterLogsForDisplay(logs: Log[]): Log[]`
  - Purpose: Centralize registration log display rules
  - _Leverage: `src/types/index.ts`_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/lib/timeline.ts with utility functions for registration log display logic. shouldShowRegistrationLog returns true if non-registration logs exist. isRegistrationLogOnly returns true if only registration log exists. | Restrictions: Keep functions pure, handle edge cases (empty array, null logs). | _Leverage: src/types/index.ts | _Requirements: REQ-5 | Success: Functions correctly identify display scenarios, handle all edge cases. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 8. Create log edit hook
  - File: `src/hooks/useLogEdit.ts`
  - Implement editing state management (isEditing, editedContent, editedLogType)
  - Implement startEdit, cancelEdit, saveEdit actions
  - Handle loading and error states
  - Call PUT /api/logs/:logId on save
  - Purpose: Encapsulate log editing logic
  - _Leverage: `src/services/logs.ts`, `src/hooks/useTimeline.ts` patterns_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create useLogEdit hook with editing state management and API integration. Follow existing hook patterns. Provide startEdit, cancelEdit, saveEdit functions with loading/error states. | Restrictions: Do not duplicate API logic, use existing logs service, handle optimistic updates if appropriate. | _Leverage: src/services/logs.ts, src/hooks/useTimeline.ts | _Requirements: REQ-3 | Success: Hook manages edit state correctly, saves to API, handles errors gracefully. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 9. Add log update function to logs service
  - File: `src/services/logs.ts`
  - Add `updateLog(logId, data): Promise<Log>` function
  - Handle API errors appropriately
  - Purpose: Enable log editing from frontend
  - _Leverage: `src/services/api.ts`, `src/services/logs.ts`_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Add updateLog function to src/services/logs.ts that calls PUT /api/logs/:logId. Follow existing service patterns for error handling. | Restrictions: Follow existing service patterns, handle 403 errors appropriately. | _Leverage: src/services/api.ts, src/services/logs.ts | _Requirements: REQ-3 | Success: updateLog function works correctly, errors are handled. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 4: UI Components

- [x] 10. Enhance TimelineItem with edit button and edit mode
  - File: `src/components/Timeline/TimelineItem.tsx`
  - Add `currentUserId` and `logUserId` props
  - Show edit button only when currentUserId === logUserId
  - Integrate useLogEdit hook for edit mode
  - Display inline edit form or modal when editing
  - Purpose: Enable log editing for owners only
  - _Leverage: `src/components/Timeline/TimelineItem.tsx`, `src/hooks/useLogEdit.ts`, `src/components/common/`_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Add edit functionality to TimelineItem. Show edit button only for log owner (currentUserId === logUserId). Use useLogEdit hook for state. Display edit form inline or in modal. | Restrictions: Do not show edit button for non-owners (UI-level security), maintain existing visual design. | _Leverage: src/components/Timeline/TimelineItem.tsx, src/hooks/useLogEdit.ts, src/components/common/ | _Requirements: REQ-3 | Success: Edit button appears only for owners, edit mode works correctly, saves changes. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 11. Enhance TimelineGroup for registration-only display
  - File: `src/components/Timeline/TimelineGroup.tsx`
  - Use `isRegistrationLogOnly()` to detect registration-only state
  - When registration-only: show book cover and info, hide log timeline
  - When has other logs: show all logs including registration log
  - Purpose: Implement registration log display rules
  - _Leverage: `src/components/Timeline/TimelineGroup.tsx`, `src/lib/timeline.ts`_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Modify TimelineGroup to handle registration-only books. Use isRegistrationLogOnly() from src/lib/timeline.ts. Show only book cover when registration-only, show all logs otherwise. | Restrictions: Maintain existing layout for normal logs, ensure visual distinction for registration-only books. | _Leverage: src/components/Timeline/TimelineGroup.tsx, src/lib/timeline.ts | _Requirements: REQ-5 | Success: Registration-only books show cover only, books with logs show all including registration log. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 12. Pass user context to Timeline components
  - Files: `src/components/Timeline/Timeline.tsx`, `src/components/Timeline/TimelineView.tsx`, `src/pages/TimelinePage.tsx`, `src/pages/PublicTimelinePage.tsx`
  - Pass currentUserId from useAuth to Timeline components
  - Pass logUserId from each log to TimelineItem
  - Purpose: Enable ownership-based UI rendering
  - _Leverage: `src/hooks/useAuth.ts`, existing Timeline components_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Thread currentUserId through Timeline component tree. Get from useAuth in pages, pass through Timeline/TimelineGroup to TimelineItem along with each log's userId. | Restrictions: Minimize prop drilling where possible, consider context if appropriate, maintain component interfaces. | _Leverage: src/hooks/useAuth.ts, Timeline components | _Requirements: REQ-3 | Success: TimelineItem receives both currentUserId and logUserId for ownership comparison. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 5: Testing

- [x] 13. Add unit tests for timeline display logic
  - File: `tests/lib/timeline.test.ts`
  - Test `shouldShowRegistrationLog()` with various log combinations
  - Test `isRegistrationLogOnly()` with edge cases
  - Test empty arrays, single logs, mixed logs
  - Purpose: Ensure display logic correctness
  - _Leverage: `src/lib/timeline.ts`, Vitest_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write comprehensive unit tests for src/lib/timeline.ts functions. Test all scenarios: empty array, only registration log, only memo logs, mixed logs. | Restrictions: Use Vitest, follow existing test patterns. | _Leverage: src/lib/timeline.ts, tests/ | _Requirements: REQ-5 | Success: All display logic scenarios are tested, edge cases covered. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 14. Add integration tests for user-scoped APIs
  - File: `tests/api/user-timeline.test.ts`
  - Test book creation with registration log auto-creation
  - Test log ownership checks (403 scenarios)
  - Test public timeline filtering
  - Purpose: Ensure API security and correctness
  - _Leverage: Existing API test patterns, Vitest_
  - _Requirements: REQ-1, REQ-2, REQ-3, REQ-4_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write integration tests for user-timeline APIs. Test book creation creates registration log, log PUT/DELETE returns 403 for non-owners, public timeline returns correct user's logs. | Restrictions: Mock auth session appropriately, use test database. | _Leverage: tests/, existing API test patterns | _Requirements: REQ-1, REQ-2, REQ-3, REQ-4 | Success: All API behaviors verified, security checks tested. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 6: Storybook & Documentation

- [x] 15. Add Storybook stories for updated components
  - Files: `src/components/Timeline/TimelineItem.stories.tsx`, `src/components/Timeline/TimelineGroup.stories.tsx`
  - Add story for TimelineItem with edit button (owner view)
  - Add story for TimelineItem without edit button (visitor view)
  - Add story for TimelineGroup with registration-only book
  - Add story for TimelineGroup with mixed logs
  - Purpose: Document component variants
  - _Leverage: Existing Storybook patterns, `src/stories/mocks/data.ts`_
  - _Requirements: REQ-3, REQ-5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create/update Storybook stories for TimelineItem and TimelineGroup showing new variants: owner vs visitor view, registration-only vs mixed logs. Use CSF 3.0 format. | Restrictions: Follow existing Storybook patterns, use shared mock data. | _Leverage: src/stories/, src/components/Timeline/*.stories.tsx | _Requirements: REQ-3, REQ-5 | Success: All new UI states documented in Storybook. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 7: Specification Changes (v2)

- [x] 16. Update timeline display logic to always hide registration logs
  - File: `src/lib/timeline.ts`
  - Replace `shouldShowRegistrationLog()` with `filterRegistrationLogs()` that always filters out registration logs
  - Update `filterLogsForDisplay()` to always exclude registration logs (no conditional logic)
  - Add `hasNonRegistrationLogs()` utility function
  - Purpose: Simplify registration log handling - always hidden, no branching
  - _Leverage: `src/lib/timeline.ts`, `src/types/index.ts`_
  - _Requirements: REQ-5 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Refactor src/lib/timeline.ts to always hide registration logs. Replace shouldShowRegistrationLog with filterRegistrationLogs that removes all registration logs. Update filterLogsForDisplay to use this unconditionally. | Restrictions: Registration logs must never appear in timeline UI, but books with only registration logs should still show book cover. | _Leverage: src/lib/timeline.ts, src/types/index.ts | _Requirements: REQ-5 | Success: Registration logs never shown in timeline, books still displayed. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 17. Update TimelineGroup to always filter registration logs
  - File: `src/components/Timeline/TimelineGroup.tsx`
  - Use `filterRegistrationLogs()` before displaying logs
  - Remove conditional logic that showed registration logs when other logs exist
  - Keep `isRegistrationLogOnly()` check for showing book cover only
  - Purpose: Ensure registration logs never appear in timeline
  - _Leverage: `src/components/Timeline/TimelineGroup.tsx`, `src/lib/timeline.ts`_
  - _Requirements: REQ-5 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Modify TimelineGroup to always filter out registration logs using filterRegistrationLogs(). Remove any conditional display of registration logs. Books with only registration logs still show book cover only. | Restrictions: Registration logs must never be visible, maintain book cover display for registration-only books. | _Leverage: src/components/Timeline/TimelineGroup.tsx, src/lib/timeline.ts | _Requirements: REQ-5 | Success: No registration logs visible in timeline, books with other logs show those logs only. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 18. Create Public Books API endpoint
  - File: `functions/api/users/[username]/books.ts`
  - Implement GET /api/users/:username/books endpoint
  - Resolve username to user_id, return user's books
  - Return 404 if user not found
  - Purpose: Enable book list display on public user timeline
  - _Leverage: `functions/api/users/[username]/timeline.ts`, `functions/api/books/index.ts`_
  - _Requirements: REQ-1 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create GET /api/users/:username/books endpoint in functions/api/users/[username]/books.ts. Resolve username to user, query their books, return paginated list. Return 404 if user not found. | Restrictions: Follow existing API patterns, reuse user lookup logic from timeline.ts. | _Leverage: functions/api/users/[username]/timeline.ts, functions/api/books/index.ts | _Requirements: REQ-1 | Success: API returns user's books, 404 for unknown users. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 19. Create usePublicUserData hook for unified data fetching
  - File: `src/hooks/usePublicUserData.ts`
  - Combine usePublicTimeline logic with books fetching
  - Return user, logs, books, loading states
  - Handle 404 for non-existent users
  - Purpose: Single hook for public user page data
  - _Leverage: `src/hooks/usePublicTimeline.ts`, `src/services/`_
  - _Requirements: REQ-1 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create usePublicUserData hook that fetches both timeline and books for a public user. Combine patterns from usePublicTimeline. Return unified data structure with user, logs, books, and loading/error states. | Restrictions: Reuse existing service functions, handle 404 gracefully. | _Leverage: src/hooks/usePublicTimeline.ts, src/services/ | _Requirements: REQ-1 | Success: Hook returns user timeline and book data, handles errors. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 20. Refactor PublicTimelinePage to match HomePage layout
  - File: `src/pages/PublicTimelinePage.tsx`
  - Use same layout structure as HomePage
  - Add UserInfo (showing target user's info)
  - Add HeaderActionButtons (hide "Add Log" for non-owners)
  - Add TabNavigation (timeline/bookshelf tabs)
  - Use TimelineView and BookListView based on active tab
  - Purpose: Unified UX across home and public timeline
  - _Leverage: `src/pages/HomePage.tsx`, `src/components/common/`, `src/hooks/usePublicUserData.ts`_
  - _Requirements: REQ-1 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Refactor PublicTimelinePage to use HomePage's layout structure. Include UserInfo (target user), TabNavigation, HeaderActionButtons (hide Add Log for visitors). Use TimelineView/BookListView based on tab. Use usePublicUserData hook. | Restrictions: Maintain 404 and error handling, hide action buttons for non-owners, preserve existing functionality. | _Leverage: src/pages/HomePage.tsx, src/components/common/, src/hooks/usePublicUserData.ts | _Requirements: REQ-1 | Success: PublicTimelinePage looks like HomePage with tabs, appropriate actions shown. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 21. Update tests for new registration log behavior
  - Files: `tests/lib/timeline.test.ts`, `tests/api/user-timeline.test.ts`
  - Update unit tests to verify registration logs are always filtered
  - Add tests for filterRegistrationLogs function
  - Update integration tests for new API endpoint
  - Purpose: Ensure new behavior is tested
  - _Leverage: Existing test files, Vitest_
  - _Requirements: REQ-1, REQ-5 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Update timeline.test.ts to test filterRegistrationLogs always removes registration logs. Add tests for /api/users/:username/books endpoint. Verify registration logs never appear in any display scenario. | Restrictions: Keep existing passing tests, follow test patterns. | _Leverage: tests/lib/timeline.test.ts, tests/api/user-timeline.test.ts | _Requirements: REQ-1, REQ-5 | Success: All new behaviors tested, no registration logs in display. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 22. Update Storybook stories for PublicTimelinePage layout
  - Files: `src/pages/PublicTimelinePage.stories.tsx` (new)
  - Add story for public timeline with owner viewing (shows action buttons)
  - Add story for public timeline with visitor viewing (no action buttons)
  - Add story for timeline tab view
  - Add story for bookshelf tab view
  - Purpose: Document new page layout variants
  - _Leverage: Existing Storybook patterns, `src/stories/mocks/data.ts`_
  - _Requirements: REQ-1 (updated)_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Storybook stories for PublicTimelinePage showing owner view vs visitor view, timeline tab vs bookshelf tab. Use CSF 3.0 format with autodocs. | Restrictions: Follow existing Storybook patterns, mock usePublicUserData appropriately. | _Leverage: src/stories/, src/pages/*.stories.tsx patterns | _Requirements: REQ-1 | Success: All PublicTimelinePage variants documented in Storybook. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

## Phase 8: Empty State Display (REQ-7)

- [x] 23. Enhance TimelineEmpty component with owner/visitor variants
  - File: `src/components/Timeline/TimelineEmpty.tsx`
  - Add `variant` prop: `'timeline' | 'books'`
  - Add `isOwner` prop: boolean
  - Add `username` prop: string (for visitor view)
  - Owner view: show action button (「本を登録する」)
  - Visitor view: show message only (「@{username}さんはまだ...」)
  - Purpose: Display appropriate empty state based on viewer context
  - _Leverage: Existing `TimelineEmpty.tsx`, `src/components/common/Button.tsx`_
  - _Requirements: REQ-7.1, REQ-7.2, REQ-7.3_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Enhance TimelineEmpty with variant, isOwner, and username props. Show "本を登録する" button only for owners. Display "@{username}さんはまだ..." for visitors. Support both timeline and books variants. | Restrictions: Maintain existing styling, use Link component for navigation. | _Leverage: src/components/Timeline/TimelineEmpty.tsx, src/components/common/Button.tsx | _Requirements: REQ-7.1, REQ-7.2, REQ-7.3 | Success: TimelineEmpty displays correctly for all 4 combinations (timeline/books × owner/visitor). Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 24. Create BooksEmpty component for empty book list
  - File: `src/components/BookList/BooksEmpty.tsx`
  - Similar structure to TimelineEmpty but for books tab
  - Add `isOwner` prop: boolean
  - Add `username` prop: string (for visitor view)
  - Owner view: 「まだ本がありません」+ 「本を登録する」ボタン
  - Visitor view: 「@{username}さんはまだ本を登録していません」
  - Purpose: Display appropriate empty state for books list
  - _Leverage: `TimelineEmpty.tsx` pattern_
  - _Requirements: REQ-7.4, REQ-7.5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create BooksEmpty component following TimelineEmpty pattern. Show "本を登録する" button only for owners. Display "@{username}さんはまだ本を登録していません" for visitors. | Restrictions: Follow TimelineEmpty styling and structure. | _Leverage: src/components/Timeline/TimelineEmpty.tsx | _Requirements: REQ-7.4, REQ-7.5 | Success: BooksEmpty displays correctly for owner/visitor views. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 25. Update PublicTimelinePage to use TimelineEmpty and BooksEmpty
  - File: `src/pages/PublicTimelinePage.tsx`
  - Replace inline empty state JSX with TimelineEmpty component
  - Replace inline empty books JSX with BooksEmpty component
  - Pass isOwner and username props appropriately
  - Purpose: Use reusable empty state components
  - _Leverage: `TimelineEmpty.tsx`, `BooksEmpty.tsx`, existing `PublicTimelinePage.tsx`_
  - _Requirements: REQ-7.1, REQ-7.2, REQ-7.3, REQ-7.4, REQ-7.5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Refactor PublicTimelinePage to use TimelineEmpty and BooksEmpty components instead of inline JSX. Pass isOwner and username props. Remove duplicate empty state code. | Restrictions: Maintain existing functionality, ensure proper prop passing. | _Leverage: src/pages/PublicTimelinePage.tsx, TimelineEmpty.tsx, BooksEmpty.tsx | _Requirements: REQ-7.1, REQ-7.2, REQ-7.3, REQ-7.4, REQ-7.5 | Success: Empty states render correctly using shared components. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 26. Update TimelineEmpty Storybook stories
  - File: `src/components/Timeline/TimelineEmpty.stories.tsx`
  - Add story for owner view (with button)
  - Add story for visitor view (message only)
  - Add story for books variant (owner)
  - Add story for books variant (visitor)
  - Purpose: Document all empty state variants
  - _Leverage: Existing `TimelineEmpty.stories.tsx`, Storybook patterns_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Update TimelineEmpty.stories.tsx to show all 4 variants: OwnerTimeline, VisitorTimeline, OwnerBooks, VisitorBooks. Use CSF 3.0 format. | Restrictions: Follow existing Storybook patterns. | _Leverage: src/components/Timeline/TimelineEmpty.stories.tsx | _Requirements: REQ-7 | Success: All TimelineEmpty variants documented in Storybook. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._

- [x] 27. Add BooksEmpty Storybook stories
  - File: `src/components/BookList/BooksEmpty.stories.tsx`
  - Add story for owner view (with button)
  - Add story for visitor view (message only)
  - Purpose: Document books empty state variants
  - _Leverage: Storybook patterns, `TimelineEmpty.stories.tsx`_
  - _Requirements: REQ-7.4, REQ-7.5_
  - _Prompt: Implement the task for spec user-timeline, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create BooksEmpty.stories.tsx with Owner and Visitor stories. Use CSF 3.0 format with autodocs. | Restrictions: Follow existing Storybook patterns. | _Leverage: TimelineEmpty.stories.tsx patterns | _Requirements: REQ-7.4, REQ-7.5 | Success: BooksEmpty variants documented in Storybook. Mark task as in-progress in tasks.md before starting, log implementation with log-implementation tool after completion, then mark as complete._
