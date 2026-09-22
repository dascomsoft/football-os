'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import opportunityService from '@/services/opportunity.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const ALLOWED_ROLES = ['ACADEMY', 'CLUB', 'COACH'];

const TYPE_LABELS = {
  PLAYER: 'Joueur',
  COACH: 'Coach',
};

const LEVEL_LABELS = {
  AMATEUR: 'Amateur',
  SEMI_PRO: 'Semi-professionnel',
  PROFESSIONAL: 'Professionnel',
  ELITE: 'Elite',
};

const POSITION_LABELS = {
  GK: 'Gardien', CB: 'Defenseur central', LB: 'Lateral gauche', RB: 'Lateral droit',
  LWB: 'Piston gauche', RWB: 'Piston droit', CDM: 'Milieu defensif', CM: 'Milieu central',
  CAM: 'Milieu offensif', LM: 'Milieu gauche', RM: 'Milieu droit', LW: 'Ailier gauche',
  RW: 'Ailier droit', CF: 'Avant-centre', ST: 'Attaquant',
};

const COACH_ROLE_LABELS = {
  HEAD_COACH: 'Entraineur principal',
  ASSISTANT_COACH: 'Entraineur adjoint',
  GOALKEEPER_COACH: 'Entraineur des gardiens',
  FITNESS_COACH: 'Preparateur physique',
  YOUTH_COACH: 'Entraineur jeunes',
  ACADEMY_COACH: 'Entraineur academie',
  TECHNICAL_DIRECTOR: 'Directeur technique',
  ANALYST: 'Analyste',
  OTHER: 'Autre',
};

const FOOT_LABELS = {
  LEFT: 'Gauche',
  RIGHT: 'Droit',
  BOTH: 'Les deux',
};

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-2 last:border-b-0">
      <span className="text-sm text-content-secondary">{label}</span>
      <span className="text-sm text-content-primary">{value}</span>
    </div>
  );
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const isAllowed = ALLOWED_ROLES.includes(user?.role);

  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAllowed || !params?.id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await opportunityService.getOpportunity(params.id);
        if (!cancelled) setOpp(data.opportunity);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Opportunite introuvable.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAllowed, params?.id]);

  if (!isAllowed) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux academies, clubs et coachs."
      />
    );
  }

  if (loading) return <LoadingState label="Chargement..." />;
  if (error) return <ErrorState message={error} />;
  if (!opp) return null;

  const criteria = opp.criteria || {};

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={opp.title}
        subtitle={`Reference ${opp.reference}`}
        action={
          <Link href="/dashboard/opportunities">
            <Button variant="secondary">Retour</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Informations generales
          </h2>
          <Row label="Reference" value={opp.reference} />
          <Row label="Type" value={TYPE_LABELS[opp.type] || opp.type} />
          <Row label="Pays" value={opp.country} />
          {opp.city ? <Row label="Ville" value={opp.city} /> : null}
          <Row label="Niveau" value={LEVEL_LABELS[opp.level] || opp.level} />
          <Row label="Deadline" value={formatDate(opp.deadline)} />
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Criteres
          </h2>
          {opp.type === 'PLAYER' ? (
            <>
              <Row label="Poste" value={POSITION_LABELS[criteria.position] || criteria.position} />
              <Row label="Pied prefere" value={FOOT_LABELS[criteria.preferredFoot] || criteria.preferredFoot} />
              <Row label="Age" value={
                criteria.ageMin || criteria.ageMax
                  ? `${criteria.ageMin || '?'} - ${criteria.ageMax || '?'}`
                  : ''
              } />
              <Row label="Taille minimum" value={criteria.heightMin ? `${criteria.heightMin} cm` : ''} />
              <Row label="Experience minimum" value={
                criteria.experienceMin !== undefined ? `${criteria.experienceMin} ans` : ''
              } />
            </>
          ) : (
            <>
              <Row label="Role" value={COACH_ROLE_LABELS[criteria.role] || criteria.role} />
              <Row label="Licence" value={criteria.license} />
              <Row label="Experience minimum" value={
                criteria.experienceMin !== undefined ? `${criteria.experienceMin} ans` : ''
              } />
              <Row label="Langues" value={
                Array.isArray(criteria.language) && criteria.language.length > 0
                  ? criteria.language.join(', ')
                  : ''
              } />
              <Row label="Categorie" value={criteria.category} />
            </>
          )}
        </section>

        {opp.description ? (
          <section className="rounded-md border border-surface-border bg-surface-raised p-4 md:col-span-2">
            <h2 className="mb-2 text-sm font-medium text-content-primary">
              Description
            </h2>
            <p className="text-sm text-content-secondary">{opp.description}</p>
          </section>
        ) : null}

        <section className="rounded-md border border-dashed border-surface-border bg-surface-raised p-4 md:col-span-2">
          <h2 className="mb-2 text-sm font-medium text-content-primary">
            Presentation mediee
          </h2>
          <p className="text-sm text-content-secondary">
            Pour manifester votre interet sur cette opportunite, contactez
            l&apos;administrateur. La mise en relation est controlee.
          </p>
        </section>
      </div>
    </div>
  );
}