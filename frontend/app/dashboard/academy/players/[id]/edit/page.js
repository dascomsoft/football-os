'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import playerService from '@/services/player.service';
import PlayerForm from '@/components/player/PlayerForm';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function EditPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isAcademy = user?.role === 'ACADEMY';
  const playerId = params?.id;

  useEffect(() => {
    if (!isAcademy || !playerId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await playerService.getMyPlayer(playerId);
        if (!cancelled) setPlayer(data.player);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Joueur introuvable.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAcademy, playerId]);

  if (!isAcademy) {
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
      await playerService.updatePlayer(playerId, payload);
      router.push(`/dashboard/academy/players/${playerId}`);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Mise a jour impossible.';
      setServerError(message);
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Chargement..." />;
  if (error) return <ErrorState message={error} />;
  if (!player) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Modifier le joueur"
        subtitle={`${player.firstName} ${player.lastName}`}
      />
      <PlayerForm
        initialPlayer={player}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/dashboard/academy/players/${playerId}`)}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}