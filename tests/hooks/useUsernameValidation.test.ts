import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUsernameValidation } from '../../src/hooks/useUsernameValidation';
import * as profileService from '../../src/services/profile';

vi.mock('../../src/services/profile');

describe('useUsernameValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => useUsernameValidation());

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.checkUsernameValue).toBe('function');
    });
  });

  describe('empty input', () => {
    it('resets state for empty username', async () => {
      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('');
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('client-side validation', () => {
    it('rejects username that is too short', async () => {
      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('ab');
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toContain('3文字以上');
    });

    it('rejects username that is too long', async () => {
      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('a'.repeat(21));
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toContain('20文字以内');
    });

    it('rejects username with invalid characters', async () => {
      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('test@user');
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toContain('英数字とアンダースコア');
    });

    it('rejects reserved username', async () => {
      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('admin');
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBe('このハンドルネームは使用できません');
    });
  });

  describe('server-side validation', () => {
    it('shows checking state during debounce', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: true,
      });

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('validuser');
      });

      expect(result.current.isChecking).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('validates available username after debounce', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: true,
      });

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('validuser');
      });

      // Fast-forward all timers and flush promises
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isValid).toBe(true);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('handles taken username', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: false,
        reason: 'taken',
      });

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('takenuser');
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBe('このハンドルネームは既に使用されています');
    });

    it('handles reserved username from server', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: false,
        reason: 'reserved',
      });

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('newreserved');
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBe('このハンドルネームは使用できません');
    });

    it('handles invalid format from server', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: false,
        reason: 'invalid',
        message: 'カスタムエラーメッセージ',
      });

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('someuser');
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBe('カスタムエラーメッセージ');
    });

    it('handles network error', async () => {
      vi.mocked(profileService.checkUsername).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useUsernameValidation());

      act(() => {
        result.current.checkUsernameValue('validuser');
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isValid).toBe(false);
      expect(result.current.isChecking).toBe(false);
      expect(result.current.error).toBe('ハンドルネームの確認に失敗しました');
    });
  });

  describe('debouncing behavior', () => {
    it('debounces multiple rapid inputs', async () => {
      vi.mocked(profileService.checkUsername).mockResolvedValue({
        available: true,
      });

      const { result } = renderHook(() => useUsernameValidation());

      // Simulate rapid typing
      act(() => {
        result.current.checkUsernameValue('use');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.checkUsernameValue('user');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.checkUsernameValue('usern');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.checkUsernameValue('userna');
      });

      // At this point, no API call should have been made yet
      expect(profileService.checkUsername).not.toHaveBeenCalled();

      // Wait for debounce and flush promises
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Only one API call should be made with the final value
      expect(profileService.checkUsername).toHaveBeenCalledTimes(1);
      expect(profileService.checkUsername).toHaveBeenCalledWith('userna');
    });
  });
});
