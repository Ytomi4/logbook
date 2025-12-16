# Quickstart: 読書ログアプリケーション

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Cloudflare account (free tier sufficient)

## Setup

### 1. Create Project

```bash
npm create cloudflare@latest booklog -- --framework=react
cd booklog
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install hono drizzle-orm zod

# Development dependencies
npm install -D drizzle-kit @cloudflare/workers-types vitest
```

### 3. Configure Cloudflare D1

```bash
# Create D1 database
npx wrangler d1 create booklog-db

# Add binding to wrangler.jsonc (created by init)
```

Update `wrangler.jsonc`:
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "booklog-db",
      "database_id": "<your-database-id>"
    }
  ]
}
```

### 4. Initialize Database Schema

Create `db/schema.ts`:
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  publisher: text('publisher'),
  isbn: text('isbn'),
  coverUrl: text('cover_url'),
  ndlBibId: text('ndl_bib_id'),
  isDeleted: integer('is_deleted').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id),
  logType: text('log_type', { enum: ['memo', 'quote'] }).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
});
```

Generate and apply migrations:
```bash
npx drizzle-kit generate
npx wrangler d1 migrations apply booklog-db --local
```

## Development

### Start Development Server

```bash
npm run dev
```

This starts:
- Vite dev server with HMR
- Local Workers runtime
- Local D1 database

### Run Tests

```bash
npm run test
```

## Project Structure

```
booklog/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API clients
│   ├── types/          # TypeScript types
│   └── App.tsx         # Root component
├── functions/
│   └── api/            # Cloudflare Workers API
├── db/
│   ├── schema.ts       # Drizzle schema
│   └── migrations/     # D1 migrations
├── public/             # Static assets
└── tests/              # Test files
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/books | List all books |
| POST | /api/books | Create a book |
| GET | /api/books/:id | Get a book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| GET | /api/books/:id/logs | List logs for a book |
| POST | /api/books/:id/logs | Create a log |
| GET | /api/logs | Timeline (all logs) |
| GET | /api/logs/:id | Get a log |
| PUT | /api/logs/:id | Update a log |
| DELETE | /api/logs/:id | Delete a log |
| GET | /api/ndl/search | Search NDL |

## Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy

# Or via git push (auto-deploy)
git push origin main
```

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Timeline page loads at `http://localhost:5173`
- [ ] Can create a new book
- [ ] Can add a log (memo/quote) to a book
- [ ] Timeline displays logs in reverse chronological order
- [ ] NDL search returns results
- [ ] `npm run test` passes
- [ ] `npm run deploy` succeeds
