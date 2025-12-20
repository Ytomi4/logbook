import type { Book, BookWithLogCount, Log, LogWithBook, NdlBook } from '../../types';

// Single book mock
export const mockBook: Book = {
  id: 'book-1',
  title: 'Sample Book Title',
  author: 'Author Name',
  publisher: 'Publisher Inc.',
  isbn: '978-4-00-000000-0',
  coverUrl: null,
  ndlBibId: 'ndl-123456',
  isDeleted: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Book with cover
export const mockBookWithCover: Book = {
  ...mockBook,
  id: 'book-2',
  title: 'Book with Cover Image',
  coverUrl: 'https://placehold.co/128x180?text=Book',
};

// Multiple books
export const mockBooks: Book[] = [
  mockBook,
  mockBookWithCover,
  {
    id: 'book-3',
    title: 'Another Book',
    author: 'Different Author',
    publisher: null,
    isbn: null,
    coverUrl: null,
    ndlBibId: null,
    isDeleted: false,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

// Books with log count
export const mockBooksWithLogCount: BookWithLogCount[] = mockBooks.map((book, index) => ({
  ...book,
  logCount: index * 3 + 1,
}));

// Single log (memo type)
export const mockMemoLog: Log = {
  id: 'log-1',
  bookId: 'book-1',
  logType: 'memo',
  content: 'This is a sample memo about the book. It contains my thoughts and notes.',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

// Single log (quote type)
export const mockQuoteLog: Log = {
  id: 'log-2',
  bookId: 'book-1',
  logType: 'quote',
  content: 'The only way to do great work is to love what you do.',
  createdAt: '2024-01-16T14:20:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
};

// Multiple logs
export const mockLogs: Log[] = [
  mockMemoLog,
  mockQuoteLog,
  {
    id: 'log-3',
    bookId: 'book-1',
    logType: 'memo',
    content: 'Another memo entry with different content.',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
];

// Log with book
export const mockLogWithBook: LogWithBook = {
  ...mockMemoLog,
  book: mockBook,
};

// Quote log with book
export const mockQuoteLogWithBook: LogWithBook = {
  ...mockQuoteLog,
  book: mockBook,
};

// Multiple logs with books
export const mockLogsWithBooks: LogWithBook[] = [
  mockLogWithBook,
  mockQuoteLogWithBook,
  {
    id: 'log-3',
    bookId: 'book-2',
    logType: 'memo',
    content: 'A memo for a different book.',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    book: mockBookWithCover,
  },
];

// NDL search results
export const mockNdlBooks: NdlBook[] = [
  {
    title: 'Search Result Book 1',
    author: 'Search Author 1',
    publisher: 'Search Publisher',
    isbn: '978-4-11-111111-1',
    pubDate: '2023',
    ndlBibId: 'ndl-search-1',
  },
  {
    title: 'Search Result Book 2',
    author: 'Search Author 2',
    publisher: null,
    isbn: null,
    pubDate: '2022',
    ndlBibId: 'ndl-search-2',
  },
];

// Empty arrays for empty state testing
export const emptyBooks: Book[] = [];
export const emptyLogs: Log[] = [];
export const emptyLogsWithBooks: LogWithBook[] = [];
