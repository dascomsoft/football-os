'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

const MESSAGES = {
  PENDING: {
    title: 'Compte en attente de validation',
    body: 'Votre inscription a bien ete enregistree. Un administrateur va examiner votre profil. Vous recevrez une notification des que votre compte sera approuve.',
  },
  REQUESTED_INFO: {
    title: 'Informations complementaires requises',
    body: 'L\'administrateur a besoin d\'informations supplementaires avant de valider votre compte. Vous serez contacte prochainement.',
  },
  REJECTED: {
    title: 'Compte non valide',
    body: 'Votre demande n\'a pas ete approuvee. Contactez l\'administrateur pour plus d\'informations.',
  },
  SUSPENDED: {
    title: 'Compte suspendu',
    body: 'Votre compte est temporairement suspendu. Contactez l\'administrateur pour plus d\'informations.',
  },
  BLOCKED: {
    title: 'Compte bloque',
    body: 'Votre compte a ete bloque. Contactez l\'administrateur pour plus d\'informations.',
  },
};

export default function PendingPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && user && user.status === 'APPROVED') {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Chargement..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const message = MESSAGES[user.status] || MESSAGES.PENDING;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-6 px-6 py-12">
      <div className="flex w-full flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-content-primary">
            {message.title}
          </h1>
          <StatusBadge status={user.status} />
        </div>

        <p className="text-sm text-content-secondary">{message.body}</p>

        <dl className="mt-2 flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between border-t border-surface-border pt-2">
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
        </dl>

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={logout}>
            Se deconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}