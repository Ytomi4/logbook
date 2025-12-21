import type { Log } from '../types';
import { isRegistrationLog } from '../types';

/**
 * Filter out registration logs from the array.
 * Registration logs are always hidden from the timeline display.
 */
export function filterRegistrationLogs(logs: Log[]): Log[] {
  if (!logs || logs.length === 0) {
    return [];
  }
  return logs.filter((log) => !isRegistrationLog(log));
}

/**
 * Check if non-registration logs exist in the array.
 * Returns true if there are logs other than registration log.
 */
export function hasNonRegistrationLogs(logs: Log[]): boolean {
  if (!logs || logs.length === 0) {
    return false;
  }
  return logs.some((log) => !isRegistrationLog(log));
}

/**
 * Check if only registration log exists in the array.
 * Returns true if the only log is a registration log.
 * Used to determine if only book cover should be shown.
 */
export function isRegistrationLogOnly(logs: Log[]): boolean {
  if (!logs || logs.length === 0) {
    return false;
  }
  const firstLog = logs[0];
  return logs.length === 1 && firstLog !== undefined && isRegistrationLog(firstLog);
}

/**
 * Filter logs for display based on registration log rules.
 * Registration logs are always excluded from the timeline.
 * - If only registration log exists: return empty array (show book cover only)
 * - If other logs exist: return only non-registration logs
 */
export function filterLogsForDisplay(logs: Log[]): Log[] {
  if (!logs || logs.length === 0) {
    return [];
  }

  // Always filter out registration logs
  return filterRegistrationLogs(logs);
}

// Keep for backward compatibility - will be removed in future
/** @deprecated Use hasNonRegistrationLogs instead */
export function shouldShowRegistrationLog(logs: Log[]): boolean {
  return hasNonRegistrationLogs(logs);
}
