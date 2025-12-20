import type { D1Database } from '@cloudflare/workers-types';
export interface AuthEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
}
export declare function createAuth(env: AuthEnv): import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    secret: string;
    baseURL: string;
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
        };
    };
    session: {
        expiresIn: number;
        updateAge: number;
    };
    trustedOrigins: string[];
}>;
export type Auth = ReturnType<typeof createAuth>;
//# sourceMappingURL=auth.d.ts.map