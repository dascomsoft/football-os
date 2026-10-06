'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import adminCreationService from '@/services/admin-creation.service';
import PageHeader from '@/components/ui/PageHeader';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const POSITIONS = [
  { value: 'GK', label: 'Gardien' },
  { value: 'CB', label: 'Defenseur central' },
  { value: 'LB', label: 'Lateral gauche' },
  { value: 'RB', label: 'Lateral droit' },
  { value: 'CDM', label: 'Milieu defensif' },
  { value: 'CM', label: 'Milieu central' },
  { value: 'CAM', label: 'Milieu offensif' },
  { value: 'LW', label: 'Ailier gauche' },
  { value: 'RW', label: 'Ailier droit' },
  { value: 'ST', label: 'Attaquant' },
];

const COACH_ROLES = [
  { value: 'HEAD_COACH', label: 'Entraineur principal' },
  { value: 'ASSISTANT_COACH', label: 'Entraineur adjoint' },
  { value: 'GOALKEEPER_COACH', label: 'Entraineur des gardiens' },
  { value: 'FITNESS_COACH', label: 'Preparateur physique' },
  { value: 'YOUTH_COACH', label: 'Entraineur jeunes' },
  { value: 'ACADEMY_COACH', label: 'Entraineur academie' },
  { value: 'TECHNICAL_DIRECTOR', label: 'Directeur technique' },
  { value: 'ANALYST', label: 'Analyste' },
  { value: 'OTHER', label: 'Autre' },
];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    type: 'PLAYER',
    title: '',
    country: '',
    city: '',
    level: 'PROFESSIONAL',
    description: '',
    deadline: '',
    visibility: 'NETWORK',
    privateNotes: '',
    // PLAYER
    position: '',
    ageMin: '',
    ageMax: '',
    experienceMinPlayer: '',
    // COACH
    coachRole: '',
    experienceMinCoach: '',
  });

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = 'Titre requis';
    if (!values.country.trim()) next.country = 'Pays requis';
    if (values.type === 'PLAYER' && !values.position) next.position = 'Poste requis';
    if (values.type === 'COACH' && !values.coachRole) next.coachRole = 'Role requis';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    const payload = {
      type: values.type,
      title: values.title.trim(),
      country: values.country.trim(),
      level: values.level,
      visibility: values.visibility,
    };
    if (values.city.trim()) payload.city = values.city.trim();
    if (values.description.trim()) payload.description = values.description.trim();
    if (values.deadline) payload.deadline = values.deadline;
    if (values.privateNotes.trim()) payload.privateNotes = values.privateNotes.trim();

    if (values.type === 'PLAYER') {
      const criteria = { position: values.position };
      if (values.ageMin !== '') criteria.ageMin = Number(values.ageMin);
      if (values.ageMax !== '') criteria.ageMax = Number(values.ageMax);
      if (values.experienceMinPlayer !== '') {
        criteria.experienceMin = Number(values.experienceMinPlayer);
      }
      payload.criteria = criteria;
      payload.category = 'RECRUITMENT';
    } else {
      const criteria = { role: values.coachRole };
      if (values.experienceMinCoach !== '') {
        criteria.experienceMin = Number(values.experienceMinCoach);
      }
      payload.criteria = criteria;
      payload.category = values.coachRole;
    }

    try {
      await adminCreationService.createOpportunity(payload);
      router.push('/dashboard/admin/opportunities');
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.details?.[0]?.message ||
          'Creation impossible.'
      );
      setSubmitting(false);
    }
  }

  if (user?.role !== 'ADMIN') {
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
        title="Nouvelle opportunite"
        subtitle="Publiez une opportunite detectee en dehors de la plateforme."
      />

      {serverError ? <ErrorState message={serverError} /> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Informations generales
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Type"
              value={values.type}
              onChange={(e) => {
                setField('type', e.target.value);
                setField('position', '');
                setField('coachRole', '');
              }}
              options={[
                { value: 'PLAYER', label: 'Joueur' },
                { value: 'COACH', label: 'Coach' },
              ]}
            />
            <Input
              label="Titre"
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              error={errors.title}
            />
            <Input
              label="Pays"
              value={values.country}
              onChange={(e) => setField('country', e.target.value)}
              error={errors.country}
            />
            <Input
              label="Ville (optionnel)"
              value={values.city}
              onChange={(e) => setField('city', e.target.value)}
            />
            <Select
              label="Niveau"
              value={values.level}
              onChange={(e) => setField('level', e.target.value)}
              options={[
                { value: 'AMATEUR', label: 'Amateur' },
                { value: 'SEMI_PRO', label: 'Semi-professionnel' },
                { value: 'PROFESSIONAL', label: 'Professionnel' },
                { value: 'ELITE', label: 'Elite' },
              ]}
            />
            <Input
              label="Deadline (optionnel)"
              type="date"
              value={values.deadline}
              onChange={(e) => setField('deadline', e.target.value)}
            />
            <Select
              label="Visibilite"
              value={values.visibility}
              onChange={(e) => setField('visibility', e.target.value)}
              options={[
                { value: 'NETWORK', label: 'Reseau professionnel (anonymise)' },
                { value: 'PROFESSIONAL', label: 'Professionnel (ville visible)' },
                { value: 'ADMIN_ONLY', label: 'Administrateur uniquement' },
              ]}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              rows={3}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Notes privees (non visibles)"
              rows={2}
              value={values.privateNotes}
              onChange={(e) => setField('privateNotes', e.target.value)}
            />
          </div>
        </section>

        {values.type === 'PLAYER' ? (
          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-4 text-sm font-medium text-content-primary">
              Criteres joueur
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Poste"
                value={values.position}
                onChange={(e) => setField('position', e.target.value)}
                options={POSITIONS}
                placeholder="Selectionner"
                error={errors.position}
              />
              <Input
                label="Age minimum"
                type="number"
                min="10"
                max="50"
                value={values.ageMin}
                onChange={(e) => setField('ageMin', e.target.value)}
              />
              <Input
                label="Age maximum"
                type="number"
                min="10"
                max="50"
                value={values.ageMax}
                onChange={(e) => setField('ageMax', e.target.value)}
              />
              <Input
                label="Experience minimum (annees)"
                type="number"
                min="0"
                max="30"
                value={values.experienceMinPlayer}
                onChange={(e) => setField('experienceMinPlayer', e.target.value)}
              />
            </div>
          </section>
        ) : (
          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-4 text-sm font-medium text-content-primary">
              Criteres coach
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Role"
                value={values.coachRole}
                onChange={(e) => setField('coachRole', e.target.value)}
                options={COACH_ROLES}
                placeholder="Selectionner"
                error={errors.coachRole}
              />
              <Input
                label="Experience minimum (annees)"
                type="number"
                min="0"
                max="40"
                value={values.experienceMinCoach}
                onChange={(e) => setField('experienceMinCoach', e.target.value)}
              />
            </div>
          </section>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/admin/create')}
          >
            Annuler
          </Button>
          <Button type="submit" loading={submitting}>
            Creer l&apos;opportunite
          </Button>
        </div>
      </form>
    </div>
  );
}