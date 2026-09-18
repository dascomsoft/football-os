'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import playerService from '@/services/player.service';
import PlayerCard from '@/components/player/PlayerCard';
import PlayerFilters from '@/components/player/PlayerFilters';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function PlayersListPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ position: '', nationality: '', status: '' });

  const isAcademy = user?.role === 'ACADEMY';

  useEffect(() => {
    if (!isAcademy) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await playerService.listMyPlayers(filters);
        if (!cancelled) setPlayers(data.items || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Impossible de charger les joueurs.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters, isAcademy]);

  const filtered = useMemo(() => players, [players]);

  if (!isAcademy) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux academies."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Joueurs"
        subtitle="Gerez les profils sportifs de votre academie."
        action={
          <Link href="/dashboard/academy/players/new">
            <Button>Ajouter un joueur</Button>
          </Link>
        }
      />

      <PlayerFilters values={filters} onChange={setFilters} />

      {loading ? <LoadingState label="Chargement des joueurs..." /> : null}

      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title="Aucun joueur"
          message="Ajoutez votre premier joueur pour commencer."
          action={
            <Link href="/dashboard/academy/players/new">
              <Button>Ajouter un joueur</Button>
            </Link>
          }
        />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      ) : null}
    </div>
  );
}