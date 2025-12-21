import { apiClient } from './api';
import type { PublicUser, LogWithBook, Book } from '../types';

export async function getPublicUser(username: string): Promise<PublicUser> {
  return apiClient.get<PublicUser>(`/users/${username}`);
}

interface PublicTimelineResponse {
  user: PublicUser;
  data: LogWithBook[];
  total: number;
  limit: number;
  offset: number;
}

interface PublicBooksResponse {
  user: PublicUser;
  data: Book[];
  total: number;
  limit: number;
  offset: number;
}

interface PaginationParams {
  limit?: number;
  offset?: number;
}

export async function getPublicTimeline(
  username: string,
  params: PaginationParams = {}
): Promise<PublicTimelineResponse> {
  return apiClient.get<PublicTimelineResponse>(`/users/${username}/timeline`, params as Record<string, number | undefined>);
}

export async function getPublicBooks(
  username: string,
  params: PaginationParams = {}
): Promise<PublicBooksResponse> {
  return apiClient.get<PublicBooksResponse>(`/users/${username}/books`, params as Record<string, number | undefined>);
}
