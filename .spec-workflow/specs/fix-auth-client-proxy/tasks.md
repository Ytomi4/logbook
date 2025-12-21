# Tasks Document: fix-auth-client-proxy

- [x] 1. Proxy 実装から bind() を削除
  - File: src/lib/auth-client.ts
  - Proxy の get トラップから `bind()` 呼び出しを削除し、プロパティをそのまま返すように修正
  - Purpose: better-auth クライアントの内部 Proxy との互換性を回復
  - _Leverage: 既存の auth-client.ts 実装_
  - _Requirements: REQ-1, REQ-2_
  - _Prompt: Implement the task for spec fix-auth-client-proxy, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer specializing in JavaScript Proxy patterns | Task: Modify the Proxy implementation in auth-client.ts to remove the bind() call that breaks better-auth's internal Proxy. Change `if (typeof value === 'function') { return value.bind(client); }` to simply `return value;` following requirements REQ-1 and REQ-2 | Restrictions: Do not change the lazy initialization pattern, do not modify the authClient export type, maintain backward compatibility with useAuth.ts | Success: The Proxy get trap returns properties directly without bind(), the file compiles without TypeScript errors, the lazy initialization pattern is preserved | Instructions: Mark this task as in-progress [-] before starting, use log-implementation tool after completion, then mark as complete [x]_

- [x] 2. auth-client のユニットテストを作成
  - File: tests/lib/auth-client.test.ts
  - authClient のエクスポート、メソッドアクセス、遅延初期化を検証するテストを作成
  - Purpose: 今後の回帰を防ぐためのテストカバレッジを追加
  - _Leverage: tests/setup.ts, vitest_
  - _Requirements: REQ-3_
  - _Prompt: Implement the task for spec fix-auth-client-proxy, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in Vitest and mocking | Task: Create unit tests for auth-client.ts verifying that authClient exports correctly, methods like signOut are accessible, nested properties like signIn.social work, and lazy initialization functions properly following requirement REQ-3 | Restrictions: Use vitest mocking to mock better-auth/react module, do not make actual HTTP requests, focus on testing the Proxy behavior not better-auth internals | Success: Tests verify authClient export, method accessibility, nested property access, and lazy initialization. All tests pass with `npm test` | Instructions: Mark this task as in-progress [-] before starting, use log-implementation tool after completion, then mark as complete [x]_

- [x] 3. ビルドとテストの実行
  - Commands: npm run build, npm test
  - TypeScript ビルドが成功し、すべてのテストがパスすることを確認
  - Purpose: 修正が既存のコードベースを壊していないことを確認
  - _Requirements: REQ-1, REQ-2, REQ-3_
  - _Prompt: Implement the task for spec fix-auth-client-proxy, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Run build and test commands to verify the fix does not break existing functionality following all requirements | Restrictions: Do not skip any failing tests, address any build errors before proceeding | Success: `npm run build` completes without errors, `npm test` passes all tests including the new auth-client tests | Instructions: Mark this task as in-progress [-] before starting, use log-implementation tool after completion, then mark as complete [x]_

- [x] 4. 手動テスト（ローカル環境）
  - Commands: npm run dev:api
  - ローカル環境でログイン→ログアウトのフローをテスト
  - Purpose: 実際の認証フローが正常に動作することを確認
  - _Requirements: REQ-1_
  - _Prompt: Implement the task for spec fix-auth-client-proxy, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Manually test the login/logout flow in local environment (localhost:8788) to verify the fix works following requirement REQ-1 | Restrictions: Test must be performed in a browser, verify both login and logout work | Success: User can log in with Google OAuth, user can log out by clicking the logout button, no console errors appear during the logout process | Instructions: Mark this task as in-progress [-] before starting, use log-implementation tool after completion, then mark as complete [x]_
