'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminOpportunitiesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/admin/opportunities');
        if (!cancelled) setItems(data.items || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Chargement impossible.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunites"
        subtitle="Opportunites creees a partir des demandes approuvees."
      />

      {loading ? <LoadingState label="Chargement..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Aucune opportunite"
          message="Aucune opportunite n'a encore ete creee."
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((opp) => (
            <div
              key={opp._id}
              className="flex flex-col gap-2 rounded-md border border-surface-border bg-surface-raised p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  {opp.reference}
                </span>
                <span className="text-sm font-medium text-content-primary">
                  {opp.title}
                </span>
                <StatusBadge status={opp.status} />
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  {opp.type}
                </span>
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  Visibilite : {opp.visibility}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
                <span>{opp.country}</span>
                {opp.city ? <span>{opp.city}</span> : null}
                <span>{opp.level}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}