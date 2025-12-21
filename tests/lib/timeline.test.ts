import { describe, it, expect } from 'vitest';
import {
  shouldShowRegistrationLog,
  isRegistrationLogOnly,
  filterLogsForDisplay,
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

describe('shouldShowRegistrationLog', () => {
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

  describe('returns all logs when other logs exist', () => {
    it('returns all logs including registration for mixed logs', () => {
      const registrationLog = createLog('registration');
      const memoLog = createLog('memo');
      const logs = [registrationLog, memoLog];
      expect(filterLogsForDisplay(logs)).toEqual([registrationLog, memoLog]);
    });

    it('returns only memo logs when no registration log', () => {
      const memoLog = createLog('memo');
      const logs = [memoLog];
      expect(filterLogsForDisplay(logs)).toEqual([memoLog]);
    });

    it('returns all logs for quote + memo', () => {
      const quoteLog = createLog('quote');
      const memoLog = createLog('memo');
      const logs = [quoteLog, memoLog];
      expect(filterLogsForDisplay(logs)).toEqual([quoteLog, memoLog]);
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
