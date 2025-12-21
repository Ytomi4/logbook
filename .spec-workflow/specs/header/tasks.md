# Tasks Document: Header

## Summary

ヘッダーコンポーネントの実装タスク。大部分は User Profile Setup で実装済みのため、アバターフォールバックの修正とテスト・Storybook の追加が主なタスク。

## Tasks

- [ ] 1. UserMenu のアバターフォールバック修正
  - File: src/components/common/UserMenu.tsx
  - `avatarUrl` が null の場合に `image`（Google 画像）へフォールバックする
  - 変更: `avatarUrl={user.avatarUrl ?? undefined}` → `avatarUrl={user.avatarUrl ?? user.image ?? undefined}`
  - Purpose: カスタムアバター未設定時でも Google 画像を表示し、空表示を避ける
  - _Requirements: 5.2_
  - _Prompt: Role: React Developer | Task: UserMenu.tsx の UserInfo 呼び出しで、avatarUrl のフォールバックを追加。user.avatarUrl ?? user.image ?? undefined の順で評価する | Restrictions: User interface は変更済み（image フィールドあり）、UserInfo コンポーネントは変更しない | Success: カスタムアバター未設定時に Google 画像が表示される_

- [ ] 2. UserMenu の User interface 確認
  - File: src/components/common/UserMenu.tsx
  - User interface に `image: string | null` が含まれていることを確認
  - 必要に応じて interface を更新
  - Purpose: フォールバック用の Google 画像フィールドを型定義に含める
  - _Requirements: 5.2_
  - _Prompt: Role: TypeScript Developer | Task: UserMenu.tsx の User interface に image フィールドが存在することを確認し、なければ追加 | Restrictions: 既存の username, avatarUrl フィールドは維持 | Success: User interface が { username, avatarUrl, image, ... } を含む_

- [ ] 3. Layout.tsx の動作確認
  - File: src/components/common/Layout.tsx
  - 認証状態に応じた表示が正しく動作することを確認
  - ロード中: スケルトン、未ログイン: 「はじめる」ボタン、ログイン済み: UserMenu
  - Purpose: 既存実装が要件を満たしていることを確認
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_
  - _Prompt: Role: QA Engineer | Task: Layout.tsx のヘッダー部分が要件通りに動作することを手動確認 | Restrictions: コード変更は不要、動作確認のみ | Success: ロゴクリックで / へ遷移、認証状態に応じた表示切り替えが正常_

- [ ] 4. UserMenu のドロップダウン動作確認
  - File: src/components/common/UserMenu.tsx
  - ドロップダウンの開閉、外側クリック、Escape キーで閉じる動作を確認
  - メニュー項目: @username、アカウント設定、ログアウト
  - Purpose: 既存実装が要件を満たしていることを確認
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - _Prompt: Role: QA Engineer | Task: UserMenu のドロップダウン動作を手動確認 | Restrictions: コード変更は不要 | Success: 開閉・キーボード操作・メニュー遷移がすべて正常_

- [ ] 5. アクセシビリティ確認
  - File: src/components/common/UserMenu.tsx
  - ARIA 属性（aria-expanded, aria-haspopup, aria-controls, aria-label）が適切か確認
  - Tab キーでのフォーカス移動を確認
  - Purpose: アクセシビリティ要件を満たしていることを確認
  - _Requirements: 4.1, 4.2, 4.3_
  - _Prompt: Role: Accessibility Specialist | Task: UserMenu の ARIA 属性とキーボードナビゲーションを確認 | Restrictions: 既存実装で問題なければ変更不要 | Success: ARIA 属性が適切、Tab 移動が機能する_

- [ ] 6. UserMenu の Storybook Stories 作成
  - File: src/components/common/UserMenu.stories.tsx
  - 開閉状態、ユーザー情報のバリエーション（アバターあり/なし、username あり/なし）
  - CSF 3.0 形式、tags: ['autodocs'] を追加
  - Purpose: コンポーネントのビジュアルカタログと自動ドキュメント
  - _Leverage: src/stories/mocks/data.ts_
  - _Requirements: 2.2, 3.4, 5.2_
  - _Prompt: Role: Frontend Developer | Task: UserMenu.stories.tsx を作成。Default, WithAvatar, WithoutAvatar, Opened 状態の Stories を定義 | Restrictions: CSF 3.0 形式、CLAUDE.md の Storybook ルールに従う | Success: Storybook でコンポーネントが正しく表示される_

- [ ] 7. UserInfo の Storybook Stories 作成
  - File: src/components/common/UserInfo.stories.tsx
  - アバター画像あり/なし、名前のバリエーション
  - CSF 3.0 形式、tags: ['autodocs'] を追加
  - Purpose: コンポーネントのビジュアルカタログ
  - _Requirements: 5.2_
  - _Prompt: Role: Frontend Developer | Task: UserInfo.stories.tsx を作成。Default, WithAvatar, WithoutAvatar, LongName の Stories を定義 | Restrictions: CSF 3.0 形式 | Success: Storybook でコンポーネントが正しく表示される_

- [ ] 8. Layout ヘッダー部分の Storybook Stories 作成
  - File: src/components/common/Layout.stories.tsx
  - 認証状態別の表示: ロード中、未ログイン、ログイン済み
  - CSF 3.0 形式、tags: ['autodocs'] を追加
  - Purpose: 認証状態によるヘッダー表示のビジュアル確認
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Role: Frontend Developer | Task: Layout.stories.tsx を作成。Loading, Unauthenticated, Authenticated 状態の Stories を定義 | Restrictions: useAuth をモック、CSF 3.0 形式 | Success: 各認証状態でヘッダーが正しく表示される_

- [ ] 9. UserMenu ユニットテスト作成
  - File: tests/components/UserMenu.test.tsx
  - ドロップダウン開閉、外側クリック、Escape キー、メニュー項目クリックのテスト
  - Purpose: コンポーネントの信頼性確保
  - _Leverage: @testing-library/react_
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_
  - _Prompt: Role: QA Engineer | Task: UserMenu.test.tsx を作成。開閉動作、キーボード操作、メニュー遷移のテストケースを実装 | Restrictions: Testing Library を使用、実装の詳細ではなく振る舞いをテスト | Success: すべてのテストが通過_

- [ ] 10. UserInfo ユニットテスト作成
  - File: tests/components/UserInfo.test.tsx
  - アバター表示、フォールバック（イニシャル）表示のテスト
  - Purpose: フォールバック動作の信頼性確保
  - _Leverage: @testing-library/react_
  - _Requirements: 5.2_
  - _Prompt: Role: QA Engineer | Task: UserInfo.test.tsx を作成。アバター表示とイニシャルフォールバックのテストケースを実装 | Restrictions: Testing Library を使用 | Success: すべてのテストが通過_

- [ ] 11. テスト実行と動作確認
  - Command: npm test && npm run lint
  - すべてのテストが通過し、lint エラーがないことを確認
  - Purpose: 品質保証
  - _Requirements: All_
  - _Prompt: Role: QA Engineer | Task: npm test && npm run lint を実行し、すべてのテストと lint が通過することを確認 | Restrictions: エラーがあれば修正 | Success: テスト・lint がすべて通過_

- [ ] 12. Storybook ビルド確認
  - Command: npm run storybook
  - 追加した Stories が正しく表示されることを確認
  - Purpose: ビジュアルドキュメントの確認
  - _Requirements: All_
  - _Prompt: Role: Frontend Developer | Task: Storybook を起動し、追加した Stories が正しく表示されることを確認 | Restrictions: エラーがあれば修正 | Success: すべての Stories が正常に表示される_
