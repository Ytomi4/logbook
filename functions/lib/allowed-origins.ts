/**
 * 認証で許可されるオリジンの一覧
 * セキュリティ上、明示的に許可されたホストのみを受け入れる
 */

// 許可されたホスト（完全一致のみ、サブドメインワイルドカードは使用しない）
export const ALLOWED_HOSTS = [
  'logbook-hmk.pages.dev',
  'develop.logbook-hmk.pages.dev',
  'localhost:8788',
] as const;

// 許可されたオリジン（trustedOrigins用）
export const ALLOWED_ORIGINS = [
  'https://logbook-hmk.pages.dev',
  'https://develop.logbook-hmk.pages.dev',
  'http://localhost:8788',
] as const;

/**
 * ホストが許可リストに含まれているかチェック
 * セキュリティ: 完全一致のみ、サブドメインワイルドカードは使用しない
 */
export function isAllowedHost(host: string): boolean {
  return ALLOWED_HOSTS.includes(host as (typeof ALLOWED_HOSTS)[number]);
}
