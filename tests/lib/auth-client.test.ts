import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock better-auth/react before importing auth-client
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn(() => ({
    signOut: vi.fn(() => Promise.resolve({ success: true })),
    signIn: {
      social: vi.fn(() => Promise.resolve({ success: true })),
    },
    useSession: vi.fn(() => ({
      data: null,
      isPending: false,
      refetch: vi.fn(),
    })),
    // Simulate better-auth's internal structure
    $fetch: vi.fn(),
  })),
}));

vi.mock('better-auth/client/plugins', () => ({
  customSessionClient: vi.fn(() => ({})),
  inferAdditionalFields: vi.fn(() => ({})),
}));

// Mock window.location for getBaseURL
const mockLocation = { origin: 'http://localhost:8788' };
Object.defineProperty(globalThis, 'location', {
  value: mockLocation,
  writable: true,
});

describe('authClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the module to test lazy initialization
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exports', () => {
    it('exports authClient as an object', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      expect(authClient).toBeDefined();
      expect(typeof authClient).toBe('object');
    });
  });

  describe('method access', () => {
    it('provides access to signOut method', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      expect(authClient.signOut).toBeDefined();
      expect(typeof authClient.signOut).toBe('function');
    });

    it('provides access to nested properties like signIn.social', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      expect(authClient.signIn).toBeDefined();
      expect(authClient.signIn.social).toBeDefined();
      expect(typeof authClient.signIn.social).toBe('function');
    });

    it('provides access to useSession hook', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      expect(authClient.useSession).toBeDefined();
      expect(typeof authClient.useSession).toBe('function');
    });
  });

  describe('method invocation', () => {
    it('can call signOut without errors', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      // This should not throw - the key fix is that methods work correctly
      await expect(authClient.signOut()).resolves.not.toThrow();
    });

    it('can call signIn.social without errors', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      await expect(
        authClient.signIn.social({ provider: 'google' })
      ).resolves.not.toThrow();
    });

    it('can call useSession without errors', async () => {
      const { authClient } = await import('../../src/lib/auth-client');
      expect(() => authClient.useSession()).not.toThrow();
    });
  });

  describe('lazy initialization', () => {
    it('does not call createAuthClient at import time', async () => {
      vi.resetModules();
      const { createAuthClient } = await import('better-auth/react');

      // Clear the mock call count
      vi.mocked(createAuthClient).mockClear();

      // Import the module - this should NOT trigger createAuthClient
      await import('../../src/lib/auth-client');

      // createAuthClient should not have been called yet at import time
      expect(createAuthClient).not.toHaveBeenCalled();
    });

    it('initializes client on first property access', async () => {
      const { createAuthClient } = await import('better-auth/react');
      vi.mocked(createAuthClient).mockClear();
      vi.resetModules();

      const { authClient } = await import('../../src/lib/auth-client');

      // Access a property - this should trigger initialization
      const _signOut = authClient.signOut;

      // Now createAuthClient should have been called
      expect(createAuthClient).toHaveBeenCalled();
    });
  });

  describe('Proxy behavior (regression test for bind() issue)', () => {
    it('does not break internal Proxy when accessing methods', async () => {
      // This test ensures the fix for the bind() issue works correctly
      // The original bug was that bind() changed the 'this' context of better-auth's
      // internal methods, causing property accesses to be misinterpreted as API paths
      const { authClient } = await import('../../src/lib/auth-client');

      // Access method and call it - should work without throwing
      const signOutMethod = authClient.signOut;
      expect(signOutMethod).toBeDefined();

      // The method should be callable
      const result = await signOutMethod();
      expect(result).toBeDefined();
    });

    it('preserves nested object access without errors', async () => {
      const { authClient } = await import('../../src/lib/auth-client');

      // Access nested property
      const signIn = authClient.signIn;
      expect(signIn).toBeDefined();

      // Access nested method
      const socialMethod = signIn.social;
      expect(socialMethod).toBeDefined();
      expect(typeof socialMethod).toBe('function');
    });
  });
});
