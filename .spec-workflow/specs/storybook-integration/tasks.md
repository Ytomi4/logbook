# Tasks Document

## Phase 1: Storybook 環境構築

- [x] 1. Storybook 依存関係のインストールと初期設定
  - Files: package.json, .storybook/main.ts, .storybook/preview.ts
  - Storybook 10.x（Vite 7 対応、ESM-only）と関連パッケージをインストール
  - `.storybook/main.ts` で Vite ビルダーと Stories パターンを設定
  - `.storybook/preview.ts` で Tailwind CSS を読み込み、グローバル設定を追加
  - Purpose: Storybook 開発環境を構築し、`npm run storybook` で起動できるようにする
  - _Leverage: vite.config.ts（既存の Vite 設定）, src/index.css（Tailwind CSS）_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer specializing in frontend tooling and Storybook configuration | Task: Install Storybook 10.x (Vite 7 compatible, ESM-only) with @storybook/react-vite builder and configure .storybook/main.ts and .storybook/preview.ts to support Tailwind CSS 4 and path alias (@/), following requirements 1.1-1.4 | Restrictions: Do not modify existing vite.config.ts, use devDependencies only, ensure Tailwind CSS styles are properly loaded in Storybook | _Leverage: vite.config.ts for Vite settings, src/index.css for Tailwind CSS | Success: `npm run storybook` starts Storybook dev server on port 6006, Tailwind CSS classes render correctly, `npm run build-storybook` creates static build | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 2. npm scripts の追加と動作確認
  - File: package.json
  - `storybook` と `build-storybook` スクリプトを追加
  - Storybook サーバーが正常に起動することを確認
  - Purpose: 開発者が簡単に Storybook を起動できるようにする
  - _Leverage: package.json（既存のスクリプト構成）_
  - _Requirements: 1.1, 1.4, 4.3_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Add storybook and build-storybook npm scripts to package.json following requirements 1.1, 1.4, and 4.3 | Restrictions: Do not modify existing scripts, follow existing script naming conventions | _Leverage: package.json existing script patterns | Success: `npm run storybook` command works, `npm run build-storybook` generates static output in storybook-static directory | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

## Phase 2: モックデータの作成

- [x] 3. Stories 用モックデータの作成
  - File: src/stories/mocks/data.ts
  - 既存の型定義（Book, LogWithBook 等）に基づくモックデータを作成
  - 複数のバリエーション（空、1件、複数件）を用意
  - Purpose: Stories で使用する一貫したテストデータを提供
  - _Leverage: src/types/index.ts（型定義）_
  - _Requirements: 3.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in testing and mock data | Task: Create comprehensive mock data file at src/stories/mocks/data.ts with Book, LogWithBook, and other types following requirement 3.2, using existing type definitions from src/types/index.ts | Restrictions: Must match existing type structures exactly, include various data scenarios (empty, single, multiple items), do not hardcode Japanese characters that might break encoding | _Leverage: src/types/index.ts for type definitions | Success: Mock data compiles without type errors, covers common data scenarios, can be imported and used in Stories | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

## Phase 3: 共通コンポーネントの Stories 作成

