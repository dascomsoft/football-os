'use client';

import { useCallback, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import adminService from '@/services/admin.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Textarea from '@/components/ui/Textarea';
import ProfileRow from '@/components/admin/ProfileRow';

const TABS = [
  { key: 'ACADEMY', label: 'Academies' },
  { key: 'CLUB', label: 'Clubs' },
  { key: 'COACH', label: 'Coachs' },
];

const STATUS_FILTERS = [
  { key: 'PENDING', label: 'En attente' },
  { key: '', label: 'Tous' },
  { key: 'APPROVED', label: 'Approuves' },
  { key: 'REQUESTED_INFO', label: 'Infos requises' },
  { key: 'REJECTED', label: 'Rejetes' },
  { key: 'SUSPENDED', label: 'Suspendus' },
  { key: 'BLOCKED', label: 'Bloques' },
];

const ACTION_LABELS = {
  APPROVED: 'Approuver',
  REJECTED: 'Rejeter',
  REQUESTED_INFO: 'Demander des informations',
  SUSPENDED: 'Suspendre',
  BLOCKED: 'Bloquer',
};

const REASON_REQUIRED = ['REJECTED', 'SUSPENDED', 'BLOCKED', 'REQUESTED_INFO'];
const DANGER_ACTIONS = ['REJECTED', 'SUSPENDED', 'BLOCKED'];

export default function AdminProfilesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [activeTab, setActiveTab] = useState('ACADEMY');
  const [activeStatus, setActiveStatus] = useState('PENDING');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const data = activeStatus
        ? await adminService.listProfilesByStatus(activeTab, activeStatus)
        : await adminService.listProfilesByStatus(activeTab);
      setProfiles(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, activeTab, activeStatus]);

  useEffect(() => {
    load();
  }, [load]);

  function openAction(profile, status) {
    setPendingAction({ profile, status });
    setReason('');
    setActionError('');
  }

  function closeAction() {
    if (submitting) return;
    setPendingAction(null);
    setReason('');
    setActionError('');
  }

  async function confirmAction() {
    if (!pendingAction) return;

    const { profile, status } = pendingAction;

    if (REASON_REQUIRED.includes(status) && !reason.trim()) {
      setActionError('Un motif est requis pour cette action.');
      return;
    }

    setSubmitting(true);
    setActionError('');

    try {
      await adminService.updateProfileStatus(activeTab, profile._id, {
        status,
        reason: reason.trim() || undefined,
      });
      setPendingAction(null);
      setReason('');
      await load();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.details?.[0]?.message ||
        'Action impossible.';
      setActionError(message);
    } finally {
      setSubmitting(false);
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
    pendingAction && REASON_REQUIRED.includes(pendingAction.status);
  const isDanger =
    pendingAction && DANGER_ACTIONS.includes(pendingAction.status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profils en attente"
        subtitle="Validez, rejetez ou demandez des informations sur les profils inscrits."
      />

      <div className="flex flex-wrap gap-2 border-b border-surface-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              setActiveStatus('PENDING');
            }}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-content-primary'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f.key || 'all'}
            size="sm"
            variant={activeStatus === f.key ? 'primary' : 'secondary'}
            onClick={() => setActiveStatus(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? <LoadingState label="Chargement des profils..." /> : null}

      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && !error && profiles.length === 0 ? (
        <EmptyState
          title="Aucun profil"
          message="Aucun profil ne correspond aux filtres selectionnes."
        />
      ) : null}

      {!loading && !error && profiles.length > 0 ? (
        <div className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <ProfileRow
              key={profile._id}
              profile={profile}
              busy={submitting}
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
              {ACTION_LABELS[pendingAction.status]}
            </h2>

            <p className="mt-2 text-sm text-content-secondary">
              {pendingAction.profile.name ||
                `${pendingAction.profile.firstName || ''} ${
                  pendingAction.profile.lastName || ''
                }`.trim() ||
                'Ce profil'}
            </p>

            {requiresReason ? (
              <div className="mt-4">
                <label className="text-sm font-medium text-content-secondary">
                  Motif
                </label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (actionError) setActionError('');
                  }}
                  placeholder="Expliquez brievement la raison."
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-content-secondary">
                Confirmez-vous cette action ?
              </p>
            )}

            {actionError ? (
              <p className="mt-3 text-sm text-state-danger">{actionError}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={closeAction}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                variant={isDanger ? 'danger' : 'primary'}
                onClick={confirmAction}
                loading={submitting}
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