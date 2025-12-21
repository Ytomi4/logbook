# Tasks Document: User Profile Setup

## Database & Schema

- [x] 1. Create database migration for username and avatar_url columns
  - File: `db/migrations/XXXX_add_user_profile_columns.sql`
  - Add `username` (TEXT, UNIQUE, nullable) and `avatar_url` (TEXT, nullable) columns to users table
  - Create unique index on username
  - Purpose: Enable user profile data storage
  - _Leverage: `db/schema.ts`, existing migrations pattern_
  - _Requirements: REQ-1, REQ-6_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer specializing in SQLite and Drizzle ORM | Task: Create a D1 migration to add username (TEXT UNIQUE) and avatar_url (TEXT) columns to the users table, following existing migration patterns | Restrictions: Do not modify existing columns, ensure migration is reversible, use proper SQLite syntax for D1 | Success: Migration runs successfully, username has UNIQUE constraint, both columns are nullable | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 2. Update Drizzle schema with new user columns
  - File: `db/schema.ts`
  - Add `username` and `avatarUrl` fields to users table definition
  - Update User type export
  - Purpose: Provide type-safe schema for new columns
  - _Leverage: existing `db/schema.ts` patterns_
  - _Requirements: REQ-1, REQ-2_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer with Drizzle ORM expertise | Task: Update the users table schema in db/schema.ts to add username (text, unique) and avatarUrl (text) columns, update the exported User type | Restrictions: Must match the migration, follow existing column naming conventions (snake_case in DB, camelCase in types), maintain backward compatibility | Success: Schema matches migration, types are correctly inferred, existing code continues to work | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Type Definitions

- [x] 3. Add profile-related types to types/index.ts
  - File: `src/types/index.ts`
  - Add UserProfile, PublicUser, UpdateProfileRequest, UsernameCheckResponse interfaces
  - Purpose: Establish type safety for profile features
  - _Leverage: existing type patterns in `src/types/index.ts`_
  - _Requirements: REQ-1, REQ-2, REQ-5_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Add UserProfile, PublicUser, UpdateProfileRequest, UsernameCheckResponse interfaces to src/types/index.ts following the design document | Restrictions: Follow existing interface naming patterns, use proper nullability, do not modify existing types | Success: All new types compile without errors, consistent with design document | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Validation & Reserved Usernames

- [x] 4. Create reserved usernames list and validation
  - File: `src/lib/reserved-usernames.ts`
  - Define RESERVED_USERNAMES array with system routes and common words
  - Create isReservedUsername function
  - Purpose: Prevent URL conflicts with system routes
  - _Leverage: design document reserved usernames list_
  - _Requirements: REQ-1 (AC7)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer | Task: Create src/lib/reserved-usernames.ts with RESERVED_USERNAMES const array and isReservedUsername function, include all routes (enter, setup, settings, books, api, auth, etc.) and common reserved words | Restrictions: Use 'as const' for type safety, case-insensitive comparison, export both the array and function | Success: Function correctly identifies reserved usernames, array includes all system routes | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 5. Add username validation schema to validation.ts
  - File: `src/lib/validation.ts`
  - Add usernameSchema with Zod (alphanumeric + underscore, 3-20 chars)
  - Add updateProfileSchema
  - Purpose: Client and server-side username validation
  - _Leverage: existing Zod schemas in `src/lib/validation.ts`_
  - _Requirements: REQ-1 (AC1, AC2)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer with Zod expertise | Task: Add usernameSchema (regex for alphanumeric and underscore, min 3, max 20) and updateProfileSchema to src/lib/validation.ts following existing patterns | Restrictions: Follow existing schema naming conventions, use Zod refinements for complex validation, integrate with reserved username check | Success: Schema validates correct usernames, rejects invalid ones with clear error messages | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Backend API

