import { createAuth, type AuthEnv } from '../../lib/auth';

interface PagesContext {
  request: Request;
  env: AuthEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

// 許可されたホスト名のリスト
const ALLOWED_HOSTS = [
  'logbook-hmk.pages.dev',
  'develop.logbook-hmk.pages.dev',
  'localhost:8788',
];

export const onRequest = async (context: PagesContext) => {
  // リクエストからホストを取得し、動的にBETTER_AUTH_URLを設定
  const url = new URL(context.request.url);
  const host = url.host;

  // 許可されたホストか確認
  const isAllowedHost = ALLOWED_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );

  // 動的にBETTER_AUTH_URLを決定（許可されたホストの場合のみ）
  const dynamicBaseURL = isAllowedHost
    ? `${url.protocol}//${host}`
    : context.env.BETTER_AUTH_URL;

  const envWithDynamicURL: AuthEnv = {
    ...context.env,
    BETTER_AUTH_URL: dynamicBaseURL,
  };

  const auth = createAuth(envWithDynamicURL);
  return auth.handler(context.request);
};
