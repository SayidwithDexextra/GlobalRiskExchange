'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Read from DOM on mount (already set by inline script)
    const current = document.documentElement.getAttribute('data-theme') as Theme;
    if (current) setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    // Use the global function set by the inline script
    if (typeof window !== 'undefined' && (window as any).dxToggleTheme) {
      (window as any).dxToggleTheme();
      const newTheme = document.documentElement.getAttribute('data-theme') as Theme;
      setTheme(newTheme);
    }
  }, []);

  return { theme, toggle };
}
