# Tasks Document

## Overview
本の検索体験向上のための実装タスク。ページネーション機能とタイトル一致度ソートを追加する。

---

- [ ] 1. バリデーションスキーマの拡張
  - File: `src/lib/validation.ts`
  - `ndlSearchSchema` に `idx` パラメータを追加
  - `cnt` のデフォルト値を 30 に変更
  - Purpose: NDL API のページネーションパラメータをサポート
  - _Leverage: 既存の Zod スキーマパターン_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: TypeScript Developer specializing in Zod validation schemas
    Task: Extend ndlSearchSchema in src/lib/validation.ts to add idx parameter (min 1, default 1) and change cnt default from 10 to 30. Reference design.md for exact schema definition.
    Restrictions: Do not modify other schemas, maintain backward compatibility with existing API calls
    _Leverage: Existing Zod patterns in validation.ts
    _Requirements: Requirement 3.1 (取得件数の最適化)
    Success: Schema compiles without errors, idx parameter is properly validated, cnt defaults to 30
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 2. バックエンド API の拡張
  - File: `functions/api/ndl/search.ts`
  - `idx` パラメータを NDL OpenSearch URL に追加
  - NDL API レスポンスから totalResults を正しく抽出
  - Purpose: ページネーション用のパラメータを NDL API に転送
  - _Leverage: 既存の XML パース処理_
  - _Requirements: 1.1, 1.5_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Backend Developer with Hono and Cloudflare Workers expertise
    Task: Extend the NDL search endpoint in functions/api/ndl/search.ts to (1) pass idx parameter to NDL OpenSearch API URL, (2) extract openSearch:totalResults from XML response and return it in the JSON response. Reference the NDL API URL pattern: https://ndlsearch.ndl.go.jp/api/opensearch?title=xxx&cnt=30&idx=1
    Restrictions: Do not change the response structure for items, maintain existing error handling, do not modify XML parsing for book items
    _Leverage: Existing XML parsing logic in parseNdlXml function
    _Requirements: Requirement 1.1 (ページネーション), 1.5 (500件制限)
    Success: API accepts idx parameter, totalResults is correctly returned, existing functionality unchanged
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 3. フロントエンド NDL サービスの拡張
  - File: `src/services/ndl.ts`
  - `NdlSearchParams` インターフェースに `idx` を追加
  - `searchNdl` 関数で `idx` パラメータを送信
  - Purpose: フロントエンドから idx パラメータを指定可能にする
  - _Leverage: 既存の apiClient パターン_
  - _Requirements: 1.1_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Frontend Developer with TypeScript and API client expertise
    Task: Extend NdlSearchParams interface in src/services/ndl.ts to include optional idx parameter (number), and update searchNdl function to append idx to URLSearchParams when provided
    Restrictions: Do not change the function signature beyond adding the new parameter, maintain existing error handling
    _Leverage: Existing URLSearchParams pattern in searchNdl
    _Requirements: Requirement 1.1 (ページネーション)
    Success: searchNdl accepts idx parameter and correctly passes it to API
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 4. 検索結果ソートユーティリティの作成
  - File: `src/lib/search-relevance.ts` (新規)
  - `calculateRelevanceScore` 関数を実装（完全一致 100、前方一致 80、部分一致 60、その他 40）
  - `sortByRelevance` 関数を実装（スコア降順でソート）
  - Purpose: 検索結果をタイトル一致度でソートする純粋関数を提供
  - _Leverage: NdlBook 型定義_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: TypeScript Developer specializing in utility functions and algorithms
    Task: Create new file src/lib/search-relevance.ts with two pure functions: (1) calculateRelevanceScore(book: NdlBook, query: string): number - returns 100 for exact title match, 80 for prefix match, 60 for contains match, 40 otherwise, plus 10 bonus if author contains query; (2) sortByRelevance(books: NdlBook[], query: string): NdlBook[] - sorts books by relevance score descending. Use case-insensitive comparison.
    Restrictions: Must be pure functions with no side effects, do not modify input arrays, import NdlBook type from ../types
    _Leverage: NdlBook type from src/types/index.ts
    _Requirements: Requirement 2.1, 2.2, 2.3 (検索結果の一致度ソート)
    Success: Functions are pure, correctly calculate scores, sort works as expected
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 5. ソートユーティリティのユニットテスト
  - File: `tests/lib/search-relevance.test.ts` (新規)
  - 完全一致、前方一致、部分一致、著者名一致のテストケース
  - ソート結果の順序テスト
  - Purpose: ソートロジックの正確性を保証
  - _Leverage: 既存の Vitest テストパターン_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: QA Engineer with Vitest testing expertise
    Task: Create tests/lib/search-relevance.test.ts with comprehensive unit tests for calculateRelevanceScore and sortByRelevance functions. Test cases: exact title match (100), prefix match (80), contains match (60), no match (40), author bonus (+10), case insensitivity, sort order verification with multiple books
    Restrictions: Use Vitest (import { describe, it, expect } from 'vitest'), create mock NdlBook objects for testing, do not test edge cases beyond the specified scoring rules
    _Leverage: Existing test patterns in tests/lib/*.test.ts
    _Requirements: Requirement 2.1, 2.2, 2.3 (検索結果の一致度ソート)
    Success: All test cases pass, good coverage of scoring logic
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 6. useBookSearch フックの拡張
  - File: `src/hooks/useBookSearch.ts`
  - 状態追加: `hasMore`, `isLoadingMore`, `currentIdx`, `allResults`
  - `loadMore` 関数を実装（idx を増加させて追加取得、既存結果にマージ）
  - 検索結果のソート処理を追加
  - 検索クエリ変更時に状態をリセット
  - Purpose: ページネーションとソートの状態管理を統括
  - _Leverage: 既存のデバウンス、AbortController パターン_
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.4_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Developer with custom hooks expertise
    Task: Extend useBookSearch hook in src/hooks/useBookSearch.ts to add: (1) new state: hasMore (boolean), isLoadingMore (boolean), currentIdx (number, starts at 1), allResults (NdlBook[]); (2) loadMore async function that increments idx by 30, fetches next page, merges with allResults, and re-sorts all results; (3) apply sortByRelevance to results before returning; (4) reset allResults and currentIdx when query changes; (5) calculate hasMore based on totalResults vs fetched count (max 500). Update return type to include hasMore, isLoadingMore, loadMore.
    Restrictions: Maintain existing debounce and AbortController patterns, do not break existing search functionality, import sortByRelevance from ../lib/search-relevance
    _Leverage: Existing debounce, AbortController patterns in useBookSearch.ts, sortByRelevance from src/lib/search-relevance.ts
    _Requirements: Requirement 1.1-1.4 (ページネーション), 2.1, 2.4 (ソート)
    Success: Hook returns hasMore, isLoadingMore, loadMore; pagination works correctly; results are sorted by relevance
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 7. NdlSearchResults コンポーネントの拡張
  - File: `src/components/BookForm/NdlSearchResults.tsx`
  - Props 追加: `hasMore`, `isLoadingMore`, `onLoadMore`
  - 「もっと見る」ボタンを検索結果の下部に追加
  - ローディング状態の表示
  - Purpose: ユーザーが追加の検索結果を読み込めるUIを提供
  - _Leverage: 既存の Button コンポーネント_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Developer with UI component expertise
    Task: Extend NdlSearchResults component in src/components/BookForm/NdlSearchResults.tsx to: (1) add optional props: hasMore (boolean), isLoadingMore (boolean), onLoadMore (() => void); (2) render a "もっと見る" button below the results list when hasMore is true; (3) show loading state on button when isLoadingMore is true; (4) disable button during loading. Use existing Button component from ../common/Button.
    Restrictions: Do not change existing result item rendering, maintain existing props as optional for backward compatibility, use Tailwind CSS for styling
    _Leverage: Button component from src/components/common/Button.tsx, existing Tailwind patterns
    _Requirements: Requirement 1.1-1.4 (ページネーション UI)
    Success: Button appears when hasMore=true, shows loading state, calls onLoadMore on click
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 8. BookRegistrationPage での統合
  - File: `src/pages/BookRegistrationPage.tsx`
  - `useBookSearch` から新しいプロパティを取得して `NdlSearchResults` に渡す
  - Purpose: ページネーション機能をページに統合
  - _Leverage: 既存のページ構造_
  - _Requirements: 1.1, 2.1_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Developer with page integration expertise
    Task: Update BookRegistrationPage in src/pages/BookRegistrationPage.tsx to: (1) destructure hasMore, isLoadingMore, loadMore from useBookSearch hook; (2) pass these props to NdlSearchResults component
    Restrictions: Minimal changes only, do not refactor existing code, maintain existing page structure
    _Leverage: Existing useBookSearch usage in BookRegistrationPage
    _Requirements: Requirement 1.1, 2.1
    Success: Page passes pagination props to NdlSearchResults, feature works end-to-end
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 9. Storybook ストーリーの更新
  - File: `src/components/BookForm/NdlSearchResults.stories.tsx`
  - ページネーション状態を含むストーリーを追加
  - Purpose: コンポーネントの動作を視覚的に確認可能にする
  - _Leverage: 既存の Storybook パターン_
  - _Requirements: なし（ドキュメント）_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Frontend Developer with Storybook expertise
    Task: Update or create NdlSearchResults.stories.tsx to add stories demonstrating: (1) Default - without pagination props; (2) WithLoadMore - hasMore=true, onLoadMore action; (3) LoadingMore - isLoadingMore=true; (4) NoMoreResults - hasMore=false. Use CSF 3.0 format with Meta and StoryObj.
    Restrictions: Follow existing Storybook patterns in the project, use mock NdlBook data
    _Leverage: Existing Storybook patterns in src/components/*/*.stories.tsx
    _Requirements: None (documentation)
    Success: Stories render correctly, demonstrate all pagination states
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_

- [ ] 10. 統合テストと動作確認
  - 開発サーバーで実際の NDL API を使用してテスト
  - ページネーション動作確認
  - ソート結果の妥当性確認
  - Purpose: 機能全体が正しく動作することを確認
  - _Leverage: npm run dev:api_
  - _Requirements: All_
  - _Prompt: Implement the task for spec book-search-enhancement, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: QA Engineer with integration testing expertise
    Task: Perform manual integration testing: (1) Start dev server with npm run dev:api; (2) Navigate to /books/new; (3) Search for a book title; (4) Verify results are sorted by relevance (exact matches first); (5) Click "もっと見る" and verify additional results load; (6) Verify button disappears when no more results; (7) Run npm test to ensure all unit tests pass
    Restrictions: Document any issues found, do not modify code in this task
    _Leverage: npm run dev:api, npm test
    _Requirements: All requirements
    Success: All manual tests pass, unit tests pass, feature works as expected
    After completing the task, use log-implementation to record what was done, then mark this task as complete in tasks.md_
