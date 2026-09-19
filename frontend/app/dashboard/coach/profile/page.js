'use client';

import { useCallback, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import coachService from '@/services/coach.service';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

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

const AVAILABILITY = [
  { value: 'UNDER_CONTRACT', label: 'Sous contrat' },
  { value: 'AVAILABLE_NOW', label: 'Disponible immediatement' },
  { value: 'AVAILABLE_FROM', label: 'Disponible a partir d\'une date' },
  { value: 'OPEN_TO_OFFERS', label: 'Ouvert aux offres' },
  { value: 'NOT_AVAILABLE', label: 'Non disponible' },
];

function arrayToText(arr) {
  return Array.isArray(arr) ? arr.join(', ') : '';
}

function textToArray(text) {
  return String(text || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CoachProfilePage() {
  const { user } = useAuth();
  const isCoach = user?.role === 'COACH';

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const [values, setValues] = useState(null);

  const load = useCallback(async () => {
    if (!isCoach) return;
    setLoading(true);
    setError('');
    try {
      const data = await coachService.getMyCoach();
      setCoach(data.coach);
      setValues({
        firstName: data.coach.firstName || '',
        lastName: data.coach.lastName || '',
        nationality: data.coach.nationality || '',
        countryOfResidence: data.coach.countryOfResidence || '',
        city: data.coach.city || '',
        languages: arrayToText(data.coach.languages),
        primaryRole: data.coach.primaryRole || '',
        secondaryRole: data.coach.secondaryRole || '',
        yearsOfExperience: data.coach.yearsOfExperience ?? '',
        licenses: arrayToText(data.coach.licenses),
        diplomas: arrayToText(data.coach.diplomas),
        specializations: arrayToText(data.coach.specializations),
        philosophy: data.coach.philosophy || '',
        competitions: arrayToText(data.coach.competitions),
        achievements: arrayToText(data.coach.achievements),
        availabilityStatus: data.coach.availability?.status || 'OPEN_TO_OFFERS',
        availabilityFrom: data.coach.availability?.availableFrom
          ? String(data.coach.availability.availableFrom).slice(0, 10)
          : '',
        activelyLooking: Boolean(data.coach.availability?.activelyLooking),
        openToInternational: Boolean(data.coach.availability?.openToInternational),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, [isCoach]);

  useEffect(() => {
    load();
  }, [load]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setServerError('');

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      nationality: values.nationality.trim(),
      countryOfResidence: values.countryOfResidence.trim(),
      city: values.city.trim(),
      languages: textToArray(values.languages),
      primaryRole: values.primaryRole,
      licenses: textToArray(values.licenses),
      diplomas: textToArray(values.diplomas),
      specializations: textToArray(values.specializations),
      philosophy: values.philosophy,
      competitions: textToArray(values.competitions),
      achievements: textToArray(values.achievements),
      availability: {
        status: values.availabilityStatus,
        activelyLooking: values.activelyLooking,
        openToInternational: values.openToInternational,
      },
    };

    if (values.secondaryRole) payload.secondaryRole = values.secondaryRole;
    if (values.yearsOfExperience !== '') {
      payload.yearsOfExperience = Number(values.yearsOfExperience);
    }
    if (values.availabilityFrom) {
      payload.availability.availableFrom = values.availabilityFrom;
    }

    try {
      const data = await coachService.updateMyCoach(payload);
      setCoach(data.coach);
      setEditing(false);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Enregistrement impossible.'
      );
    } finally {
      setSubmitting(false);
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

  if (loading) return <LoadingState label="Chargement du profil..." />;
  if (error) return <ErrorState message={error} />;
  if (!coach || !values) return null;

  if (!editing) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mon profil"
          subtitle="Profil professionnel visible par l'administrateur."
          action={<Button onClick={() => setEditing(true)}>Modifier</Button>}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-2 text-sm font-medium text-content-primary">Identite</h2>
            <p className="text-sm text-content-secondary">Nom</p>
            <p className="text-sm text-content-primary">{coach.firstName} {coach.lastName}</p>
            <p className="mt-2 text-sm text-content-secondary">Nationalite</p>
            <p className="text-sm text-content-primary">{coach.nationality || '-'}</p>
            <p className="mt-2 text-sm text-content-secondary">Pays de residence</p>
            <p className="text-sm text-content-primary">{coach.countryOfResidence || '-'}</p>
          </section>

          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-2 text-sm font-medium text-content-primary">Profil pro</h2>
            <p className="text-sm text-content-secondary">Role principal</p>
            <p className="text-sm text-content-primary">{coach.primaryRole}</p>
            <p className="mt-2 text-sm text-content-secondary">Experience</p>
            <p className="text-sm text-content-primary">{coach.yearsOfExperience} ans</p>
            <p className="mt-2 text-sm text-content-secondary">Disponibilite</p>
            <p className="text-sm text-content-primary">{coach.availability?.status}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Modifier mon profil" subtitle="Mettez a jour vos informations." />

      {serverError ? <ErrorState message={serverError} /> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">Identite</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Prenom" value={values.firstName} onChange={(e) => setField('firstName', e.target.value)} />
            <Input label="Nom" value={values.lastName} onChange={(e) => setField('lastName', e.target.value)} />
            <Input label="Nationalite" value={values.nationality} onChange={(e) => setField('nationality', e.target.value)} />
            <Input label="Pays de residence" value={values.countryOfResidence} onChange={(e) => setField('countryOfResidence', e.target.value)} />
            <Input label="Ville" value={values.city} onChange={(e) => setField('city', e.target.value)} />
            <Input label="Langues (separees par virgule)" value={values.languages} onChange={(e) => setField('languages', e.target.value)} />
          </div>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">Profil professionnel</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Role principal" value={values.primaryRole} onChange={(e) => setField('primaryRole', e.target.value)} options={COACH_ROLES} />
            <Select label="Role secondaire" value={values.secondaryRole} onChange={(e) => setField('secondaryRole', e.target.value)} options={COACH_ROLES} placeholder="Aucun" />
            <Input label="Annees d'experience" type="number" min="0" max="60" value={values.yearsOfExperience} onChange={(e) => setField('yearsOfExperience', e.target.value)} />
            <Input label="Licences (separees par virgule)" value={values.licenses} onChange={(e) => setField('licenses', e.target.value)} />
            <Input label="Diplomes (separes par virgule)" value={values.diplomas} onChange={(e) => setField('diplomas', e.target.value)} />
            <Input label="Specialisations (separes par virgule)" value={values.specializations} onChange={(e) => setField('specializations', e.target.value)} />
          </div>
          <div className="mt-4">
            <Textarea label="Philosophie de jeu" value={values.philosophy} onChange={(e) => setField('philosophy', e.target.value)} />
          </div>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">Palmares et competitions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Competitions (separees par virgule)" value={values.competitions} onChange={(e) => setField('competitions', e.target.value)} />
            <Input label="Palmares (separe par virgule)" value={values.achievements} onChange={(e) => setField('achievements', e.target.value)} />
          </div>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">Disponibilite</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Statut" value={values.availabilityStatus} onChange={(e) => setField('availabilityStatus', e.target.value)} options={AVAILABILITY} />
            <Input label="Disponible a partir de" type="date" value={values.availabilityFrom} onChange={(e) => setField('availabilityFrom', e.target.value)} />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-content-secondary">
              <input type="checkbox" checked={values.activelyLooking} onChange={(e) => setField('activelyLooking', e.target.checked)} />
              Recherche active
            </label>
            <label className="flex items-center gap-2 text-sm text-content-secondary">
              <input type="checkbox" checked={values.openToInternational} onChange={(e) => setField('openToInternational', e.target.checked)} />
              Ouvert aux opportunites internationales
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Annuler</Button>
          <Button type="submit" loading={submitting}>Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}