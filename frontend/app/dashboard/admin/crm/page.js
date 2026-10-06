'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import contactService from '@/services/contact.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const TYPE_FILTERS = [
  { value: '', label: 'Tous les types' },
  { value: 'CLUB', label: 'Clubs' },
  { value: 'ACADEMY', label: 'Academies' },
  { value: 'SCOUT', label: 'Scouts' },
  { value: 'AGENT', label: 'Agents' },
  { value: 'COACH', label: 'Coachs' },
  { value: 'SPORTING_DIRECTOR', label: 'Directeurs sportifs' },
  { value: 'RECRUITER', label: 'Recruteurs' },
  { value: 'OTHER', label: 'Autres' },
];

const STATUS_FILTERS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'PROSPECT', label: 'Prospects' },
  { value: 'ACTIVE', label: 'Actifs' },
  { value: 'INACTIVE', label: 'Inactifs' },
  { value: 'CLOSED', label: 'Fermes' },
];

const TYPE_LABELS = {
  CLUB: 'Club',
  ACADEMY: 'Academie',
  SCOUT: 'Scout',
  AGENT: 'Agent',
  COACH: 'Coach',
  SPORTING_DIRECTOR: 'Directeur sportif',
  RECRUITER: 'Recruteur',
  OTHER: 'Autre',
};

const STATUS_LABELS = {
  PROSPECT: 'Prospect',
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  CLOSED: 'Ferme',
};

export default function AdminCrmPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hideAutoCreated, setHideAutoCreated] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    relationshipStatus: '',
    search: '',
  });

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const data = await contactService.listContacts({
        type: filters.type || undefined,
        relationshipStatus: filters.relationshipStatus || undefined,
        search: filters.search || undefined,
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, filters]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isAdmin) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  const visibleItems = hideAutoCreated
    ? items.filter((c) => !c.autoCreated)
    : items;

  const autoCount = items.filter((c) => c.autoCreated).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="CRM prive"
        subtitle="Votre carnet professionnel. Ces donnees ne sont visibles que par vous."
        action={
          <Link href="/dashboard/admin/crm/new">
            <Button>Nouveau contact</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          label="Type"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          options={TYPE_FILTERS}
        />
        <Select
          label="Statut"
          value={filters.relationshipStatus}
          onChange={(e) =>
            setFilters({ ...filters, relationshipStatus: e.target.value })
          }
          options={STATUS_FILTERS}
        />
        <Input
          label="Recherche"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Nom, contact, email"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-surface-border bg-surface-raised px-4 py-2 text-xs text-content-secondary">
        <span>
          {autoCount > 0
            ? `${autoCount} fiche(s) auto-creee(s) depuis les inscriptions.`
            : 'Aucune fiche auto-creee.'}
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-content-secondary">
          <input
            type="checkbox"
            checked={hideAutoCreated}
            onChange={(e) => setHideAutoCreated(e.target.checked)}
          />
          Masquer les fiches auto-creees
        </label>
      </div>

      {loading ? <LoadingState label="Chargement du CRM..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <EmptyState
          title="Aucun contact"
          message="Ajoutez votre premier contact dans le CRM."
          action={
            <Link href="/dashboard/admin/crm/new">
              <Button>Nouveau contact</Button>
            </Link>
          }
        />
      ) : null}

      {!loading && !error && visibleItems.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visibleItems.map((c) => (
            <Link
              key={c._id}
              href={`/dashboard/admin/crm/${c._id}`}
              className="flex flex-col gap-2 rounded-md border border-surface-border bg-surface-raised p-4 transition-colors hover:border-accent/40 hover:bg-surface-overlay"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-content-primary">
                  {c.organizationName}
                </span>
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  {TYPE_LABELS[c.type] || c.type}
                </span>
                <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                  {STATUS_LABELS[c.relationshipStatus] || c.relationshipStatus}
                </span>
                {c.autoCreated ? (
                  <span className="rounded-md bg-state-info/15 px-2 py-0.5 text-xs text-state-info">
                    Auto-cree
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
                {c.country ? <span>{c.country}</span> : null}
                {c.city ? <span>{c.city}</span> : null}
                {c.contactName ? <span>{c.contactName}</span> : null}
                {c.contactRole ? <span>{c.contactRole}</span> : null}
              </div>
              {Array.isArray(c.tags) && c.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}