import { describe, it, expect } from 'vitest';
import { usernameSchema, updateProfileSchema } from '../../src/lib/validation';

describe('usernameSchema', () => {
  describe('valid usernames', () => {
    it('accepts alphanumeric usernames', () => {
      const result = usernameSchema.safeParse('testuser123');
      expect(result.success).toBe(true);
    });

    it('accepts usernames with underscores', () => {
      const result = usernameSchema.safeParse('test_user');
      expect(result.success).toBe(true);
    });

    it('accepts exactly 3 character username', () => {
      const result = usernameSchema.safeParse('abc');
      expect(result.success).toBe(true);
    });

    it('accepts exactly 20 character username', () => {
      const result = usernameSchema.safeParse('a'.repeat(20));
      expect(result.success).toBe(true);
    });

    it('accepts uppercase letters', () => {
      const result = usernameSchema.safeParse('TestUser');
      expect(result.success).toBe(true);
    });
  });

  describe('invalid usernames', () => {
    it('rejects usernames shorter than 3 characters', () => {
      const result = usernameSchema.safeParse('ab');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('3文字以上');
      }
    });

    it('rejects usernames longer than 20 characters', () => {
      const result = usernameSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('20文字以内');
      }
    });

    it('rejects usernames with special characters', () => {
      const result = usernameSchema.safeParse('test@user');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('英数字とアンダースコア');
      }
    });

    it('rejects usernames with spaces', () => {
      const result = usernameSchema.safeParse('test user');
      expect(result.success).toBe(false);
    });

    it('rejects usernames with hyphens', () => {
      const result = usernameSchema.safeParse('test-user');
      expect(result.success).toBe(false);
    });

    it('rejects usernames with dots', () => {
      const result = usernameSchema.safeParse('test.user');
      expect(result.success).toBe(false);
    });

    it('rejects empty username', () => {
      const result = usernameSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });
});

describe('updateProfileSchema', () => {
  it('accepts valid profile update', () => {
    const result = updateProfileSchema.safeParse({ username: 'validuser' });
    expect(result.success).toBe(true);
  });

  it('rejects missing username', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects invalid username format', () => {
    const result = updateProfileSchema.safeParse({ username: 'a' });
    expect(result.success).toBe(false);
  });
});
