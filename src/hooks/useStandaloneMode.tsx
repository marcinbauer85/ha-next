'use client';

import { useState, useEffect } from 'react';

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS Safari
  if ((navigator as unknown as { standalone?: boolean }).standalone === true) return true;
  // Android Chrome & cross-platform
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
}

export function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsStandalone(getIsStandalone());
    setHydrated(true);

    const mql = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return { isStandalone, hydrated };
}
