import type { R2Bucket } from '@cloudflare/workers-types';

interface Env {
  AVATAR_BUCKET: R2Bucket;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    path: string[];
  };
}

// GET /avatars/:filename - Serve avatar image from R2
export const onRequest = async (context: PagesContext) => {
  if (context.request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const filename = context.params.path?.join('/');

  if (!filename) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const object = await context.env.AVATAR_BUCKET.get(filename);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
