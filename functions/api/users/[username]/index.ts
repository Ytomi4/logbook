import type { D1Database } from '@cloudflare/workers-types';

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

// GET /api/users/:username - Get public user info
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

  try {
    const result = await context.env.DB.prepare(
      `SELECT id, username, avatar_url as avatarUrl
       FROM users WHERE username = ?`
    )
      .bind(username)
      .first();

    if (!result) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        id: result.id,
        username: result.username,
        avatarUrl: result.avatarUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
