import type { D1Database } from '@cloudflare/workers-types';
interface Env {
    DB: D1Database;
}
interface PagesContext {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil: (promise: Promise<unknown>) => void;
    passThroughOnException: () => void;
    next: () => Promise<Response>;
}
export declare const onRequest: (context: PagesContext) => any;
export {};
//# sourceMappingURL=%5B%5Bpath%5D%5D.d.ts.map