# Tasks Document: Unified Log

## Phase 1: Data Layer

- [ ] 1. Update type definitions
  - File: `src/types/index.ts`
  - Change `LogType` from `'memo' | 'quote' | 'registration'` to `'note' | 'registration'`
  - Add helper function `parseLogContent` for Markdown parsing
  - Purpose: Establish new type system for unified log
  - _Leverage: existing type definitions in `src/types/index.ts`_
  - _Requirements: 1.1, 1.3_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Update LogType definition to remove 'memo'/'quote' and add 'note', add parseLogContent helper for Markdown quote parsing | Restrictions: Do not break existing imports, maintain type safety | _Leverage: src/types/index.ts | _Requirements: 1.1, 1.3 | Success: LogType is updated, parseLogContent correctly parses `> ` prefixed lines as quotes | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 2. Create DB migration for logType change
  - File: `db/migrations/XXXX_unified_log.sql`
  - Add `note` to logType enum
  - Migrate existing `memo` logs to `note`
  - Migrate existing `quote` logs to `note` with `> ` prefix in content
  - Remove `memo` and `quote` from enum
  - Purpose: Update database schema and migrate existing data
  - _Leverage: existing migrations in `db/migrations/`, `db/schema.ts`_
  - _Requirements: 1.1, 1.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer | Task: Create SQL migration to add 'note' type, migrate memo→note, quote→note (with `> ` prefix on each line of content), then remove memo/quote | Restrictions: Must be reversible if possible, handle empty content gracefully | _Leverage: db/migrations/, db/schema.ts | _Requirements: 1.1, 1.2 | Success: Migration runs without errors, all existing logs are converted correctly, logType enum only contains 'note' and 'registration' | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 3. Update DB schema definition
  - File: `db/schema.ts`
  - Update `logType` enum to `['note', 'registration']`
  - Purpose: Keep schema definition in sync with migration
  - _Leverage: `db/schema.ts`_
  - _Requirements: 1.1_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Update logs table schema to use new logType enum with only 'note' and 'registration' | Restrictions: Ensure compatibility with Drizzle ORM | _Leverage: db/schema.ts | _Requirements: 1.1 | Success: Schema compiles without errors, enum values match migration | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

## Phase 2: Core Components

- [ ] 4. Create useRichTextEditor hook
  - File: `src/hooks/useRichTextEditor.ts`
  - Implement contentEditable state management
  - Add toggleQuote function for quote/unquote operations
  - Implement keyboard shortcut handler (Ctrl/Cmd + Shift + Q)
  - Handle Markdown ↔ DOM conversion
  - Purpose: Encapsulate rich text editing logic
  - _Leverage: existing hooks pattern in `src/hooks/`_
  - _Requirements: 3.1, 3.2, 3.3, 4.3, 4.4, 4.5, 4.6_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create useRichTextEditor hook with contentEditable management, toggleQuote for paragraph-level quote toggling, keyboard shortcut support (Cmd/Ctrl+Shift+Q), and Markdown↔DOM sync | Restrictions: No external rich text libraries, keep lightweight, handle edge cases (empty, cursor position, selection) | _Leverage: src/hooks/ | _Requirements: 3.1, 3.2, 3.3, 4.3, 4.4, 4.5, 4.6 | Success: Hook manages editor state correctly, toggleQuote works for all scenarios (empty, cursor in paragraph, selection, no cursor), keyboard shortcut triggers toggleQuote | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 5. Create QuoteButton component
  - File: `src/components/LogForm/QuoteButton.tsx`
  - Create icon button for quote toggle
  - Show keyboard shortcut hint on desktop only
  - Use `window.matchMedia('(pointer: coarse)')` for mobile detection
  - Purpose: Provide UI for quote toggling
  - _Leverage: `src/components/common/Button.tsx`, existing icon patterns_
  - _Requirements: 4.1, 4.7, 4.8_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create QuoteButton component with quote icon, onClick handler, showShortcut prop for desktop-only shortcut display, use pointer:coarse media query for mobile detection | Restrictions: Follow existing Button patterns, accessible touch target (44x44px minimum) | _Leverage: src/components/common/Button.tsx | _Requirements: 4.1, 4.7, 4.8 | Success: Button renders quote icon, shows "⌘⇧Q" hint on desktop only, has proper touch target size | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 6. Create RichTextEditor component
  - File: `src/components/LogForm/RichTextEditor.tsx`
  - Create contentEditable div with quote styling
  - Integrate useRichTextEditor hook
  - Add QuoteButton in footer area
  - Implement borderless design
  - Purpose: Main editing interface for unified logs
  - _Leverage: `src/components/LogForm/`, `src/components/Timeline/QuoteDisplay.tsx` for quote styling_
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 5.1, 5.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create RichTextEditor with contentEditable div, integrate useRichTextEditor hook, render quoted paragraphs with left border style (from QuoteDisplay), add QuoteButton in footer, implement borderless design | Restrictions: No form borders, quote paragraphs must have visual distinction (border-l-4, italic, gray text), placeholder when empty | _Leverage: src/components/LogForm/, src/components/Timeline/QuoteDisplay.tsx | _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 5.1, 5.2 | Success: Editor displays with no borders, quoted text shows with left border style, QuoteButton visible in footer, content syncs with Markdown format | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 7. Create LogDisplay component
  - File: `src/components/Timeline/LogDisplay.tsx`
  - Parse Markdown content and render with quote styling
  - Reuse quote styles from QuoteDisplay
  - Purpose: Display unified log content in timeline
  - _Leverage: `src/components/Timeline/QuoteDisplay.tsx`_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create LogDisplay component that parses Markdown content (lines starting with `> ` are quotes), renders quote paragraphs with QuoteDisplay styling, normal paragraphs as regular text | Restrictions: Reuse existing QuoteDisplay styles, handle multi-line quotes, preserve whitespace | _Leverage: src/components/Timeline/QuoteDisplay.tsx | _Requirements: 2.1, 2.2, 2.3 | Success: Component correctly renders mixed quote/text content, quote styling matches existing QuoteDisplay, handles edge cases (empty, all quotes, no quotes) | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

