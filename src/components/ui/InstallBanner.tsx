'use client';

import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { useStandaloneMode } from '@/hooks/useStandaloneMode';
import { mdiCellphoneArrowDown, mdiClose } from '@mdi/js';

const LS_DISMISSED_KEY = 'ha_install_banner_dismissed';

export function InstallBanner() {
  const { isStandalone, hydrated } = useStandaloneMode();
  const [dismissed, setDismissed] = useState(true); // default true to avoid flash
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(LS_DISMISSED_KEY) === 'true');
  }, []);

  // Animate in after hydration
  useEffect(() => {
    if (hydrated && !isStandalone && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [hydrated, isStandalone, dismissed]);

  if (!hydrated || isStandalone || dismissed) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(LS_DISMISSED_KEY, 'true');
    // Wait for animation to finish before removing from DOM
    setTimeout(() => setDismissed(true), 300);
  };

  return (
    <div
      className={`lg:hidden fixed bottom-36 left-edge right-edge z-40 transition-all duration-300 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-ha-3 p-ha-3 bg-surface-low rounded-ha-xl shadow-lg shadow-black/10">
        <div className="flex-shrink-0 w-10 h-10 rounded-ha-lg bg-ha-blue/10 flex items-center justify-center">
          <Icon path={mdiCellphoneArrowDown} size={22} className="text-ha-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">Add to homescreen for a better experience</p>
          <p className="text-xs text-text-secondary">Please add this page to your mobile screen via Share - Add to Homescreen 🙏</p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-ha-1 rounded-full hover:bg-surface-lower transition-colors"
          aria-label="Dismiss"
        >
          <Icon path={mdiClose} size={18} className="text-text-secondary" />
        </button>
      </div>
    </div>
  );
}
