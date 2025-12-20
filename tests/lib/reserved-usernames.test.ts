import { describe, it, expect } from 'vitest';
import { isReservedUsername, RESERVED_USERNAMES } from '../../src/lib/reserved-usernames';

describe('isReservedUsername', () => {
  describe('reserved usernames', () => {
    it('returns true for "enter"', () => {
      expect(isReservedUsername('enter')).toBe(true);
    });

    it('returns true for "setup"', () => {
      expect(isReservedUsername('setup')).toBe(true);
    });

    it('returns true for "settings"', () => {
      expect(isReservedUsername('settings')).toBe(true);
    });

    it('returns true for "admin"', () => {
      expect(isReservedUsername('admin')).toBe(true);
    });

    it('returns true for "api"', () => {
      expect(isReservedUsername('api')).toBe(true);
    });

    it('is case insensitive - uppercase', () => {
      expect(isReservedUsername('ADMIN')).toBe(true);
    });

    it('is case insensitive - mixed case', () => {
      expect(isReservedUsername('EnTeR')).toBe(true);
    });
  });

  describe('non-reserved usernames', () => {
    it('returns false for regular username', () => {
      expect(isReservedUsername('testuser')).toBe(false);
    });

    it('returns false for username containing reserved word', () => {
      expect(isReservedUsername('myadmin')).toBe(false);
    });

    it('returns false for username similar to reserved', () => {
      expect(isReservedUsername('settingss')).toBe(false);
    });
  });
});

describe('RESERVED_USERNAMES', () => {
  it('contains expected system routes', () => {
    expect(RESERVED_USERNAMES).toContain('enter');
    expect(RESERVED_USERNAMES).toContain('setup');
    expect(RESERVED_USERNAMES).toContain('settings');
    expect(RESERVED_USERNAMES).toContain('login');
    expect(RESERVED_USERNAMES).toContain('logout');
  });

  it('contains expected API routes', () => {
    expect(RESERVED_USERNAMES).toContain('api');
    expect(RESERVED_USERNAMES).toContain('auth');
  });

  it('contains expected admin routes', () => {
    expect(RESERVED_USERNAMES).toContain('admin');
  });

  it('is not empty', () => {
    expect(RESERVED_USERNAMES.length).toBeGreaterThan(0);
  });
});
