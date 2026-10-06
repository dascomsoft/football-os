'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

export default function ProposalForm({
  opportunity,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}) {
  const [clubs, setClubs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [values, setValues] = useState({
    clubId: '',
    candidateId: '',
    message: '',
    videoUrl: '',
    videoTitle: '',
  });
  const [localErrors, setLocalErrors] = useState({});

  const candidateType = opportunity?.type;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError('');
      try {
        // Charge les clubs approuves
        const clubsRes = await api.get('/admin/profiles/CLUB', {
          params: { status: 'APPROVED' },
        });
        const clubOptions = (clubsRes.data.items || []).map((c) => ({
          value: c._id,
          label: c.name + (c.country ? ` - ${c.country}` : ''),
        }));

        // Charge les candidats selon le type
        let candidateOptions = [];

        if (candidateType === 'PLAYER') {
          const playersRes = await api.get('/players/admin');
          candidateOptions = (playersRes.data.items || [])
            .filter((p) => p.status === 'ACTIVE')
            .map((p) => ({
              value: p._id,
              label: `${p.firstName} ${p.lastName} - ${p.position} - ${p.age} ans`,
            }));
        } else if (candidateType === 'COACH') {
          const coachesRes = await api.get('/admin/profiles/COACH', {
            params: { status: 'APPROVED' },
          });
          candidateOptions = (coachesRes.data.items || []).map((c) => ({
            value: c._id,
            label: `${c.firstName} ${c.lastName} - ${c.primaryRole}`,
          }));
        }

        if (!cancelled) {
          setClubs(clubOptions);
          setCandidates(candidateOptions);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err.response?.data?.message || 'Chargement des listes impossible.'
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
  }, [candidateType]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setLocalErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const next = {};
    if (!values.clubId) next.clubId = 'Club requis';
    if (!values.candidateId) next.candidateId = 'Candidat requis';

    setLocalErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      opportunityId: opportunity._id,
      clubId: values.clubId,
      candidateType,
      candidateId: values.candidateId,
      message: values.message.trim(),
    };

    if (values.videoUrl.trim()) {
      payload.sharedVideos = [
        {
          url: values.videoUrl.trim(),
          title: values.videoTitle.trim() || 'Video',
          type: 'HIGHLIGHTS',
        },
      ];
    }

    onSubmit(payload);
  }

  if (loading) return <LoadingState label="Chargement des listes..." />;
  if (loadError) return <ErrorState message={loadError} />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError ? <ErrorState message={serverError} /> : null}

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Presentation
        </h2>

        <div className="flex flex-col gap-4">
          <Select
            label="Club destinataire"
            value={values.clubId}
            onChange={(e) => setField('clubId', e.target.value)}
            options={clubs}
            placeholder="Selectionner un club"
            error={localErrors.clubId}
          />

          <Select
            label={
              candidateType === 'PLAYER'
                ? 'Joueur a proposer'
                : 'Coach a proposer'
            }
            value={values.candidateId}
            onChange={(e) => setField('candidateId', e.target.value)}
            options={candidates}
            placeholder="Selectionner un candidat"
            error={localErrors.candidateId}
          />

          <Textarea
            label="Message (optionnel)"
            rows={4}
            value={values.message}
            onChange={(e) => setField('message', e.target.value)}
            placeholder="Expliquez pourquoi ce candidat correspond a l'opportunite."
          />
        </div>
      </section>

      <section className="rounded-md border border-surface-border bg-surface-raised p-4">
        <h2 className="mb-4 text-sm font-medium text-content-primary">
          Video a partager (optionnel)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="URL de la video"
            value={values.videoUrl}
            onChange={(e) => setField('videoUrl', e.target.value)}
            placeholder="https://..."
          />
          <Input
            label="Titre de la video"
            value={values.videoTitle}
            onChange={(e) => setField('videoTitle', e.target.value)}
            placeholder="Ex : Highlights 2026"
          />
        </div>
        <p className="mt-2 text-xs text-content-muted">
          Aucune video n&apos;est transmise automatiquement. Seules celles que
          vous renseignez ici seront visibles par le club.
        </p>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={submitting}>
          Creer la proposition
        </Button>
      </div>
    </form>
  );
}