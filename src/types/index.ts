// Book types
export interface Book {
  id: string;
  userId?: string;
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  coverUrl: string | null;
  ndlBibId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookWithLogCount extends Book {
  logCount: number;
}

export interface BookWithLogs extends Book {
  logs: Log[];
}

export interface CreateBookRequest {
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  coverUrl?: string;
  ndlBibId?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  coverUrl?: string;
}

// Log types
export type LogType = 'note' | 'registration';

// Log content paragraph type
export interface LogParagraph {
  type: 'text' | 'quote';
  content: string;
}

// Parse log content into paragraphs (quotes and text)
export function parseLogContent(content: string): LogParagraph[] {
  if (!content || content.trim() === '') {
    return [];
  }

  const lines = content.split('\n');
  const paragraphs: LogParagraph[] = [];
  let currentParagraph: LogParagraph | null = null;

  for (const line of lines) {
    const isQuote = line.startsWith('> ');
    const lineContent = isQuote ? line.slice(2) : line;
    const lineType: 'text' | 'quote' = isQuote ? 'quote' : 'text';

    if (currentParagraph === null) {
      currentParagraph = { type: lineType, content: lineContent };
    } else if (currentParagraph.type === lineType) {
      currentParagraph.content += '\n' + lineContent;
    } else {
      paragraphs.push(currentParagraph);
      currentParagraph = { type: lineType, content: lineContent };
    }
  }

  if (currentParagraph !== null) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
}

export interface Log {
  id: string;
  bookId: string;
  userId?: string;
  logType: LogType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Type guard for registration log
export function isRegistrationLog(log: Log): boolean {
  return log.logType === 'registration';
}

export interface LogWithBook extends Log {
  book: Book;
}

export interface CreateLogRequest {
  logType: LogType;
  content: string;
}

export interface UpdateLogRequest {
  logType?: LogType;
  content?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export type PaginatedLogs = PaginatedResponse<Log>;
export type TimelineLogs = PaginatedResponse<LogWithBook>;

// NDL types
export interface NdlBook {
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  pubDate: string | null;
  ndlBibId: string;
}

export interface NdlSearchResults {
  totalResults: number;
  items: NdlBook[];
}

// API Error type
export interface ApiError {
  message: string;
  details?: Record<string, unknown>;
}

// User Profile types
export interface UserProfile {
  id: string;
  username: string | null;
  name: string;
  email: string;
  image: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface UpdateProfileRequest {
  username: string;
}

export interface UsernameCheckResponse {
  available: boolean;
  reason?: 'taken' | 'reserved' | 'invalid';
  message?: string;
}
