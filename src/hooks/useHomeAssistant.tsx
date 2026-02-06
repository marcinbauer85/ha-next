'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { HassEntities as HAEntities } from 'home-assistant-js-websocket';
import {
  connect,
  disconnect,
  subscribeToEntities,
  toggleEntity as toggleEntityAction,
  callService as callServiceAction,
} from '@/lib/homeassistant';
import type { CallServiceParams } from '@/lib/homeassistant';
import type { HassEntities, HassEntity } from '@/types';

interface HomeAssistantContextValue {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  entities: HassEntities;
  toggleEntity: (entityId: string) => Promise<void>;
  callService: (params: CallServiceParams) => Promise<void>;
  reconnect: () => Promise<void>;
}

const HomeAssistantContext = createContext<HomeAssistantContextValue | null>(null);

interface HomeAssistantProviderProps {
  children: ReactNode;
  url?: string;
  token?: string;
}

export function HomeAssistantProvider({
  children,
  url = process.env.NEXT_PUBLIC_HA_URL || '',
  token = process.env.NEXT_PUBLIC_HA_TOKEN || '',
}: HomeAssistantProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entities, setEntities] = useState<HassEntities>({});

  const connectToHA = useCallback(async () => {
    if (!url || !token) {
      setError('Home Assistant URL or token not configured');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      await connect({ url, token });
      setConnected(true);

      subscribeToEntities((newEntities: HAEntities) => {
        setEntities(newEntities as unknown as HassEntities);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, [url, token]);

  const reconnect = useCallback(async () => {
    disconnect();
    setConnected(false);
    await connectToHA();
  }, [connectToHA]);

  const toggleEntity = useCallback(async (entityId: string) => {
    try {
      await toggleEntityAction(entityId);
    } catch (err) {
      console.error('Failed to toggle entity:', err);
    }
  }, []);

  const callService = useCallback(async (params: CallServiceParams) => {
    try {
      await callServiceAction(params);
    } catch (err) {
      console.error('Failed to call service:', err);
    }
  }, []);

  useEffect(() => {
    connectToHA();

    return () => {
      disconnect();
    };
  }, [connectToHA]);

  return (
    <HomeAssistantContext.Provider
      value={{
        connected,
        connecting,
        error,
        entities,
        toggleEntity,
        callService,
        reconnect,
      }}
    >
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): HomeAssistantContextValue {
  const context = useContext(HomeAssistantContext);
  if (!context) {
    throw new Error('useHomeAssistant must be used within a HomeAssistantProvider');
  }
  return context;
}

export function useEntity(entityId: string): HassEntity | undefined {
  const { entities } = useHomeAssistant();
  return entities[entityId];
}

export function useEntities(entityIds: string[]): (HassEntity | undefined)[] {
  const { entities } = useHomeAssistant();
  return entityIds.map((id) => entities[id]);
}
