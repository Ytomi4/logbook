# Tasks Document

## Task Overview

Google ソーシャルログイン機能を Better Auth で実装するためのタスク一覧。

---

- [x] 1. Better Auth パッケージのインストール
  - Files: `package.json`
  - Install: `npm install better-auth` and `npm install -D @better-auth/cli`
  - Purpose: Better Auth ライブラリと CLI ツールをプロジェクトに追加
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Install better-auth package and CLI tool using npm. Run `npm install better-auth` and `npm install -D @better-auth/cli`. Verify installation by checking package.json. | Restrictions: Do not modify any source files yet, only install packages | Success: Packages appear in package.json dependencies and devDependencies, npm install completes without errors | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 2. Better Auth スキーマを DB に追加
  - Files: `db/schema.ts`, `db/migrations/*.sql`
  - Add users, sessions, accounts, verifications tables to schema
  - Generate migration with Drizzle Kit
  - Purpose: 認証に必要なテーブルをデータベースに追加
  - _Leverage: db/schema.ts (existing books/logs tables), drizzle.config.ts_
  - _Requirements: REQ-2, REQ-5_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Engineer | Task: Add Better Auth schema tables (users, sessions, accounts, verifications) to db/schema.ts following the design document. Generate migration using `npx drizzle-kit generate`. Apply migration to local D1 with `npx wrangler d1 migrations apply logbook-db --local`. | Restrictions: Do not modify existing books/logs tables, follow existing schema patterns (text IDs, timestamp formats) | _Leverage: db/schema.ts for existing patterns | Success: Schema compiles without errors, migration file generated, tables created in local D1 | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 3. Better Auth サーバーインスタンスの作成
  - Files: `functions/lib/auth.ts`
  - Create `createAuth(env)` function with Google provider config
  - Configure Drizzle adapter with D1
  - Set session expiry to 30 days
  - Purpose: バックエンドの認証処理を担当するインスタンスを作成
  - _Leverage: functions/lib/db.ts (existing Drizzle setup), db/schema.ts_
  - _Requirements: REQ-2, REQ-5_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create functions/lib/auth.ts with createAuth function. Configure betterAuth with drizzleAdapter (provider: sqlite), Google social provider using env.GOOGLE_CLIENT_ID and env.GOOGLE_CLIENT_SECRET, trustedOrigins from env.BETTER_AUTH_URL, and session expiry of 30 days. | Restrictions: Must create auth instance inside function (not at module level) due to Cloudflare Workers bindings, do not hardcode credentials | _Leverage: functions/lib/db.ts for Drizzle pattern | Success: TypeScript compiles without errors, auth instance can be created with env parameter | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 4. Auth API ハンドラーの作成
  - Files: `functions/api/auth/[...all].ts`
  - Create catch-all route for Better Auth endpoints
  - Handle both GET and POST methods
  - Purpose: Better Auth の認証エンドポイントを Hono で公開
  - _Leverage: functions/api/[[path]].ts (existing Hono setup), functions/lib/auth.ts_
  - _Requirements: REQ-1, REQ-2, REQ-4_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer | Task: Create functions/api/auth/[...all].ts as a Cloudflare Pages Function. Import createAuth from functions/lib/auth.ts. Handle GET and POST requests by calling auth.handler(request). Return the response from Better Auth. | Restrictions: Follow Cloudflare Pages Functions pattern, pass context.env to createAuth | _Leverage: functions/api/[[path]].ts for Hono pattern | Success: Endpoints /api/auth/* respond correctly, Google OAuth redirect works | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 5. Better Auth クライアントの作成
  - Files: `src/lib/auth-client.ts`
  - Create authClient with createAuthClient
  - Configure baseURL as '/api/auth'
  - Purpose: フロントエンドから認証 API を呼び出すクライアントを作成
  - _Requirements: REQ-1, REQ-2, REQ-4_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/lib/auth-client.ts. Import createAuthClient from 'better-auth/react'. Export authClient configured with baseURL: '/api/auth'. | Restrictions: Keep configuration minimal, do not add unused options | Success: authClient exports signIn, signOut, useSession correctly, TypeScript compiles | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 6. useAuth フックの作成
  - Files: `src/hooks/useAuth.ts`
  - Wrap authClient.useSession() with additional utilities
  - Provide signInWithGoogle and signOut functions
  - Purpose: コンポーネントから使いやすい認証フックを提供
  - _Leverage: src/lib/auth-client.ts, src/hooks/useTimeline.ts (existing hook pattern)_
  - _Requirements: REQ-1, REQ-2, REQ-3, REQ-4_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/hooks/useAuth.ts. Use authClient.useSession() to get session data. Return user, isAuthenticated, isLoading, signInWithGoogle (calls authClient.signIn.social with provider 'google'), and signOut (calls authClient.signOut). | Restrictions: Follow existing hook patterns from useTimeline.ts, handle loading and error states | _Leverage: src/hooks/useTimeline.ts for pattern | Success: Hook returns correct auth state, signInWithGoogle triggers OAuth flow | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 7. LoginButton コンポーネントの作成
  - Files: `src/components/common/LoginButton.tsx`
  - Create Google-branded login button
  - Include Google logo SVG
  - Purpose: 未ログイン時にヘッダーに表示するログインボタン
  - _Leverage: src/components/common/Button.tsx (existing button styles)_
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/components/common/LoginButton.tsx. Create a button with Google logo and text "Google でログイン". Style with white background, gray border, following Google branding guidelines. Accept onClick prop for sign-in action. | Restrictions: Follow Google Sign-In branding guidelines, use existing Button component patterns | _Leverage: src/components/common/Button.tsx for styling patterns | Success: Button renders correctly with Google branding, onClick triggers sign-in | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 8. UserMenu コンポーネントの作成
  - Files: `src/components/common/UserMenu.tsx`
  - Display user avatar and name
  - Add dropdown with logout option
  - Purpose: ログイン後にヘッダーに表示するユーザーメニュー
  - _Leverage: src/components/common/UserInfo.tsx (existing component)_
  - _Requirements: REQ-3, REQ-4_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create src/components/common/UserMenu.tsx. Accept user prop (name, email, image) and onLogout prop. Display UserInfo component. Add click handler to toggle dropdown menu. Dropdown contains "ログアウト" button that calls onLogout. | Restrictions: Reuse UserInfo component, use Tailwind for styling, handle click-outside to close dropdown | _Leverage: src/components/common/UserInfo.tsx | Success: Avatar and name display correctly, dropdown opens/closes, logout works | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 9. Layout コンポーネントの更新
  - Files: `src/components/common/Layout.tsx`
  - Add auth section to header
  - Conditionally render LoginButton or UserMenu
  - Purpose: ヘッダー右上に認証 UI を追加
  - _Leverage: src/components/common/Layout.tsx (existing), src/hooks/useAuth.ts_
  - _Requirements: REQ-1, REQ-3_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Update src/components/common/Layout.tsx. Import useAuth hook. Add auth section to header (right side). If isAuthenticated, render UserMenu with user data and signOut. Otherwise render LoginButton with signInWithGoogle. Handle isLoading state. | Restrictions: Maintain existing layout structure, use flexbox for header alignment | _Leverage: src/components/common/Layout.tsx, src/hooks/useAuth.ts | Success: Header shows login button when logged out, shows user menu when logged in | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 10. コンポーネントを index.ts にエクスポート追加
  - Files: `src/components/common/index.ts`
  - Export LoginButton and UserMenu
  - Purpose: バレルエクスポートに新規コンポーネントを追加
  - _Leverage: src/components/common/index.ts (existing exports)_
  - _Requirements: N/A_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Update src/components/common/index.ts. Add exports for LoginButton and UserMenu components. | Restrictions: Follow existing export pattern | _Leverage: src/components/common/index.ts | Success: Components can be imported from 'components/common' | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 11. 環境変数の設定ドキュメント作成
  - Files: `.dev.vars.example`
  - Create example environment variables file
  - Document required variables for Google OAuth
  - Purpose: 開発者が環境変数を設定するためのテンプレート
  - _Requirements: REQ-2_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Create .dev.vars.example file with placeholder values for BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET. Add comments explaining each variable. | Restrictions: Do not include real credentials, use placeholder values | Success: File serves as template for developers to create .dev.vars | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 12. Storybook Stories の作成
  - Files: `src/components/common/LoginButton.stories.tsx`, `src/components/common/UserMenu.stories.tsx`
  - Create stories for LoginButton and UserMenu
  - Include different states (loading, logged in, logged out)
  - Purpose: コンポーネントのカタログと視覚的テスト
  - _Leverage: src/stories/mocks/data.ts, existing *.stories.tsx files_
  - _Requirements: REQ-1, REQ-3_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Storybook stories for LoginButton and UserMenu. Follow CSF 3.0 format with Meta and StoryObj. Add tags: ['autodocs']. Create stories for default state, loading state, and different user data. | Restrictions: Follow existing story patterns, use Common category | _Leverage: Existing *.stories.tsx files for patterns | Success: Stories render correctly in Storybook, all states are visible | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_

- [x] 13. 動作確認とテスト
  - Manual testing of complete login flow
  - Verify Google OAuth redirect works
  - Test session persistence across page reloads
  - Test logout functionality
  - Purpose: 実装が要件を満たしていることを確認
  - _Requirements: REQ-1, REQ-2, REQ-3, REQ-4, REQ-5_
  - _Prompt: Implement the task for spec login, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Perform manual testing of the complete login flow. Start dev server with `npm run dev:api`. Test: 1) Login button appears in header, 2) Click redirects to Google OAuth, 3) After auth, user info shows in header, 4) Page reload maintains session, 5) Logout clears session and shows login button. Document any issues found. | Restrictions: Must use real Google OAuth credentials in .dev.vars | Success: All 5 test cases pass, login flow works end-to-end | Instructions: Mark this task as in-progress in tasks.md before starting, use log-implementation tool after completion, then mark as complete_
