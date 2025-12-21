import { createAuth, type AuthEnv } from '../../lib/auth';
import { usernameSchema } from '../../../src/lib/validation';
import { isReservedUsername } from '../../../src/lib/reserved-usernames';

interface PagesContext {
  request: Request;
  env: AuthEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

// GET /api/username/check?username=xxx - Check username availability
export const onRequest = async (context: PagesContext) => {
  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = createAuth(context.env);

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(context.request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response(
      JSON.stringify({
        available: false,
        reason: 'invalid',
        message: 'Username is required',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Validate username format
  const parseResult = usernameSchema.safeParse(username);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        available: false,
        reason: 'invalid',
        message: parseResult.error.issues[0]?.message || 'Invalid username format',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Check if username is reserved
  if (isReservedUsername(username)) {
    return new Response(
      JSON.stringify({
        available: false,
        reason: 'reserved',
        message: 'このユーザー名は使用できません',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Check if username is already taken (excluding current user)
    const existingUser = await context.env.DB.prepare(
      'SELECT id FROM users WHERE username = ? AND id != ?'
    )
      .bind(username, session.user.id)
      .first();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          available: false,
          reason: 'taken',
          message: 'このユーザー名は既に使用されています',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        available: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({
        available: false,
        reason: 'invalid',
        message: 'Failed to check username',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
