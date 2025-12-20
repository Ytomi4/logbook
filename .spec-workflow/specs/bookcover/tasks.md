# Tasks Document

- [x] 1. Create NDL thumbnail URL utility function
  - File: src/lib/ndl.ts (new file)
  - Implement `getNdlThumbnailUrl(isbn)` function
  - Normalize ISBN (remove hyphens, validate format)
  - Return NDL thumbnail URL or null
  - Purpose: Generate NDL thumbnail URLs from ISBN
  - _Leverage: None (pure utility function)_
  - _Requirements: 1, 3_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Create a new utility file src/lib/ndl.ts with a getNdlThumbnailUrl function that takes an ISBN string (or null) and returns the NDL thumbnail URL. The function should: (1) Return null if ISBN is null/undefined, (2) Remove hyphens and spaces from ISBN, (3) Validate that ISBN is 10 or 13 digits, (4) Return URL in format https://ndlsearch.ndl.go.jp/thumbnail/{isbn}.jpg. Reference requirements 1 and 3 from requirements.md. | Restrictions: Do not modify any existing files, keep the function pure with no side effects, export the function and the base URL constant | Success: Function correctly generates URLs for valid ISBNs and returns null for invalid ones. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 2. Add unit tests for getNdlThumbnailUrl
  - File: tests/lib/ndl.test.ts (new file)
  - Test valid ISBN-13 returns correct URL
  - Test valid ISBN-10 returns correct URL
  - Test hyphenated ISBN is normalized
  - Test null/invalid ISBN returns null
  - Purpose: Ensure thumbnail URL generation is reliable
  - _Leverage: tests/setup.ts, vitest_
  - _Requirements: 1, 3_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Create unit tests for getNdlThumbnailUrl function in tests/lib/ndl.test.ts. Test cases: (1) Valid 13-digit ISBN returns correct URL, (2) Valid 10-digit ISBN returns correct URL, (3) ISBN with hyphens is normalized correctly, (4) ISBN with spaces is normalized correctly, (5) null returns null, (6) Invalid ISBN (wrong length) returns null, (7) Non-numeric ISBN returns null. Use vitest and follow existing test patterns. | Restrictions: Only test the getNdlThumbnailUrl function, do not mock external APIs | Success: All tests pass, edge cases covered. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 3. Add thumbnail preview to NdlSearchResults
  - File: src/components/BookForm/NdlSearchResults.tsx (modify)
  - Import BookCover component and getNdlThumbnailUrl
  - Add BookCover to each search result item
  - Use size="sm" for compact display
  - Purpose: Show book covers in NDL search results
  - _Leverage: src/components/common/BookCover.tsx, src/lib/ndl.ts_
  - _Requirements: 4_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Modify NdlSearchResults.tsx to display book cover thumbnails. (1) Import BookCover from '../common/BookCover', (2) Import getNdlThumbnailUrl from '../../lib/ndl', (3) For each search result, add BookCover component with coverUrl={getNdlThumbnailUrl(book.isbn)}, title={book.title}, size="sm", (4) Position the cover image on the left side of each result item using flex layout. Reference requirement 4 from requirements.md. | Restrictions: Do not change the component's props interface, maintain existing click behavior, keep the existing text layout | Success: Book covers appear in search results, fallback icon shows when no cover available. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 4. Set coverUrl when selecting NDL result in BookForm
  - File: src/components/BookForm/BookForm.tsx (modify)
  - Import getNdlThumbnailUrl
  - In handleNdlSelect, set coverUrl from ISBN
  - Purpose: Auto-populate cover URL when registering book from NDL
  - _Leverage: src/lib/ndl.ts, existing handleNdlSelect function_
  - _Requirements: 1_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Modify BookForm.tsx to automatically set coverUrl when user selects an NDL search result. (1) Import getNdlThumbnailUrl from '../../lib/ndl', (2) Find the handleNdlSelect function (or equivalent), (3) When setting form values from NDL result, also set coverUrl using getNdlThumbnailUrl(ndlBook.isbn). Reference requirement 1 from requirements.md. | Restrictions: Do not modify the form submission logic, do not change form validation, preserve all existing form fields | Success: When selecting NDL result, coverUrl is automatically populated. Book is saved with correct coverUrl. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 5. Add integration test for book registration with cover
  - File: tests/components/BookForm.test.tsx (modify or create)
  - Test NDL selection sets coverUrl
  - Test book displays cover after registration
  - Purpose: Ensure end-to-end cover functionality works
  - _Leverage: tests/setup.ts, @testing-library/react_
  - _Requirements: 1, 2, 4_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Add integration tests for book cover functionality. (1) Test that selecting an NDL result with ISBN sets the coverUrl field, (2) Test that selecting an NDL result without ISBN leaves coverUrl as null, (3) Verify the generated coverUrl matches expected NDL thumbnail format. Use React Testing Library patterns. Reference requirements 1, 2, 4 from requirements.md. | Restrictions: Mock API calls, do not make real network requests, follow existing test patterns | Success: Tests verify cover URL is set correctly during NDL selection flow. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 6. Verify existing BookCover usage across app
  - Files: src/components/Timeline/*.tsx, src/components/BookList/*.tsx, src/pages/BookDetailPage.tsx
  - Verify BookCover receives coverUrl from book data
  - Ensure fallback works when coverUrl is null
  - Purpose: Confirm covers display throughout the app
  - _Leverage: src/components/common/BookCover.tsx_
  - _Requirements: 2_
  - _Prompt: Implement the task for spec bookcover, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Review and verify BookCover component usage across the app. (1) Check Timeline components pass book.coverUrl to BookCover, (2) Check BookList components pass book.coverUrl to BookCover, (3) Check BookDetailPage passes book.coverUrl to BookCover, (4) If any component is missing coverUrl prop, add it. Reference requirement 2 from requirements.md. This is a verification task - only modify code if BookCover is not receiving coverUrl properly. | Restrictions: Do not refactor working code, only fix missing coverUrl props if found, do not change BookCover component itself | Success: All BookCover usages receive coverUrl from book data. After completing, set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._
