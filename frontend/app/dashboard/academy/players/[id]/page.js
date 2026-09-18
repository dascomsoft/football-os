'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import playerService from '@/services/player.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-2 last:border-b-0">
      <span className="text-sm text-content-secondary">{label}</span>
      <span className="text-sm text-content-primary">{value ?? '-'}</span>
    </div>
  );
}

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const isAcademy = user?.role === 'ACADEMY';
  const playerId = params?.id;

  const load = useCallback(async () => {
    if (!isAcademy || !playerId) return;
    setLoading(true);
    setError('');
    try {
      const data = await playerService.getMyPlayer(playerId);
      setPlayer(data.player);
    } catch (err) {
      setError(err.response?.data?.message || 'Joueur introuvable.');
    } finally {
      setLoading(false);
    }
  }, [isAcademy, playerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleArchive() {
    setArchiving(true);
    try {
      await playerService.archivePlayer(playerId);
      setConfirmOpen(false);
      router.push('/dashboard/academy/players');
    } catch (err) {
      setError(err.response?.data?.message || 'Archivage impossible.');
      setArchiving(false);
      setConfirmOpen(false);
    }
  }

  if (!isAcademy) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux academies."
      />
    );
  }

  if (loading) return <LoadingState label="Chargement du joueur..." />;
  if (error) return <ErrorState message={error} />;
  if (!player) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${player.firstName} ${player.lastName}`}
        subtitle="Fiche sportive du joueur."
        action={
          <div className="flex gap-2">
            <Link href="/dashboard/academy/players">
              <Button variant="secondary">Retour</Button>
            </Link>
            <Link href={`/dashboard/academy/players/${player._id}/edit`}>
              <Button variant="secondary">Modifier</Button>
            </Link>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Archiver
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Identite
          </h2>
          <Row label="Prenom" value={player.firstName} />
          <Row label="Nom" value={player.lastName} />
          <Row label="Age" value={`${player.age} ans`} />
          <Row label="Nationalite" value={player.nationality} />
          <Row label="Genre" value={player.gender} />
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Profil sportif
          </h2>
          <Row label="Poste" value={player.position} />
          <Row label="Poste secondaire" value={player.secondaryPosition || '-'} />
          <Row label="Pied prefere" value={player.preferredFoot} />
          <Row label="Taille" value={player.height ? `${player.height} cm` : '-'} />
          <Row label="Poids" value={player.weight ? `${player.weight} kg` : '-'} />
          <Row label="Experience" value={`${player.experienceYears || 0} ans`} />
          <Row label="Club actuel" value={player.currentClub || '-'} />
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4 md:col-span-2">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Statut interne
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={player.status} />
            <span className="text-xs text-content-secondary">
              Visibilite : {player.visibility}
            </span>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Archiver ce joueur"
        message="Le joueur ne sera plus visible dans votre liste. Cette action peut etre reversible plus tard."
        confirmLabel="Archiver"
        danger
        loading={archiving}
        onConfirm={handleArchive}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}