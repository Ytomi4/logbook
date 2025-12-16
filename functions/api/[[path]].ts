import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { D1Database } from '@cloudflare/workers-types';
import logsApp from './logs/index';

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

export default app;
