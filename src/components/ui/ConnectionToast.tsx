'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { mdiConnection, mdiAlertCircle, mdiCheckCircle, mdiReload } from '@mdi/js';

export type ConnectionStatus = 'connecting' | 'connected' | 'error' | null;

interface ConnectionToastProps {
  status: ConnectionStatus;
  errorMessage?: string;
}

export function ConnectionToast({ status, errorMessage }: ConnectionToastProps) {
  const [visible, setVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ConnectionStatus>(null);
  const [haUrl, setHaUrl] = useState<string>('');

  useEffect(() => {
    setHaUrl(process.env.NEXT_PUBLIC_HA_URL || 'http://localhost:8123');
  }, []);

  useEffect(() => {
    if (status) {
      setCurrentStatus(status);
      setVisible(true);

      // Auto-hide success message after 3 seconds
      if (status === 'connected') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [status]);

  const handleTransitionEnd = () => {
    if (!visible) {
      setCurrentStatus(null);
    }
  };

  if (!currentStatus && !visible) return null;

  const config = {
    connecting: {
      icon: mdiConnection,
      message: 'Connecting to Home Assistant...',
      bgColor: 'bg-ha-blue',
      textColor: 'text-white',
      glowColor: 'shadow-[0_0_20px_rgba(66,133,244,0.6)]',
    },
    connected: {
      icon: mdiCheckCircle,
      message: 'Connected',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      glowColor: 'shadow-[0_0_20px_rgba(34,197,94,0.6)]',
    },
    error: {
      icon: mdiAlertCircle,
      message: errorMessage || 'Connection error',
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]',
    },
  };

  const current = config[currentStatus || 'connecting'];

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Toast message */}
      <div
        className={`fixed bottom-36 lg:bottom-24 right-edge z-50 transition-all duration-500 ease-out ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-4 opacity-0 scale-95'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {currentStatus === 'error' ? (
          // Error toast with URL and reload button
          <div
            className={`flex flex-col gap-ha-2 px-ha-4 py-ha-3 rounded-ha-xl ${current.bgColor} ${current.textColor} shadow-lg shadow-black/20 min-w-[280px] max-w-[400px]`}
          >
            <div className="flex items-center gap-ha-3">
              <Icon path={current.icon} size={20} />
              <span className="text-sm font-medium">
                {errorMessage || 'Connection error'}
              </span>
            </div>
            <div className="flex flex-col gap-ha-2 pl-8">
              <span className="text-xs opacity-90 break-all">
                URL: {haUrl}
              </span>
              <button
                onClick={handleReload}
                className="flex items-center gap-ha-2 px-ha-3 py-ha-1.5 bg-white/20 hover:bg-white/30 rounded-ha-pill text-xs font-medium transition-colors self-start"
              >
                <Icon path={mdiReload} size={14} />
                Reload page
              </button>
            </div>
          </div>
        ) : (
          // Normal toast (connecting/connected)
          <div
            className={`flex items-center gap-ha-3 px-ha-4 py-ha-3 rounded-ha-xl ${current.bgColor} ${current.textColor} shadow-lg shadow-black/20`}
          >
            <Icon
              path={current.icon}
              size={20}
              className={currentStatus === 'connecting' ? 'animate-pulse' : ''}
            />
            <span className="text-sm font-medium whitespace-nowrap">
              {current.message}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
