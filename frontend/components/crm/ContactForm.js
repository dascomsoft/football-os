'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

const TYPES = [
  { value: 'CLUB', label: 'Club' },
  { value: 'ACADEMY', label: 'Academie' },
  { value: 'SCOUT', label: 'Scout' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'COACH', label: 'Coach' },
  { value: 'SPORTING_DIRECTOR', label: 'Directeur sportif' },
  { value: 'RECRUITER', label: 'Recruteur' },
  { value: 'OTHER', label: 'Autre' },
];

const STATUSES = [
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'INACTIVE', label: 'Inactif' },
  { value: 'CLOSED', label: 'Ferme' },
];

function emptyValues() {
  return {
    type: 'CLUB',
    organizationName: '',
    country: '',
    city: '',
    contactName: '',
    contactRole: '',
    phone: '',
    whatsapp: '',
    email: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    website: '',
    relationshipStatus: 'PROSPECT',
    tags: '',
    privateNotes: '',
  };
}

function toFormValues(contact) {
  if (!contact) return emptyValues();
  return {
    type: contact.type || 'CLUB',
    organizationName: contact.organizationName || '',
    country: contact.country || '',
    city: contact.city || '',
    contactName: contact.contactName || '',
    contactRole: contact.contactRole || '',
    phone: contact.phone || '',
    whatsapp: contact.whatsapp || '',
    email: contact.email || '',
    linkedin: contact.socialLinks?.linkedin || '',
    instagram: contact.socialLinks?.instagram || '',
    twitter: contact.socialLinks?.twitter || '',
    website: contact.socialLinks?.website || '',
    relationshipStatus: contact.relationshipStatus || 'PROSPECT',
    tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : '',
    privateNotes: contact.privateNotes || '',
  };
}

export default function ContactForm({
  initialContact = null,
  submitting,
  serverError,
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}) {
  const [values, setValues] = useState(() => toFormValues(initialContact));
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const next = {};
    if (!values.organizationName.trim()) next.organizationName = 'Nom requis';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      type: values.type,
      organizationName: values.organizationName.trim(),
      country: values.country.trim(),
      city: values.city.trim(),
      contactName: values.contactName.trim(),
      contactRole: values.contactRole.trim(),
      phone: values.phone.trim(),
      whatsapp: values.whatsapp.trim(),
      relationshipStatus: values.relationshipStatus,
      privateNotes: values.privateNotes,
    };

    if (values.email.trim()) payload.email = values.email.trim();

    const socialLinks = {};
    if (values.linkedin.trim()) socialLinks.linkedin = values.linkedin.trim();
    if (values.instagram.trim()) socialLinks.instagram = values.instagram.trim();
    if (values.twitter.trim()) socialLinks.twitter = values.twitter.trim();
    if (values.website.trim()) socialLinks.website = values.website.trim();
    if (Object.keys(socialLinks).length > 0) payload.socialLinks = socialLinks;

    if (values.tags.trim()) {
      payload.tags = values.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError ? <ErrorState message={serverError} /> : null}

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Organisation
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Type"
            value={values.type}
            onChange={(e) => setField('type', e.target.value)}
            options={TYPES}
          />
          <Input
            label="Nom de l'organisation"
            value={values.organizationName}
            onChange={(e) => setField('organizationName', e.target.value)}
            error={errors.organizationName}
          />
          <Input
            label="Pays"
            value={values.country}
            onChange={(e) => setField('country', e.target.value)}
          />
          <Input
            label="Ville"
            value={values.city}
            onChange={(e) => setField('city', e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Contact
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nom du responsable"
            value={values.contactName}
            onChange={(e) => setField('contactName', e.target.value)}
          />
          <Input
            label="Fonction"
            value={values.contactRole}
            onChange={(e) => setField('contactRole', e.target.value)}
            placeholder="Ex : Sporting Director"
          />
          <Input
            label="Telephone"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
          <Input
            label="WhatsApp"
            value={values.whatsapp}
            onChange={(e) => setField('whatsapp', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          <Select
            label="Statut de la relation"
            value={values.relationshipStatus}
            onChange={(e) => setField('relationshipStatus', e.target.value)}
            options={STATUSES}
          />
        </div>
      </section>

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Liens et reseaux (optionnel)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="LinkedIn"
            value={values.linkedin}
            onChange={(e) => setField('linkedin', e.target.value)}
          />
          <Input
            label="Instagram"
            value={values.instagram}
            onChange={(e) => setField('instagram', e.target.value)}
          />
          <Input
            label="Twitter / X"
            value={values.twitter}
            onChange={(e) => setField('twitter', e.target.value)}
          />
          <Input
            label="Site web"
            value={values.website}
            onChange={(e) => setField('website', e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Notes et tags
        </h2>
        <Input
          label="Tags (separes par virgule)"
          value={values.tags}
          onChange={(e) => setField('tags', e.target.value)}
          placeholder="Ex : important, europe, u21"
        />
        <div className="mt-4">
          <Textarea
            label="Notes privees"
            rows={4}
            value={values.privateNotes}
            onChange={(e) => setField('privateNotes', e.target.value)}
            hint="Ces notes sont strictement privees."
          />
        </div>
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