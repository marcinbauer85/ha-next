'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useHomeAssistant } from '@/hooks/useHomeAssistant';
import { getPanels, type HaPanel } from '@/lib/homeassistant';

export interface SidebarItem {
  id: string;
  title: string;
  icon: string | null;
  urlPath: string;
  type: 'dashboard' | 'panel';
  isCustom?: boolean;
  isApp?: boolean;
}

interface SidebarItemsContextType {
  items: SidebarItem[];
  loading: boolean;
  error: string | null;
}

const SidebarItemsContext = createContext<SidebarItemsContextType>({
  items: [],
  loading: true,
  error: null,
});

export function SidebarItemsProvider({ children }: { children: ReactNode }) {
  const { connected } = useHomeAssistant();
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!connected || hasFetched) return;

    const fetchItems = async () => {
      setLoading(true);
      const sidebarItems: SidebarItem[] = [];

      // Add our custom "Home" dashboard first
      // icon is null so TopBar shows HALogo instead
      sidebarItems.push({
        id: 'home',
        title: 'Home',
        icon: null,
        urlPath: '/',
        type: 'dashboard',
        isCustom: true,
      });

      // Add custom Energy dashboard
      sidebarItems.push({
        id: 'energy',
        title: 'Energy',
        icon: 'mdi:flash',
        urlPath: '/dashboard/energy',
        type: 'dashboard',
        isCustom: true,
      });

      try {
        // Small delay to ensure connection is ready
        await new Promise(resolve => setTimeout(resolve, 300));

        // Fetch panels
        const panels = await getPanels();

        if (panels && typeof panels === 'object') {
          const panelEntries = Object.entries(panels);
          const lovelacePanels: [string, HaPanel][] = [];
          const otherPanels: [string, HaPanel][] = [];

          const hiddenPanels = new Set([
            'profile',
            'developer-tools',
            'config',
            'lovelace',
            'home',
            'energy',
          ]);

          panelEntries.forEach(([key, panel]) => {
            if (hiddenPanels.has(key)) return;

            if (panel.component_name === 'lovelace') {
              lovelacePanels.push([key, panel]);
            } else if (panel.title && panel.icon) {
              otherPanels.push([key, panel]);
            }
          });

          lovelacePanels.forEach(([key, panel]) => {
            if (key === 'lovelace') return;

            sidebarItems.push({
              id: key,
              title: panel.title || key,
              icon: panel.icon || 'mdi:view-dashboard-outline',
              urlPath: `/dashboard/${panel.url_path}`,
              type: 'dashboard',
            });
          });

          const appComponents = new Set([
            'iframe',
            'custom',
            'hassio',
            'hacs',
            'esphome',
          ]);

          otherPanels.forEach(([key, panel]) => {
            const isApp = appComponents.has(panel.component_name) ||
                         key.includes('_') ||
                         panel.component_name.startsWith('custom:');

            sidebarItems.push({
              id: key,
              title: panel.title!,
              icon: panel.icon || 'mdi:application',
              urlPath: `/panel/${panel.url_path}`,
              type: 'panel',
              isApp,
            });
          });
        }

        setItems(sidebarItems);
        setError(null);
        setHasFetched(true);
      } catch (err) {
        console.error('Failed to fetch sidebar items:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [connected, hasFetched]);

  return (
    <SidebarItemsContext.Provider value={{ items, loading, error }}>
      {children}
    </SidebarItemsContext.Provider>
  );
}

export function useSidebarItemsContext() {
  return useContext(SidebarItemsContext);
}
