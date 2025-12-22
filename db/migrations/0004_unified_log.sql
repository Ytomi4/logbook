-- Migration: Unified Log
-- Consolidates memo/quote log types into single 'note' type with Markdown formatting

-- Step 1: Migrate 'memo' logs to 'note' (content stays the same)
UPDATE logs
SET log_type = 'note'
WHERE log_type = 'memo';

-- Step 2: Migrate 'quote' logs to 'note' with '> ' prefix on each line
-- SQLite doesn't have a built-in way to add prefix to each line,
-- so we use replace to handle both single-line and multi-line content
UPDATE logs
SET
  log_type = 'note',
  content = '> ' || REPLACE(content, CHAR(10), CHAR(10) || '> ')
WHERE log_type = 'quote';
