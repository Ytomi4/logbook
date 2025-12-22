# Tasks Document

## Phase 1: New Components

- [x] 1. Create UserProfileHeader component
  - File: `src/components/Timeline/UserProfileHeader.tsx`
  - Create component displaying large centered avatar (64-80px) and username
  - Handle avatar fallback with initial letter
  - Purpose: Display user profile prominently at top of timeline page
  - _Leverage: `src/components/common/UserInfo.tsx` (reference pattern)_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Frontend Developer specializing in UI components
    Task: Create UserProfileHeader component in `src/components/Timeline/UserProfileHeader.tsx` displaying large centered avatar (64-80px) and @username. Reference existing `src/components/common/UserInfo.tsx` for pattern. Use Tailwind CSS for styling.
    Restrictions: Do not modify existing components. Keep component focused on display only. Use existing avatar fallback pattern.
    _Leverage: `src/components/common/UserInfo.tsx`
    _Requirements: REQ-1
    Success: Component displays avatar (64-80px) and username centered. Avatar fallback shows initial letter. Tailwind CSS used for all styling.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 2. Create UserProfileHeader Stories
  - File: `src/components/Timeline/UserProfileHeader.stories.tsx`
  - Create stories for: with avatar, without avatar (fallback), long username
  - Purpose: Document and test UserProfileHeader visually
  - _Leverage: `src/stories/mocks/data.ts`, existing stories pattern_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Storybook Developer specializing in component documentation
    Task: Create Stories for UserProfileHeader in `src/components/Timeline/UserProfileHeader.stories.tsx`. Use CSF 3.0 format with Meta + StoryObj. Include stories: Default (with avatar), NoAvatar (fallback), LongUsername.
    Restrictions: Follow existing Stories patterns. Use `tags: ['autodocs']`. Use mock data from `src/stories/mocks/data.ts` where applicable.
    _Leverage: existing stories in `src/components/`
    _Requirements: REQ-1
    Success: Stories file created with 3+ variants. `npm run storybook` shows component correctly.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 3. Create BookSelectorModal component
  - File: `src/components/LogForm/BookSelectorModal.tsx`
  - Extract book selection UI from QuickLogModal into reusable modal
  - Accept books array, selectedBook, onSelect callback
  - Purpose: Reusable modal for selecting a book from user's collection
  - _Leverage: `src/components/LogForm/QuickLogModal.tsx` (extract from), `src/components/common/Modal.tsx`_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Frontend Developer specializing in modal components
    Task: Create BookSelectorModal component in `src/components/LogForm/BookSelectorModal.tsx`. Extract book selection UI from `QuickLogModal.tsx`. Props: isOpen, onClose, books, selectedBook, onSelect. Use existing Modal component.
    Restrictions: Do not modify QuickLogModal yet. Reuse exact UI pattern from QuickLogModal for consistency.
    _Leverage: `src/components/LogForm/QuickLogModal.tsx`, `src/components/common/Modal.tsx`
    _Requirements: REQ-5
    Success: Modal opens/closes correctly. Books are displayed as selectable list. onSelect fires with selected book.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 4. Create BookSelectorModal Stories
  - File: `src/components/LogForm/BookSelectorModal.stories.tsx`
  - Create stories for: with books, empty books, with selected book
  - Purpose: Document and test BookSelectorModal visually
  - _Leverage: `src/stories/mocks/data.ts`_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Storybook Developer specializing in component documentation
    Task: Create Stories for BookSelectorModal in `src/components/LogForm/BookSelectorModal.stories.tsx`. Use CSF 3.0 format. Include stories: Default (with books), EmptyBooks, WithSelectedBook.
    Restrictions: Follow existing Stories patterns. Mock onSelect/onClose with action().
    _Leverage: `src/stories/mocks/data.ts`
    _Requirements: REQ-5
    Success: Stories file created with 3+ variants. Modal interactions work in Storybook.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 5. Create InlineLogForm component
  - File: `src/components/LogForm/InlineLogForm.tsx`
  - Create inline log form with book selector button and LogForm
  - Open BookSelectorModal on book button click
  - Default book logic: first log's book or first book in list
  - Handle empty books case with message and link to book registration
  - Purpose: Always-visible log input form for owner's timeline
  - _Leverage: `src/components/LogForm/LogForm.tsx`, `src/components/LogForm/BookSelectorModal.tsx`, `src/services/logs.ts`_
  - _Requirements: REQ-4, REQ-5_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Frontend Developer specializing in forms and user interaction
    Task: Create InlineLogForm component in `src/components/LogForm/InlineLogForm.tsx`. Props: books, defaultBook, onSuccess. Display selected book with button to open BookSelectorModal. Use LogForm for input. Call createLog service on submit.
    Restrictions: Reuse existing LogForm, do not duplicate form logic. Handle empty books case with message and link to /books/new.
    _Leverage: `src/components/LogForm/LogForm.tsx`, `src/components/LogForm/BookSelectorModal.tsx`, `src/services/logs.ts`
    _Requirements: REQ-4, REQ-5
    Success: Form displays with book selector. Modal opens on click. Log submission works. Empty books shows appropriate message.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 6. Create InlineLogForm Stories
  - File: `src/components/LogForm/InlineLogForm.stories.tsx`
  - Create stories for: with books and default, no books, loading state
  - Purpose: Document and test InlineLogForm visually
  - _Leverage: `src/stories/mocks/data.ts`_
  - _Requirements: REQ-4, REQ-5_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Storybook Developer specializing in component documentation
    Task: Create Stories for InlineLogForm in `src/components/LogForm/InlineLogForm.stories.tsx`. Use CSF 3.0 format. Include stories: Default, NoBooks, WithDifferentDefaultBook.
    Restrictions: Follow existing Stories patterns. Mock API calls appropriately.
    _Leverage: `src/stories/mocks/data.ts`
    _Requirements: REQ-4, REQ-5
    Success: Stories file created with 3+ variants. Form interactions work in Storybook.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

