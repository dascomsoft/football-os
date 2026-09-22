'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import recruitmentRequestService from '@/services/recruitment-request.service';
import RequestForm from '@/components/request/RequestForm';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function NewCoachRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user?.role !== 'COACH') {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux coachs."
      />
    );
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError('');
    try {
      await recruitmentRequestService.createRequest(payload);
      router.push('/dashboard/coach/requests');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Creation impossible. Verifiez les champs.'
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nouvelle recherche"
        subtitle="Votre recherche sera validee par l'administrateur avant publication anonymisee."
      />
      <RequestForm
        role="COACH"
        defaultType="COACH"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/coach/requests')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  );
}