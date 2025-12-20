import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UsernameInput } from '../../src/components/common/UsernameInput';

describe('UsernameInput', () => {
  describe('rendering', () => {
    it('renders with label', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      expect(screen.getByText('ユーザー名')).toBeInTheDocument();
    });

    it('renders input field', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText('username');
      expect(input).toBeInTheDocument();
    });
  });

  describe('value handling', () => {
    it('displays the provided value', () => {
      render(
        <UsernameInput
          value="testuser"
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
      const onChange = vi.fn();
      render(
        <UsernameInput
          value=""
          onChange={onChange}
          onValidationChange={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText('username');
      fireEvent.change(input, { target: { value: 'newuser' } });

      expect(onChange).toHaveBeenCalledWith('newuser');
    });
  });

  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(
        <UsernameInput
          value="testuser"
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
          disabled={true}
        />
      );

      expect(screen.getByPlaceholderText('username')).toBeDisabled();
    });
  });

  describe('validation feedback', () => {
    it('shows helper text about valid characters', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      expect(screen.getByText(/英数字とアンダースコア/)).toBeInTheDocument();
    });

    it('calls onValidationChange when value changes', async () => {
      const onValidationChange = vi.fn();
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={onValidationChange}
        />
      );

      // Initial call with empty value
      await waitFor(() => {
        expect(onValidationChange).toHaveBeenCalled();
      });
    });
  });

  describe('accessibility', () => {
    it('has associated label', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      const label = screen.getByText('ユーザー名');
      expect(label.tagName).toBe('LABEL');
    });

    it('input has id for label association', () => {
      render(
        <UsernameInput
          value=""
          onChange={vi.fn()}
          onValidationChange={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText('username');
      expect(input).toHaveAttribute('id');
    });
  });
});
