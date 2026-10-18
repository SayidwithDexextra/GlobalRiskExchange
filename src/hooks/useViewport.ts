'use client';

import { useState, useEffect } from 'react';

interface Viewport {
  w: number;
  h: number;
}

// SSR-safe default
const defaultViewport: Viewport = { w: 1440, h: 800 };

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(defaultViewport);

  useEffect(() => {
    function update() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return viewport;
}
