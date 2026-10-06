'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
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
    name: '',
    country: '',
    city: '',
    competition: '',
    foundedYear: '',
    description: '',
    nationality: '',
    countryOfResidence: '',
    primaryRole: '',
    yearsOfExperience: '',
    licenses: '',
  };
}

export default function OrgCreateForm({
  type,
  submitting,
  serverError,
  onSubmit,
  onCancel,
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
    if (!values.firstName.trim()) next.firstName = 'Prenom requis';
    if (!values.lastName.trim()) next.lastName = 'Nom requis';

    if (type === 'CLUB' || type === 'ACADEMY') {
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
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    };
    if (values.phone.trim()) base.phone = values.phone.trim();

    if (type === 'CLUB') {
      base.name = values.name.trim();
      base.country = values.country.trim();
      if (values.city.trim()) base.city = values.city.trim();
      if (values.competition.trim()) base.competition = values.competition.trim();
      if (values.foundedYear !== '') base.foundedYear = Number(values.foundedYear);
      if (values.description.trim()) base.description = values.description.trim();
    }

    if (type === 'ACADEMY') {
      base.name = values.name.trim();
      base.country = values.country.trim();
      if (values.city.trim()) base.city = values.city.trim();
      if (values.foundedYear !== '') base.foundedYear = Number(values.foundedYear);
      if (values.description.trim()) base.description = values.description.trim();
    }

    if (type === 'COACH') {
      if (values.nationality.trim()) base.nationality = values.nationality.trim();
      if (values.countryOfResidence.trim()) {
        base.countryOfResidence = values.countryOfResidence.trim();
      }
      if (values.city.trim()) base.city = values.city.trim();
      base.primaryRole = values.primaryRole;
      if (values.yearsOfExperience !== '') {
        base.yearsOfExperience = Number(values.yearsOfExperience);
      }
      if (values.licenses.trim()) {
        base.licenses = values.licenses
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    return base;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(buildPayload());
  }

  const isOrg = type === 'CLUB' || type === 'ACADEMY';

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
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            error={localErrors.email}
          />
          <Input
            label="Telephone (optionnel)"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
          <Input
            label="Prenom"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            error={localErrors.firstName}
          />
          <Input
            label="Nom"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            error={localErrors.lastName}
          />
        </div>
      </section>

      {isOrg ? (
        <section className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="mb-4 text-sm font-medium text-content-primary">
            Informations
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nom"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              error={localErrors.name}
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
            {type === 'CLUB' ? (
              <Input
                label="Competition (optionnel)"
                value={values.competition}
                onChange={(e) => setField('competition', e.target.value)}
              />
            ) : null}
            <Input
              label="Annee de fondation (optionnel)"
              type="number"
              min="1850"
              max="2100"
              value={values.foundedYear}
              onChange={(e) => setField('foundedYear', e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description (optionnel)"
              rows={3}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
        </section>
      ) : null}

      {type === 'COACH' ? (
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
              error={localErrors.primaryRole}
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
              label="Ville (optionnel)"
              value={values.city}
              onChange={(e) => setField('city', e.target.value)}
            />
            <Input
              label="Annees d'experience (optionnel)"
              type="number"
              min="0"
              max="60"
              value={values.yearsOfExperience}
              onChange={(e) => setField('yearsOfExperience', e.target.value)}
            />
            <Input
              label="Licences (separees par virgule)"
              value={values.licenses}
              onChange={(e) => setField('licenses', e.target.value)}
              placeholder="Ex : CAF A, UEFA B"
            />
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={submitting}>
          Creer
        </Button>
      </div>
    </form>
  );
}