## Phase 3: Integration

- [ ] 8. Update LogForm to use RichTextEditor
  - File: `src/components/LogForm/LogForm.tsx`
  - Replace Textarea with RichTextEditor
  - Remove LogTypeSelector usage
  - Update form submission to always use 'note' type
  - Purpose: Integrate new editor into existing form
  - _Leverage: `src/components/LogForm/LogForm.tsx`, `src/components/LogForm/RichTextEditor.tsx`_
  - _Requirements: 6.1, 6.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update LogForm to use RichTextEditor instead of Textarea, remove LogTypeSelector import and usage, hardcode logType as 'note' in submission | Restrictions: Maintain existing onSubmit/onCancel props interface, keep validation logic | _Leverage: src/components/LogForm/LogForm.tsx, src/components/LogForm/RichTextEditor.tsx | _Requirements: 6.1, 6.2 | Success: Form uses new RichTextEditor, no LogTypeSelector visible, submission creates 'note' type logs | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 9. Update InlineLogForm styling
  - File: `src/components/LogForm/InlineLogForm.tsx`
  - Remove outer border styling for borderless design
  - Ensure RichTextEditor integration works correctly
  - Purpose: Apply borderless design to timeline form
  - _Leverage: `src/components/LogForm/InlineLogForm.tsx`_
  - _Requirements: 5.1, 5.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Update InlineLogForm to remove border and background styling for borderless design, ensure LogForm with RichTextEditor displays correctly | Restrictions: Keep book selector and layout intact, maintain spacing | _Leverage: src/components/LogForm/InlineLogForm.tsx | _Requirements: 5.1, 5.2 | Success: Form blends into page without visible borders, content area is seamless | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 10. Update TimelineItem to use LogDisplay
  - File: `src/components/Timeline/TimelineItem.tsx`
  - Replace QuoteDisplay/plain text logic with LogDisplay
  - Handle 'note' type logs
  - Keep 'registration' type handling unchanged
  - Purpose: Display unified logs in timeline
  - _Leverage: `src/components/Timeline/TimelineItem.tsx`, `src/components/Timeline/LogDisplay.tsx`_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Update TimelineItem to use LogDisplay for 'note' type logs instead of separate quote/memo rendering, keep registration log handling unchanged | Restrictions: Do not break registration log display, maintain edit/delete functionality | _Leverage: src/components/Timeline/TimelineItem.tsx, src/components/Timeline/LogDisplay.tsx | _Requirements: 2.1, 2.2, 2.3 | Success: Note logs render with LogDisplay showing mixed quote/text, registration logs unchanged, edit mode still works | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 11. Update TimelineItem edit mode
  - File: `src/components/Timeline/TimelineItem.tsx`
  - Replace edit textarea with RichTextEditor
  - Remove log type toggle in edit mode
  - Purpose: Enable rich text editing for existing logs
  - _Leverage: `src/components/Timeline/TimelineItem.tsx`, `src/components/LogForm/RichTextEditor.tsx`_
  - _Requirements: 3.1, 6.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update TimelineItem edit mode to use RichTextEditor instead of textarea, remove log type toggle buttons, update save handler | Restrictions: Maintain cancel/save button functionality, preserve existing edit state management | _Leverage: src/components/Timeline/TimelineItem.tsx, src/components/LogForm/RichTextEditor.tsx | _Requirements: 3.1, 6.2 | Success: Edit mode shows RichTextEditor with quote support, no type toggle visible, save/cancel work correctly | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

