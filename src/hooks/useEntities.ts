'use client';

import { useMemo } from 'react';
import { useHomeAssistant } from './useHomeAssistant';
import type { HassEntity } from '@/types';

export function useEntitiesByDomain(domain: string): HassEntity[] {
  const { entities } = useHomeAssistant();

  return useMemo(() => {
    return Object.values(entities).filter((entity) =>
      entity.entity_id.startsWith(`${domain}.`)
    );
  }, [entities, domain]);
}

export function useEntitiesCount(domain: string, state?: string): number {
  const domainEntities = useEntitiesByDomain(domain);

  return useMemo(() => {
    if (!state) return domainEntities.length;
    return domainEntities.filter((entity) => entity.state === state).length;
  }, [domainEntities, state]);
}

export function useLightsOn(): number {
  return useEntitiesCount('light', 'on');
}

export function useDoorsOpen(): number {
  const binarySensors = useEntitiesByDomain('binary_sensor');

  return useMemo(() => {
    return binarySensors.filter(
      (entity) =>
        entity.attributes.device_class === 'door' && entity.state === 'on'
    ).length;
  }, [binarySensors]);
}

export function useAverageTemperature(): number | null {
  const { entities } = useHomeAssistant();

  return useMemo(() => {
    const tempEntities = Object.values(entities).filter(
      (entity) =>
        entity.entity_id.startsWith('sensor.') &&
        entity.attributes.device_class === 'temperature' &&
        !isNaN(parseFloat(entity.state))
    );

    if (tempEntities.length === 0) return null;

    const sum = tempEntities.reduce(
      (acc, entity) => acc + parseFloat(entity.state),
      0
    );
    return Math.round(sum / tempEntities.length);
  }, [entities]);
}
