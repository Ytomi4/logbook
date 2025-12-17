import { Hono } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
export interface Env {
    DB: D1Database;
}
export declare const app: Hono<{
    Bindings: Env;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=_middleware.d.ts.map