- [x] 6. Create profile API endpoints
  - File: `functions/api/profile/index.ts`
  - Implement GET /api/profile (get current user profile)
  - Implement PUT /api/profile (update username)
  - Add authentication middleware check
  - Purpose: Enable profile read/update operations
  - _Leverage: `functions/api/books/index.ts` patterns, `functions/lib/auth.ts`_
  - _Requirements: REQ-1, REQ-5_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Hono and Cloudflare Workers expertise | Task: Create functions/api/profile/index.ts with GET and PUT endpoints for user profile, integrate with Better Auth for authentication, use Drizzle for DB operations | Restrictions: Must verify user is authenticated, validate username with schema, handle unique constraint errors gracefully | Success: GET returns current user profile, PUT updates username with validation, proper error responses | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 7. Create username check API endpoint
  - File: `functions/api/username/check.ts`
  - Implement GET /api/username/check?username=xxx
  - Check both reserved usernames and database uniqueness
  - Purpose: Enable real-time username availability checking
  - _Leverage: `src/lib/reserved-usernames.ts`, existing API patterns_
  - _Requirements: REQ-1 (AC3, AC4, AC7), REQ-6_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create functions/api/username/check.ts with GET endpoint that checks if username is available (not reserved and not taken), return { available: boolean, reason?: 'taken' | 'reserved' | 'invalid' } | Restrictions: Must check both reserved list and database, require authentication, handle edge cases | Success: Returns correct availability status with appropriate reason codes | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 8. Create public user API endpoints
  - File: `functions/api/users/[username]/index.ts`
  - Implement GET /api/users/:username (get public user info)
  - Purpose: Enable public profile access by username
  - _Leverage: existing API patterns_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create functions/api/users/[username]/index.ts with GET endpoint that returns public user info (id, username, name, avatarUrl) for a given username | Restrictions: Do not expose email or private data, return 404 for non-existent users, no authentication required | Success: Returns public user info, proper 404 handling | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 9. Create public timeline API endpoint
  - File: `functions/api/users/[username]/timeline.ts`
  - Implement GET /api/users/:username/timeline
  - Return user info and their timeline logs
  - Purpose: Enable public timeline viewing
  - _Leverage: `functions/api/logs/index.ts` patterns_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create functions/api/users/[username]/timeline.ts with GET endpoint that returns user info and their logs with book data, similar to existing timeline API but filtered by user | Restrictions: No authentication required, return 404 for non-existent users, include pagination | Success: Returns user's public timeline with logs and books | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Image Upload (R2)

- [x] 10. Configure Cloudflare R2 bucket
  - File: `wrangler.jsonc`
  - Add R2 bucket binding for avatar storage
  - Purpose: Enable avatar image storage
  - _Leverage: Cloudflare R2 documentation_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with Cloudflare expertise | Task: Add R2 bucket configuration to wrangler.jsonc with binding name AVATAR_BUCKET and bucket name logbook-avatars, include both production and preview environments | Restrictions: Follow existing wrangler.jsonc structure, ensure binding is available in all environments | Success: R2 bucket is properly configured and accessible from Workers | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 11. Create avatar upload API endpoint
  - File: `functions/api/avatar/index.ts`
  - Implement POST /api/avatar for image upload
  - Validate file type and size
  - Store in R2 and update user avatar_url
  - Purpose: Enable avatar image upload
  - _Leverage: Cloudflare R2 API_
  - _Requirements: REQ-2 (AC1, AC2, AC3)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with file upload expertise | Task: Create functions/api/avatar/index.ts with POST endpoint that accepts multipart/form-data image upload, validates type (JPEG, PNG, GIF, WebP) and size (max 2MB), stores in R2, updates user's avatar_url | Restrictions: Must validate content type, require authentication, handle upload errors gracefully | Success: Images are uploaded to R2, avatar_url is updated, proper error handling | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Frontend Services

- [x] 12. Create profile service
  - File: `src/services/profile.ts`
  - Add getProfile, updateProfile, checkUsername, uploadAvatar functions
  - Purpose: API client for profile operations
  - _Leverage: existing `src/services/*.ts` patterns_
  - _Requirements: REQ-1, REQ-2, REQ-5_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/services/profile.ts with async functions for getProfile, updateProfile, checkUsername, uploadAvatar that call the corresponding API endpoints | Restrictions: Follow existing service patterns, use proper TypeScript types, handle errors consistently | Success: All API operations are accessible via service functions | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 13. Create public timeline service
  - File: `src/services/publicTimeline.ts`
  - Add getPublicUser, getPublicTimeline functions
  - Purpose: API client for public profile/timeline access
  - _Leverage: existing service patterns_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/services/publicTimeline.ts with getPublicUser and getPublicTimeline functions that call /api/users/:username endpoints | Restrictions: Follow existing patterns, handle 404 errors appropriately | Success: Public user and timeline data can be fetched | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Frontend Hooks