## Phase 2: Page Integration

- [x] 7. Update TimelinePage layout
  - File: `src/pages/TimelinePage.tsx`
  - Replace header with centered UserProfileHeader
  - Move TabNavigation below UserProfileHeader, centered
  - Remove HeaderActionButtons import and usage
  - Add InlineLogForm above Timeline when isOwner and activeTab === 'timeline'
  - Remove QuickLogModal usage
  - Purpose: Implement new page layout per design
  - _Leverage: All new components created in Phase 1_
  - _Requirements: REQ-1, REQ-2, REQ-3, REQ-4_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Frontend Developer specializing in page layouts
    Task: Modify TimelinePage in `src/pages/TimelinePage.tsx` to implement new layout:
    1. Replace header section with centered UserProfileHeader
    2. Center TabNavigation below UserProfileHeader
    3. Remove HeaderActionButtons
    4. Add InlineLogForm above Timeline (only when isOwner && activeTab === 'timeline')
    5. Remove QuickLogModal
    6. Calculate defaultBook from logs[0]?.book or books[0]
    Restrictions: Maintain all existing functionality (loading, error, not found states). Keep isOwner check logic.
    _Leverage: `UserProfileHeader`, `InlineLogForm`, existing page structure
    _Requirements: REQ-1, REQ-2, REQ-3, REQ-4
    Success: Page displays new layout. InlineLogForm shows only for owner on timeline tab. All existing features still work.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 8. Update component exports
  - Files: `src/components/Timeline/index.ts`, `src/components/LogForm/index.ts`
  - Add exports for new components
  - Purpose: Enable clean imports from barrel exports
  - _Requirements: All_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: TypeScript Developer
    Task: Update barrel exports:
    - Add `UserProfileHeader` to `src/components/Timeline/index.ts`
    - Add `BookSelectorModal`, `InlineLogForm` to `src/components/LogForm/index.ts`
    Restrictions: Do not remove existing exports.
    _Requirements: All
    Success: New components can be imported from barrel exports.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

## Phase 3: Cleanup & Testing

