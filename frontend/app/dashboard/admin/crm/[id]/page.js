'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import contactService from '@/services/contact.service';
import ContactForm from '@/components/crm/ContactForm';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const INTERACTION_TYPES = [
  { value: 'NOTE', label: 'Note' },
  { value: 'CALL', label: 'Appel' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'MEETING', label: 'Rendez-vous' },
  { value: 'PROPOSAL_SENT', label: 'Proposition envoyee' },
  { value: 'OFFER_SENT', label: 'Offre envoyee' },
  { value: 'OTHER', label: 'Autre' },
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

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-2 last:border-b-0">
      <span className="text-sm text-content-secondary">{label}</span>
      <span className="text-sm text-content-primary">{value}</span>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('fr-FR');
  } catch {
    return '-';
  }
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [contact, setContact] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const [newInteraction, setNewInteraction] = useState({
    type: 'NOTE',
    summary: '',
    details: '',
  });
  const [interactionBusy, setInteractionBusy] = useState(false);
  const [interactionError, setInteractionError] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const contactId = params?.id;

  const load = useCallback(async () => {
    if (!isAdmin || !contactId) return;
    setLoading(true);
    setError('');
    try {
      const c = await contactService.getContact(contactId);
      setContact(c.contact);
      const i = await contactService.listInteractions(contactId);
      setInteractions(i.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Contact introuvable.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, contactId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(payload) {
    setSubmitting(true);
    setServerError('');
    try {
      const data = await contactService.updateContact(contactId, payload);
      setContact(data.contact);
      setEditing(false);
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.details?.[0]?.message ||
          'Mise a jour impossible.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddInteraction(event) {
    event.preventDefault();
    if (!newInteraction.summary.trim()) {
      setInteractionError('Resume requis');
      return;
    }
    setInteractionBusy(true);
    setInteractionError('');
    try {
      const data = await contactService.createInteraction(contactId, {
        type: newInteraction.type,
        summary: newInteraction.summary.trim(),
        details: newInteraction.details.trim(),
      });
      setInteractions((prev) => [data.interaction, ...prev]);
      setNewInteraction({ type: 'NOTE', summary: '', details: '' });
    } catch (err) {
      setInteractionError(
        err.response?.data?.message || 'Ajout impossible.'
      );
    } finally {
      setInteractionBusy(false);
    }
  }

  async function handleDelete() {
    setDeleteBusy(true);
    try {
      await contactService.deleteContact(contactId);
      router.push('/dashboard/admin/crm');
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible.');
      setDeleteBusy(false);
      setConfirmDelete(false);
    }
  }

  async function handleDeleteInteraction(interactionId) {
    try {
      await contactService.deleteInteraction(contactId, interactionId);
      setInteractions((prev) => prev.filter((i) => i._id !== interactionId));
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible.');
    }
  }

  if (!isAdmin) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  if (loading) return <LoadingState label="Chargement..." />;
  if (error) return <ErrorState message={error} />;
  if (!contact) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={contact.organizationName}
        subtitle={`${TYPE_LABELS[contact.type] || contact.type} - ${STATUS_LABELS[contact.relationshipStatus] || contact.relationshipStatus}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/admin/crm">
              <Button variant="secondary">Retour</Button>
            </Link>
            <Button variant="secondary" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Voir' : 'Modifier'}
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Supprimer
            </Button>
          </div>
        }
      />

      {editing ? (
        <ContactForm
          initialContact={contact}
          submitting={submitting}
          serverError={serverError}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Enregistrer les modifications"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-2 text-sm font-medium text-content-primary">
              Organisation
            </h2>
            <Row label="Nom" value={contact.organizationName} />
            <Row label="Type" value={TYPE_LABELS[contact.type] || contact.type} />
            <Row label="Pays" value={contact.country} />
            <Row label="Ville" value={contact.city} />
          </section>

          <section className="rounded-md border border-surface-border bg-surface-raised p-4">
            <h2 className="mb-2 text-sm font-medium text-content-primary">
              Contact
            </h2>
            <Row label="Responsable" value={contact.contactName} />
            <Row label="Fonction" value={contact.contactRole} />
            <Row label="Telephone" value={contact.phone} />
            <Row label="WhatsApp" value={contact.whatsapp} />
            <Row label="Email" value={contact.email} />
          </section>

          {contact.socialLinks &&
          (contact.socialLinks.linkedin ||
            contact.socialLinks.instagram ||
            contact.socialLinks.twitter ||
            contact.socialLinks.website) ? (
            <section className="rounded-md border border-surface-border bg-surface-raised p-4">
              <h2 className="mb-2 text-sm font-medium text-content-primary">
                Liens
              </h2>
              <Row label="LinkedIn" value={contact.socialLinks.linkedin} />
              <Row label="Instagram" value={contact.socialLinks.instagram} />
              <Row label="Twitter" value={contact.socialLinks.twitter} />
              <Row label="Site" value={contact.socialLinks.website} />
            </section>
          ) : null}

          {contact.tags && contact.tags.length > 0 ? (
            <section className="rounded-md border border-surface-border bg-surface-raised p-4">
              <h2 className="mb-2 text-sm font-medium text-content-primary">
                Tags
              </h2>
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {contact.privateNotes ? (
            <section className="rounded-md border border-surface-border bg-surface-raised p-4 md:col-span-2">
              <h2 className="mb-2 text-sm font-medium text-content-primary">
                Notes privees
              </h2>
              <p className="whitespace-pre-wrap text-sm text-content-secondary">
                {contact.privateNotes}
              </p>
            </section>
          ) : null}
        </div>
      )}

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Ajouter une interaction
        </h2>
        <form onSubmit={handleAddInteraction} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Type"
              value={newInteraction.type}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, type: e.target.value })
              }
              options={INTERACTION_TYPES}
            />
            <Input
              label="Resume"
              value={newInteraction.summary}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, summary: e.target.value })
              }
              placeholder="Ex : Appel de suivi"
              error={interactionError}
            />
          </div>
          <Textarea
            label="Details (optionnel)"
            rows={3}
            value={newInteraction.details}
            onChange={(e) =>
              setNewInteraction({ ...newInteraction, details: e.target.value })
            }
          />
          <div className="flex justify-end">
            <Button type="submit" loading={interactionBusy}>
              Ajouter
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Timeline
        </h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-content-secondary">
            Aucune interaction pour le moment.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {interactions.map((i) => (
              <li
                key={i._id}
                className="flex flex-col gap-1 border-b border-surface-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
                    {i.type}
                  </span>
                  <span className="text-sm font-medium text-content-primary">
                    {i.summary}
                  </span>
                  <span className="text-xs text-content-muted">
                    {formatDate(i.occurredAt)}
                  </span>
                </div>
                {i.details ? (
                  <p className="whitespace-pre-wrap text-xs text-content-secondary">
                    {i.details}
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteInteraction(i._id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer ce contact"
        message="Le contact sera archive et n'apparaitra plus dans la liste."
        confirmLabel="Supprimer"
        danger
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}