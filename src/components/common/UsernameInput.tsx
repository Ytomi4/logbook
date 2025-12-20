import { useState, useEffect, useCallback } from 'react';
import { Input } from './Input';
import { useUsernameValidation } from '../../hooks/useUsernameValidation';

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function UsernameInput({
  value,
  onChange,
  onValidationChange,
  disabled = false,
  label = 'ユーザー名',
}: UsernameInputProps) {
  const { isValid, isChecking, error, checkUsernameValue } = useUsernameValidation();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched && value) {
      checkUsernameValue(value);
    }
  }, [value, touched, checkUsernameValue]);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
      onChange(newValue);
      if (!touched) {
        setTouched(true);
      }
    },
    [onChange, touched]
  );

  const handleBlur = useCallback(() => {
    if (!touched && value) {
      setTouched(true);
      checkUsernameValue(value);
    }
  }, [touched, value, checkUsernameValue]);

  const getStatusIcon = () => {
    if (!touched || !value) return null;

    if (isChecking) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="animate-spin h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      );
    }

    if (isValid) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          label={label}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="username"
          error={touched && error ? error : undefined}
          helperText={
            !touched || !error
              ? '英数字とアンダースコアのみ（3〜20文字）'
              : undefined
          }
          className="pr-10"
        />
        {getStatusIcon()}
      </div>
    </div>
  );
}