- [x] 9. Run tests and fix any issues
  - Run `npm test` and `npm run lint`
  - Fix any failing tests or lint errors
  - Purpose: Ensure code quality and no regressions
  - _Requirements: All_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: QA Engineer
    Task: Run `npm test` and `npm run lint`. Fix any failing tests or lint errors introduced by the changes.
    Restrictions: Do not modify unrelated code. Only fix issues related to this feature.
    _Requirements: All
    Success: All tests pass. No lint errors.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 10. Manual testing and verification
  - Test own timeline: InlineLogForm visible, book selection works, log submission works
  - Test other user's timeline: InlineLogForm not visible
  - Test books tab: InlineLogForm not visible
  - Test empty states: no books, no logs
  - Purpose: Verify all requirements are met
  - _Requirements: All_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: QA Engineer specializing in manual testing
    Task: Manually test the implementation:
    1. Own timeline: InlineLogForm visible, can select book via modal, can submit log
    2. Other user timeline: InlineLogForm NOT visible
    3. Books tab: InlineLogForm NOT visible
    4. Empty books: Shows message with link to add book
    5. UI: UserProfileHeader is centered with large avatar, TabNavigation is centered
    Restrictions: Report all issues found. Do not skip any test case.
    _Requirements: All
    Success: All test cases pass. UI matches design document.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

## Phase 4: REQ-6 Implementation (Book Selector UI Improvement)

- [x] 11. Update InlineLogForm book selector UI
  - File: `src/components/LogForm/InlineLogForm.tsx`
  - Remove dropdown arrow icon from book selector button
  - Make book selector button compact with max-width and truncate
  - Add "本を追加" link next to book selector button
  - Purpose: Simplify book selector UI and add book registration shortcut
  - _Leverage: existing InlineLogForm component_
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: React Frontend Developer specializing in UI components
    Task: Update InlineLogForm in `src/components/LogForm/InlineLogForm.tsx`:
    1. Remove the dropdown arrow (chevron-down) SVG icon from the book selector button
    2. Make the book selector button compact: add max-width (e.g., max-w-xs or similar) and ensure title truncates
    3. Add a "本を追加" link (using Link from react-router-dom) to the right of the book selector button, linking to /books/new
    4. Arrange book selector and add book link in a flex row
    Restrictions: Keep existing functionality. Do not change BookSelectorModal. Only modify InlineLogForm.
    _Leverage: existing InlineLogForm component, Link from react-router-dom
    _Requirements: REQ-6
    Success: Book selector has no dropdown arrow. Book selector is compact with truncated title. "本を追加" link appears to the right. Link navigates to /books/new.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 12. Update InlineLogForm Stories for new UI
  - File: `src/components/LogForm/InlineLogForm.stories.tsx`
  - Verify stories reflect new UI layout
  - Purpose: Ensure Storybook shows updated UI
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: Storybook Developer
    Task: Review and update InlineLogForm stories to ensure they correctly display the new UI with compact book selector and "本を追加" link.
    Restrictions: Only update if necessary. Stories may already work correctly.
    _Requirements: REQ-6
    Success: Storybook shows InlineLogForm with new compact layout.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._

- [x] 13. Test and verify REQ-6 changes
  - Run build and verify no errors
  - Manual testing of new UI
  - Purpose: Ensure REQ-6 is fully implemented
  - _Requirements: REQ-6_
  - _Prompt: Implement the task for spec timeline-page-redesign, first run spec-workflow-guide to get the workflow guide then implement the task:
    Role: QA Engineer
    Task: Test REQ-6 implementation:
    1. Run `npm run build` to verify no errors
    2. Verify book selector has no dropdown arrow
    3. Verify book selector is compact and title truncates for long titles
    4. Verify "本を追加" link appears and navigates to /books/new
    Restrictions: Report any issues found.
    _Requirements: REQ-6
    Success: Build passes. All REQ-6 acceptance criteria verified.
    After implementation: Set task to in-progress in tasks.md, log implementation with log-implementation tool, then mark as complete._
