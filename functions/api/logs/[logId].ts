import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { getDb } from '../../lib/db';
import { logs, books } from '../../../db/schema';
import { updateLogSchema } from '../../../src/lib/validation';
import { now } from '../../lib/utils';
import { createAuth, type AuthEnv } from '../../lib/auth';

type Env = AuthEnv;

const app = new Hono<{ Bindings: Env }>();

// Helper to get session
async function getSession(c: { env: Env; req: { raw: Request } }) {
  const auth = createAuth(c.env);
  return auth.api.getSession({ headers: c.req.raw.headers });
}

// GET /api/logs/:logId - Get a single log with book info
app.get('/', async (c) => {
  const logId = c.req.param('logId');
  const db = getDb(c.env.DB);

  // Validate logId format
  if (!logId || !/^[0-9a-f-]{36}$/i.test(logId)) {
    return c.json({ message: 'Invalid log ID format' }, 400);
  }

  const result = await db
    .select({
      id: logs.id,
      bookId: logs.bookId,
      userId: logs.userId,
      logType: logs.logType,
      content: logs.content,
      createdAt: logs.createdAt,
      updatedAt: logs.updatedAt,
      book: {
        id: books.id,
        userId: books.userId,
        title: books.title,
        author: books.author,
        publisher: books.publisher,
        isbn: books.isbn,
        coverUrl: books.coverUrl,
        ndlBibId: books.ndlBibId,
        isDeleted: books.isDeleted,
        createdAt: books.createdAt,
        updatedAt: books.updatedAt,
      },
    })
    .from(logs)
    .innerJoin(books, eq(logs.bookId, books.id))
    .where(eq(logs.id, logId))
    .get();

  if (!result) {
    return c.json({ message: 'Log not found' }, 404);
  }

  return c.json({
    id: result.id,
    bookId: result.bookId,
    userId: result.userId,
    logType: result.logType,
    content: result.content,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    book: {
      ...result.book,
      isDeleted: result.book.isDeleted === 1,
    },
  });
});

// PUT /api/logs/:logId - Update a log
app.put('/', async (c) => {
  // Get authenticated user
  const session = await getSession(c);
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const logId = c.req.param('logId');
  const db = getDb(c.env.DB);

  // Validate logId format
  if (!logId || !/^[0-9a-f-]{36}$/i.test(logId)) {
    return c.json({ message: 'Invalid log ID format' }, 400);
  }

  // Check if log exists
  const existingLog = await db
    .select()
    .from(logs)
    .where(eq(logs.id, logId))
    .get();

  if (!existingLog) {
    return c.json({ message: 'Log not found' }, 404);
  }

  // Check ownership - return 403 if not owner
  if (existingLog.userId !== session.user.id) {
    return c.json({ message: 'Forbidden' }, 403);
  }

  // Parse and validate request body
  const body = await c.req.json();
  const parsed = updateLogSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: 'Validation failed', details: parsed.error.flatten() }, 400);
  }

  const updates = parsed.data;

  // Check if there's anything to update
  if (Object.keys(updates).length === 0) {
    return c.json({ message: 'No fields to update' }, 400);
  }

  const timestamp = now();

  // Update log
  await db
    .update(logs)
    .set({
      ...updates,
      updatedAt: timestamp,
    })
    .where(eq(logs.id, logId))
    .run();

  // Fetch updated log
  const updatedLog = await db
    .select()
    .from(logs)
    .where(eq(logs.id, logId))
    .get();

  return c.json(updatedLog);
});

// DELETE /api/logs/:logId - Delete a log
app.delete('/', async (c) => {
  // Get authenticated user
  const session = await getSession(c);
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const logId = c.req.param('logId');
  const db = getDb(c.env.DB);

  // Validate logId format
  if (!logId || !/^[0-9a-f-]{36}$/i.test(logId)) {
    return c.json({ message: 'Invalid log ID format' }, 400);
  }

  // Check if log exists
  const existingLog = await db
    .select()
    .from(logs)
    .where(eq(logs.id, logId))
    .get();

  if (!existingLog) {
    return c.json({ message: 'Log not found' }, 404);
  }

  // Check ownership - return 403 if not owner
  if (existingLog.userId !== session.user.id) {
    return c.json({ message: 'Forbidden' }, 403);
  }

  // Delete log (hard delete)
  await db.delete(logs).where(eq(logs.id, logId)).run();

  return c.body(null, 204);
});

export default app;