- [x] 14. Create useUsernameValidation hook
  - File: `src/hooks/useUsernameValidation.ts`
  - Implement debounced username validation (300ms)
  - Check client-side rules and server availability
  - Purpose: Real-time username validation feedback
  - _Leverage: `src/services/profile.ts`, `src/lib/validation.ts`_
  - _Requirements: REQ-1 (AC4)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/hooks/useUsernameValidation.ts hook that provides debounced (300ms) username validation, checks both client-side rules (format, length, reserved) and server availability, returns { isValid, isChecking, error, checkUsername } | Restrictions: Use proper debouncing, cancel pending requests on new input, handle race conditions | Success: Hook provides accurate real-time validation feedback | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 15. Create useProfile hook
  - File: `src/hooks/useProfile.ts`
  - Implement profile fetch and update operations
  - Purpose: Profile state management
  - _Leverage: `src/services/profile.ts`, `src/hooks/useAuth.ts` patterns_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/hooks/useProfile.ts hook that fetches and manages user profile state, provides updateUsername and updateAvatar functions, returns { profile, isLoading, error, updateUsername, updateAvatar } | Restrictions: Handle loading and error states, invalidate cache after updates | Success: Profile data is accessible and updatable via hook | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 16. Create usePublicTimeline hook
  - File: `src/hooks/usePublicTimeline.ts`
  - Fetch public user and timeline by username
  - Purpose: Public timeline data fetching
  - _Leverage: `src/services/publicTimeline.ts`_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/hooks/usePublicTimeline.ts hook that fetches public user info and timeline logs by username, returns { user, logs, isLoading, error } | Restrictions: Handle 404 errors for non-existent users, proper loading states | Success: Public timeline data can be fetched by username | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 17. Update useAuth hook to include username
  - File: `src/hooks/useAuth.ts`
  - Add username to User interface and return value
  - Purpose: Make username available throughout app
  - _Leverage: existing `src/hooks/useAuth.ts`_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/hooks/useAuth.ts to include username in the User interface and map it from session data | Restrictions: Maintain backward compatibility, ensure username can be null for users who haven't set it | Success: useAuth returns user with username field | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Frontend Components

- [x] 18. Create UsernameInput component
  - File: `src/components/common/UsernameInput.tsx`
  - Input with real-time validation feedback
  - Show loading spinner while checking
  - Display error/success states
  - Purpose: Reusable username input with validation
  - _Leverage: `src/components/common/Input.tsx`, `src/hooks/useUsernameValidation.ts`_
  - _Requirements: REQ-1, REQ-4_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/components/common/UsernameInput.tsx component that wraps Input with useUsernameValidation hook, shows checking spinner, displays validation errors/success, includes helper text about allowed characters | Restrictions: Follow existing Input component patterns, use Tailwind for styling, accessible | Success: Component provides clear real-time feedback on username validity | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 19. Create AvatarUploader component
  - File: `src/components/common/AvatarUploader.tsx`
  - Image preview before upload
  - File type and size validation
  - Upload progress indication
  - Purpose: Reusable avatar upload component
  - _Leverage: existing component patterns_
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/components/common/AvatarUploader.tsx component with current avatar display, file input for new image, preview before upload, validation messages for invalid files, upload button | Restrictions: Client-side validation for type (JPEG, PNG, GIF, WebP) and size (2MB), use Tailwind styling, accessible | Success: Component allows image selection, preview, and upload with validation | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 20. Create RequireUsername guard component
  - File: `src/components/common/RequireUsername.tsx`
  - Redirect to /setup if user has no username
  - Allow /enter and /setup routes without redirect
  - Purpose: Enforce username setup for authenticated users
  - _Leverage: `src/hooks/useAuth.ts`, React Router_
  - _Requirements: REQ-4 (AC7)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/components/common/RequireUsername.tsx wrapper component that checks if authenticated user has username set, redirects to /setup if not, allows /enter and /setup routes without redirect | Restrictions: Show loading state while checking, don't redirect if not authenticated, preserve intended destination | Success: Users without username are redirected to setup, allowed routes work normally | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Pages

