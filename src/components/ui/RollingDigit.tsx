'use client';

import { useEffect, useState } from 'react';

interface RollingDigitProps {
  digit: string;
  className?: string; // To pass font styles
}

export function RollingDigit({ digit, className = '' }: RollingDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState<string | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit && nextDigit === null) {
      setNextDigit(digit);
      // Wait for render to display nextDigit
      requestAnimationFrame(() => {
        // Double RAF to ensure browser has painted the new DOM node (nextDigit)
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setTranslateY(-50);
        });
      });
    }
  }, [digit, currentDigit, nextDigit]);

  const handleTransitionEnd = () => {
    // Disable transition to reset instantly
    setIsTransitioning(false);
    setTranslateY(0);
    // Update current digit to the new one
    if (nextDigit !== null) {
      setCurrentDigit(nextDigit);
      setNextDigit(null);
    }
  };

  return (
    <div 
      className={`relative inline-block overflow-hidden align-top ${className}`} 
      style={{ 
        height: '1em', 
        lineHeight: 1, 
        width: '1ch',
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div
        className={`flex flex-col ${isTransitioning ? 'transition-transform duration-500 ease-in-out-quint' : ''}`}
        style={{
          transform: `translateY(${translateY}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div style={{ height: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentDigit}
        </div>
        {nextDigit !== null && (
          <div style={{ height: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {nextDigit}
          </div>
        )}
      </div>
    </div>
  );
}