- [x] 4. Button コンポーネントの Stories 作成
  - File: src/components/common/Button.stories.tsx
  - variant（primary, secondary, danger, ghost）と size（sm, md, lg）の全組み合わせ
  - loading 状態、disabled 状態の Stories
  - autodocs タグを追加して Props ドキュメントを自動生成
  - Purpose: Button の全バリエーションをカタログ化
  - _Leverage: src/components/common/Button.tsx_
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in Storybook and component documentation | Task: Create Button.stories.tsx with CSF 3.0 format covering all variant and size combinations, loading and disabled states following requirements 2.1-2.4 | Restrictions: Use CSF 3.0 format with Meta and StoryObj, include autodocs tag, follow Storybook best practices for argTypes | _Leverage: src/components/common/Button.tsx for component props and variants | Success: All Button variants visible in Storybook, Controls panel allows dynamic prop changes, Docs page shows Props table | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 5. Input と Textarea コンポーネントの Stories 作成
  - Files: src/components/common/Input.stories.tsx, src/components/common/Textarea.stories.tsx
  - placeholder、disabled、error 状態の Stories
  - Purpose: フォーム入力コンポーネントをカタログ化
  - _Leverage: src/components/common/Input.tsx, src/components/common/Textarea.tsx_
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Input.stories.tsx and Textarea.stories.tsx with CSF 3.0 format, covering default, placeholder, disabled, and error states following requirements 2.1-2.4 | Restrictions: Use CSF 3.0 format, include autodocs tag, maintain consistent story naming | _Leverage: src/components/common/Input.tsx, src/components/common/Textarea.tsx | Success: Input and Textarea components visible in Storybook with all states, Controls panel functional | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 6. Card コンポーネントの Stories 作成
  - File: src/components/common/Card.stories.tsx
  - Card, CardHeader, CardTitle, CardContent の組み合わせ
  - Purpose: カードレイアウトコンポーネントをカタログ化
  - _Leverage: src/components/common/Card.tsx_
  - _Requirements: 2.1, 2.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Card.stories.tsx demonstrating Card, CardHeader, CardTitle, CardContent composition following requirements 2.1-2.2 | Restrictions: Use CSF 3.0 format, show realistic content examples | _Leverage: src/components/common/Card.tsx | Success: Card component compositions visible in Storybook | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 7. Modal コンポーネントの Stories 作成
  - File: src/components/common/Modal.stories.tsx
  - 開閉状態を Args で制御
  - モーダル内にコンテンツを配置した例
  - Purpose: モーダルダイアログをカタログ化
  - _Leverage: src/components/common/Modal.tsx_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Modal.stories.tsx with open/close state controlled via args, showing modal with sample content following requirements 2.1-2.3 | Restrictions: Use CSF 3.0 format, handle isOpen state properly in stories, include close button interaction | _Leverage: src/components/common/Modal.tsx | Success: Modal opens/closes via Controls, content displays correctly | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 8. Toast と Loading コンポーネントの Stories 作成
  - Files: src/components/common/Toast.stories.tsx, src/components/common/Loading.stories.tsx
  - Toast: success, error, info バリアント
  - Loading, LoadingPage の表示
  - Purpose: フィードバックコンポーネントをカタログ化
  - _Leverage: src/components/common/Toast.tsx, src/components/common/Loading.tsx_
  - _Requirements: 2.1, 2.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Toast.stories.tsx and Loading.stories.tsx with all variants following requirements 2.1-2.2, Toast needs ToastProvider decorator | Restrictions: Use CSF 3.0 format, wrap Toast stories with ToastProvider decorator | _Leverage: src/components/common/Toast.tsx, src/components/common/Loading.tsx | Success: Toast variants and Loading states visible in Storybook | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

## Phase 4: 機能コンポーネントの Stories 作成

