import type { D1Database } from '@cloudflare/workers-types';
import { paginationSchema } from '../../../../src/lib/validation';

interface Env {
  DB: D1Database;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

// GET /api/users/:username/timeline - Get public user timeline
export const onRequest = async (context: PagesContext) => {
  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const username = context.params.username;

  if (!username) {
    return new Response(JSON.stringify({ message: 'Username is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse and validate query parameters
  const url = new URL(context.request.url);
  const parsed = paginationSchema.safeParse({
    limit: url.searchParams.get('limit'),
    offset: url.searchParams.get('offset'),
  });

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ message: 'Invalid query parameters', details: parsed.error.flatten() }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { limit, offset } = parsed.data;

  try {
    // Get user info
    const user = await context.env.DB.prepare(
      `SELECT id, username, avatar_url as avatarUrl
       FROM users WHERE username = ?`
    )
      .bind(username)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id as string;

    // Get total count of user's logs
    const countResult = await context.env.DB.prepare(
      `SELECT COUNT(*) as count FROM logs WHERE user_id = ?`
    )
      .bind(userId)
      .first();
    const total = (countResult?.count as number) ?? 0;

    // Get user's logs with book info, ordered by created_at DESC
    const logsResult = await context.env.DB.prepare(
      `SELECT
        l.id,
        l.book_id as bookId,
        l.user_id as userId,
        l.log_type as logType,
        l.content,
        l.created_at as createdAt,
        l.updated_at as updatedAt,
        b.id as bookId,
        b.user_id as bookUserId,
        b.title as bookTitle,
        b.author as bookAuthor,
        b.publisher as bookPublisher,
        b.isbn as bookIsbn,
        b.cover_url as bookCoverUrl,
        b.ndl_bib_id as bookNdlBibId,
        b.is_deleted as bookIsDeleted,
        b.created_at as bookCreatedAt,
        b.updated_at as bookUpdatedAt
      FROM logs l
      INNER JOIN books b ON l.book_id = b.id
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?`
    )
      .bind(userId, limit, offset)
      .all();

    // Transform results to LogWithBook format
    const data = logsResult.results.map((row: Record<string, unknown>) => ({
      id: row.id,
      bookId: row.bookId,
      userId: row.userId,
      logType: row.logType,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      book: {
        id: row.bookId,
        userId: row.bookUserId,
        title: row.bookTitle,
        author: row.bookAuthor,
        publisher: row.bookPublisher,
        isbn: row.bookIsbn,
        coverUrl: row.bookCoverUrl,
        ndlBibId: row.bookNdlBibId,
        isDeleted: Boolean(row.bookIsDeleted),
        createdAt: row.bookCreatedAt,
        updatedAt: row.bookUpdatedAt,
      },
    }));

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
        data,
        total,
        limit,
        offset,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch timeline' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
