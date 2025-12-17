import { Hono } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
import { updateBookSchema, uuidSchema } from '../../../../src/lib/validation';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// GET /api/books/:bookId - Get a book by ID
app.get('/', async (c) => {
  const bookId = c.req.param('bookId');

  const uuidResult = uuidSchema.safeParse(bookId);
  if (!uuidResult.success) {
    return c.json({ message: 'Invalid book ID format' }, 400);
  }

  try {
    const bookResult = await c.env.DB.prepare(
      `SELECT
        id,
        title,
        author,
        publisher,
        isbn,
        cover_url as coverUrl,
        ndl_bib_id as ndlBibId,
        is_deleted as isDeleted,
        created_at as createdAt,
        updated_at as updatedAt
       FROM books WHERE id = ?`
    )
      .bind(bookId)
      .first<Record<string, unknown>>();

    if (!bookResult) {
      return c.json({ message: 'Book not found' }, 404);
    }

    // Fetch logs for the book
    const logsResult = await c.env.DB.prepare(
      `SELECT
        id,
        book_id as bookId,
        log_type as logType,
        content,
        created_at as createdAt,
        updated_at as updatedAt
       FROM logs WHERE book_id = ? ORDER BY created_at DESC`
    )
      .bind(bookId)
      .all();

    const book = {
      id: bookResult.id,
      title: bookResult.title,
      author: bookResult.author,
      publisher: bookResult.publisher,
      isbn: bookResult.isbn,
      coverUrl: bookResult.coverUrl,
      ndlBibId: bookResult.ndlBibId,
      isDeleted: Boolean(bookResult.isDeleted),
      createdAt: bookResult.createdAt,
      updatedAt: bookResult.updatedAt,
      logs: logsResult.results.map((row: Record<string, unknown>) => ({
        id: row.id,
        bookId: row.bookId,
        logType: row.logType,
        content: row.content,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
    };

    return c.json(book);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ message: 'Failed to fetch book' }, 500);
  }
});

// PUT /api/books/:bookId - Update a book
app.put('/', async (c) => {
  const bookId = c.req.param('bookId');

  const uuidResult = uuidSchema.safeParse(bookId);
  if (!uuidResult.success) {
    return c.json({ message: 'Invalid book ID format' }, 400);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ message: 'Invalid JSON body' }, 400);
  }

  const parseResult = updateBookSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(
      { message: 'Validation failed', details: parseResult.error.flatten() },
      400
    );
  }

  const updates = parseResult.data;

  if (Object.keys(updates).length === 0) {
    return c.json({ message: 'No fields to update' }, 400);
  }

  try {
    // Check if book exists
    const existing = await c.env.DB.prepare('SELECT id FROM books WHERE id = ?')
      .bind(bookId)
      .first();

    if (!existing) {
      return c.json({ message: 'Book not found' }, 404);
    }

    // Build update query dynamically
    const setClauses: string[] = [];
    const values: (string | null)[] = [];

    if (updates.title !== undefined) {
      setClauses.push('title = ?');
      values.push(updates.title);
    }
    if (updates.author !== undefined) {
      setClauses.push('author = ?');
      values.push(updates.author ?? null);
    }
    if (updates.publisher !== undefined) {
      setClauses.push('publisher = ?');
      values.push(updates.publisher ?? null);
    }
    if (updates.isbn !== undefined) {
      setClauses.push('isbn = ?');
      values.push(updates.isbn ?? null);
    }
    if (updates.coverUrl !== undefined) {
      setClauses.push('cover_url = ?');
      values.push(updates.coverUrl ?? null);
    }

    const now = new Date().toISOString();
    setClauses.push('updated_at = ?');
    values.push(now);
    values.push(bookId!);

    await c.env.DB.prepare(
      `UPDATE books SET ${setClauses.join(', ')} WHERE id = ?`
    )
      .bind(...values)
      .run();

    // Fetch updated book
    const updatedResult = await c.env.DB.prepare(
      `SELECT
        id,
        title,
        author,
        publisher,
        isbn,
        cover_url as coverUrl,
        ndl_bib_id as ndlBibId,
        is_deleted as isDeleted,
        created_at as createdAt,
        updated_at as updatedAt
       FROM books WHERE id = ?`
    )
      .bind(bookId)
      .first<Record<string, unknown>>();

    const book = {
      id: updatedResult!.id,
      title: updatedResult!.title,
      author: updatedResult!.author,
      publisher: updatedResult!.publisher,
      isbn: updatedResult!.isbn,
      coverUrl: updatedResult!.coverUrl,
      ndlBibId: updatedResult!.ndlBibId,
      isDeleted: Boolean(updatedResult!.isDeleted),
      createdAt: updatedResult!.createdAt,
      updatedAt: updatedResult!.updatedAt,
    };

    return c.json(book);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ message: 'Failed to update book' }, 500);
  }
});

// DELETE /api/books/:bookId - Soft delete a book
app.delete('/', async (c) => {
  const bookId = c.req.param('bookId');

  const uuidResult = uuidSchema.safeParse(bookId);
  if (!uuidResult.success) {
    return c.json({ message: 'Invalid book ID format' }, 400);
  }

  try {
    // Check if book exists
    const existing = await c.env.DB.prepare('SELECT id FROM books WHERE id = ?')
      .bind(bookId)
      .first();

    if (!existing) {
      return c.json({ message: 'Book not found' }, 404);
    }

    const now = new Date().toISOString();

    // Soft delete
    await c.env.DB.prepare(
      'UPDATE books SET is_deleted = 1, updated_at = ? WHERE id = ?'
    )
      .bind(now, bookId)
      .run();

    return c.body(null, 204);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ message: 'Failed to delete book' }, 500);
  }
});

export default app;
