'use client';

import { useCallback, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import proposalService from '@/services/proposal.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import AdminProposalRow from '@/components/proposal/AdminProposalRow';

const STATUS_FILTERS = [
  { key: '', label: 'Toutes' },
  { key: 'DRAFT', label: 'Brouillons' },
  { key: 'SENT', label: 'Envoyees' },
  { key: 'VIEWED', label: 'Vues' },
  { key: 'INTERESTED', label: 'Interesse' },
  { key: 'DECLINED', label: 'Refusees' },
  { key: 'CLOSED', label: 'Fermees' },
];

export default function AdminProposalsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState('');
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const data = await proposalService.listAdminProposals({
        status: statusFilter || undefined,
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function openAction(proposal, action) {
    setPendingAction({ proposal, action });
    setReason('');
    setActionError('');
  }

  function closeAction() {
    if (busy) return;
    setPendingAction(null);
    setReason('');
    setActionError('');
  }

  async function confirmAction() {
    if (!pendingAction) return;

    const { proposal, action } = pendingAction;

    setBusy(true);
    setActionError('');

    try {
      if (action === 'SEND') {
        await proposalService.sendProposal(proposal.proposal._id);
      } else if (action === 'CLOSE') {
        if (!reason.trim()) {
          setActionError('Un motif est requis pour fermer.');
          setBusy(false);
          return;
        }
        await proposalService.closeProposal(proposal.proposal._id, {
          reason: reason.trim(),
        });
      }
      setPendingAction(null);
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Action impossible.');
    } finally {
      setBusy(false);
    }
  }

  if (!isAdmin) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  const requiresReason =
    pendingAction && pendingAction.action === 'CLOSE';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Propositions"
        subtitle="Presentez des candidats aux clubs, suivez leurs reponses."
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
          title="Aucune proposition"
          message="Creez une proposition depuis la page d'une opportunite."
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((view) => (
            <AdminProposalRow
              key={view.proposal._id}
              proposal={view}
              busy={busy}
              onAction={openAction}
            />
          ))}
        </div>
      ) : null}

      {pendingAction ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeAction}
        >
          <div
            className="w-full max-w-md rounded-lg border border-surface-border bg-surface-raised p-5 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-content-primary">
              {pendingAction.action === 'SEND'
                ? 'Envoyer la proposition'
                : 'Fermer la proposition'}
            </h2>

            <p className="mt-2 text-sm text-content-secondary">
              {pendingAction.proposal.proposal.reference}
            </p>

            {requiresReason ? (
              <div className="mt-4">
                <Textarea
                  label="Motif"
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (actionError) setActionError('');
                  }}
                  placeholder="Raison de la fermeture."
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-content-secondary">
                La proposition sera visible par le club destinataire.
              </p>
            )}

            {actionError ? (
              <p className="mt-3 text-sm text-state-danger">{actionError}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeAction} disabled={busy}>
                Annuler
              </Button>
              <Button
                variant={
                  pendingAction.action === 'CLOSE' ? 'danger' : 'primary'
                }
                onClick={confirmAction}
                loading={busy}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}