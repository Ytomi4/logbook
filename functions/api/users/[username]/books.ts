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

// GET /api/users/:username/books - Get public user's book list
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

    // Get total count of user's books (excluding deleted)
    const countResult = await context.env.DB.prepare(
      `SELECT COUNT(*) as count FROM books WHERE user_id = ? AND is_deleted = 0`
    )
      .bind(userId)
      .first();
    const total = (countResult?.count as number) ?? 0;

    // Get user's books, ordered by created_at DESC
    const booksResult = await context.env.DB.prepare(
      `SELECT
        id,
        user_id as userId,
        title,
        author,
        publisher,
        isbn,
        cover_url as coverUrl,
        ndl_bib_id as ndlBibId,
        is_deleted as isDeleted,
        created_at as createdAt,
        updated_at as updatedAt
      FROM books
      WHERE user_id = ? AND is_deleted = 0
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`
    )
      .bind(userId, limit, offset)
      .all();

    // Transform results to Book format
    const data = booksResult.results.map((row: Record<string, unknown>) => ({
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
    return new Response(JSON.stringify({ message: 'Failed to fetch books' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
