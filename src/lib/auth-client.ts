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

export const authClient = createAuthClient({
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
