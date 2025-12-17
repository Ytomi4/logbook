# Requirements Document: Timeline Redesign

## Introduction

タイムラインと本一覧を統合したタブベースのナビゲーションと、タイムライン上での書影表示を実現する UI リデザイン機能。Figma デザイン（node-id: 11:136）に基づき、より直感的で視覚的に豊かな読書記録体験を提供する。

**主な変更点:**
- タブによるタイムラインと本一覧の切り替え
- タイムラインへの縦ライン・ドットによるビジュアルタイムライン表示
- 書影（本の表紙画像）のタイムライン表示
- 同一ページ内でのビュー切り替え（ルーティング変更なし）

## Alignment with Product Vision

本機能は product.md で定義された以下の目標に沿っています：

1. **シンプルさ優先**: タブ切り替えにより、ページ遷移なく2つのビューを行き来でき、直感的な操作を実現
2. **高速な操作**: 同一ページ内でのビュー切り替えにより、ページロードなしで即座に表示を変更
3. **タイムライン表示の強化**: 縦ライン・ドットによる時系列の可視化、書影表示による視覚的な豊かさ

## Requirements

### Requirement 1: タブナビゲーション

**User Story:** ユーザーとして、タイムラインと本一覧をタブで素早く切り替えたい。ページ遷移なしで両方のビューを確認できるようにしたい。

#### Acceptance Criteria

1. WHEN ユーザーがホームページ（/）にアクセス THEN システムは「タイムライン」と「本の一覧」の2つのタブを表示 SHALL タイムラインタブがデフォルトで選択状態
2. WHEN ユーザーが「本の一覧」タブをクリック THEN システム SHALL 本一覧ビューを表示（ページ遷移なし）
3. WHEN ユーザーが「タイムライン」タブをクリック THEN システム SHALL タイムラインビューを表示（ページ遷移なし）
4. IF タブが選択状態 THEN システム SHALL 選択されたタブを視覚的に区別（白背景、ボーダー）
5. WHEN タブを切り替え THEN システム SHALL URLを変更せずビューのみ切り替え

### Requirement 2: タイムラインビジュアル強化

**User Story:** ユーザーとして、読書記録の時系列を視覚的に把握したい。縦のタイムラインで時間の流れを感じられるようにしたい。

#### Acceptance Criteria

1. WHEN タイムラインを表示 THEN システム SHALL 縦のライン（グレー、幅2px）を左端に表示
2. WHEN 本のグループを表示 THEN システム SHALL 本の開始位置に黒丸ドット（16px、白い内円付き）を表示
3. WHEN 各ログエントリを表示 THEN システム SHALL ログの位置にグレードット（16px）を表示
4. IF ログが引用タイプ THEN システム SHALL ドットを塗りつぶしなし（ボーダーのみ）で表示
5. WHEN 縦ラインを表示 THEN システム SHALL 各本グループ内のログ間を接続

### Requirement 3: 書影（本の表紙）表示

**User Story:** ユーザーとして、タイムライン上で本の表紙画像を見て、どの本のログかを視覚的に識別したい。

#### Acceptance Criteria

1. WHEN 本のグループヘッダーを表示 THEN システム SHALL 書影サムネイル（48x64px、角丸4px）を表示
2. IF 本に coverUrl が設定されている THEN システム SHALL その画像を書影として表示
3. IF 本に coverUrl が未設定 THEN システム SHALL デフォルトの本アイコン（グレー背景）を表示
4. WHEN 書影をクリック THEN システム SHALL 本の詳細ページに遷移

### Requirement 4: 本一覧タブの統合

**User Story:** ユーザーとして、本一覧を独立したページではなく、タイムラインと同じ画面内で確認したい。

#### Acceptance Criteria

1. WHEN 「本の一覧」タブを選択 THEN システム SHALL 既存の本一覧と同等の機能を表示
2. WHEN 本一覧を表示 THEN システム SHALL グリッドレイアウトで本を表示
3. WHEN 本をクリック THEN システム SHALL 本の詳細ページに遷移
4. IF 本が0件 THEN システム SHALL 「本を追加」への導線を表示

### Requirement 5: ヘッダーアクションボタン

**User Story:** ユーザーとして、どのビューにいても素早くログや本を追加したい。

#### Acceptance Criteria

1. WHEN ホームページを表示 THEN システム SHALL 「ログを追加」ボタン（黒背景、白文字）を表示
2. WHEN ホームページを表示 THEN システム SHALL 「本を追加」ボタン（白背景、グレーボーダー）を表示
3. WHEN 「ログを追加」をクリック THEN システム SHALL クイックログモーダルを開く
4. WHEN 「本を追加」をクリック THEN システム SHALL 本登録ページに遷移

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: タブコンポーネント、タイムラインビュー、本一覧ビューを分離
- **Modular Design**: タブ切り替えロジックを再利用可能なフックとして実装
- **Dependency Management**: 既存の Timeline, BookList コンポーネントを活用
- **Clear Interfaces**: タブ状態管理のための明確な型定義

### Performance
- タブ切り替え時のレンダリングは100ms以内
- 書影画像は遅延読み込み（lazy loading）を適用
- 両タブのデータは必要時のみフェッチ（不要な事前読み込みを避ける）

### Usability
- タブの選択状態が視覚的に明確
- 書影のない本でもレイアウトが崩れない
- 既存のキーボードショートカット（Alt+H, Alt+B）との整合性維持
