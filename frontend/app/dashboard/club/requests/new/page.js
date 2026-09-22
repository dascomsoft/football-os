'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import recruitmentRequestService from '@/services/recruitment-request.service';
import RequestForm from '@/components/request/RequestForm';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function NewClubRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user?.role !== 'CLUB') {
    return (
      <EmptyState
        title="Acces reserve"
        message="Cette section est reservee aux clubs."
      />
    );
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError('');
    try {
      await recruitmentRequestService.createRequest(payload);
      router.push('/dashboard/club/requests');
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
        title="Nouvelle demande"
        subtitle="Une fois validee par l'administrateur, votre demande sera publiee comme opportunite anonymisee."
      />
      <RequestForm
        role="CLUB"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/club/requests')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  );
}