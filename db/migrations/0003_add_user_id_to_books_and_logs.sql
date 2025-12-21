-- Add user_id columns to books and logs tables for user-specific data
ALTER TABLE books ADD COLUMN user_id TEXT REFERENCES users(id);--> statement-breakpoint
ALTER TABLE logs ADD COLUMN user_id TEXT REFERENCES users(id);--> statement-breakpoint
CREATE INDEX idx_books_user_id ON books(user_id);--> statement-breakpoint
CREATE INDEX idx_logs_user_id ON logs(user_id);
