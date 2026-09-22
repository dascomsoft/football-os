'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import opportunityService from '@/services/opportunity.service';
import OpportunityCard from '@/components/opportunity/OpportunityCard';
import OpportunityFilters from '@/components/opportunity/OpportunityFilters';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const ALLOWED_ROLES = ['ACADEMY', 'CLUB', 'COACH'];

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const isAllowed = ALLOWED_ROLES.includes(user?.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', country: '', level: '' });

  useEffect(() => {
    if (!isAllowed) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await opportunityService.listOpportunities(filters);
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
  }, [isAllowed, filters]);

  if (!isAllowed) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux academies, clubs et coachs."
      />
    );
  }

  const showType = user?.role === 'CLUB';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Opportunites"
        subtitle="Opportunites publiees par l'administrateur. Les informations sensibles restent privees."
      />

      <OpportunityFilters values={filters} onChange={setFilters} showType={showType} />

      {loading ? <LoadingState label="Chargement des opportunites..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="Aucune opportunite"
          message="Aucune opportunite ne correspond aux filtres selectionnes."
        />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      ) : null}
    </div>
  );
}