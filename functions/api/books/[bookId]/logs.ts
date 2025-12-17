import { Hono } from 'hono';
import { eq, desc, sql, and } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
import { getDb } from '../../../lib/db';
import { books, logs } from '../../../../db/schema';
import { createLogSchema, paginationSchema } from '../../../../src/lib/validation';
import { generateId, now } from '../../../lib/utils';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// GET /api/books/:bookId/logs - List logs for a book
app.get('/', async (c) => {
  const bookId = c.req.param('bookId');
  const db = getDb(c.env.DB);

  // Validate bookId format
  if (!bookId || !/^[0-9a-f-]{36}$/i.test(bookId)) {
    return c.json({ message: 'Invalid book ID format' }, 400);
  }

  // Check if book exists
  const book = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId))
    .get();

  if (!book) {
    return c.json({ message: 'Book not found' }, 404);
  }

  // Parse pagination
  const query = c.req.query();
  const parsed = paginationSchema.safeParse({
    limit: query.limit,
    offset: query.offset,
  });

  if (!parsed.success) {
    return c.json({ message: 'Invalid query parameters', details: parsed.error.flatten() }, 400);
  }

  const { limit, offset } = parsed.data;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(logs)
    .where(eq(logs.bookId, bookId))
    .get();
  const total = countResult?.count ?? 0;

  // Get logs
  const bookLogs = await db
    .select()
    .from(logs)
    .where(eq(logs.bookId, bookId))
    .orderBy(desc(logs.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return c.json({
    data: bookLogs,
    total,
    limit,
    offset,
  });
});

// POST /api/books/:bookId/logs - Create a new log
app.post('/', async (c) => {
  const bookId = c.req.param('bookId');
  const db = getDb(c.env.DB);

  // Validate bookId format
  if (!bookId || !/^[0-9a-f-]{36}$/i.test(bookId)) {
    return c.json({ message: 'Invalid book ID format' }, 400);
  }

  // Check if book exists and is not deleted
  const book = await db
    .select()
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.isDeleted, 0)))
    .get();

  if (!book) {
    return c.json({ message: 'Book not found or has been deleted' }, 404);
  }

  // Parse and validate request body
  const body = await c.req.json();
  const parsed = createLogSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  const { logType, content } = parsed.data;
  const timestamp = now();

  // Create log
  const newLog = {
    id: generateId(),
    bookId,
    logType,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.insert(logs).values(newLog).run();

  return c.json(newLog, 201);
});

export default app;
