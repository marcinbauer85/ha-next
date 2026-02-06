'use client';

import { clsx } from 'clsx';
import { Icon } from '../ui/Icon';
import type { SummaryCardProps } from '@/types';

const colorClasses = {
  primary: 'bg-fill-primary-quiet',
  danger: 'bg-fill-danger-normal',
  success: 'bg-fill-success-normal',
  yellow: 'bg-yellow-95',
  default: 'bg-surface-low',
};

const iconColorClasses = {
  primary: 'text-ha-blue',
  danger: 'text-red-600',
  success: 'text-green-600',
  yellow: 'text-yellow-600',
  default: 'text-text-secondary',
};

export function SummaryCard({ icon, title, state, color = 'default', compact = false }: SummaryCardProps) {
  if (compact) {
    return (
      <div
        className={clsx(
          'flex items-center gap-ha-2 px-ha-3 py-ha-2 rounded-ha-pill whitespace-nowrap',
          colorClasses[color]
        )}
      >
        <div className={clsx('flex-shrink-0', iconColorClasses[color])}>
          <Icon path={icon} size={18} />
        </div>
        <span className="text-sm font-medium text-text-primary text-left">{state}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-ha-3 p-ha-3 rounded-ha-xl',
        colorClasses[color]
      )}
    >
      <div className={clsx('flex-shrink-0', iconColorClasses[color])}>
        <Icon path={icon} size={24} />
      </div>
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-sm font-medium text-text-primary text-left">{title}</span>
        <span className="text-xs text-text-secondary text-left">{state}</span>
      </div>
    </div>
  );
}
