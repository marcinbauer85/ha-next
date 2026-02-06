'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIdleTimerOptions {
  timeout: number; // in milliseconds
  onIdle?: () => void;
  onActive?: () => void;
}

export function useIdleTimer({ timeout, onIdle, onActive }: UseIdleTimerOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onIdleRef = useRef(onIdle);
  const onActiveRef = useRef(onActive);

  // Keep refs updated
  useEffect(() => {
    onIdleRef.current = onIdle;
    onActiveRef.current = onActive;
  }, [onIdle, onActive]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isIdle) {
      setIsIdle(false);
      onActiveRef.current?.();
    }

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdleRef.current?.();
    }, timeout);
  }, [timeout, isIdle]);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
      'wheel',
    ];

    // Start the timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  const wake = useCallback(() => {
    if (isIdle) {
      setIsIdle(false);
      onActiveRef.current?.();
      resetTimer();
    }
  }, [isIdle, resetTimer]);

  return { isIdle, wake, resetTimer };
}
