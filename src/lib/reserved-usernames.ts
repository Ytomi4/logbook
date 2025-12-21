export const RESERVED_USERNAMES = [
  // Routes
  'enter',
  'setup',
  'settings',
  'login',
  'logout',
  'auth',
  'books',
  'logs',
  'api',
  'admin',
  'help',
  'about',
  // Common
  'user',
  'users',
  'profile',
  'account',
  'home',
  'index',
  'new',
  'edit',
  'delete',
  'create',
  'update',
  // System
  'static',
  'assets',
  'public',
  'private',
  'internal',
  'null',
  'undefined',
  'true',
  'false',
] as const;

export type ReservedUsername = (typeof RESERVED_USERNAMES)[number];

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.includes(
    username.toLowerCase() as ReservedUsername
  );
}
