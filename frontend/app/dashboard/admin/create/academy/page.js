'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import adminCreationService from '@/services/admin-creation.service';
import OrgCreateForm from '@/components/admin/OrgCreateForm';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function CreateAcademyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user?.role !== 'ADMIN') {
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
      const result = await adminCreationService.createAcademy(payload);
      alert(
        `Academie creee.\n\nMot de passe temporaire : ${result.temporaryPassword}\n\nA communiquer au partenaire par un canal securise.`
      );
      router.push('/dashboard/admin/create');
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.details?.[0]?.message ||
          'Creation impossible.'
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nouvelle academie"
        subtitle="Le compte est cree directement en APPROVED avec un mot de passe temporaire."
      />
      <OrgCreateForm
        type="ACADEMY"
        submitting={submitting}
        serverError={serverError}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/admin/create')}
      />
    </div>
  );
}