import { createAuth, type AuthEnv } from '../../lib/auth';
import { updateProfileSchema } from '../../../src/lib/validation';
import { isReservedUsername } from '../../../src/lib/reserved-usernames';

interface PagesContext {
  request: Request;
  env: AuthEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

// GET /api/profile - Get current user profile
async function handleGet(context: PagesContext): Promise<Response> {
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

  try {
    const result = await context.env.DB.prepare(
      `SELECT id, name, email, email_verified as emailVerified, image, username, avatar_url as avatarUrl, created_at as createdAt
       FROM users WHERE id = ?`
    )
      .bind(session.user.id)
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
        name: result.name,
        email: result.email,
        image: result.image,
        avatarUrl: result.avatarUrl,
        createdAt:
          typeof result.createdAt === 'number'
            ? new Date(result.createdAt * 1000).toISOString()
            : result.createdAt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT /api/profile - Update user profile (username)
async function handlePut(context: PagesContext): Promise<Response> {
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

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parseResult = updateProfileSchema.safeParse(body);

  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        message: 'Validation failed',
        details: parseResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { username } = parseResult.data;

  // Check if username is reserved
  if (isReservedUsername(username)) {
    return new Response(
      JSON.stringify({
        message: 'このユーザー名は使用できません',
        reason: 'reserved',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Check if username is already taken by another user
    const existingUser = await context.env.DB.prepare(
      'SELECT id FROM users WHERE username = ? AND id != ?'
    )
      .bind(username, session.user.id)
      .first();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: 'このユーザー名は既に使用されています',
          reason: 'taken',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update username
    const now = Math.floor(Date.now() / 1000);
    await context.env.DB.prepare('UPDATE users SET username = ?, updated_at = ? WHERE id = ?')
      .bind(username, now, session.user.id)
      .run();

    // Fetch updated profile
    const result = await context.env.DB.prepare(
      `SELECT id, name, email, email_verified as emailVerified, image, username, avatar_url as avatarUrl, created_at as createdAt
       FROM users WHERE id = ?`
    )
      .bind(session.user.id)
      .first();

    return new Response(
      JSON.stringify({
        id: result?.id,
        username: result?.username,
        name: result?.name,
        email: result?.email,
        image: result?.image,
        avatarUrl: result?.avatarUrl,
        createdAt:
          typeof result?.createdAt === 'number'
            ? new Date((result.createdAt as number) * 1000).toISOString()
            : result?.createdAt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return new Response(
        JSON.stringify({
          message: 'このユーザー名は既に使用されています',
          reason: 'taken',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    return new Response(JSON.stringify({ message: 'Failed to update profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const onRequest = async (context: PagesContext) => {
  const method = context.request.method;

  if (method === 'GET') {
    return handleGet(context);
  } else if (method === 'PUT') {
    return handlePut(context);
  } else {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
