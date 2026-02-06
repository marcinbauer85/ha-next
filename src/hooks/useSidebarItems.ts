'use client';

import { useSidebarItemsContext, type SidebarItem } from '@/contexts';

export type { SidebarItem };

export function useSidebarItems() {
  return useSidebarItemsContext();
}