- [x] 21. Create EnterPage
  - File: `src/pages/EnterPage.tsx`
  - Display Logbook logo and service description
  - Google login button
  - Redirect if already authenticated
  - Purpose: New user registration landing page
  - _Leverage: `src/components/common/LoginButton.tsx`, `src/hooks/useAuth.ts`_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/pages/EnterPage.tsx with centered layout showing Logbook logo (SVG from Layout), welcoming headline, service description text, and LoginButton for Google auth, redirect to /setup or / if already authenticated | Restrictions: Use existing components, follow page layout patterns, attractive design with Tailwind | Success: Page displays branding and login option, redirects authenticated users | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 22. Create SetupPage
  - File: `src/pages/SetupPage.tsx`
  - Title: "アカウントを作成します"
  - Username input with validation
  - "これで始める" button (enabled when valid)
  - Redirect to /{username} on success
  - Purpose: Initial username setup after Google auth
  - _Leverage: `UsernameInput`, `src/hooks/useProfile.ts`_
  - _Requirements: REQ-4_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/pages/SetupPage.tsx with title "アカウントを作成します", description "ハンドルネームを決めましょう", UsernameInput component, "これで始める" button that's disabled until valid username, on submit update profile and redirect to /{username} | Restrictions: Require authentication, redirect if username already set, handle errors gracefully | Success: Users can set their username and proceed to their timeline | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 23. Create SettingsPage
  - File: `src/pages/SettingsPage.tsx`
  - Display current avatar and username
  - AvatarUploader for image change
  - Username edit functionality
  - Save button and success notification
  - Purpose: Account settings management
  - _Leverage: `AvatarUploader`, `UsernameInput`, `src/hooks/useProfile.ts`_
  - _Requirements: REQ-5_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/pages/SettingsPage.tsx with sections for avatar change (AvatarUploader) and username edit (UsernameInput), save button, success/error toast notifications, require authentication | Restrictions: Follow existing page patterns, use Card component for sections, handle optimistic updates | Success: Users can view and update their avatar and username | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 24. Create PublicTimelinePage
  - File: `src/pages/PublicTimelinePage.tsx`
  - Display user info (avatar, name, username)
  - Show user's timeline logs
  - Handle 404 for non-existent users
  - Purpose: Public timeline view accessible by username URL
  - _Leverage: `src/components/Timeline/`, `src/hooks/usePublicTimeline.ts`_
  - _Requirements: REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Create src/pages/PublicTimelinePage.tsx that gets username from URL params, fetches user and timeline data, displays user info header and timeline using existing Timeline components, show 404 page for non-existent users | Restrictions: Use existing Timeline components, handle loading and error states, no authentication required | Success: Public timeline is viewable by visiting /{username} | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Layout & Routing

- [x] 25. Update Layout with "はじめる" button
  - File: `src/components/common/Layout.tsx`
  - Add "はじめる" button for unauthenticated users (replaces LoginButton)
  - Link to /enter
  - Purpose: Entry point for new users
  - _Leverage: existing Layout.tsx_
  - _Requirements: REQ-3 (AC4, AC5)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/components/common/Layout.tsx to show "はじめる" button (styled as primary button) instead of LoginButton for unauthenticated users, linking to /enter | Restrictions: Maintain existing layout structure, use Button component with Link, consistent styling | Success: Unauthenticated users see "はじめる" button that links to /enter | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 26. Update UserMenu with settings link
  - File: `src/components/common/UserMenu.tsx`
  - Add "アカウント設定" menu item
  - Link to /settings
  - Purpose: Access to settings from user menu
  - _Leverage: existing UserMenu.tsx_
  - _Requirements: REQ-5 (AC1)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/components/common/UserMenu.tsx to add "アカウント設定" menu item before logout button, linking to /settings | Restrictions: Follow existing menu item styling, use Link component for navigation | Success: Users can access settings from the dropdown menu | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 27. Update App.tsx routing
  - File: `src/App.tsx`
  - Add routes for /enter, /setup, /settings
  - Add catch-all route for /:username (must be last)
  - Wrap appropriate routes with RequireUsername
  - Purpose: Enable navigation to new pages
  - _Leverage: existing App.tsx routing_
  - _Requirements: REQ-3, REQ-4, REQ-5, REQ-7_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/App.tsx to add routes for EnterPage (/enter), SetupPage (/setup), SettingsPage (/settings), PublicTimelinePage (/:username), wrap main content with RequireUsername, ensure /:username is the last route | Restrictions: Maintain route order (specific routes before catch-all), proper component imports | Success: All new routes work correctly, username guard functions properly | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Storybook

