'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/api';
import proposalService from '@/services/proposal.service';
import ProposalForm from '@/components/proposal/ProposalForm';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function NewProposalPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isAdmin || !params?.id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/admin/opportunities`);
        const found = (data.items || []).find((o) => o._id === params.id);
        if (!found) {
          throw new Error('Opportunity not found');
        }
        if (!cancelled) setOpportunity(found);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || 'Opportunite introuvable.'
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
  }, [isAdmin, params?.id]);

  if (!isAdmin) {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux administrateurs."
      />
    );
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError('');
    try {
      await proposalService.createProposal(payload);
      router.push('/dashboard/admin/proposals');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Creation impossible.'
      );
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Chargement..." />;
  if (error) return <ErrorState message={error} />;
  if (!opportunity) return null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nouvelle proposition"
        subtitle={`Opportunite ${opportunity.reference} - ${opportunity.title}`}
      />
      <ProposalForm
        opportunity={opportunity}
        submitting={submitting}
        serverError={serverError}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}