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

    // TODO: Currently logs are not associated with users.
    // When multi-user support is added (user_id in books/logs table),
    // this should filter logs by the user's books.
    // For now, return empty logs array for public timeline.

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
        data: [],
        total: 0,
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