- [x] 28. Create UsernameInput stories
  - File: `src/components/common/UsernameInput.stories.tsx`
  - Stories for default, valid, invalid, checking states
  - Purpose: Document and test UsernameInput component
  - _Leverage: existing stories patterns_
  - _Requirements: CLAUDE.md Storybook guidelines_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/components/common/UsernameInput.stories.tsx with CSF 3.0 format, include stories for Default, Valid, Invalid (various errors), Checking states, add autodocs tag | Restrictions: Follow existing story patterns, mock useUsernameValidation hook, use decorators as needed | Success: Stories showcase all component states | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 29. Create AvatarUploader stories
  - File: `src/components/common/AvatarUploader.stories.tsx`
  - Stories for default, with image, uploading states
  - Purpose: Document and test AvatarUploader component
  - _Leverage: existing stories patterns_
  - _Requirements: CLAUDE.md Storybook guidelines_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/components/common/AvatarUploader.stories.tsx with CSF 3.0 format, include stories for Default (no image), WithCurrentImage, Uploading states, add autodocs tag | Restrictions: Follow existing story patterns, mock upload functionality | Success: Stories showcase all component states | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Testing

- [x] 30. Add unit tests for username validation
  - File: `tests/lib/username-validation.test.ts`
  - Test isReservedUsername function
  - Test usernameSchema validation
  - Purpose: Ensure validation logic is correct
  - _Leverage: existing test patterns_
  - _Requirements: REQ-1, REQ-6_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Create tests/lib/username-validation.test.ts with tests for isReservedUsername (reserved and non-reserved usernames) and usernameSchema (valid formats, invalid formats, edge cases) | Restrictions: Use Vitest, test both positive and negative cases | Success: All validation logic is tested with good coverage | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 31. Add hook tests for useUsernameValidation
  - File: `tests/hooks/useUsernameValidation.test.ts`
  - Test debouncing behavior
  - Test validation states
  - Purpose: Ensure hook works correctly
  - _Leverage: existing hook test patterns, React Testing Library_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Create tests/hooks/useUsernameValidation.test.ts with tests for debouncing, validation states (valid, invalid, checking), API call mocking | Restrictions: Use Vitest and React Testing Library, mock API calls, test async behavior | Success: Hook behavior is fully tested | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## Final Integration

- [x] 32. Run database migration
  - Execute migration on local and remote D1
  - Verify columns are added correctly
  - Purpose: Apply database changes
  - _Requirements: Task 1_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Run the migration created in Task 1 using npx wrangler d1 migrations apply logbook-db --local for local and --remote for production, verify columns exist with SELECT sql FROM sqlite_master | Restrictions: Test on local first, backup remote before applying | Success: Migration applied successfully to both environments | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 33. Create R2 bucket
  - Create logbook-avatars bucket via Wrangler CLI
  - Configure public access if needed
  - Purpose: Enable avatar storage
  - _Requirements: Task 10_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Create R2 bucket named logbook-avatars using npx wrangler r2 bucket create logbook-avatars, configure CORS if needed for direct uploads | Restrictions: Ensure bucket name matches wrangler.jsonc config | Success: R2 bucket is created and accessible from Workers | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 34. End-to-end testing
  - Test full registration flow manually
  - Test avatar upload flow
  - Test public timeline access
  - Purpose: Verify complete feature works
  - _Requirements: All_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Manually test complete user flows: 1) New user registration (enter → Google auth → setup → timeline), 2) Avatar upload (settings → upload image → verify), 3) Public timeline access (visit /{username} as logged out user), document any issues found | Restrictions: Test in development environment first, test both happy paths and error cases | Success: All user flows work correctly without errors | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

## v1.1 修正タスク（2025-12-21 フィードバック対応）

### 認証フロー簡素化

- [x] 35. 認証コールバックのリダイレクト先を /setup に変更
  - File: `src/lib/auth-client.ts`
  - Better Auth のコールバック設定で `/setup` を指定
  - Purpose: 認証後に直接 /setup に遷移させる
  - _Leverage: Better Auth ドキュメント_
  - _Requirements: REQ-4 (AC1)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Better Auth expertise | Task: Update src/lib/auth-client.ts to set callbackURL to '/setup' so users are redirected directly to /setup after Google authentication | Restrictions: Ensure existing authentication flow still works, test with fresh login | Success: After Google login, users are redirected to /setup instead of / | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 36. RequireUsername ガードを削除
  - Files: `src/components/common/RequireUsername.tsx`, `src/App.tsx`
  - RequireUsername コンポーネントを削除
  - App.tsx から RequireUsername ラッパーを削除
  - Purpose: 過剰なガードを削除してシンプル化
  - _Requirements: v1.1 設計変更_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Delete src/components/common/RequireUsername.tsx file and remove all usages from src/App.tsx, ensure routes work without the guard | Restrictions: Test that navigation still works correctly, ensure no broken imports | Success: RequireUsername is completely removed, app functions normally | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

