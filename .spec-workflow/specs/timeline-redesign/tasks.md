# Tasks Document: Timeline Redesign

## Phase 1: 共通コンポーネントとフック

- [x] 1. BookCover コンポーネントの作成
  - File: `src/components/common/BookCover.tsx`
  - 書影サムネイル表示コンポーネント
  - coverUrl がない場合はデフォルトアイコン表示
  - サイズバリエーション（sm: 32x48, md: 48x64, lg: 64x96）
  - Purpose: タイムラインと本一覧で書影を統一的に表示
  - _Leverage: 既存の Tailwind CSS クラス_
  - _Requirements: 3.1, 3.2, 3.3_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React/TypeScript Developer specializing in UI components | Task: Create BookCover component at src/components/common/BookCover.tsx. Props: coverUrl (string | null), title (string), size ('sm' | 'md' | 'lg', default 'md'), className (optional). Show image if coverUrl exists, otherwise show a book icon placeholder with gray background. Sizes: sm=32x48px, md=48x64px, lg=64x96px. Use rounded corners (4px). Handle image load errors by showing fallback icon. | Restrictions: Do not add external dependencies, use only Tailwind CSS for styling, do not modify other files | Success: Component renders correctly with/without coverUrl, all sizes work, image errors handled gracefully. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 2. useTabNavigation フックの作成
  - File: `src/hooks/useTabNavigation.ts`
  - タブ状態管理（timeline | books）
  - デフォルトタブの設定
  - Purpose: HomePage でのタブ切り替え状態管理
  - _Leverage: React useState_
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer specializing in custom hooks | Task: Create useTabNavigation hook at src/hooks/useTabNavigation.ts. Define TabType = 'timeline' | 'books'. Return { activeTab, setActiveTab }. Accept optional defaultTab parameter (defaults to 'timeline'). | Restrictions: Keep it simple, no side effects, no localStorage persistence for now | Success: Hook manages tab state correctly, type-safe. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 3. useBookList フックの作成
  - File: `src/hooks/useBookList.ts`
  - 本一覧のデータ取得・削除ロジック
  - BookListPage.tsx のロジックを抽出
  - Purpose: BookListView での本一覧データ管理
  - _Leverage: src/services/books.ts (getBooks, deleteBook), src/pages/BookListPage.tsx のロジック_
  - _Requirements: 4.1, 4.2, 4.3_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer specializing in data fetching hooks | Task: Create useBookList hook at src/hooks/useBookList.ts. Extract logic from BookListPage.tsx. Return { books, isLoading, error, deleteBook, refetch }. Use getBooks and deleteBook from services/books.ts. Handle ApiClientError for error messages. Auto-fetch on mount with useEffect. | Restrictions: Do not modify BookListPage.tsx yet, follow existing hook patterns in the codebase | Success: Hook fetches books, handles loading/error states, deleteBook works with refetch. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 4. TabNavigation コンポーネントの作成
  - File: `src/components/common/TabNavigation.tsx`
  - タイムライン/本一覧タブ UI
  - Figma デザインに合わせたスタイル
  - Purpose: タブ切り替え UI の提供
  - _Leverage: Figma デザイン（node-id: 11:159-169）_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React/TypeScript Developer specializing in UI components | Task: Create TabNavigation component at src/components/common/TabNavigation.tsx. Props: activeTab ('timeline' | 'books'), onTabChange callback. Style per Figma: container bg-gray-100 rounded-[14px] h-[36px] p-[5px], active tab has white bg with border, inactive has no bg. Include clock icon for Timeline tab, book icon for Books tab. Tab labels: 'タイムライン', '本の一覧'. | Restrictions: Use only Tailwind CSS, inline SVG icons, no external icon libraries | Success: Tabs render correctly, active state is visually distinct, clicking triggers onTabChange. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 5. HeaderActionButtons コンポーネントの作成
  - File: `src/components/common/HeaderActionButtons.tsx`
  - 「ログを追加」「本を追加」ボタン
  - Figma デザインに合わせたスタイル
  - Purpose: ヘッダーのアクションボタン提供
  - _Leverage: src/components/common/Button.tsx, react-router-dom Link, Figma デザイン（node-id: 11:145-155）_
  - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create HeaderActionButtons at src/components/common/HeaderActionButtons.tsx. Props: onAddLog callback. Two buttons: 1) 'ログを追加' - black bg (bg-gray-900), white text, plus icon, calls onAddLog. 2) '本を追加' - white bg, gray border, book-plus icon, Link to /books/new. Both h-[36px] rounded-[8px]. Use inline SVG icons. | Restrictions: Use existing Button component if suitable or create custom buttons with Tailwind | Success: Both buttons render correctly, ログを追加 triggers callback, 本を追加 navigates to /books/new. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 5.1. UserInfo コンポーネントの作成
  - File: `src/components/common/UserInfo.tsx`
  - ヘッダー下・タイムラインの上に表示するユーザー情報（アイコン + ユーザー名）
  - 「このタイムラインが誰の読んだ本の記録か」を示す
  - Purpose: ユーザー識別情報の表示
  - _Leverage: Tailwind CSS_
  - _Requirements: design.md UserInfo セクション_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React/TypeScript Developer | Task: Create UserInfo component at src/components/common/UserInfo.tsx. Props: name (optional, default 'ゲスト'), avatarUrl (optional). Display: 32x32px circular avatar (gray bg with initial if no avatarUrl) + username (14px, gray-500). Layout: flex items-center gap-2. If avatarUrl provided, show image; otherwise show first character of name as initial. | Restrictions: Pure UI component, no external dependencies, use only Tailwind CSS | Success: Component renders avatar + username correctly, handles missing props gracefully. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

