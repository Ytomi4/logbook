import { apiClient } from './api';
import type { PublicUser, LogWithBook } from '../types';

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

interface PublicTimelineParams {
  limit?: number;
  offset?: number;
}

export async function getPublicTimeline(
  username: string,
  params: PublicTimelineParams = {}
): Promise<PublicTimelineResponse> {
  return apiClient.get<PublicTimelineResponse>(`/users/${username}/timeline`, params as Record<string, number | undefined>);
}
