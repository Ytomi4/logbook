import type { LogType } from '../../types';

interface LogTypeSelectorProps {
  value: LogType;
  onChange: (type: LogType) => void;
  disabled?: boolean;
}

export function LogTypeSelector({
  value,
  onChange,
  disabled = false,
}: LogTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('memo')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
          value === 'memo'
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          メモ
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange('quote')}
        disabled={disabled}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
          value === 'quote'
            ? 'bg-amber-50 border-amber-500 text-amber-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          引用
        </span>
      </button>
    </div>
  );
}
