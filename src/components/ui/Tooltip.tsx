'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: ReactNode;
  delay?: number;
}

export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 200; // approximate width
    const tooltipHeight = 40; // approximate height
    const spacing = 8;

    // Calculate horizontal position (centered above element)
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Keep tooltip within viewport horizontally
    const viewportWidth = window.innerWidth;
    if (left < 8) left = 8;
    if (left + tooltipWidth > viewportWidth - 8) {
      left = viewportWidth - tooltipWidth - 8;
    }

    // Calculate vertical position (above element)
    let top = rect.top - tooltipHeight - spacing;

    // If not enough space above, show below
    if (top < 8) {
      top = rect.bottom + spacing;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      {mounted && isVisible && createPortal(
        <div
          className="fixed z-[200] px-ha-2 py-ha-1 bg-surface-default border border-surface-lower rounded-ha-pill shadow-lg shadow-black/20 transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          }}
        >
          <span className="text-[11px] text-text-primary whitespace-nowrap font-medium">
            {content}
          </span>
        </div>,
        document.body
      )}
    </>
  );
}
