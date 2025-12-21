import { createAuthClient } from 'better-auth/react';
import { customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins';

function getBaseURL(): string {
  // Use type assertion for browser environment check
  // This works in both DOM and Worker contexts
  const g = globalThis as typeof globalThis & {
    location?: { origin: string };
  };
  if (g.location?.origin) {
    return `${g.location.origin}/api/auth`;
  }
  return '/api/auth';
}

// Lazily initialize the auth client to avoid accessing browser-specific globals
// (e.g., location) at module import time. This helps with SSR and build-time imports.
function createConfiguredAuthClient() {
  return createAuthClient({
    baseURL: getBaseURL(),
    plugins: [
      customSessionClient(),
      inferAdditionalFields({
        user: {
          username: { type: 'string' },
          avatarUrl: { type: 'string' },
        },
      }),
    ],
  });
}

type AuthClientInstance = ReturnType<typeof createConfiguredAuthClient>;

let authClientInstance: AuthClientInstance | null = null;

function getAuthClientInstance(): AuthClientInstance {
  if (!authClientInstance) {
    authClientInstance = createConfiguredAuthClient();
  }
  return authClientInstance;
}

export const authClient: AuthClientInstance = new Proxy({} as AuthClientInstance, {
  get(_target, prop) {
    const client = getAuthClientInstance();
    // Note: Do NOT use bind() here. better-auth's client uses internal Proxy
    // that manages its own 'this' context. Using bind() breaks the internal
    // Proxy by changing the context, causing property accesses like
    // 'fetchOptions.method.toUpperCase' to be misinterpreted as API paths.
    return (client as Record<string, unknown>)[prop as string];
  },
});