## Phase 2: タイムラインコンポーネントのリファクタリング

- [x] 6. TimelineItem コンポーネントの簡素化
  - File: `src/components/Timeline/TimelineItem.tsx`
  - カード枠を削除、Figma デザインに合わせて簡素化
  - ドットスタイルの変更（グレー塗り、引用はボーダーのみ）
  - 編集機能削除、削除ボタンのみ残す
  - Purpose: Figma デザインに合わせたログ表示
  - _Leverage: 既存の TimelineItem.tsx, QuoteDisplay.tsx_
  - _Requirements: 2.3, 2.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer specializing in refactoring | Task: Refactor TimelineItem at src/components/Timeline/TimelineItem.tsx. Changes: 1) Remove card wrapper (border, shadow, padding), content is plain text. 2) Dot style: 16px circle, gray-500 fill for memo, border-only (no fill) for quote. 3) Remove edit functionality (isEditMode, handleEdit, onEdit prop). 4) Keep delete button (trash icon) on right side, visible on hover. 5) Show timestamp below content in gray-500. 6) Simplify props: log, isLast, onDelete, isDeleting. | Restrictions: Keep QuoteDisplay usage for quotes, maintain existing delete confirmation UX | Success: Cleaner UI matching Figma, no edit mode, delete still works. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 6.1. QuoteDisplay のスタイルをグレー系に変更
  - File: `src/components/Timeline/QuoteDisplay.tsx`
  - 背景色を削除（透明に）
  - 左ボーダー色を amber-400 → gray-200 に変更
  - テキスト色を gray-700 → gray-500 に変更
  - 角丸（rounded-r）を削除
  - Purpose: 引用表示をミニマル・モダンなスタイルに統一
  - _Leverage: 既存の QuoteDisplay.tsx_
  - _Requirements: design.md QuoteDisplay セクション_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update QuoteDisplay.tsx styling. Change from amber/yellow theme to gray theme. Before: "border-l-4 border-amber-400 pl-4 py-1 italic text-gray-700 bg-amber-50/50 rounded-r". After: "border-l-4 border-gray-200 pl-5 italic text-gray-500". Remove background color and rounded corners for a cleaner, minimal look. | Restrictions: Only change styling, keep component structure | Success: Quote displays with gray left border, no background, gray text. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 7. TimelineGroup コンポーネントの改修（書影追加）
  - File: `src/components/Timeline/TimelineGroup.tsx`
  - 書影サムネイル追加（BookCover 使用）
  - 本ヘッダーのドットスタイル変更（黒丸、白い内円）
  - 縦ラインのスタイル調整
  - Purpose: 書影付きの本グループ表示
  - _Leverage: BookCover コンポーネント（Task 1）, 既存の TimelineGroup.tsx_
  - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.2, 3.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Refactor TimelineGroup at src/components/Timeline/TimelineGroup.tsx. Changes: 1) Add BookCover (size='md') next to book title. 2) Book header dot: 16px black circle (bg-gray-900) with 8px white inner circle. 3) Vertical line: 2px wide, bg-gray-200 (or rgba(0,0,0,0.1)), positioned at left-[7px]. 4) Layout: dot + gap-4 + BookCover + (title + author stack). 5) Keep Link to book detail on both cover and title. | Restrictions: Import BookCover from ../common, maintain existing TimelineItem integration | Success: Book groups show cover image, dot and line styles match Figma. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 7.1. TimelineGroup からグループレベルの縦ラインを削除
  - File: `src/components/Timeline/TimelineGroup.tsx`
  - グループ全体をカバーする縦ライン（`left-[7px]`）を削除
  - 縦ラインは TimelineItem 内でのみ表示（二重表示を防ぐ）
  - Purpose: 縦ラインの二重表示を解消
  - _Leverage: 既存の TimelineGroup.tsx_
  - _Requirements: design.md TimelineGroup セクション_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update TimelineGroup.tsx to remove the group-level vertical line. Remove the div with class "absolute left-[7px] top-2 bottom-0 w-0.5 bg-black/10". The vertical line should only be rendered inside each TimelineItem, not at the group level. This prevents double vertical lines from appearing. | Restrictions: Only remove the vertical line div, keep all other functionality | Success: Only one vertical line appears per log item (from TimelineItem), no duplicate lines. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 8. TimelineView コンポーネントの作成
  - File: `src/components/Timeline/TimelineView.tsx`
  - タイムラインタブのコンテンツコンテナ
  - useTimeline を使用したデータ取得
  - Purpose: タブ内でのタイムライン表示
  - _Leverage: src/hooks/useTimeline.ts, src/components/Timeline/Timeline.tsx_
  - _Requirements: 1.2_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create TimelineView at src/components/Timeline/TimelineView.tsx. This is a container component that uses useTimeline hook and renders Timeline component. Handle loading state (show Loading component), error state (show error message with retry), and empty state (delegates to Timeline's TimelineEmpty). No props needed - self-contained. | Restrictions: Reuse existing useTimeline and Timeline components, do not duplicate logic | Success: TimelineView fetches and displays timeline data with proper loading/error handling. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

## Phase 3: 本一覧コンポーネント

- [x] 9. BookGrid コンポーネントの作成
  - File: `src/components/BookList/BookGrid.tsx`
  - 本のグリッド表示（BookListPage から抽出）
  - 削除機能付き
  - Purpose: 本一覧のグリッド UI
  - _Leverage: src/pages/BookListPage.tsx のグリッド部分_
  - _Requirements: 4.2, 4.3_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create BookGrid at src/components/BookList/BookGrid.tsx. Props: books (BookWithLogCount[]), onDelete callback (optional). Extract grid rendering logic from BookListPage.tsx. Use existing Card/CardContent components. Grid: gap-4 sm:grid-cols-2 lg:grid-cols-3. Each card shows title, author, publisher, logCount. Include delete button with confirmation (extract from BookListPage). | Restrictions: Create new directory src/components/BookList/, do not modify BookListPage yet | Success: BookGrid renders book cards with delete functionality. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 10. BookListView コンポーネントの作成
  - File: `src/components/BookList/BookListView.tsx`
  - 本一覧タブのコンテンツコンテナ
  - useBookList を使用したデータ取得
  - Purpose: タブ内での本一覧表示
  - _Leverage: useBookList フック（Task 3）, BookGrid（Task 9）_
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create BookListView at src/components/BookList/BookListView.tsx. Container using useBookList hook. Handle loading (Loading component), error (error message + retry button), empty (message + Link to /books/new). Render BookGrid with books and deleteBook handler. No header needed (handled by HomePage). | Restrictions: Reuse useBookList and BookGrid, keep it simple | Success: BookListView shows book grid with proper loading/error/empty states. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 11. BookList バレルエクスポートの作成
  - File: `src/components/BookList/index.ts`
  - BookGrid, BookListView のエクスポート
  - Purpose: インポートパスの簡略化
  - _Leverage: 既存の components/*/index.ts パターン_
  - _Requirements: N/A (infrastructure)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Create barrel export at src/components/BookList/index.ts. Export BookGrid and BookListView. Follow existing pattern from src/components/common/index.ts. | Restrictions: Only export public components | Success: Components can be imported from '../components/BookList'. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

## Phase 4: ページ統合

- [x] 12. HomePage コンポーネントの作成
  - File: `src/pages/HomePage.tsx`
  - タブナビゲーション統合ページ
  - ヘッダー下・タイムラインの上に UserInfo を表示（「誰の読書記録か」を示す）
  - タブ切り替えによるビュー表示
  - QuickLogModal の統合
  - Purpose: タイムラインと本一覧の統合メインページ
  - _Leverage: TabNavigation, HeaderActionButtons, TimelineView, BookListView, QuickLogModal, useTabNavigation, UserInfo_
  - _Requirements: 1.1-1.5, 5.1-5.4_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update HomePage at src/pages/HomePage.tsx. Structure: 1) UserInfo component at the top (below header, above tabs) to show whose reading log this is. 2) HeaderActionButtons on the right. 3) TabNavigation below. 4) Conditional render: TimelineView when activeTab='timeline', BookListView when activeTab='books'. 5) QuickLogModal integration. | Restrictions: UserInfo should be placed between header and TabNavigation, not in the header itself | Success: Full page with UserInfo visible at top, working tab navigation, quick log modal. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 13. App.tsx ルーティングの更新
  - File: `src/App.tsx`
  - `/` を HomePage に変更
  - `/books` ルートを削除（またはリダイレクト）
  - Purpose: 新しいページ構造への移行
  - _Leverage: 既存の App.tsx_
  - _Requirements: 1.1_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update App.tsx routing. Changes: 1) Import HomePage instead of TimelinePage. 2) Change Route path="/" to render HomePage. 3) Remove or redirect /books route (can add Navigate redirect to / for backward compat). Keep /books/new and /books/:id routes unchanged. | Restrictions: Maintain backward compatibility for /books/:id and /books/new | Success: / renders HomePage, /books redirects or removed, other routes work. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 14. useKeyboardShortcuts の更新
  - File: `src/hooks/useKeyboardShortcuts.ts`
  - Alt+H, Alt+B をタブ切り替えに対応
  - グローバルタブ状態との連携方法を検討
  - Purpose: キーボードショートカットの整合性維持
  - _Leverage: 既存の useKeyboardShortcuts.ts_
  - _Requirements: 1.5_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update useKeyboardShortcuts at src/hooks/useKeyboardShortcuts.ts. Current behavior uses navigate() for Alt+H (/) and Alt+B (/books). New behavior: Since both views are now on /, we need a different approach. Option 1: Keep navigation to / for both (simple, but loses tab state). Option 2: Add optional callback props for tab switching. Option 3: Use URL hash (#timeline, #books) or query param. Recommend Option 1 for simplicity - navigate to / which defaults to timeline tab. Alt+B could navigate to /?tab=books if we add query param support to HomePage. Implement the simplest working solution. | Restrictions: Keep Alt+N for /books/new unchanged | Success: Keyboard shortcuts work with new page structure. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

## Phase 5: クリーンアップとエクスポート

- [x] 15. common/index.ts バレルエクスポートの更新
  - File: `src/components/common/index.ts`
  - BookCover, TabNavigation, HeaderActionButtons, UserInfo の追加
  - Purpose: 新コンポーネントのエクスポート
  - _Leverage: 既存の index.ts_
  - _Requirements: N/A (infrastructure)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Update src/components/common/index.ts to export new components: BookCover, TabNavigation, HeaderActionButtons, UserInfo. Follow existing export pattern. | Restrictions: Only add exports, do not remove existing ones | Success: New components can be imported from '../components/common'. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 15.1. Layout.tsx からユーザー情報を削除
  - File: `src/components/common/Layout.tsx`
  - ヘッダー右側のユーザー情報（アバター + ユーザー名）を削除
  - UserInfo は HomePage でヘッダー下に表示するため、Layout からは削除
  - Purpose: design.md の修正に合わせてヘッダーをシンプル化
  - _Leverage: 既存の Layout.tsx_
  - _Requirements: design.md Layout セクション_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update Layout.tsx to remove user info from header. Remove the div containing avatar icon and "Guest" text from the header right side. The header should only show the Logbook logo/title on the left. UserInfo will be displayed in HomePage instead. | Restrictions: Only remove user info section, keep rest of Layout unchanged | Success: Header shows only logo, no user info. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 16. Timeline/index.ts バレルエクスポートの更新
  - File: `src/components/Timeline/index.ts`
  - TimelineView の追加
  - Purpose: 新コンポーネントのエクスポート
  - _Leverage: 既存の index.ts_
  - _Requirements: N/A (infrastructure)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Update src/components/Timeline/index.ts to export TimelineView. Follow existing export pattern. | Restrictions: Only add exports | Success: TimelineView can be imported from '../components/Timeline'. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 17. 不要ファイルの削除検討
  - Files: `src/pages/TimelinePage.tsx`, `src/pages/BookListPage.tsx`
  - TimelinePage は HomePage に置き換え
  - BookListPage のロジックは hooks/components に移動済み
  - Purpose: コードベースの整理
  - _Leverage: 新しい HomePage, useBookList, BookListView_
  - _Requirements: N/A (cleanup)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Senior Developer | Task: Review and clean up deprecated files. 1) TimelinePage.tsx - can be deleted if HomePage fully replaces it. 2) BookListPage.tsx - can be deleted if useBookList and BookListView cover all functionality. Before deleting: verify no other imports reference these files (grep for imports). If still referenced, update those references first. | Restrictions: Only delete if safe, verify no breaking imports | Success: Unused files removed, no broken imports. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

## Phase 6: テスト

- [x] 18. コンポーネントテストの作成 (オプショナル)
  - Files: `tests/components/BookCover.test.tsx`, `tests/components/TabNavigation.test.tsx`
  - 新規コンポーネントのユニットテスト
  - Purpose: コンポーネントの信頼性確保
  - _Leverage: 既存のテストパターン, Vitest, Testing Library_
  - _Requirements: All (testing)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer specializing in React testing | Task: Create unit tests for new components. 1) BookCover.test.tsx: test with/without coverUrl, different sizes, image error fallback. 2) TabNavigation.test.tsx: test tab rendering, click handlers, active state styling. Use @testing-library/react and vitest. Follow existing test patterns in the codebase. | Restrictions: Mock external dependencies, test in isolation | Success: Tests pass, good coverage of component behavior. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 19. フックテストの作成 (オプショナル)
  - Files: `tests/hooks/useTabNavigation.test.ts`, `tests/hooks/useBookList.test.ts`
  - 新規フックのユニットテスト
  - Purpose: フックの信頼性確保
  - _Leverage: @testing-library/react-hooks または renderHook_
  - _Requirements: All (testing)_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Create unit tests for new hooks. 1) useTabNavigation.test.ts: test default tab, tab switching. 2) useBookList.test.ts: test initial fetch, loading state, error handling, deleteBook, refetch. Mock API calls. Use renderHook from @testing-library/react. | Restrictions: Mock all API calls, test hook logic in isolation | Success: Tests pass, hooks work correctly in all scenarios. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._

- [x] 20. E2E テスト (オプショナル) - スキップ
  - File: `tests/e2e/tabNavigation.test.ts` (if E2E setup exists)
  - タブ切り替えのユーザーフロー
  - Purpose: ユーザー体験の検証
  - **Note:** E2Eフレームワーク（Playwright/Cypress）が未セットアップのためスキップ。将来的に導入時に実装予定。
  - _Leverage: 既存の E2E テストセットアップ（あれば）_
  - _Requirements: 1.1-1.5_
  - _Prompt: Implement the task for spec timeline-redesign, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Automation Engineer | Task: If E2E testing is set up (Playwright/Cypress), create tab navigation tests. Test: 1) Default tab is timeline. 2) Click 'books' tab shows book list. 3) Click 'timeline' tab returns to timeline. 4) Quick log modal opens from header button. If no E2E setup, skip this task and note it as future work. | Restrictions: Only implement if E2E framework is already configured | Success: E2E tests pass or task documented as skipped. After implementation, mark task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark task as complete [x] in tasks.md._
