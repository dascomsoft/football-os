'use client';

import useAuth from '@/hooks/useAuth';
import StatusBadge from '@/components/ui/StatusBadge';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Tableau de bord
        </h1>
        <p className="text-sm text-content-secondary">
          Vue d&apos;ensemble de votre espace Football OS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-content-primary">
            Compte
          </h2>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-content-secondary">Nom</dt>
              <dd className="text-content-primary">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-content-secondary">Email</dt>
              <dd className="text-content-primary">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-content-secondary">Role</dt>
              <dd className="text-content-primary">{user.role}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-content-secondary">Statut</dt>
              <dd>
                <StatusBadge status={user.status} />
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-content-primary">
            Prochaines etapes
          </h2>
          <p className="mt-3 text-sm text-content-secondary">
            Les modules de recrutement, de CRM prive et de suivi des placements
            seront actives progressivement. Votre espace est pret.
          </p>
        </section>
      </div>
    </div>
  );
}