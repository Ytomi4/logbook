import { createAuthClient } from 'better-auth/react';

type AuthClient = ReturnType<typeof createAuthClient>;

let _authClient: AuthClient | null = null;

function getBaseURL(): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof globalThis !== 'undefined' && 'location' in globalThis) {
    const loc = globalThis as typeof globalThis & {
      location: { origin: string };
    };
    return `${loc.location.origin}/api/auth`;
  }
  return '/api/auth';
}

function getAuthClient(): AuthClient {
  if (!_authClient) {
    _authClient = createAuthClient({
      baseURL: getBaseURL(),
    });
  }
  return _authClient;
}

// Proxy object that lazily initializes the auth client
export const authClient: AuthClient = new Proxy({} as AuthClient, {
  get(_target, prop: keyof AuthClient) {
    return getAuthClient()[prop];
  },
});
