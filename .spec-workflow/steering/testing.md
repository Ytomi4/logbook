# Testing Strategy

## Philosophy

個人開発の規模に合わせ、**静的解析を最大限活用**し、動的テストは費用対効果の高い部分に限定する。

> "テストがソフトウェアの使用方法に近いほど、より高い信頼度が得られる"
> — Kent C. Dodds

この原則を踏まえつつ、保守コストとのバランスを取る。

## Current Stack

| Level | Tool | Purpose | Status |
|-------|------|---------|--------|
| Static | TypeScript 5.9 (strict) | 型によるバグ防止 | ✅ 必須 |
| Static | ESLint 9 | コード品質・一貫性 | ✅ 必須 |
| Visual | Storybook 10 | コンポーネントカタログ | ✅ 運用中 |
| Unit/Integration | Vitest 3 + Testing Library | 動的テスト | 📦 導入済み（必要に応じて使用） |

## Testing Pyramid（現実的な配分）

```
        E2E          ← 将来的に検討
    ┌──────────┐
    │Integration│    ← 複雑なAPI連携があれば
    ├──────────┤
    │   Unit   │     ← 複雑なロジックのみ
    ├──────────┤
    │  Static  │     ← ここで大半のバグを防ぐ
    └──────────┘
```

## What to Test

### 今すぐ書くべき

- **なし** — 静的解析とStorybookで十分カバーできる現状

### 必要に応じて書く

| 対象 | ツール | 例 |
|------|--------|-----|
| 複雑なユーティリティ関数 | Vitest | 日付計算、データ変換 |
| カスタムhooks | Vitest + renderHook | useDebounce, useLocalStorage |
| 重要なフォーム | Storybook play function | ログインフォーム、書籍登録 |

### 書かなくてよい

- 単純なコンポーネント（PropsをそのままレンダリングするだけのもE）
- Storybookで視覚確認できるUI
- 外部ライブラリの動作確認

## Conventions

### ファイル配置

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx    # Storybook
│       └── Button.test.tsx       # Vitest（必要な場合のみ）
├── hooks/
│   └── useDebounce.test.ts       # hooks は積極的にテスト
└── utils/
    └── dateUtils.test.ts         # 複雑なロジックはテスト
```

### 命名規則

- テストファイル: `*.test.ts`, `*.test.tsx`
- Storybook: `*.stories.tsx`

### テストの書き方

```typescript
// Good: ユーザー視点で書く
it('送信ボタンをクリックするとフォームが送信される', async () => {
  // ...
});

// Bad: 実装詳細をテストする
it('handleSubmit関数が呼ばれる', async () => {
  // ...
});
```

## Future Considerations

プロジェクトの成長に応じて段階的に導入を検討する。

### Phase 1: Storybook Interaction Tests

重要なユーザーインタラクションを `play` function でテスト。

```typescript
// 例: ログインフォーム
export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'password');
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(canvas.getByText('送信完了')).toBeInTheDocument();
  },
};
```

### Phase 2: API Integration Tests

MSW (Mock Service Worker) を使用したAPI連携テスト。

```typescript
// 外部API（NDL Search等）のモック
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('/api/books/search', () => {
    return HttpResponse.json({ books: [...] });
  }),
];
```

### Phase 3: E2E Tests

ユーザー数が増加し、クリティカルパスの自動検証が必要になった場合。

- **Tool**: Playwright
- **Scope**: 認証フロー、書籍登録→一覧表示

### Phase 4: Visual Regression

デザイナーとの協業やUIの一貫性が重要になった場合。

- **Tool**: Chromatic
- **Features**: ビジュアルリグレッション、Figma連携
- **Note**: 無料枠 5,000スクリーンショット/月

## Commands

```bash
# テスト実行
npm test              # Vitest（watchモード）
npm test -- --run     # CI用（1回実行）

# Storybook
npm run storybook     # 開発サーバー起動

# Lint
npm run lint          # ESLint実行
```

## References

- [Testing Trophy - Kent C. Dodds](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)
- [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Vitest Guide](https://vitest.dev/guide/)
- [Chromatic](https://www.chromatic.com/)
