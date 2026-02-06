'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from '@/components/layout';
import { EntityCard, RoomCard } from '@/components/cards';
import { DashboardSection, MobileSummaryRow, SummariesPanel, PullToRevealPanel } from '@/components/sections';
import { useTheme, useIdleTimer, useImmersiveMode } from '@/hooks';
import { usePullToRevealContext } from '@/contexts';
import { ScreensaverClock } from '@/components/ui/ScreensaverClock';
import {
  mdiLightbulb,
  mdiTelevision,
  mdiSpeaker,
  mdiLock,
  mdiSofa,
  mdiBed,
  mdiSilverwareForkKnife,
  mdiDesk,
  mdiShower,
  mdiDoorOpen,
  mdiToyBrickOutline,
  mdiBalcony,
} from '@mdi/js';

// Mock data for static rendering - will be replaced with real HA data
const favoriteEntities = [
  { id: 'light.living_room', icon: mdiLightbulb, title: 'Living Room', state: 'On', color: 'yellow' as const },
  { id: 'media_player.tv', icon: mdiTelevision, title: 'TV', state: 'Off', color: 'default' as const },
  { id: 'media_player.speaker', icon: mdiSpeaker, title: 'Speaker', state: 'Playing', color: 'primary' as const },
  { id: 'lock.front_door', icon: mdiLock, title: 'Front Door', state: 'Locked', color: 'success' as const },
];

const rooms = [
  { id: 'living_room', icon: mdiSofa, name: 'Living Room', temperature: 22, humidity: 45, activeEntities: 2 },
  { id: 'kitchen', icon: mdiSilverwareForkKnife, name: 'Kitchen', temperature: 21, humidity: 50, activeEntities: 1 },
  { id: 'office', icon: mdiDesk, name: 'Office', temperature: 23, humidity: 40, activeEntities: 3 },
  { id: 'bedroom', icon: mdiBed, name: 'Bedroom', temperature: 20, humidity: 48, activeEntities: 0 },
  { id: 'kids_room', icon: mdiToyBrickOutline, name: 'Kids Room', temperature: 21, humidity: 47, activeEntities: 0 },
  { id: 'balcony', icon: mdiBalcony, name: 'Balcony', temperature: 18, humidity: 60, activeEntities: 0 },
  { id: 'bathroom', icon: mdiShower, name: 'Bathroom', temperature: 24, humidity: 65, activeEntities: 0 },
  { id: 'hallway', icon: mdiDoorOpen, name: 'Hallway', temperature: 20, humidity: 44, activeEntities: 0 },
];

const SCREENSAVER_TIMEOUT = 60000; // 1 minute of inactivity

export default function DashboardPage() {
  const { toggleTheme } = useTheme();
  const { immersiveMode, setImmersiveMode, toggleImmersiveMode } = useImmersiveMode();
  const [screensaverActive, setScreensaverActive] = useState(false);
  const scrollableRef = useRef<HTMLElement | null>(null);
  const { isRevealed } = usePullToRevealContext();

  // Screensaver idle timer
  const { wake } = useIdleTimer({
    timeout: SCREENSAVER_TIMEOUT,
    onIdle: () => {
      setScreensaverActive(true);
      setImmersiveMode(true);
    },
  });

  const dismissScreensaver = useCallback(() => {
    setScreensaverActive(false);
    setImmersiveMode(false);
    wake();
  }, [wake, setImmersiveMode]);

  const activateScreensaver = useCallback(() => {
    setScreensaverActive(true);
    setImmersiveMode(true);
  }, [setImmersiveMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + \ for immersive mode
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        toggleImmersiveMode();
      }
      // Cmd/Ctrl + Shift + S for screensaver
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (screensaverActive) {
          dismissScreensaver();
        } else {
          activateScreensaver();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screensaverActive, dismissScreensaver, activateScreensaver, toggleImmersiveMode]);

  return (
    <>
      {/* TopBar row */}
      <div className={`px-edge lg:pr-edge overflow-hidden flex-shrink-0 ${
        immersiveMode ? 'h-0 opacity-0 transition-[height,opacity] duration-300 ease-out' : 'h-16'
      }`}>
        <TopBar title="Home" />
      </div>

      {/* Pull to reveal - drag handle between TopBar and dashboard (Mobile only) */}
      <PullToRevealPanel />

      {/* Main content row - shrinks as panel expands */}
      <div className={`min-h-0 overflow-hidden px-edge pb-20 mt-1 lg:mt-0 lg:pb-ha-0 lg:pr-edge transition-all duration-300 ease-out ${
        isRevealed ? 'flex-none h-0 opacity-0' : 'flex-1'
      }`}>
        <div className="h-full bg-surface-lower overflow-hidden rounded-ha-3xl">
          <div className="h-full flex flex-col lg:px-ha-5 lg:pt-ha-5 lg:pb-ha-5 overflow-hidden">
            {/* Content area */}
            <div className="flex-1 flex gap-ha-4 overflow-hidden">
              {/* Main dashboard */}
              <main
                ref={(el) => { scrollableRef.current = el; }}
                className="flex-1 lg:pb-0 px-ha-3 lg:px-0 overscroll-none overflow-x-hidden overflow-y-auto touch-pan-y"
                data-scrollable="dashboard"
              >
                {/* Mobile summary row - sticky with glass effect on scroll */}
                <MobileSummaryRow />

                {/* Favorites */}
                <DashboardSection title="Favorites" columns={2}>
                  {favoriteEntities.map((entity) => (
                    <EntityCard
                      key={entity.id}
                      icon={entity.icon}
                      title={entity.title}
                      state={entity.state}
                      color={entity.color}
                      size="sm"
                    />
                  ))}
                </DashboardSection>

                {/* Rooms */}
                <DashboardSection title="Rooms" columns={3}>
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      icon={room.icon}
                      name={room.name}
                      temperature={room.temperature}
                      humidity={room.humidity}
                      activeEntities={room.activeEntities}
                    />
                  ))}
                </DashboardSection>
              </main>

              {/* Summaries panel - Desktop only */}
              <SummariesPanel
                onToggleImmersive={toggleImmersiveMode}
                onToggleDarkMode={toggleTheme}
                onToggleScreensaver={activateScreensaver}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Screensaver */}
      <ScreensaverClock visible={screensaverActive} onDismiss={dismissScreensaver} />
    </>
  );
}
