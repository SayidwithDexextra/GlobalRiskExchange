'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label="Switch to light mode"
    >
      <svg className="moon" width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="sun" width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9L13 13M3 13l1.1-1.1M11.9 4.1L13 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
