import { createAuth, type AuthEnv } from '../../lib/auth';

interface PagesContext {
  request: Request;
  env: AuthEnv;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

export const onRequest = async (context: PagesContext) => {
  const auth = createAuth(context.env);
  return auth.handler(context.request);
};
