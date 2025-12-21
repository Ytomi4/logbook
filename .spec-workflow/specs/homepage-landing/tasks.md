# Tasks Document: Homepage Landing

## Summary

ホームページ（ランディングページ）の実装タスク。サービスの価値を簡潔に伝え、ユーザーをログイン/タイムラインへ導くシンプルなページを構築する。

## Phase 1: Core Components

- [ ] 1. Create FeatureCard component
  - File: `src/components/Landing/FeatureCard.tsx`
  - Props: icon, title, description
  - スタイル: カード形式、アイコン + タイトル + 説明文
  - Purpose: 個別の特徴を表示する再利用可能なカード
  - _Leverage: Tailwind CSS, 既存のカードパターン_
  - _Requirements: REQ-1.3_
  - _Prompt: Role: React Developer | Task: Create FeatureCard component with icon, title, description props. Use Tailwind for styling with card layout, centered icon, bold title, and gray description text. | Restrictions: Keep component simple and stateless. | Success: FeatureCard renders correctly with all props._

- [ ] 2. Create FeatureSection component
  - File: `src/components/Landing/FeatureSection.tsx`
  - 3つの FeatureCard を配置
  - レスポンシブ: デスクトップは横並び、モバイルは縦並び
  - 特徴内容:
    1. タイムライン形式 - 読書の軌跡を時系列で振り返る
    2. メモ・引用の記録 - 気づきや印象的なフレーズを残す
    3. シンプルな操作 - 素早く記録、いつでも振り返り
  - Purpose: サービスの主要な特徴を一覧表示
  - _Leverage: FeatureCard, Tailwind CSS grid/flex_
  - _Requirements: REQ-1.2, REQ-1.3, REQ-4_
  - _Prompt: Role: React Developer | Task: Create FeatureSection with 3 FeatureCards in responsive grid layout. Use grid-cols-1 md:grid-cols-3. Include appropriate icons for each feature. | Restrictions: Use static content, no props needed. | Success: Features display in grid on desktop, stack on mobile._

- [ ] 3. Create HeroSection component
  - File: `src/components/Landing/HeroSection.tsx`
  - Props: isAuthenticated, username
  - キャッチコピー: 「読書を、記録する。」「本との出会いを、タイムラインに。」
  - CTAボタン:
    - 未ログイン: 「はじめる」→ /enter
    - ログイン済: 「タイムラインを見る」→ /{username}
  - Purpose: サービスの価値を伝え、行動を促す
  - _Leverage: Button, Link, Tailwind CSS_
  - _Requirements: REQ-1.1, REQ-2, REQ-3_
  - _Prompt: Role: React Developer | Task: Create HeroSection with catchphrase and CTA button. Button shows "はじめる" linking to /enter for unauthenticated, "タイムラインを見る" linking to /{username} for authenticated. | Restrictions: Use Link component for navigation, large centered text layout. | Success: Correct CTA based on auth state._

- [ ] 4. Create Landing components barrel export
  - File: `src/components/Landing/index.ts`
  - Export: HeroSection, FeatureSection, FeatureCard
  - Purpose: コンポーネントの一括インポートを可能に
  - _Requirements: structure.md_
  - _Prompt: Role: Frontend Developer | Task: Create barrel export file for Landing components. | Success: All Landing components can be imported from single path._

## Phase 2: Page Integration

- [ ] 5. Create LandingPage component
  - File: `src/pages/LandingPage.tsx`
  - Layout コンポーネントでラップ
  - HeroSection と FeatureSection を配置
  - useAuth で認証状態を取得
  - Purpose: ホームページのメインコンポーネント
  - _Leverage: Layout, HeroSection, FeatureSection, useAuth_
  - _Requirements: REQ-1, REQ-2, REQ-3_
  - _Prompt: Role: React Developer | Task: Create LandingPage using Layout wrapper, HeroSection, and FeatureSection. Get auth state from useAuth hook and pass to HeroSection. | Restrictions: Keep page component thin, delegate to child components. | Success: Page renders with hero and features, auth-aware CTA._

