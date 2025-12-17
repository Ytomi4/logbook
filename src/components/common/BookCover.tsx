import { useState } from 'react';

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-12', // 32x48px
  md: 'w-12 h-16', // 48x64px
  lg: 'w-16 h-24', // 64x96px
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function BookCover({
  coverUrl,
  title,
  size = 'md',
  className = '',
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !coverUrl || hasError;

  if (showFallback) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-100 rounded flex items-center justify-center flex-shrink-0 ${className}`}
        title={title}
      >
        <svg
          className={`${iconSizes[size]} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={title}
      className={`${sizeClasses[size]} rounded object-cover flex-shrink-0 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
