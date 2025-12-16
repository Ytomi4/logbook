import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable(
  'books',
  {
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
  },
  (table) => [
    index('idx_books_created_at').on(table.createdAt),
    index('idx_books_is_deleted').on(table.isDeleted),
  ]
);

export const logs = sqliteTable(
  'logs',
  {
    id: text('id').primaryKey(),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id),
    logType: text('log_type', { enum: ['memo', 'quote'] }).notNull(),
    content: text('content').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_logs_book_id').on(table.bookId),
    index('idx_logs_created_at').on(table.createdAt),
    index('idx_logs_book_created').on(table.bookId, table.createdAt),
  ]
);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
