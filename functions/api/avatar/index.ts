import { createAuth, type AuthEnv } from '../../lib/auth';
import type { R2Bucket } from '@cloudflare/workers-types';

interface Env extends AuthEnv {
  AVATAR_BUCKET: R2Bucket;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function getExtension(contentType: string): string {
  switch (contentType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

// POST /api/avatar - Upload avatar image
export const onRequest = async (context: PagesContext) => {
  if (context.request.method !== 'POST') {
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

  try {
    const formData = await context.request.formData();
    const fileData = formData.get('file');

    if (!fileData || typeof fileData === 'string') {
      return new Response(
        JSON.stringify({ message: 'ファイルが選択されていません' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // fileData is now guaranteed to be a File (which extends Blob in Workers)
    const file = fileData as File;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          message: '対応していないファイル形式です。JPEG, PNG, GIF, WebPのみ対応しています',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({
          message: 'ファイルサイズが大きすぎます。2MB以下にしてください',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate file name
    const extension = getExtension(file.type);
    const fileName = `${session.user.id}.${extension}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await context.env.AVATAR_BUCKET.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Generate public URL
    // Note: R2 public access needs to be configured in Cloudflare dashboard
    // For now, we'll use a relative path that can be proxied
    const avatarUrl = `/avatars/${fileName}`;

    // Update user's avatar_url in database
    const now = Math.floor(Date.now() / 1000);
    await context.env.DB.prepare('UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?')
      .bind(avatarUrl, now, session.user.id)
      .run();

    return new Response(
      JSON.stringify({
        avatarUrl,
        message: 'アバター画像をアップロードしました',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ message: '画像のアップロードに失敗しました' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
