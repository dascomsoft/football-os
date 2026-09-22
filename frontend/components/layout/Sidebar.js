'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  UserRound,
  FileText,
  Target,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

// const NAV_BY_ROLE = {
//   ADMIN: [
//     { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//     { href: '/dashboard/admin/profiles', label: 'Profils en attente', icon: Shield },
//     { href: '/dashboard/admin/requests', label: 'Demandes', icon: FileText },
//     { href: '/dashboard/admin/opportunities', label: 'Opportunites', icon: Target },
//   ],
//   ACADEMY: [
//     { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//     { href: '/dashboard/academy/players', label: 'Joueurs', icon: Users },
//   ],
//   CLUB: [
//     { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//   ],
//   COACH: [
//     { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//     { href: '/dashboard/coach/profile', label: 'Mon profil', icon: UserRound },
//   ],
//   PLAYER: [
//     { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
//   ],
// };






const NAV_BY_ROLE = {
  ADMIN: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/admin/profiles', label: 'Profils en attente', icon: Shield },
    { href: '/dashboard/admin/requests', label: 'Demandes', icon: FileText },
    { href: '/dashboard/admin/opportunities', label: 'Opportunites', icon: Target },
  ],
  ACADEMY: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/academy/players', label: 'Joueurs', icon: Users },
    { href: '/dashboard/opportunities', label: 'Opportunites', icon: Target },
  ],
  CLUB: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/club/requests', label: 'Mes demandes', icon: FileText },
    { href: '/dashboard/opportunities', label: 'Opportunites', icon: Target },
  ],
  COACH: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/coach/profile', label: 'Mon profil', icon: UserRound },
    { href: '/dashboard/coach/requests', label: 'Ma recherche', icon: FileText },
    { href: '/dashboard/opportunities', label: 'Opportunites', icon: Target },
  ],
  PLAYER: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  ],
};










export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = user ? NAV_BY_ROLE[user.role] || [] : [];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-surface-border bg-surface-raised">
      <div className="flex h-14 items-center border-b border-surface-border px-4">
        <span className="text-sm font-semibold text-content-primary">
          Football OS
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-surface-overlay text-content-primary'
                      : 'text-content-secondary hover:bg-surface-overlay hover:text-content-primary'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-surface-border p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-content-secondary transition-colors hover:bg-surface-overlay hover:text-content-primary"
        >
          <LogOut size={16} />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>
  );
}