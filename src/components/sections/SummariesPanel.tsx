'use client';

import { useMemo, useState } from 'react';
import { SummaryCard } from '../cards/SummaryCard';
import { Avatar } from '../ui/Avatar';
import { useHomeAssistant } from '@/hooks';
import {
  mdiAccountMultiple,
  mdiLightbulbGroup,
  mdiThermometer,
  mdiShieldHome,
  mdiWeatherPartlyCloudy,
  mdiGestureTap,
  mdiArrowExpandAll,
  mdiChevronLeft,
  mdiChevronRight,
  mdiThemeLightDark,
  mdiClockOutline,
} from '@mdi/js';
import { Icon } from '../ui/Icon';

const summaryItems = [
  { icon: mdiLightbulbGroup, title: 'Lights', state: '3 on', color: 'yellow' as const },
  { icon: mdiThermometer, title: 'Climate', state: '22°C avg', color: 'primary' as const },
  { icon: mdiShieldHome, title: 'Security', state: 'Armed', color: 'success' as const },
  { icon: mdiWeatherPartlyCloudy, title: 'Weather', state: '18°C Cloudy', color: 'default' as const },
];

const tips = [
  {
    id: 'immersive',
    icon: mdiArrowExpandAll,
    title: 'Immersive Mode',
    description: 'Press ⌘ + \\ to toggle immersive view',
  },
  {
    id: 'darkmode',
    icon: mdiThemeLightDark,
    title: 'Dark Mode',
    description: 'Press ⌘ + Shift + D to toggle dark mode',
  },
  {
    id: 'screensaver',
    icon: mdiClockOutline,
    title: 'Screensaver',
    description: 'Press ⌘ + Shift + S to toggle, or wait 1 minute of inactivity',
  },
  {
    id: 'pull',
    icon: mdiGestureTap,
    title: 'Pull to Reveal',
    description: 'Pull down on the dashboard to reveal quick actions',
  },
];

interface TipsCardProps {
  onToggleImmersive?: () => void;
  onToggleDarkMode?: () => void;
  onToggleScreensaver?: () => void;
}

