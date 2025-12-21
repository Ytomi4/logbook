import type { Database } from './db';
import { logs } from '../../db/schema';
import { generateId } from './utils';

/**
 * Create a registration log when a book is registered.
 * The registration log has log_type: 'registration' and content: '📖'.
 * Uses the book's created_at timestamp for the log.
 */
export async function createRegistrationLog(
  db: Database,
  bookId: string,
  userId: string,
  bookCreatedAt: string
): Promise<void> {
  const registrationLog = {
    id: generateId(),
    bookId,
    userId,
    logType: 'registration' as const,
    content: '📖',
    createdAt: bookCreatedAt,
    updatedAt: bookCreatedAt,
  };

  await db.insert(logs).values(registrationLog).run();
}
