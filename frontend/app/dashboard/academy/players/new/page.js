'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import playerService from '@/services/player.service';
import PlayerForm from '@/components/player/PlayerForm';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function NewPlayerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user?.role !== 'ACADEMY') {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux academies."
      />
    );
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError('');
    try {
      const data = await playerService.createPlayer(payload);
      router.push(`/dashboard/academy/players/${data.player._id}`);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Creation impossible. Verifiez les champs.';
      setServerError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nouveau joueur"
        subtitle="Renseignez le profil sportif. Les coordonnees privees ne sont pas demandees ici."
      />
      <PlayerForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/academy/players')}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Creer le joueur"
      />
    </div>
  );
}