import { describe, it, expect } from 'vitest';
import {
  shouldShowRegistrationLog,
  isRegistrationLogOnly,
  filterLogsForDisplay,
  filterRegistrationLogs,
  hasNonRegistrationLogs,
} from '../../src/lib/timeline';
import type { Log } from '../../src/types';

// Helper to create mock logs
function createLog(logType: 'memo' | 'quote' | 'registration'): Log {
  return {
    id: crypto.randomUUID(),
    bookId: 'book-1',
    userId: 'user-1',
    logType,
    content: logType === 'registration' ? '📖' : 'Test content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('filterRegistrationLogs', () => {
  describe('always filters out registration logs', () => {
    it('returns empty array for single registration log', () => {
      const logs = [createLog('registration')];
      expect(filterRegistrationLogs(logs)).toEqual([]);
    });

    it('returns only non-registration logs for mixed logs', () => {
      const registrationLog = createLog('registration');
      const memoLog = createLog('memo');
      const logs = [registrationLog, memoLog];
      const result = filterRegistrationLogs(logs);
      expect(result).toHaveLength(1);
      expect(result[0].logType).toBe('memo');
    });

    it('returns all logs when no registration log exists', () => {
      const memoLog = createLog('memo');
      const quoteLog = createLog('quote');
      const logs = [memoLog, quoteLog];
      expect(filterRegistrationLogs(logs)).toEqual(logs);
    });

    it('filters out all registration logs when multiple exist', () => {
      const reg1 = createLog('registration');
      const reg2 = createLog('registration');
      const memoLog = createLog('memo');
      const logs = [reg1, memoLog, reg2];
      const result = filterRegistrationLogs(logs);
      expect(result).toHaveLength(1);
      expect(result[0].logType).toBe('memo');
    });
  });

  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      expect(filterRegistrationLogs([])).toEqual([]);
    });

    it('handles null-like input gracefully', () => {
      // @ts-expect-error testing null input
      expect(filterRegistrationLogs(null)).toEqual([]);
      // @ts-expect-error testing undefined input
      expect(filterRegistrationLogs(undefined)).toEqual([]);
    });
  });
});

