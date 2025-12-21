import type { Log } from '../types';
import { isRegistrationLog } from '../types';

/**
 * Check if non-registration logs exist in the array.
 * Returns true if there are logs other than registration log,
 * meaning the registration log should also be displayed.
 */
export function shouldShowRegistrationLog(logs: Log[]): boolean {
  if (!logs || logs.length === 0) {
    return false;
  }
  // Show registration log only if there are other logs
  return logs.some((log) => !isRegistrationLog(log));
}

/**
 * Check if only registration log exists in the array.
 * Returns true if the only log is a registration log.
 */
export function isRegistrationLogOnly(logs: Log[]): boolean {
  if (!logs || logs.length === 0) {
    return false;
  }
  return logs.length === 1 && isRegistrationLog(logs[0]);
}

/**
 * Filter logs for display based on registration log rules.
 * - If only registration log exists: return empty array (show book cover only)
 * - If other logs exist: return all logs including registration log
 */
export function filterLogsForDisplay(logs: Log[]): Log[] {
  if (!logs || logs.length === 0) {
    return [];
  }

  // If only registration log, don't show it (show book cover only)
  if (isRegistrationLogOnly(logs)) {
    return [];
  }

  // Otherwise, show all logs including registration log
  return logs;
}
