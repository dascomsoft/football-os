'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

const POSITIONS = [
  { value: 'GK', label: 'Gardien (GK)' },
  { value: 'CB', label: 'Defenseur central (CB)' },
  { value: 'LB', label: 'Lateral gauche (LB)' },
  { value: 'RB', label: 'Lateral droit (RB)' },
  { value: 'LWB', label: 'Piston gauche (LWB)' },
  { value: 'RWB', label: 'Piston droit (RWB)' },
  { value: 'CDM', label: 'Milieu defensif (CDM)' },
  { value: 'CM', label: 'Milieu central (CM)' },
  { value: 'CAM', label: 'Milieu offensif (CAM)' },
  { value: 'LM', label: 'Milieu gauche (LM)' },
  { value: 'RM', label: 'Milieu droit (RM)' },
  { value: 'LW', label: 'Ailier gauche (LW)' },
  { value: 'RW', label: 'Ailier droit (RW)' },
  { value: 'CF', label: 'Avant-centre (CF)' },
  { value: 'ST', label: 'Attaquant (ST)' },
];

const FEET = [
  { value: 'LEFT', label: 'Gauche' },
  { value: 'RIGHT', label: 'Droit' },
  { value: 'BOTH', label: 'Les deux' },
];

const GENDERS = [
  { value: 'MALE', label: 'Masculin' },
  { value: 'FEMALE', label: 'Feminin' },
];

const VISIBILITIES = [
  { value: 'ADMIN_ONLY', label: 'Prive (administrateur uniquement)' },
  { value: 'PARTNER', label: 'Partenaire' },
  { value: 'NETWORK', label: 'Reseau professionnel' },
  { value: 'PROFESSIONAL', label: 'Professionnel' },
  { value: 'PRESENTATION', label: 'Presentation autorisee' },
];

function emptyForm() {
  return {
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
  };
}

function toFormValues(player) {
  if (!player) return emptyForm();
  return {
    firstName: player.firstName || '',
    lastName: player.lastName || '',
    dateOfBirth: player.dateOfBirth
      ? String(player.dateOfBirth).slice(0, 10)
      : '',
    nationality: player.nationality || '',
    gender: player.gender || 'MALE',
    position: player.position || '',
    secondaryPosition: player.secondaryPosition || '',
    preferredFoot: player.preferredFoot || 'RIGHT',
    height: player.height ?? '',
    weight: player.weight ?? '',
    experienceYears: player.experienceYears ?? '',
    currentClub: player.currentClub || '',
    photoUrl: player.photoUrl || '',
    visibility: player.visibility || 'ADMIN_ONLY',
  };
}

export default function PlayerForm({
  initialPlayer = null,
  submitting = false,
  serverError = '',
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}) {
  const [values, setValues] = useState(() => toFormValues(initialPlayer));
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (!values.firstName.trim()) next.firstName = 'Prenom requis';
    if (!values.lastName.trim()) next.lastName = 'Nom requis';
    if (!values.dateOfBirth) next.dateOfBirth = 'Date de naissance requise';
    if (!values.nationality.trim()) next.nationality = 'Nationalite requise';
    if (!values.position) next.position = 'Poste requis';

    const numericFields = ['height', 'weight', 'experienceYears'];
    numericFields.forEach((f) => {
      if (values[f] !== '' && Number.isNaN(Number(values[f]))) {
        next[f] = 'Valeur numerique requise';
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth,
      nationality: values.nationality.trim(),
      gender: values.gender,
      position: values.position,
      preferredFoot: values.preferredFoot,
      currentClub: values.currentClub.trim(),
      photoUrl: values.photoUrl.trim(),
      visibility: values.visibility,
    };

    if (values.secondaryPosition) {
      payload.secondaryPosition = values.secondaryPosition;
    }
    if (values.height !== '') payload.height = Number(values.height);
    if (values.weight !== '') payload.weight = Number(values.weight);
    if (values.experienceYears !== '') {
      payload.experienceYears = Number(values.experienceYears);
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError ? <ErrorState message={serverError} /> : null}

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
            options={GENDERS}
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
            label="Poste secondaire"
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
            error={errors.height}
          />
          <Input
            label="Poids (kg)"
            type="number"
            min="30"
            max="150"
            value={values.weight}
            onChange={(e) => setField('weight', e.target.value)}
            error={errors.weight}
          />
          <Input
            label="Annees d'experience"
            type="number"
            min="0"
            max="40"
            value={values.experienceYears}
            onChange={(e) => setField('experienceYears', e.target.value)}
            error={errors.experienceYears}
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
          hint="Determine qui pourra voir ce joueur en dehors de votre academie."
        />
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}