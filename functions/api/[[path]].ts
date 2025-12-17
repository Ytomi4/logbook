import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { D1Database } from '@cloudflare/workers-types';
import logsApp from './logs/index';
import logDetailApp from './logs/[logId]';
import booksApp from './books/index';
import bookDetailApp from './books/[bookId]/index';
import bookLogsApp from './books/[bookId]/logs';
import ndlSearchApp from './ndl/search';

interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

// Apply middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
  })
);

// Mount route handlers
app.route('/logs', logsApp);
app.route('/logs/:logId', logDetailApp);
app.route('/books', booksApp);
app.route('/books/:bookId', bookDetailApp);
app.route('/books/:bookId/logs', bookLogsApp);
app.route('/ndl/search', ndlSearchApp);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// Error handling
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json(
    {
      message: err.message || 'Internal Server Error',
    },
    500
  );
});

// Not found handler
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404);
});

// Export for Cloudflare Pages Functions
interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

export const onRequest = (context: PagesContext) => {
  // Rewrite URL to remove /api prefix since Hono routes are relative
  const url = new URL(context.request.url);
  url.pathname = url.pathname.replace(/^\/api/, '') || '/';
  const request = new Request(url.toString(), context.request);

  return app.fetch(request, context.env);
};
