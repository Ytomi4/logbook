import { Hono } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
import { createBookSchema, listBooksQuerySchema } from '../../../src/lib/validation';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// GET /api/books - List all books
app.get('/', async (c) => {
  const query = c.req.query();
  const parseResult = listBooksQuerySchema.safeParse(query);

  if (!parseResult.success) {
    return c.json(
      { message: 'Invalid query parameters', details: parseResult.error.flatten() },
      400
    );
  }

  const { include_deleted } = parseResult.data;

  try {
    let sql = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.publisher,
        b.isbn,
        b.cover_url as coverUrl,
        b.ndl_bib_id as ndlBibId,
        b.is_deleted as isDeleted,
        b.created_at as createdAt,
        b.updated_at as updatedAt,
        COUNT(l.id) as logCount
      FROM books b
      LEFT JOIN logs l ON b.id = l.book_id
    `;

    if (!include_deleted) {
      sql += ' WHERE b.is_deleted = 0';
    }

    sql += ' GROUP BY b.id ORDER BY b.updated_at DESC';

    const result = await c.env.DB.prepare(sql).all();

    const books = result.results.map((row: Record<string, unknown>) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      publisher: row.publisher,
      isbn: row.isbn,
      coverUrl: row.coverUrl,
      ndlBibId: row.ndlBibId,
      isDeleted: Boolean(row.isDeleted),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      logCount: Number(row.logCount),
    }));

    return c.json(books);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ message: 'Failed to fetch books' }, 500);
  }
});

// POST /api/books - Create a new book
app.post('/', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ message: 'Invalid JSON body' }, 400);
  }

  const parseResult = createBookSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(
      { message: 'Validation failed', details: parseResult.error.flatten() },
      400
    );
  }

  const { title, author, publisher, isbn, coverUrl, ndlBibId } = parseResult.data;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await c.env.DB.prepare(
      `INSERT INTO books (id, title, author, publisher, isbn, cover_url, ndl_bib_id, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    )
      .bind(id, title, author || null, publisher || null, isbn || null, coverUrl || null, ndlBibId || null, now, now)
      .run();

    const book = {
      id,
      title,
      author: author || null,
      publisher: publisher || null,
      isbn: isbn || null,
      coverUrl: coverUrl || null,
      ndlBibId: ndlBibId || null,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    return c.json(book, 201);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ message: 'Failed to create book' }, 500);
  }
});

export default app;
