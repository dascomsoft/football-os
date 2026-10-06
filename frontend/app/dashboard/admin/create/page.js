'use client';

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import {
  Building2,
  Users,
  UserRound,
  UserPlus,
  Target,
} from 'lucide-react';

const CARDS = [
  {
    href: '/dashboard/admin/create/club',
    title: 'Nouveau club',
    description: 'Creez un compte club approuve directement.',
    icon: Building2,
  },
  {
    href: '/dashboard/admin/create/academy',
    title: 'Nouvelle academie',
    description: 'Creez un compte academie approuve directement.',
    icon: Users,
  },
  {
    href: '/dashboard/admin/create/coach',
    title: 'Nouveau coach',
    description: 'Creez un compte coach approuve directement.',
    icon: UserRound,
  },
  {
    href: '/dashboard/admin/create/player',
    title: 'Nouveau joueur',
    description: 'Ajoutez un joueur pour une academie existante.',
    icon: UserPlus,
  },
  {
    href: '/dashboard/admin/create/opportunity',
    title: 'Nouvelle opportunite',
    description: 'Publiez une opportunite sans demande prealable.',
    icon: Target,
  },
];

export default function AdminCreateIndexPage() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Creation directe"
        subtitle="Creez manuellement des organisations, des joueurs ou des opportunites. Les comptes sont approuves automatiquement."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4 transition-colors hover:border-accent/40 hover:bg-surface-overlay"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-overlay text-content-secondary">
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-content-primary">
                {card.title}
              </span>
              <span className="text-xs text-content-secondary">
                {card.description}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}