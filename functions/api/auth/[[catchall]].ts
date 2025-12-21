import { createAuth, type AuthEnv } from '../../lib/auth';
import { isAllowedHost } from '../../lib/allowed-origins';

interface PagesContext {
  request: Request;
  env: AuthEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

export const onRequest = async (context: PagesContext) => {
  const url = new URL(context.request.url);
  const host = url.host;

  // 許可されたホストか確認（完全一致のみ、セキュリティのため）
  if (!isAllowedHost(host)) {
    console.error(`Auth request from disallowed host: ${host}`);
    return new Response('Forbidden: Host not allowed', { status: 403 });
  }

  // 動的にBETTER_AUTH_URLを決定
  const dynamicBaseURL = `${url.protocol}//${host}`;

  const envWithDynamicURL: AuthEnv = {
    ...context.env,
    BETTER_AUTH_URL: dynamicBaseURL,
  };

  const auth = createAuth(envWithDynamicURL);
  return auth.handler(context.request);
};
