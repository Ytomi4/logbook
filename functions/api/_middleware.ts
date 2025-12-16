import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { D1Database } from '@cloudflare/workers-types';

// Environment bindings type
export interface Env {
  DB: D1Database;
}

// Create Hono app with environment type
export const app = new Hono<{ Bindings: Env }>();

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

// Error handling middleware
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json(
    {
      message: err.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined,
    },
    500
  );
});

// Not found handler
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404);
});

export default app;
