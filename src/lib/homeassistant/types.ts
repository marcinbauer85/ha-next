import type { HassEntity } from '@/types';

export type { HassEntity };

export interface HassConfig {
  url: string;
  token: string;
}

export interface ConnectionState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export interface HassServices {
  [domain: string]: {
    [service: string]: {
      name: string;
      description: string;
      fields: Record<string, unknown>;
    };
  };
}

export interface CallServiceParams {
  domain: string;
  service: string;
  serviceData?: Record<string, unknown>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
}
