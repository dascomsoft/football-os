'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

const LEVELS = [
  { value: 'AMATEUR', label: 'Amateur' },
  { value: 'SEMI_PRO', label: 'Semi-professionnel' },
  { value: 'PROFESSIONAL', label: 'Professionnel' },
  { value: 'ELITE', label: 'Elite' },
];

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

function emptyValues(type) {
  return {
    type,
    title: '',
    country: '',
    city: '',
    level: 'PROFESSIONAL',
    description: '',
    deadline: '',
    // PLAYER
    position: '',
    preferredFoot: 'RIGHT',
    ageMin: '',
    ageMax: '',
    heightMin: '',
    experienceMinPlayer: '',
    // COACH
    coachRole: '',
    license: '',
    experienceMinCoach: '',
    category: '',
  };
}

export default function RequestForm({
  role,
  defaultType,
  submitting,
  serverError,
  onSubmit,
  onCancel,
  submitLabel = 'Creer la demande',
}) {
  const canChooseType = role === 'CLUB';
  const initialType = defaultType || (role === 'COACH' ? 'COACH' : 'PLAYER');

  const [values, setValues] = useState(() => emptyValues(initialType));
  const [localErrors, setLocalErrors] = useState({});

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setLocalErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (!values.title.trim() || values.title.length < 4) {
      next.title = 'Titre de 4 caracteres minimum';
    }
    if (!values.country.trim()) next.country = 'Pays requis';

    if (values.type === 'PLAYER') {
      if (!values.position) next.position = 'Poste requis';
    } else {
      if (!values.coachRole) next.coachRole = 'Role requis';
    }

    setLocalErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildPayload() {
    const base = {
      type: values.type,
      title: values.title.trim(),
      country: values.country.trim(),
      level: values.level,
    };

    if (values.city.trim()) base.city = values.city.trim();
    if (values.description.trim()) base.description = values.description.trim();
    if (values.deadline) base.deadline = values.deadline;

    if (values.type === 'PLAYER') {
      const criteria = { position: values.position };
      if (values.preferredFoot) criteria.preferredFoot = values.preferredFoot;
      if (values.ageMin !== '') criteria.ageMin = Number(values.ageMin);
      if (values.ageMax !== '') criteria.ageMax = Number(values.ageMax);
      if (values.heightMin !== '') criteria.heightMin = Number(values.heightMin);
      if (values.experienceMinPlayer !== '') {
        criteria.experienceMin = Number(values.experienceMinPlayer);
      }
      base.playerCriteria = criteria;
    } else {
      const criteria = { role: values.coachRole };
      if (values.license.trim()) criteria.license = values.license.trim();
      if (values.experienceMinCoach !== '') {
        criteria.experienceMin = Number(values.experienceMinCoach);
      }
      if (values.category.trim()) criteria.category = values.category.trim();
      base.coachCriteria = criteria;
    }

    return base;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(buildPayload());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError ? <ErrorState message={serverError} /> : null}

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Informations generales
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {canChooseType ? (
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
          ) : null}

          <Input
            label="Titre"
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            error={localErrors.title}
            placeholder="Ex : Recrutement defenseur central U21"
          />
          <Input
            label="Pays"
            value={values.country}
            onChange={(e) => setField('country', e.target.value)}
            error={localErrors.country}
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
            options={LEVELS}
          />
          <Input
            label="Deadline (optionnel)"
            type="date"
            value={values.deadline}
            onChange={(e) => setField('deadline', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Description (optionnel)"
            rows={3}
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            hint="N'indiquez aucune coordonnee (email, telephone, lien) : elles sont interdites."
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
              error={localErrors.position}
            />
            <Select
              label="Pied prefere"
              value={values.preferredFoot}
              onChange={(e) => setField('preferredFoot', e.target.value)}
              options={FEET}
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
              label="Taille minimum (cm)"
              type="number"
              min="120"
              max="220"
              value={values.heightMin}
              onChange={(e) => setField('heightMin', e.target.value)}
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
              error={localErrors.coachRole}
            />
            <Input
              label="Licence (optionnel)"
              value={values.license}
              onChange={(e) => setField('license', e.target.value)}
              placeholder="Ex : CAF A"
            />
            <Input
              label="Experience minimum (annees)"
              type="number"
              min="0"
              max="40"
              value={values.experienceMinCoach}
              onChange={(e) => setField('experienceMinCoach', e.target.value)}
            />
            <Input
              label="Categorie (optionnel)"
              value={values.category}
              onChange={(e) => setField('category', e.target.value)}
              placeholder="Ex : U21, Senior"
            />
          </div>
        </section>
      )}

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