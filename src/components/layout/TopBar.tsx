'use client';

import { Icon } from '../ui/Icon';
import { MdiIcon } from '../ui/MdiIcon';
import { HALogo } from '../ui/HALogo';
import { usePullToRevealContext } from '@/contexts';
import {
  mdiPencil,
  mdiPlus,
  mdiChevronDown,
} from '@mdi/js';

interface TopBarProps {
  title?: string;
  icon?: string;
}

export function TopBar({ title = 'Home', icon }: TopBarProps) {
  const { isRevealed, toggle } = usePullToRevealContext();

  return (
    <header className="flex items-center justify-between h-full py-ha-2 px-ha-0 lg:px-0" data-component="TopBar">
      {/* Mobile: Logo/Icon + Title with dropdown */}
      <div className="flex items-center gap-ha-3 lg:hidden">
        {icon ? (
          <MdiIcon icon={icon} size={24} className="text-text-secondary" />
        ) : (
          <HALogo size={24} />
        )}
        <button
          className="flex items-center gap-ha-1"
          onClick={toggle}
        >
          <span className="text-lg font-semibold text-text-primary capitalize">{title}</span>
          <Icon
            path={mdiChevronDown}
            size={24}
            className={`text-text-secondary transition-transform duration-300 ${isRevealed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Title (desktop) */}
      <h1 className="hidden lg:block text-2xl font-semibold text-text-primary capitalize">
        {title}
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-ha-2">
        <button className="p-ha-3 rounded-ha-xl hover:bg-surface-low text-text-secondary transition-colors">
          <Icon path={mdiPencil} size={24} />
        </button>
        <button className="p-ha-3 rounded-ha-xl bg-fill-primary-normal text-ha-blue transition-colors hover:bg-fill-primary-quiet">
          <Icon path={mdiPlus} size={24} />
        </button>
      </div>
    </header>
  );
}