function TipsCard({ onToggleImmersive, onToggleDarkMode, onToggleScreensaver }: TipsCardProps) {
  const [currentTip, setCurrentTip] = useState(0);

  const tip = tips[currentTip];

  const goToPrev = () => setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  const goToNext = () => setCurrentTip((prev) => (prev + 1) % tips.length);

  const getActionButton = () => {
    if (tip.id === 'immersive' && onToggleImmersive) {
      return (
        <button onClick={onToggleImmersive} className="text-ha-blue font-medium hover:underline">
          Try it now
        </button>
      );
    }
    if (tip.id === 'darkmode' && onToggleDarkMode) {
      return (
        <button onClick={onToggleDarkMode} className="text-ha-blue font-medium hover:underline">
          Try it now
        </button>
      );
    }
    if (tip.id === 'screensaver' && onToggleScreensaver) {
      return (
        <button onClick={onToggleScreensaver} className="text-ha-blue font-medium hover:underline">
          Try it now
        </button>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-ha-2 p-ha-3 rounded-ha-xl bg-surface-low">
      <div className="flex items-center gap-ha-2">
        <div className="w-8 h-8 rounded-full bg-fill-primary-normal flex items-center justify-center flex-shrink-0">
          <Icon path={tip.icon} size={18} className="text-ha-blue" />
        </div>
        <span className="text-sm font-medium text-text-primary flex-1">{tip.title}</span>
        <div className="flex items-center gap-ha-1">
          <button
            onClick={goToPrev}
            className="w-6 h-6 rounded-full bg-surface-lower flex items-center justify-center text-text-secondary hover:bg-surface-default transition-colors"
          >
            <Icon path={mdiChevronLeft} size={16} />
          </button>
          <button
            onClick={goToNext}
            className="w-6 h-6 rounded-full bg-surface-lower flex items-center justify-center text-text-secondary hover:bg-surface-default transition-colors"
          >
            <Icon path={mdiChevronRight} size={16} />
          </button>
        </div>
      </div>
      <p className="text-xs text-text-secondary">
        {tip.description}
        {getActionButton() && <> {getActionButton()}</>}
      </p>
      <div className="flex gap-ha-1 mt-ha-1">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentTip ? 'bg-ha-blue' : 'bg-surface-lower'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PeopleBadge({ compact = false }: { compact?: boolean }) {
  const { entities, haUrl } = useHomeAssistant();

  const peopleHome = useMemo(() => {
    return Object.entries(entities)
      .filter(([entityId, entity]) => entityId.startsWith('person.') && entity.state === 'home')
      .map(([, entity]) => ({
        name: entity.attributes.friendly_name as string || 'User',
        picture: entity.attributes.entity_picture
          ? `${haUrl}${entity.attributes.entity_picture}`
          : undefined,
        initials: ((entity.attributes.friendly_name as string) || 'U')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }));
  }, [entities, haUrl]);

  if (compact) {
    // Mobile: stacked avatars + count
    return (
      <div className="flex items-center gap-ha-2 px-ha-2 py-ha-1 rounded-ha-pill whitespace-nowrap bg-fill-primary-quiet flex-shrink-0">
        <div className="flex -space-x-1.5 flex-shrink-0">
          {peopleHome.length > 0 ? (
            peopleHome.slice(0, 4).map((person, index) => (
              <Avatar
                key={index}
                src={person.picture}
                initials={person.initials}
                size="xs"
                className="ring-2 ring-fill-primary-quiet flex-shrink-0 bg-surface-default"
              />
            ))
          ) : (
            <div className="w-7 h-7 rounded-full bg-fill-primary-normal flex items-center justify-center flex-shrink-0">
              <Icon path={mdiAccountMultiple} size={16} className="text-ha-blue" />
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-text-primary text-left pr-ha-1 flex-shrink-0">
          {peopleHome.length} home
        </span>
      </div>
    );
  }

  // Desktop: icon + text on left, avatars on right
  return (
    <div className="flex items-center gap-ha-3 p-ha-3 rounded-ha-xl bg-fill-primary-quiet">
      <div className="flex-shrink-0 text-ha-blue">
        <Icon path={mdiAccountMultiple} size={24} />
      </div>
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-sm font-medium text-text-primary text-left">People</span>
        <span className="text-xs text-text-secondary text-left">{peopleHome.length} home</span>
      </div>
      {peopleHome.length > 0 && (
        <div className="flex -space-x-2 flex-shrink-0">
          {peopleHome.map((person, index) => (
            <Avatar
              key={index}
              src={person.picture}
              initials={person.initials}
              size="sm"
              className="ring-2 ring-fill-primary-quiet bg-surface-default"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileSummaryRow() {
  return (
    <div
      className="lg:hidden sticky top-0 -mx-ha-4 px-ha-4 pt-ha-4 pb-ha-3 z-10 backdrop-blur-md"
      style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--ha-color-surface-lower) 60%, transparent), transparent)' }}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-ha-2">
          <PeopleBadge compact />
          {summaryItems.map((item) => (
            <SummaryCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              state={item.state}
              color={item.color}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SummariesPanelProps {
  onToggleImmersive?: () => void;
  onToggleDarkMode?: () => void;
  onToggleScreensaver?: () => void;
}

export function SummariesPanel({ onToggleImmersive, onToggleDarkMode, onToggleScreensaver }: SummariesPanelProps) {
  return (
    <aside className="hidden lg:block w-80 xl:w-96 bg-surface-default rounded-ha-2xl p-ha-5 h-fit">
      <h2 className="text-lg font-semibold text-text-primary mb-ha-4">Summary</h2>
      <div className="space-y-ha-3">
        <PeopleBadge />
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            state={item.state}
            color={item.color}
          />
        ))}
        <div className="pt-ha-2">
          <TipsCard onToggleImmersive={onToggleImmersive} onToggleDarkMode={onToggleDarkMode} onToggleScreensaver={onToggleScreensaver} />
        </div>
      </div>
    </aside>
  );
}