describe('hasNonRegistrationLogs', () => {
  describe('returns true when non-registration logs exist', () => {
    it('returns true for array with memo log', () => {
      const logs = [createLog('memo')];
      expect(hasNonRegistrationLogs(logs)).toBe(true);
    });

    it('returns true for array with quote log', () => {
      const logs = [createLog('quote')];
      expect(hasNonRegistrationLogs(logs)).toBe(true);
    });

    it('returns true for mixed logs (registration + memo)', () => {
      const logs = [createLog('registration'), createLog('memo')];
      expect(hasNonRegistrationLogs(logs)).toBe(true);
    });
  });

  describe('returns false when only registration logs exist', () => {
    it('returns false for empty array', () => {
      expect(hasNonRegistrationLogs([])).toBe(false);
    });

    it('returns false for array with only registration log', () => {
      const logs = [createLog('registration')];
      expect(hasNonRegistrationLogs(logs)).toBe(false);
    });

    it('returns false for multiple registration logs', () => {
      const logs = [createLog('registration'), createLog('registration')];
      expect(hasNonRegistrationLogs(logs)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null-like input gracefully', () => {
      // @ts-expect-error testing null input
      expect(hasNonRegistrationLogs(null)).toBe(false);
      // @ts-expect-error testing undefined input
      expect(hasNonRegistrationLogs(undefined)).toBe(false);
    });
  });
});

describe('shouldShowRegistrationLog (deprecated)', () => {
  describe('returns true when non-registration logs exist', () => {
    it('returns true for array with memo log', () => {
      const logs = [createLog('memo')];
      expect(shouldShowRegistrationLog(logs)).toBe(true);
    });

    it('returns true for array with quote log', () => {
      const logs = [createLog('quote')];
      expect(shouldShowRegistrationLog(logs)).toBe(true);
    });

    it('returns true for mixed logs (registration + memo)', () => {
      const logs = [createLog('registration'), createLog('memo')];
      expect(shouldShowRegistrationLog(logs)).toBe(true);
    });

    it('returns true for mixed logs (registration + quote + memo)', () => {
      const logs = [
        createLog('registration'),
        createLog('quote'),
        createLog('memo'),
      ];
      expect(shouldShowRegistrationLog(logs)).toBe(true);
    });
  });

  describe('returns false when only registration logs exist', () => {
    it('returns false for empty array', () => {
      expect(shouldShowRegistrationLog([])).toBe(false);
    });

    it('returns false for array with only registration log', () => {
      const logs = [createLog('registration')];
      expect(shouldShowRegistrationLog(logs)).toBe(false);
    });

    it('returns false for multiple registration logs', () => {
      const logs = [createLog('registration'), createLog('registration')];
      expect(shouldShowRegistrationLog(logs)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null-like input gracefully', () => {
      // @ts-expect-error testing null input
      expect(shouldShowRegistrationLog(null)).toBe(false);
      // @ts-expect-error testing undefined input
      expect(shouldShowRegistrationLog(undefined)).toBe(false);
    });
  });
});

describe('isRegistrationLogOnly', () => {
  describe('returns true when only registration log exists', () => {
    it('returns true for single registration log', () => {
      const logs = [createLog('registration')];
      expect(isRegistrationLogOnly(logs)).toBe(true);
    });
  });

  describe('returns false when other logs exist', () => {
    it('returns false for empty array', () => {
      expect(isRegistrationLogOnly([])).toBe(false);
    });

    it('returns false for single memo log', () => {
      const logs = [createLog('memo')];
      expect(isRegistrationLogOnly(logs)).toBe(false);
    });

    it('returns false for single quote log', () => {
      const logs = [createLog('quote')];
      expect(isRegistrationLogOnly(logs)).toBe(false);
    });

    it('returns false for registration + memo', () => {
      const logs = [createLog('registration'), createLog('memo')];
      expect(isRegistrationLogOnly(logs)).toBe(false);
    });

    it('returns false for multiple registration logs', () => {
      const logs = [createLog('registration'), createLog('registration')];
      expect(isRegistrationLogOnly(logs)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null-like input gracefully', () => {
      // @ts-expect-error testing null input
      expect(isRegistrationLogOnly(null)).toBe(false);
      // @ts-expect-error testing undefined input
      expect(isRegistrationLogOnly(undefined)).toBe(false);
    });
  });
});

describe('filterLogsForDisplay', () => {
  describe('returns empty array when only registration log exists', () => {
    it('returns empty array for single registration log', () => {
      const logs = [createLog('registration')];
      expect(filterLogsForDisplay(logs)).toEqual([]);
    });
  });

  describe('always excludes registration logs (v2 spec)', () => {
    it('returns only non-registration logs for mixed logs', () => {
      const registrationLog = createLog('registration');
      const memoLog = createLog('memo');
      const logs = [registrationLog, memoLog];
      const result = filterLogsForDisplay(logs);
      expect(result).toHaveLength(1);
      expect(result[0].logType).toBe('memo');
    });

    it('returns only memo logs when no registration log', () => {
      const memoLog = createLog('memo');
      const logs = [memoLog];
      expect(filterLogsForDisplay(logs)).toEqual([memoLog]);
    });

    it('returns all non-registration logs for quote + memo', () => {
      const quoteLog = createLog('quote');
      const memoLog = createLog('memo');
      const logs = [quoteLog, memoLog];
      expect(filterLogsForDisplay(logs)).toEqual([quoteLog, memoLog]);
    });

    it('excludes registration log even with multiple other logs', () => {
      const registrationLog = createLog('registration');
      const quoteLog = createLog('quote');
      const memoLog = createLog('memo');
      const logs = [registrationLog, quoteLog, memoLog];
      const result = filterLogsForDisplay(logs);
      expect(result).toHaveLength(2);
      expect(result.every((log) => log.logType !== 'registration')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      expect(filterLogsForDisplay([])).toEqual([]);
    });

    it('handles null-like input gracefully', () => {
      // @ts-expect-error testing null input
      expect(filterLogsForDisplay(null)).toEqual([]);
      // @ts-expect-error testing undefined input
      expect(filterLogsForDisplay(undefined)).toEqual([]);
    });
  });
});
