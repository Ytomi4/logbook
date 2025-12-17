import type { D1Database } from '@cloudflare/workers-types';
import * as schema from '../../db/schema';
export declare function getDb(d1: D1Database): import("drizzle-orm/d1").DrizzleD1Database<typeof schema> & {
    $client: D1Database;
};
export type Database = ReturnType<typeof getDb>;
//# sourceMappingURL=db.d.ts.map