## Phase 4: Cleanup

- [ ] 12. Remove LogTypeSelector component
  - File: `src/components/LogForm/LogTypeSelector.tsx`
  - Delete the file
  - Remove from barrel export in `src/components/LogForm/index.ts`
  - Purpose: Clean up unused component
  - _Leverage: `src/components/LogForm/`_
  - _Requirements: 6.1_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Developer | Task: Delete LogTypeSelector.tsx and LogTypeSelector.stories.tsx, remove export from index.ts | Restrictions: Ensure no remaining imports reference this component | _Leverage: src/components/LogForm/ | _Requirements: 6.1 | Success: Files deleted, no import errors in project, build succeeds | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 13. Update useLogEdit hook
  - File: `src/hooks/useLogEdit.ts`
  - Remove logType editing functionality
  - Simplify to content-only editing
  - Purpose: Align hook with new unified log model
  - _Leverage: `src/hooks/useLogEdit.ts`_
  - _Requirements: 6.2_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update useLogEdit to remove editedLogType state and setEditedLogType, simplify saveEdit to only update content | Restrictions: Maintain existing error handling and loading states | _Leverage: src/hooks/useLogEdit.ts | _Requirements: 6.2 | Success: Hook no longer manages logType, save only sends content updates | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

## Phase 5: Testing & Documentation

- [ ] 14. Create Storybook stories for new components
  - Files: `src/components/LogForm/RichTextEditor.stories.tsx`, `src/components/LogForm/QuoteButton.stories.tsx`, `src/components/Timeline/LogDisplay.stories.tsx`
  - Add stories with various states (empty, with content, with quotes, mixed)
  - Purpose: Document and test components visually
  - _Leverage: existing stories patterns, `src/stories/mocks/data.ts`_
  - _Requirements: All_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Storybook stories for RichTextEditor, QuoteButton, LogDisplay with CSF 3.0 format, add autodocs tag, create stories for empty/content/quotes/mixed states | Restrictions: Follow existing story patterns, use mock data from src/stories/mocks/data.ts | _Leverage: existing stories, src/stories/mocks/data.ts | _Requirements: All | Success: Stories render correctly in Storybook, cover all component states, autodocs generate properly | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 15. Add unit tests for parseLogContent
  - File: `tests/lib/parseLogContent.test.ts`
  - Test Markdown quote parsing
  - Test edge cases (empty, all quotes, no quotes, mixed)
  - Purpose: Ensure parsing logic reliability
  - _Leverage: existing test patterns in `tests/`_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Create unit tests for parseLogContent function covering all edge cases: empty content, all quote lines, no quote lines, mixed content, multiline quotes | Restrictions: Use Vitest, follow existing test patterns | _Leverage: tests/ | _Requirements: 2.1, 2.2, 2.3 | Success: All tests pass, good coverage of edge cases | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.

- [ ] 16. Run full test suite and fix issues
  - Files: Various
  - Run `npm test` and fix any failing tests
  - Update test mocks if needed
  - Purpose: Ensure all tests pass after changes
  - _Leverage: existing tests_
  - _Requirements: All_
  - _Prompt: Implement the task for spec unified-log, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Run npm test, identify and fix any failing tests related to unified-log changes, update mocks/fixtures as needed | Restrictions: Do not skip tests, fix root causes | _Leverage: existing tests | _Requirements: All | Success: All tests pass, no regressions | After completing implementation, mark this task as in-progress in tasks.md, then log the implementation using log-implementation tool, then mark task as complete.
