'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../ui/Icon';
import { MdiIcon } from '../ui/MdiIcon';
import { HALogo } from '../ui/HALogo';
import { useSidebarItems } from '@/hooks';
import { mdiMagnify } from '@mdi/js';

export function Sidebar() {
  const pathname = usePathname();
  const { items, loading } = useSidebarItems();

  return (
    <aside className="hidden lg:flex flex-col items-center w-16 bg-surface-default py-ha-3 h-full" data-component="Sidebar">
      {/* Logo - links to home dashboard */}
      <Link href="/" className="h-12 flex items-center justify-center mb-ha-4">
        <HALogo size={32} />
      </Link>

      {/* Search */}
      <Link
        href="/panel/search"
        className={`p-ha-3 rounded-ha-xl transition-colors mb-ha-4 ${
          pathname === '/panel/search' ? 'bg-fill-primary-normal text-ha-blue' : 'hover:bg-surface-low text-text-secondary'
        }`}
      >
        <Icon path={mdiMagnify} size={24} />
      </Link>

      {/* All items listed one-by-one */}
      <nav className="flex-1 flex flex-col gap-ha-2 overflow-y-auto scrollbar-hide">
        {loading ? (
          // Loading placeholders
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 flex-shrink-0 rounded-ha-xl bg-surface-low animate-pulse" />
            ))}
          </>
        ) : (
          [...items]
            .filter(item => item.urlPath !== '/')
            .sort((a, b) => {
              // Dashboards first, then apps
              if (a.isApp === b.isApp) return 0;
              return a.isApp ? 1 : -1;
            })
            .map((item) => {
            const isActive = pathname === item.urlPath ||
              (item.urlPath !== '/' && pathname.startsWith(item.urlPath));

            return (
              <Link
                key={item.id}
                href={item.urlPath}
                scroll={false}
                className={`w-12 h-12 flex-shrink-0 rounded-ha-xl transition-colors flex items-center justify-center ${
                  item.isApp
                    ? isActive ? 'bg-ha-blue' : 'bg-surface-lower'
                    : isActive ? 'bg-fill-primary-normal' : 'hover:bg-surface-low'
                }`}
                title={item.title}
              >
                <MdiIcon
                  icon={item.icon || (item.isApp ? 'mdi:application' : 'mdi:view-dashboard')}
                  size={24}
                  className={item.isApp
                    ? isActive ? 'text-white' : 'text-text-secondary'
                    : isActive ? 'text-ha-blue' : 'text-text-secondary'
                  }
                />
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
