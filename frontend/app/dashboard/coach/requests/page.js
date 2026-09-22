'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import recruitmentRequestService from '@/services/recruitment-request.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import OwnRequestCard from '@/components/request/OwnRequestCard';

const STATUS_FILTERS = [
  { key: '', label: 'Toutes' },
  { key: 'PENDING', label: 'En attente' },
  { key: 'APPROVED', label: 'Approuvees' },
  { key: 'REJECTED', label: 'Rejetees' },
  { key: 'REQUESTED_INFO', label: 'Infos requises' },
  { key: 'CANCELLED', label: 'Annulees' },
];

export default function CoachRequestsPage() {
  const { user } = useAuth();
  const isCoach = user?.role === 'COACH';

  const [statusFilter, setStatusFilter] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!isCoach) return;
    setLoading(true);
    setError('');
    try {
      const data = await recruitmentRequestService.listMyRequests({
        status: statusFilter || undefined,
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isCoach, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel() {
    if (!toCancel) return;
    setBusy(true);
    try {
      await recruitmentRequestService.cancelRequest(toCancel._id);
      setToCancel(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Annulation impossible.');
    } finally {
      setBusy(false);
    }
  }

  if (!isCoach) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux coachs."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ma recherche"
        subtitle="Exprimez votre recherche de poste. L'administrateur la validera avant publication anonymisee."
        action={
          <Link href="/dashboard/coach/requests/new">
            <Button>Nouvelle recherche</Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f.key || 'all'}
            size="sm"
            variant={statusFilter === f.key ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? <LoadingState label="Chargement..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Aucune recherche"
          message="Creez votre premiere demande de poste."
          action={
            <Link href="/dashboard/coach/requests/new">
              <Button>Nouvelle recherche</Button>
            </Link>
          }
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((request) => (
            <OwnRequestCard
              key={request._id}
              request={request}
              busy={busy}
              onCancel={setToCancel}
            />
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Annuler cette recherche"
        message="La recherche sera marquee comme annulee et ne sera plus traitee."
        confirmLabel="Annuler"
        danger
        loading={busy}
        onConfirm={handleCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}