- [ ] 6. Update router to add LandingPage route
  - File: `src/App.tsx` or router configuration file
  - Add route: `<Route path="/" element={<LandingPage />} />`
  - Ensure no conflict with /:username route
  - Purpose: ホームページへのルーティング設定
  - _Leverage: React Router DOM_
  - _Requirements: REQ-1_
  - _Prompt: Role: React Developer | Task: Add route for "/" to render LandingPage. Verify routing order to avoid conflict with /:username dynamic route. | Restrictions: Do not break existing routes. | Success: Navigating to "/" shows LandingPage._

## Phase 3: Storybook

- [ ] 7. Create FeatureCard Storybook stories
  - File: `src/components/Landing/FeatureCard.stories.tsx`
  - Stories: Default, Timeline, Notes, Simple
  - CSF 3.0 形式、tags: ['autodocs']
  - Purpose: FeatureCard のビジュアルカタログ
  - _Leverage: Storybook patterns_
  - _Requirements: structure.md_
  - _Prompt: Role: Frontend Developer | Task: Create FeatureCard.stories.tsx with multiple stories showing different feature content. Use CSF 3.0 format. | Success: Stories render in Storybook._

- [ ] 8. Create HeroSection Storybook stories
  - File: `src/components/Landing/HeroSection.stories.tsx`
  - Stories: Unauthenticated, Authenticated
  - CSF 3.0 形式、tags: ['autodocs']
  - Purpose: 認証状態別のHeroSection表示
  - _Leverage: Storybook patterns_
  - _Requirements: REQ-2, REQ-3_
  - _Prompt: Role: Frontend Developer | Task: Create HeroSection.stories.tsx with Unauthenticated and Authenticated stories. | Success: Both auth states visible in Storybook._

- [ ] 9. Create LandingPage Storybook stories
  - File: `src/pages/LandingPage.stories.tsx`
  - Stories: Default (mocked auth states)
  - CSF 3.0 形式、tags: ['autodocs']
  - Purpose: ページ全体のビジュアル確認
  - _Leverage: Storybook patterns, useAuth mock_
  - _Requirements: REQ-1_
  - _Prompt: Role: Frontend Developer | Task: Create LandingPage.stories.tsx with mocked useAuth hook. | Success: Full page renders in Storybook._

## Phase 4: Testing & Polish

- [ ] 10. Add unit tests for HeroSection
  - File: `tests/components/Landing/HeroSection.test.tsx`
  - Test: 未ログイン時のボタンテキストとリンク先
  - Test: ログイン済み時のボタンテキストとリンク先
  - Purpose: 認証状態に応じた表示の正確性を保証
  - _Leverage: Testing Library, Vitest_
  - _Requirements: REQ-2, REQ-3_
  - _Prompt: Role: QA Engineer | Task: Write tests for HeroSection verifying correct button text and link destination based on auth state. | Success: All tests pass._

- [ ] 11. Verify responsive layout
  - Manual testing on mobile and desktop viewports
  - Ensure features stack on mobile, align horizontally on desktop
  - Verify CTA button is accessible on all screen sizes
  - Purpose: レスポンシブデザインの確認
  - _Requirements: REQ-4_
  - _Prompt: Role: QA Engineer | Task: Manually test LandingPage on mobile (375px) and desktop (1280px) viewports. Verify layout adapts correctly. | Success: Layout works on all screen sizes._

- [ ] 12. Run tests and lint
  - Command: `npm test && npm run lint`
  - すべてのテストが通過し、lint エラーがないことを確認
  - Purpose: 品質保証
  - _Requirements: All_
  - _Prompt: Role: QA Engineer | Task: Run npm test && npm run lint and fix any errors. | Success: All tests pass, no lint errors._
