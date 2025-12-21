import { Hono } from 'hono';
import { createBookSchema, listBooksQuerySchema } from '../../../src/lib/validation';
import { createAuth, type AuthEnv } from '../../lib/auth';
import { getDb } from '../../lib/db';
import { createRegistrationLog } from '../../lib/registrationLog';

type Env = AuthEnv;

const app = new Hono<{ Bindings: Env }>();

// Helper to get session
async function getSession(c: { env: Env; req: { raw: Request } }) {
  const auth = createAuth(c.env);
  return auth.api.getSession({ headers: c.req.raw.headers });
}

// GET /api/books - List books for authenticated user
app.get('/', async (c) => {
  // Get authenticated user
  const session = await getSession(c);
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

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
        b.user_id as userId,
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
      WHERE b.user_id = ?
    `;

    if (!include_deleted) {
      sql += ' AND b.is_deleted = 0';
    }

    sql += ' GROUP BY b.id ORDER BY b.updated_at DESC';

    const result = await c.env.DB.prepare(sql).bind(session.user.id).all();

    const books = result.results.map((row: Record<string, unknown>) => ({
      id: row.id,
      userId: row.userId,
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
  // Get authenticated user
  const session = await getSession(c);
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

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
  const userId = session.user.id;

  try {
    // Create book with user_id
    await c.env.DB.prepare(
      `INSERT INTO books (id, user_id, title, author, publisher, isbn, cover_url, ndl_bib_id, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    )
      .bind(id, userId, title, author || null, publisher || null, isbn || null, coverUrl || null, ndlBibId || null, now, now)
      .run();

    // Create registration log (non-blocking, log errors only)
    try {
      const db = getDb(c.env.DB);
      await createRegistrationLog(db, id, userId, now);
    } catch (logError) {
      console.error('Failed to create registration log:', logError);
      // Don't fail book creation if registration log fails
    }

    const book = {
      id,
      userId,
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