- [x] 9. Timeline コンポーネント群の Stories 作成
  - Files: src/components/Timeline/TimelineItem.stories.tsx, src/components/Timeline/TimelineGroup.stories.tsx, src/components/Timeline/TimelineEmpty.stories.tsx, src/components/Timeline/QuoteDisplay.stories.tsx
  - モックデータを使用して表示
  - memo タイプと quote タイプの両方を表示
  - Purpose: タイムライン表示コンポーネントをカタログ化
  - _Leverage: src/components/Timeline/*.tsx, src/stories/mocks/data.ts_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Stories for TimelineItem, TimelineGroup, TimelineEmpty, and QuoteDisplay using mock data from src/stories/mocks/data.ts following requirements 3.1-3.2 | Restrictions: Use CSF 3.0 format, organize under Timeline category, show both memo and quote log types | _Leverage: src/components/Timeline/*.tsx, src/stories/mocks/data.ts | Success: Timeline components visible in Storybook under Timeline category, mock data renders correctly | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 10. BookList コンポーネント群の Stories 作成
  - Files: src/components/BookList/BookGrid.stories.tsx, src/components/BookList/BookListView.stories.tsx
  - モックの Book データを使用
  - 空の状態と複数件の状態
  - Purpose: 書籍一覧表示コンポーネントをカタログ化
  - _Leverage: src/components/BookList/*.tsx, src/stories/mocks/data.ts_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Stories for BookGrid and BookListView using mock Book data following requirements 3.1-3.2, showing empty and populated states | Restrictions: Use CSF 3.0 format, organize under BookList category | _Leverage: src/components/BookList/*.tsx, src/stories/mocks/data.ts | Success: BookList components visible in Storybook, empty and populated states shown | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 11. LogForm コンポーネント群の Stories 作成
  - Files: src/components/LogForm/LogForm.stories.tsx, src/components/LogForm/LogTypeSelector.stories.tsx
  - memo と quote の切り替え
  - フォーム入力状態
  - Purpose: ログ入力フォームコンポーネントをカタログ化
  - _Leverage: src/components/LogForm/*.tsx, src/stories/mocks/data.ts_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Stories for LogForm and LogTypeSelector showing memo/quote type switching following requirements 3.1-3.2 | Restrictions: Use CSF 3.0 format, organize under LogForm category, mock form submission handlers | _Leverage: src/components/LogForm/*.tsx, src/stories/mocks/data.ts | Success: LogForm components visible in Storybook, type switching works in Controls | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 12. BookForm コンポーネント群の Stories 作成
  - Files: src/components/BookForm/BookForm.stories.tsx, src/components/BookForm/BookSearchInput.stories.tsx
  - 新規登録と編集モード
  - 検索入力コンポーネント
  - Purpose: 書籍フォームコンポーネントをカタログ化
  - _Leverage: src/components/BookForm/*.tsx, src/stories/mocks/data.ts_
  - _Requirements: 3.1, 3.2, 3.3_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create Stories for BookForm (create and edit modes) and BookSearchInput following requirements 3.1-3.3, mock API handlers for search functionality | Restrictions: Use CSF 3.0 format, organize under BookForm category, mock NDL search API responses | _Leverage: src/components/BookForm/*.tsx, src/stories/mocks/data.ts | Success: BookForm components visible in Storybook, create and edit modes shown | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

## Phase 5: ドキュメント更新と最終確認

- [x] 13. 全体動作確認と ESLint 対応
  - Files: .eslintrc.*, package.json
  - Storybook が正常に起動し、全 Stories が表示されることを確認
  - ESLint エラーがないことを確認
  - Purpose: 品質基準を満たした状態で導入を完了
  - _Leverage: eslint.config.js_
  - _Requirements: 4.1, 4.2_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Verify all Stories load correctly in Storybook, run ESLint and fix any errors in .stories.tsx files following requirements 4.1-4.2 | Restrictions: Do not modify ESLint rules, fix code to comply with existing rules | _Leverage: eslint.config.js for lint rules | Success: `npm run storybook` shows all Stories without errors, `npm run lint` passes with no errors in Stories files | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 14. CLAUDE.md に Storybook 開発ルールを追記
  - File: CLAUDE.md
  - 新しいコンポーネント作成時に Stories ファイル（*.stories.tsx）も作成するルールを追記
  - Stories ファイルの配置場所（コンポーネントと同じディレクトリ）を明記
  - Purpose: 今後の開発で Storybook が継続的に更新されるようにする
  - _Leverage: CLAUDE.md（既存のガイドライン）_
  - _Requirements: 4.1_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer | Task: Add Storybook development rules to CLAUDE.md, specifying that new components must have corresponding .stories.tsx files in the same directory following requirement 4.1 | Restrictions: Add to existing Code Style or similar section, do not remove existing content, use consistent Japanese formatting | _Leverage: CLAUDE.md existing structure | Success: CLAUDE.md contains clear instructions for creating Stories with new components, colocation pattern is documented | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_

- [x] 15. README.md に Storybook セクションを追記
  - File: README.md
  - Storybook の起動方法（`npm run storybook`）を追記
  - Storybook の目的と使い方を簡潔に説明
  - Purpose: 開発者が Storybook の存在と使い方を把握できるようにする
  - _Leverage: README.md（既存のドキュメント）_
  - _Requirements: 4.1_
  - _Prompt: Implement the task for spec storybook-integration, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer | Task: Add Storybook section to README.md with startup instructions and brief explanation of its purpose following requirement 4.1 | Restrictions: Add to appropriate section (e.g., Development or Commands), maintain existing README structure and formatting | _Leverage: README.md existing structure | Success: README.md contains Storybook section with `npm run storybook` command and brief description | After completion: Mark this task as in-progress in tasks.md before starting, use log-implementation tool to record implementation details, then mark as complete in tasks.md_
