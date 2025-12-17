# Feature Specification: 読書ログアプリケーション (Reading Log App)

**Feature Branch**: `001-reading-log-app`
**Created**: 2025-12-17
**Status**: Draft
**Input**: User description: 読書ログアプリケーションを作る。読んだ本の記録を残し、振り返りができる Web アプリケーション。

## User Scenarios & Testing _(mandatory)_

### User Story 1 - タイムラインでの読書ログ閲覧 (Priority: P1)

ユーザーとして、自分の読書ログをタイムライン形式で閲覧したい。Git のコミット履歴のように、時系列で読書の軌跡を振り返ることで、どのように本を読み進めたかを把握できる。

**Why this priority**: これがプロダクトの中心的価値。単なる「読んだ」記録ではなく、読書プロセスの可視化が最も重要。

**Independent Test**: タイムライン画面にアクセスし、読書ログが時系列で表示されることを確認できる。

**Acceptance Scenarios**:

1. **Given** 読書ログが存在する状態, **When** タイムライン画面を表示する, **Then** 全てのログが新しい順に縦軸タイムラインで表示される
2. **Given** 同じ本に対する連続したログがある状態, **When** タイムラインを表示する, **Then** 本の情報は最初の 1 回だけ表示され、その下にログが連続表示される
3. **Given** タイムラインを表示している状態, **When** 各ログを確認する, **Then** 左側に縦の軸線があり、各ポイントに円のマーカーが配置されている
4. **Given** 引用タイプのログがある状態, **When** そのログを表示する, **Then** 左ボーダー・イタリック体の引用スタイルで表示される

---

### User Story 2 - 読書ログの登録 (Priority: P1)

ユーザーとして、本を読んでいる最中に素早くログ（メモや引用）を記録したい。読書に集中している状態を妨げずに、最小限の操作で思考や気づきを残せる。

**Why this priority**: ログの蓄積がなければタイムラインの価値がない。簡単な登録体験はユーザーの継続利用に直結する。

**Independent Test**: 本の詳細画面からログを追加し、その内容がタイムラインに反映されることを確認できる。

**Acceptance Scenarios**:

1. **Given** 本が登録されている状態, **When** その本に対してメモを入力して保存する, **Then** メモタイプのログとして記録される
2. **Given** 本が登録されている状態, **When** その本に対して引用を入力して保存する, **Then** 引用タイプのログとして記録される
3. **Given** ログ入力画面を開いている状態, **When** テキストを入力して保存する, **Then** 3 ステップ以内で完了できる

---

### User Story 3 - 本の登録 (Priority: P2)

ユーザーとして、読んだ本を簡単に登録したい。タイトルを入力するだけで書誌情報を自動取得できることで、手間をかけずに本の記録を始められる。

**Why this priority**: ログを記録するには本の登録が前提。ただし初回のみの操作なのでログ登録より優先度は下。

**Independent Test**: 本のタイトルを入力して検索し、書誌情報を取得して本を登録できる。

**Acceptance Scenarios**:

1. **Given** 本の登録画面を開いている状態, **When** タイトルを入力して検索する, **Then** 国会図書館の検索結果が表示される
2. **Given** 検索結果が表示されている状態, **When** 候補を選択する, **Then** 書誌情報（著者、出版社、ISBN 等）が自動で入力される
3. **Given** 検索結果がない場合, **When** 手動で本の情報を入力する, **Then** 最低限タイトルのみで本を登録できる

---

### User Story 4 - 公開タイムラインの閲覧 (Priority: P3)

誰でも（URLを知っている人）、公開されている読書ログのタイムラインを閲覧できる。オーナーの読書記録を外部から参照できる。

**Why this priority**: 「誰もが見れる場所」という要件を満たすが、まずは自分の記録機能が優先。シングルユーザーMVPでは閲覧者=外部訪問者。

**Independent Test**: ログインせずにタイムラインページにアクセスし、公開ログが表示されることを確認できる。

**Acceptance Scenarios**:

1. **Given** ログが存在する状態, **When** 外部訪問者がタイムラインURLにアクセスする, **Then** 全てのログが表示される
2. **Given** タイムラインを閲覧している状態, **When** 特定の本をクリックする, **Then** その本に関連するログ一覧を確認できる

---

### Edge Cases

- 国会図書館の検索で結果が 0 件の場合、ユーザーは手動で本の情報を入力できる
- 同じ本を重複登録しようとした場合、既存の本を使用するか確認する
- 非常に長いメモや引用の場合、タイムライン上では省略表示し、クリックで全文表示
- ログが大量にある場合、無限スクロールまたはページネーションで対応
- 本を削除した場合、関連ログは残り、本情報は「削除済み」として表示される

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display reading logs in a timeline view with a vertical axis line and circular markers
- **FR-002**: System MUST group consecutive logs for the same book, showing book info only once
- **FR-003**: System MUST support two log types: "memo" (メモ) and "quote" (引用)
- **FR-004**: System MUST display quotes with left border and italic styling (blockquote style)
- **FR-005**: Users MUST be able to add a log in 3 steps or fewer
- **FR-006**: System MUST allow book registration with title-only as minimum requirement
- **FR-007**: System MUST integrate with National Diet Library (NDL) search for book metadata
- **FR-008**: System MUST allow public viewing of the timeline without login
- **FR-009**: System MUST display logs in reverse chronological order (newest first)
- **FR-010**: System MUST persist all logs and books permanently
- **FR-011**: Users MUST be able to edit their own logs after creation
- **FR-012**: Users MUST be able to delete their own logs
- **FR-013**: Users MUST be able to delete their own books
- **FR-014**: System MUST preserve logs when associated book is deleted, displaying book info as "削除済み"

### Key Entities

- **Book (本)**: Represents a registered book. Attributes include title (required), author, publisher, ISBN, cover image URL. A book can have multiple logs.
- **Log (ログ)**: Represents a reading note or quote. Attributes include content text, log type (memo/quote), creation timestamp. Each log belongs to one book.
- **User (ユーザー)**: MVP is single-user (no authentication required). Data model should allow future multi-user expansion by including owner reference fields.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can add a reading log within 30 seconds from opening the app
- **SC-002**: Users can register a new book within 1 minute using the search feature
- **SC-003**: Timeline displays up to 100 logs without noticeable delay (under 2 seconds)
- **SC-004**: 90% of users can successfully add their first log without instructions
- **SC-005**: Public timeline is accessible to anyone with a direct link
- **SC-006**: Book search returns NDL results within 3 seconds

## Clarifications

### Session 2025-12-17

- Q: ログの公開範囲は？ → A: 全ログ公開（非公開機能なし）
- Q: ログの編集・削除は？ → A: 編集・削除どちらも可能
- Q: 本の削除時のログ処理は？ → A: 本削除可能、ログは残る（本情報は「削除済み」表示）
- Q: ユーザーモデルは？ → A: シングルユーザー（自分専用、認証不要）、将来マルチユーザー拡張予定

## Assumptions

- All logs are public by design; no per-log or per-book privacy controls in MVP
- National Diet Library (NDL) provides a publicly accessible search API
- Users will primarily access the application via web browser on desktop and mobile
- Japanese language support is required; multi-language support is not in initial scope
- MVP is single-user (personal use); no authentication required
- Data model includes owner reference fields to enable future multi-user expansion
- Social features (following, likes, multiple users) are out of scope for MVP
