'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/api';
import adminCreationService from '@/services/admin-creation.service';
import PageHeader from '@/components/ui/PageHeader';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

const POSITIONS = [
  { value: 'GK', label: 'Gardien (GK)' },
  { value: 'CB', label: 'Defenseur central (CB)' },
  { value: 'LB', label: 'Lateral gauche (LB)' },
  { value: 'RB', label: 'Lateral droit (RB)' },
  { value: 'CDM', label: 'Milieu defensif (CDM)' },
  { value: 'CM', label: 'Milieu central (CM)' },
  { value: 'CAM', label: 'Milieu offensif (CAM)' },
  { value: 'LW', label: 'Ailier gauche (LW)' },
  { value: 'RW', label: 'Ailier droit (RW)' },
  { value: 'ST', label: 'Attaquant (ST)' },
];

const FEET = [
  { value: 'LEFT', label: 'Gauche' },
  { value: 'RIGHT', label: 'Droit' },
  { value: 'BOTH', label: 'Les deux' },
];

const VISIBILITIES = [
  { value: 'ADMIN_ONLY', label: 'Prive (administrateur uniquement)' },
  { value: 'PARTNER', label: 'Partenaire' },
  { value: 'NETWORK', label: 'Reseau professionnel' },
  { value: 'PROFESSIONAL', label: 'Professionnel' },
  { value: 'PRESENTATION', label: 'Presentation autorisee' },
];

export default function CreatePlayerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    academyId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    gender: 'MALE',
    position: '',
    secondaryPosition: '',
    preferredFoot: 'RIGHT',
    height: '',
    weight: '',
    experienceYears: '',
    currentClub: '',
    photoUrl: '',
    visibility: 'ADMIN_ONLY',
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError('');
      try {
        const { data } = await api.get('/admin/profiles/ACADEMY', {
          params: { status: 'APPROVED' },
        });
        if (!cancelled) {
          setAcademies(
            (data.items || []).map((a) => ({
              value: a._id,
              label: a.name + (a.country ? ` - ${a.country}` : ''),
            }))
          );
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err.response?.data?.message || 'Chargement des academies impossible.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (!values.academyId) next.academyId = 'Academie requise';
    if (!values.firstName.trim()) next.firstName = 'Prenom requis';
    if (!values.lastName.trim()) next.lastName = 'Nom requis';
    if (!values.dateOfBirth) next.dateOfBirth = 'Date requise';
    if (!values.nationality.trim()) next.nationality = 'Nationalite requise';
    if (!values.position) next.position = 'Poste requis';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    const payload = {
      academyId: values.academyId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth,
      nationality: values.nationality.trim(),
      gender: values.gender,
      position: values.position,
      preferredFoot: values.preferredFoot,
      visibility: values.visibility,
    };
    if (values.secondaryPosition) payload.secondaryPosition = values.secondaryPosition;
    if (values.height !== '') payload.height = Number(values.height);
    if (values.weight !== '') payload.weight = Number(values.weight);
    if (values.experienceYears !== '') payload.experienceYears = Number(values.experienceYears);
    if (values.currentClub.trim()) payload.currentClub = values.currentClub.trim();
    if (values.photoUrl.trim()) payload.photoUrl = values.photoUrl.trim();

    try {
      await adminCreationService.createPlayer(payload);
      router.push('/dashboard/admin/create');
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

  if (loading) return <LoadingState label="Chargement..." />;
  if (loadError) return <ErrorState message={loadError} />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nouveau joueur"
        subtitle="Ajoutez un joueur pour une academie existante."
      />

      {serverError ? <ErrorState message={serverError} /> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Academie
          </h2>
          <Select
            label="Academie proprietaire"
            value={values.academyId}
            onChange={(e) => setField('academyId', e.target.value)}
            options={academies}
            placeholder="Selectionner une academie"
            error={errors.academyId}
          />
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Identite
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Prenom"
              value={values.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Nom"
              value={values.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              error={errors.lastName}
            />
            <Input
              label="Date de naissance"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => setField('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />
            <Input
              label="Nationalite"
              value={values.nationality}
              onChange={(e) => setField('nationality', e.target.value)}
              error={errors.nationality}
            />
            <Select
              label="Genre"
              value={values.gender}
              onChange={(e) => setField('gender', e.target.value)}
              options={[
                { value: 'MALE', label: 'Masculin' },
                { value: 'FEMALE', label: 'Feminin' },
              ]}
            />
          </div>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Profil sportif
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Poste principal"
              value={values.position}
              onChange={(e) => setField('position', e.target.value)}
              options={POSITIONS}
              placeholder="Selectionner"
              error={errors.position}
            />
            <Select
              label="Poste secondaire (optionnel)"
              value={values.secondaryPosition}
              onChange={(e) => setField('secondaryPosition', e.target.value)}
              options={POSITIONS}
              placeholder="Aucun"
            />
            <Select
              label="Pied prefere"
              value={values.preferredFoot}
              onChange={(e) => setField('preferredFoot', e.target.value)}
              options={FEET}
            />
            <Input
              label="Taille (cm)"
              type="number"
              min="100"
              max="250"
              value={values.height}
              onChange={(e) => setField('height', e.target.value)}
            />
            <Input
              label="Poids (kg)"
              type="number"
              min="30"
              max="150"
              value={values.weight}
              onChange={(e) => setField('weight', e.target.value)}
            />
            <Input
              label="Annees d'experience"
              type="number"
              min="0"
              max="40"
              value={values.experienceYears}
              onChange={(e) => setField('experienceYears', e.target.value)}
            />
            <Input
              label="Club actuel (texte libre)"
              value={values.currentClub}
              onChange={(e) => setField('currentClub', e.target.value)}
            />
            <Input
              label="URL photo (optionnel)"
              value={values.photoUrl}
              onChange={(e) => setField('photoUrl', e.target.value)}
            />
          </div>
        </section>

        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Visibilite
          </h2>
          <Select
            label="Niveau de visibilite"
            value={values.visibility}
            onChange={(e) => setField('visibility', e.target.value)}
            options={VISIBILITIES}
          />
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/admin/create')}
          >
            Annuler
          </Button>
          <Button type="submit" loading={submitting}>
            Creer le joueur
          </Button>
        </div>
      </form>
    </div>
  );
}