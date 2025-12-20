import { type AuthEnv } from '../../lib/auth';
interface PagesContext {
    request: Request;
    env: AuthEnv;
    params: Record<string, string>;
    waitUntil: (promise: Promise<unknown>) => void;
    passThroughOnException: () => void;
    next: () => Promise<Response>;
}
export declare const onRequest: (context: PagesContext) => Promise<any>;
export {};
//# sourceMappingURL=%5B%5Bcatchall%5D%5D.d.ts.map