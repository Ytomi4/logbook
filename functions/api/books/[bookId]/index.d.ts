import { Hono } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
interface Env {
    DB: D1Database;
}
declare const app: Hono<{
    Bindings: Env;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map