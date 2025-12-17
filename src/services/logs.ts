import { get, post, put, del } from './api';
import type {
  TimelineLogs,
  Log,
  LogWithBook,
  CreateLogRequest,
  UpdateLogRequest,
  PaginatedLogs,
} from '../types';

export interface GetTimelineParams {
  limit?: number;
  offset?: number;
}

export async function getTimeline(
  params: GetTimelineParams = {}
): Promise<TimelineLogs> {
  return get<TimelineLogs>('/logs', {
    limit: params.limit,
    offset: params.offset,
  });
}

export async function getLog(logId: string): Promise<LogWithBook> {
  return get<LogWithBook>(`/logs/${logId}`);
}

export async function getBookLogs(
  bookId: string,
  params: GetTimelineParams = {}
): Promise<PaginatedLogs> {
  return get<PaginatedLogs>(`/books/${bookId}/logs`, {
    limit: params.limit,
    offset: params.offset,
  });
}

export async function createLog(
  bookId: string,
  data: CreateLogRequest
): Promise<Log> {
  return post<Log>(`/books/${bookId}/logs`, data);
}

export async function updateLog(
  logId: string,
  data: UpdateLogRequest
): Promise<Log> {
  return put<Log>(`/logs/${logId}`, data);
}

export async function deleteLog(logId: string): Promise<void> {
  return del(`/logs/${logId}`);
}
