CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`publisher` text,
	`isbn` text,
	`cover_url` text,
	`ndl_bib_id` text,
	`is_deleted` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_books_created_at` ON `books` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_books_is_deleted` ON `books` (`is_deleted`);--> statement-breakpoint
CREATE TABLE `logs` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`log_type` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_logs_book_id` ON `logs` (`book_id`);--> statement-breakpoint
CREATE INDEX `idx_logs_created_at` ON `logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_logs_book_created` ON `logs` (`book_id`,`created_at`);