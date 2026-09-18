'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

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

function emptyValues() {
  return {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    // ACADEMY et CLUB
    name: '',
    country: '',
    city: '',
    competition: '',
    // COACH
    nationality: '',
    countryOfResidence: '',
    primaryRole: '',
    yearsOfExperience: '',
  };
}

export default function RegisterForm({
  type,
  submitting,
  serverError,
  fieldErrors,
  onSubmit,
  onBack,
}) {
  const [values, setValues] = useState(emptyValues());
  const [localErrors, setLocalErrors] = useState({});

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setLocalErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};

    if (!values.email.trim()) next.email = 'Email requis';
    if (!values.password || values.password.length < 8) {
      next.password = 'Mot de passe de 8 caracteres minimum';
    }
    if (!values.firstName.trim()) next.firstName = 'Prenom requis';
    if (!values.lastName.trim()) next.lastName = 'Nom requis';

    if (type === 'ACADEMY' || type === 'CLUB') {
      if (!values.name.trim()) next.name = 'Nom requis';
      if (!values.country.trim()) next.country = 'Pays requis';
    }

    if (type === 'COACH') {
      if (!values.primaryRole) next.primaryRole = 'Role principal requis';
    }

    setLocalErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildPayload() {
    const base = {
      email: values.email.trim(),
      password: values.password,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      role: type,
    };

    if (values.phone.trim()) base.phone = values.phone.trim();

    if (type === 'ACADEMY') {
      base.profile = {
        name: values.name.trim(),
        country: values.country.trim(),
        city: values.city.trim(),
      };
    }

    if (type === 'CLUB') {
      base.profile = {
        name: values.name.trim(),
        country: values.country.trim(),
        city: values.city.trim(),
      };
      if (values.competition.trim()) {
        base.profile.competition = values.competition.trim();
      }
    }

    if (type === 'COACH') {
      base.profile = {
        primaryRole: values.primaryRole,
      };
      if (values.nationality.trim()) {
        base.profile.nationality = values.nationality.trim();
      }
      if (values.countryOfResidence.trim()) {
        base.profile.countryOfResidence = values.countryOfResidence.trim();
      }
      if (values.yearsOfExperience !== '') {
        base.profile.yearsOfExperience = Number(values.yearsOfExperience);
      }
    }

    return base;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(buildPayload());
  }

  const isAcademyOrClub = type === 'ACADEMY' || type === 'CLUB';
  const isCoach = type === 'COACH';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError ? <ErrorState message={serverError} /> : null}

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Identite du compte
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            error={localErrors.email || fieldErrors?.email}
          />
          <Input
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            error={localErrors.password || fieldErrors?.password}
            hint="8 caracteres minimum."
          />
          <Input
            label="Prenom"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            error={localErrors.firstName || fieldErrors?.firstName}
          />
          <Input
            label="Nom"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            error={localErrors.lastName || fieldErrors?.lastName}
          />
          <Input
            label="Telephone (optionnel)"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            error={fieldErrors?.phone}
          />
        </div>
      </section>

      {isAcademyOrClub ? (
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            {type === 'ACADEMY' ? 'Informations de l\'academie' : 'Informations du club'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nom"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              error={localErrors.name || fieldErrors?.['profile.name']}
            />
            <Input
              label="Pays"
              value={values.country}
              onChange={(e) => setField('country', e.target.value)}
              error={localErrors.country || fieldErrors?.['profile.country']}
            />
            <Input
              label="Ville (optionnel)"
              value={values.city}
              onChange={(e) => setField('city', e.target.value)}
            />
            {type === 'CLUB' ? (
              <Input
                label="Competition (optionnel)"
                value={values.competition}
                onChange={(e) => setField('competition', e.target.value)}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {isCoach ? (
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Profil professionnel
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Role principal"
              value={values.primaryRole}
              onChange={(e) => setField('primaryRole', e.target.value)}
              options={COACH_ROLES}
              placeholder="Selectionner"
              error={localErrors.primaryRole || fieldErrors?.['profile.primaryRole']}
            />
            <Input
              label="Nationalite (optionnel)"
              value={values.nationality}
              onChange={(e) => setField('nationality', e.target.value)}
            />
            <Input
              label="Pays de residence (optionnel)"
              value={values.countryOfResidence}
              onChange={(e) => setField('countryOfResidence', e.target.value)}
            />
            <Input
              label="Annees d'experience (optionnel)"
              type="number"
              min="0"
              max="60"
              value={values.yearsOfExperience}
              onChange={(e) => setField('yearsOfExperience', e.target.value)}
            />
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" loading={submitting}>
          Creer mon compte
        </Button>
      </div>
    </form>
  );
}