'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import notificationService from '@/services/notification.service';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Topbar() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await notificationService.unreadCount();
        if (!cancelled) setUnread(data.count || 0);
      } catch {
        // silencieux
      }
    }

    load();
    const interval = setInterval(load, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface-raised px-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-content-secondary">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </span>
        {user?.role ? (
          <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
            {user.role}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {user?.status ? <StatusBadge status={user.status} /> : null}
        <Link
          href="/dashboard/notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-content-secondary transition-colors hover:bg-surface-overlay hover:text-content-primary"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-state-danger px-1 text-[10px] font-medium text-white">
              {unread > 99 ? '99+' : unread}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}