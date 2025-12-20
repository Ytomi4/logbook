import type { D1Database } from '@cloudflare/workers-types';
export interface AuthEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
}
export declare function createAuth(env: AuthEnv): any;
export type Auth = ReturnType<typeof createAuth>;
//# sourceMappingURL=auth.d.ts.map