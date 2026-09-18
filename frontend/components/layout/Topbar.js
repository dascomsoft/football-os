'use client';

import useAuth from '@/hooks/useAuth';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Topbar() {
  const { user } = useAuth();

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

      <div className="flex items-center gap-2">
        {user?.status ? <StatusBadge status={user.status} /> : null}
      </div>
    </header>
  );
}