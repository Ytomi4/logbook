import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTabNavigation } from '../../src/hooks/useTabNavigation';

describe('useTabNavigation', () => {
  describe('default state', () => {
    it('defaults to timeline tab', () => {
      const { result } = renderHook(() => useTabNavigation());

      expect(result.current.activeTab).toBe('timeline');
    });

    it('accepts custom default tab', () => {
      const { result } = renderHook(() => useTabNavigation('books'));

      expect(result.current.activeTab).toBe('books');
    });
  });

  describe('tab switching', () => {
    it('switches to books tab', () => {
      const { result } = renderHook(() => useTabNavigation());

      act(() => {
        result.current.setActiveTab('books');
      });

      expect(result.current.activeTab).toBe('books');
    });

    it('switches to timeline tab', () => {
      const { result } = renderHook(() => useTabNavigation('books'));

      act(() => {
        result.current.setActiveTab('timeline');
      });

      expect(result.current.activeTab).toBe('timeline');
    });

    it('can switch tabs multiple times', () => {
      const { result } = renderHook(() => useTabNavigation());

      act(() => {
        result.current.setActiveTab('books');
      });
      expect(result.current.activeTab).toBe('books');

      act(() => {
        result.current.setActiveTab('timeline');
      });
      expect(result.current.activeTab).toBe('timeline');

      act(() => {
        result.current.setActiveTab('books');
      });
      expect(result.current.activeTab).toBe('books');
    });
  });
});