### ユーザー表示の修正

- [x] 37. ヘッダー右上をハンドルネーム + アバター表示に変更
  - File: `src/components/common/UserMenu.tsx`
  - Google名（name）ではなくハンドルネーム（username）を表示
  - アバター画像を表示（未設定時はデフォルトアイコン）
  - Purpose: サイト内表示をハンドルネームに統一
  - _Leverage: useAuth hook_
  - _Requirements: REQ-8 (AC1, AC2)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/components/common/UserMenu.tsx to display username instead of Google name, show avatarUrl for avatar image (use default icon if null), never display Google account name or image | Restrictions: Handle null username gracefully, use consistent default avatar | Success: Header shows username and custom avatar, no Google info visible | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 38. 公開タイムラインでアバター画像を正しく表示
  - File: `src/pages/PublicTimelinePage.tsx`
  - ユーザーヘッダー部分でアバター画像を表示
  - avatarUrl を正しく参照する
  - Purpose: 公開タイムラインでアバターを表示
  - _Leverage: usePublicTimeline hook_
  - _Requirements: REQ-7 (AC4)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/pages/PublicTimelinePage.tsx to correctly display user's avatarUrl in the header section, use default avatar if null | Restrictions: Ensure image loads correctly, handle loading states | Success: Avatar image displays correctly on public timeline | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 39. 公開タイムラインで Google 名を非表示に
  - Files: `functions/api/users/[username]/index.ts`, `src/pages/PublicTimelinePage.tsx`
  - API から name フィールドを削除
  - UI で Google 名を表示している箇所を削除
  - ハンドルネーム（username）のみを表示
  - Purpose: Google 名をサイト内で非表示にする
  - _Requirements: REQ-7 (AC5), REQ-8 (AC3)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Full-stack Developer | Task: Update functions/api/users/[username]/index.ts to remove 'name' field from response, update src/pages/PublicTimelinePage.tsx to display only username (not Google name), update PublicUser type if needed | Restrictions: Ensure backward compatibility, test that timeline still works | Success: Public timeline shows only username, no Google name visible | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

### UI 改善

- [x] 40. アカウント設定画面のラベル重複を解消
  - File: `src/pages/SettingsPage.tsx`
  - 「ハンドルネーム」セクションのラベル重複を解消
  - タイトルのみ表示し、入力欄のラベルは省略
  - Purpose: UI の重複表記を解消
  - _Requirements: REQ-5 (AC6)_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: React Developer | Task: Update src/pages/SettingsPage.tsx to remove duplicate label in username section - keep section title 'ハンドルネーム' but remove input field label, update UsernameInput to accept showLabel prop if needed | Restrictions: Maintain accessibility, ensure form still works | Success: Settings page shows 'ハンドルネーム' title once, no duplicate labels | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

- [x] 41. 用語を「ハンドルネーム」に統一
  - Files: 各コンポーネント、ページ
  - UI 上の「ユーザー名」表記を「ハンドルネーム」に変更
  - エラーメッセージも含めて統一
  - Purpose: 用語の統一
  - _Requirements: v1.1 用語定義_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Search and replace all UI text from 'ユーザー名' to 'ハンドルネーム' in components and pages (UsernameInput, SetupPage, SettingsPage, validation messages), ensure consistency | Restrictions: Only change user-facing text, keep variable/function names as 'username' | Success: All UI shows 'ハンドルネーム' consistently | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_

### テスト

- [x] 42. v1.1 修正の E2E テスト
  - Test: 認証後 /setup への直接遷移
  - Test: ヘッダーロゴクリックでホームに遷移（/setup にリダイレクトされない）
  - Test: 公開タイムラインでアバターとハンドルネーム表示
  - Purpose: v1.1 修正の動作確認
  - _Requirements: All v1.1 requirements_
  - _Prompt: Implement the task for spec user-profile-setup, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Manually test v1.1 fixes: 1) Fresh login redirects to /setup directly, 2) After setting username, header logo click goes to home (not /setup), 3) Public timeline shows avatar and username (no Google name), 4) Settings page shows 'ハンドルネーム' without duplicate labels | Restrictions: Test with fresh account if possible, document any issues | Success: All v1.1 requirements are met | After completing the task, mark it as in-progress in tasks.md using `- [-]`, log the implementation using log-implementation tool, then mark as complete using `- [x]`_
