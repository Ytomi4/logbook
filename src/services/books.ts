import { apiClient } from './api';
import type {
  Book,
  BookWithLogCount,
  BookWithLogs,
  CreateBookRequest,
  UpdateBookRequest,
} from '../types';

interface ListBooksParams {
  includeDeleted?: boolean;
}

export async function getBooks(params: ListBooksParams = {}): Promise<BookWithLogCount[]> {
  const searchParams = new URLSearchParams();
  if (params.includeDeleted) {
    searchParams.append('include_deleted', 'true');
  }

  const query = searchParams.toString();
  const url = query ? `/books?${query}` : '/books';

  return apiClient.get<BookWithLogCount[]>(url);
}

export async function getBook(bookId: string): Promise<BookWithLogs> {
  return apiClient.get<BookWithLogs>(`/books/${bookId}`);
}

export async function createBook(data: CreateBookRequest): Promise<Book> {
  return apiClient.post<Book>('/books', data);
}

export async function updateBook(bookId: string, data: UpdateBookRequest): Promise<Book> {
  return apiClient.put<Book>(`/books/${bookId}`, data);
}

export async function deleteBook(bookId: string): Promise<void> {
  return apiClient.delete(`/books/${bookId}`);
}
