import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { getDb } from '../../lib/db';
import { books, logs } from '../../../db/schema';
import { paginationSchema } from '../../../src/lib/validation';
import { createAuth, type AuthEnv } from '../../lib/auth';

type Env = AuthEnv;

const app = new Hono<{ Bindings: Env }>();

// Helper to get session
async function getSession(c: { env: Env; req: { raw: Request } }) {
  const auth = createAuth(c.env);
  return auth.api.getSession({ headers: c.req.raw.headers });
}

// GET /api/logs - Timeline (user's logs with book info)
app.get('/', async (c) => {
  // Get authenticated user
  const session = await getSession(c);
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const db = getDb(c.env.DB);

  // Parse and validate query parameters
  const query = c.req.query();
  const parsed = paginationSchema.safeParse({
    limit: query.limit,
    offset: query.offset,
  });

  if (!parsed.success) {
    return c.json({ message: 'Invalid query parameters', details: parsed.error.flatten() }, 400);
  }

  const { limit, offset } = parsed.data;

  // Get total count for user's logs
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(logs)
    .where(eq(logs.userId, session.user.id))
    .get();
  const total = countResult?.count ?? 0;

  // Get user's logs with book info, ordered by created_at DESC
  const logsWithBooks = await db
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
    .where(eq(logs.userId, session.user.id))
    .orderBy(desc(logs.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  // Transform isDeleted from number to boolean
  const data = logsWithBooks.map((row) => ({
    id: row.id,
    bookId: row.bookId,
    userId: row.userId,
    logType: row.logType,
    content: row.content,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    book: {
      ...row.book,
      isDeleted: row.book.isDeleted === 1,
    },
  }));

  return c.json({
    data,
    total,
    limit,
    offset,
  });
});

export default app;
