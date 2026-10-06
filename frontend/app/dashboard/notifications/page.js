'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import notificationService from '@/services/notification.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const TYPE_LABELS = {
  SIGNUP_RECEIVED: 'Inscription recue',
  REQUEST_RECEIVED: 'Demande recue',
  REQUEST_APPROVED: 'Demande approuvee',
  REQUEST_REJECTED: 'Demande rejetee',
  REQUEST_INFO: 'Informations requises',
  PROPOSAL_RECEIVED: 'Proposition recue',
  PROPOSAL_RESPONSE: 'Reponse a une proposition',
};

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('fr-FR');
  } catch {
    return '-';
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.listNotifications();
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMarkRead(id) {
    setBusy(true);
    try {
      const data = await notificationService.markRead(id);
      setItems((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true, readAt: data.notification.readAt } : n
        )
      );
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkAllRead() {
    setBusy(true);
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        subtitle="Vos alertes recentes."
        action={
          hasUnread ? (
            <Button variant="secondary" onClick={handleMarkAllRead} disabled={busy}>
              Tout marquer comme lu
            </Button>
          ) : null
        }
      />

      {loading ? <LoadingState label="Chargement..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          message="Vous n'avez pas de notifications pour le moment."
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((n) => (
            <div
              key={n._id}
              className={`flex flex-col gap-2 rounded-md border p-4 ${
                n.read
                  ? 'border-surface-border bg-surface-raised'
                  : 'border-accent/30 bg-accent/5'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  {TYPE_LABELS[n.type] || n.type}
                </span>
                <span className="text-sm font-medium text-content-primary">
                  {n.title}
                </span>
                <span className="text-xs text-content-muted">
                  {formatDate(n.createdAt)}
                </span>
              </div>
              {n.message ? (
                <p className="text-sm text-content-secondary">{n.message}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                {!n.read ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkRead(n._id)}
                    disabled={busy}
                  >
                    Marquer comme lu
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}