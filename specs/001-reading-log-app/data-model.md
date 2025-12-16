# Data Model: 読書ログアプリケーション

**Date**: 2025-12-17
**Database**: Cloudflare D1 (SQLite)
**ORM**: Drizzle ORM

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                           Book                              │
├─────────────────────────────────────────────────────────────┤
│ id: TEXT (PRIMARY KEY, UUID)                                │
│ title: TEXT (NOT NULL)                                      │
│ author: TEXT (NULLABLE)                                     │
│ publisher: TEXT (NULLABLE)                                  │
│ isbn: TEXT (NULLABLE)                                       │
│ cover_url: TEXT (NULLABLE)                                  │
│ ndl_bib_id: TEXT (NULLABLE) - NDL書誌ID                     │
│ is_deleted: INTEGER (DEFAULT 0) - Soft delete flag          │
│ created_at: TEXT (ISO8601)                                  │
│ updated_at: TEXT (ISO8601)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                            Log                              │
├─────────────────────────────────────────────────────────────┤
│ id: TEXT (PRIMARY KEY, UUID)                                │
│ book_id: TEXT (FOREIGN KEY → Book.id)                       │
│ log_type: TEXT ('memo' | 'quote')                           │
│ content: TEXT (NOT NULL)                                    │
│ created_at: TEXT (ISO8601)                                  │
│ updated_at: TEXT (ISO8601)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Table Definitions

### books

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| title | TEXT | NOT NULL | 書籍タイトル |
| author | TEXT | - | 著者名 |
| publisher | TEXT | - | 出版社 |
| isbn | TEXT | - | ISBN (10/13桁) |
| cover_url | TEXT | - | 表紙画像URL |
| ndl_bib_id | TEXT | - | 国会図書館書誌ID |
| is_deleted | INTEGER | DEFAULT 0 | 論理削除フラグ (0=active, 1=deleted) |
| created_at | TEXT | NOT NULL | 作成日時 (ISO8601) |
| updated_at | TEXT | NOT NULL | 更新日時 (ISO8601) |

**Indexes**:
- `idx_books_created_at` on `created_at DESC`
- `idx_books_is_deleted` on `is_deleted`

### logs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| book_id | TEXT | FOREIGN KEY, NOT NULL | 関連する書籍のID |
| log_type | TEXT | NOT NULL, CHECK | 'memo' または 'quote' |
| content | TEXT | NOT NULL | ログ内容 |
| created_at | TEXT | NOT NULL | 作成日時 (ISO8601) |
| updated_at | TEXT | NOT NULL | 更新日時 (ISO8601) |

**Indexes**:
- `idx_logs_book_id` on `book_id`
- `idx_logs_created_at` on `created_at DESC`
- `idx_logs_book_created` on `(book_id, created_at DESC)` - タイムライングルーピング用

**Foreign Key**:
- `book_id` REFERENCES `books(id)` ON DELETE RESTRICT

## Drizzle Schema

```typescript
// db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  publisher: text('publisher'),
  isbn: text('isbn'),
  coverUrl: text('cover_url'),
  ndlBibId: text('ndl_bib_id'),
  isDeleted: integer('is_deleted').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id),
  logType: text('log_type', { enum: ['memo', 'quote'] }).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

## Validation Rules

### Book
- `title`: Required, 1-500 characters
- `author`: Optional, max 200 characters
- `publisher`: Optional, max 200 characters
- `isbn`: Optional, 10 or 13 digits (hyphen-free)
- `cover_url`: Optional, valid URL format

### Log
- `book_id`: Required, must reference existing non-deleted book
- `log_type`: Required, must be 'memo' or 'quote'
- `content`: Required, 1-10000 characters

## Query Patterns

### Timeline (grouped by book)

```sql
SELECT
  l.id, l.book_id, l.log_type, l.content, l.created_at,
  b.title, b.author, b.is_deleted
FROM logs l
JOIN books b ON l.book_id = b.id
ORDER BY l.created_at DESC
LIMIT 50 OFFSET 0;
```

Application layer groups consecutive logs by book_id.

### Book with logs count

```sql
SELECT
  b.*,
  COUNT(l.id) as log_count
FROM books b
LEFT JOIN logs l ON b.id = l.book_id
WHERE b.is_deleted = 0
GROUP BY b.id
ORDER BY b.created_at DESC;
```

### Logs for specific book

```sql
SELECT * FROM logs
WHERE book_id = ?
ORDER BY created_at DESC;
```

## State Transitions

### Book States
```
[Active] --delete()--> [Deleted (is_deleted=1)]
```
- Deleted books retain all logs
- Deleted books show as "削除済み" in timeline
- Deleted books cannot receive new logs

### Log Lifecycle
```
[Created] --edit()--> [Updated] --delete()--> [Removed]
```
- Logs can be edited (content, log_type)
- Logs can be hard deleted
- Editing updates `updated_at` timestamp

## Future Multi-User Extension

現在のスキーマは将来のマルチユーザー対応を考慮:

```sql
-- 将来追加予定のカラム
ALTER TABLE books ADD COLUMN owner_id TEXT;
ALTER TABLE logs ADD COLUMN owner_id TEXT;
```

現時点ではシングルユーザーのため、owner_id は未実装。
