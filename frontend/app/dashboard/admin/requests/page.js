'use client';

import { useCallback, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import adminRequestService from '@/services/admin-request.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import RequestRow from '@/components/admin/RequestRow';

const STATUS_FILTERS = [
  { key: 'PENDING', label: 'En attente' },
  { key: 'REQUESTED_INFO', label: 'Infos requises' },
  { key: '', label: 'Toutes' },
  { key: 'APPROVED', label: 'Approuvees' },
  { key: 'REJECTED', label: 'Rejetees' },
  { key: 'CANCELLED', label: 'Annulees' },
];

const TYPE_FILTERS = [
  { value: '', label: 'Tous les types' },
  { value: 'PLAYER', label: 'Joueur' },
  { value: 'COACH', label: 'Coach' },
];

const VISIBILITY_OPTIONS = [
  { value: 'NETWORK', label: 'Reseau professionnel (anonymise)' },
  { value: 'PROFESSIONAL', label: 'Professionnel (ville visible)' },
  { value: 'PARTNER', label: 'Partenaire' },
  { value: 'ADMIN_ONLY', label: 'Administrateur uniquement' },
];

const ACTION_LABELS = {
  APPROVED: 'Approuver',
  REJECTED: 'Rejeter',
  REQUESTED_INFO: 'Demander des informations',
};

const REASON_REQUIRED = ['REJECTED', 'REQUESTED_INFO'];

export default function AdminRequestsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [typeFilter, setTypeFilter] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState('');
  const [visibility, setVisibility] = useState('NETWORK');
  const [privateNotes, setPrivateNotes] = useState('');
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const data = await adminRequestService.listRequests({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, statusFilter, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function openAction(request, action) {
    setPendingAction({ request, action });
    setReason('');
    setVisibility('NETWORK');
    setPrivateNotes('');
    setActionError('');
  }

  function closeAction() {
    if (busy) return;
    setPendingAction(null);
    setReason('');
    setPrivateNotes('');
    setActionError('');
  }

  async function confirmAction() {
    if (!pendingAction) return;

    const { request, action } = pendingAction;

    if (REASON_REQUIRED.includes(action) && !reason.trim()) {
      setActionError('Un motif est requis pour cette action.');
      return;
    }

    setBusy(true);
    setActionError('');

    try {
      if (action === 'APPROVED') {
        await adminRequestService.approveRequest(request._id, {
          visibility,
          privateNotes: privateNotes.trim() || undefined,
        });
      } else if (action === 'REJECTED') {
        await adminRequestService.rejectRequest(request._id, {
          reason: reason.trim(),
        });
      } else if (action === 'REQUESTED_INFO') {
        await adminRequestService.requestInfo(request._id, {
          reason: reason.trim(),
        });
      }

      setPendingAction(null);
      await load();
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Action impossible.'
      );
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
    pendingAction && REASON_REQUIRED.includes(pendingAction.action);
  const isApproval = pendingAction && pendingAction.action === 'APPROVED';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Demandes de recrutement"
        subtitle="Validez les demandes des clubs et coachs pour creer des opportunites."
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

      <div className="max-w-xs">
        <Select
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={TYPE_FILTERS}
        />
      </div>

      {loading ? <LoadingState label="Chargement des demandes..." /> : null}

      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Aucune demande"
          message="Aucune demande ne correspond aux filtres selectionnes."
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((request) => (
            <RequestRow
              key={request._id}
              request={request}
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
              {ACTION_LABELS[pendingAction.action]}
            </h2>

            <p className="mt-2 text-sm text-content-secondary">
              {pendingAction.request.title}
            </p>

            {isApproval ? (
              <div className="mt-4 flex flex-col gap-3">
                <Select
                  label="Visibilite"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  options={VISIBILITY_OPTIONS}
                />
                <Textarea
                  label="Notes privees (optionnel)"
                  rows={3}
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Notes internes, non visibles par les roles."
                />
              </div>
            ) : null}

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
                  placeholder="Expliquez brievement la raison."
                />
              </div>
            ) : null}

            {!requiresReason && !isApproval ? (
              <p className="mt-4 text-sm text-content-secondary">
                Confirmez-vous cette action ?
              </p>
            ) : null}

            {actionError ? (
              <p className="mt-3 text-sm text-state-danger">{actionError}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeAction} disabled={busy}>
                Annuler
              </Button>
              <Button
                variant={
                  pendingAction.action === 'REJECTED' ? 'danger' : 'primary'
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