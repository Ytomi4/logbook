-- Add username and avatar_url columns to users table for user profile setup
ALTER TABLE users ADD COLUMN username TEXT;--> statement-breakpoint
ALTER TABLE users ADD COLUMN avatar_url TEXT;--> statement-breakpoint
CREATE UNIQUE INDEX idx_users_username ON users(username);
