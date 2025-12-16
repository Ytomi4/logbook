import { get } from './api';
import type { TimelineLogs } from '../types';

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
