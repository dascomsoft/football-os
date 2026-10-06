'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import contactService from '@/services/contact.service';
import ContactForm from '@/components/crm/ContactForm';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function NewContactPage() {
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
      const data = await contactService.createContact(payload);
      router.push(`/dashboard/admin/crm/${data.contact._id}`);
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
        title="Nouveau contact"
        subtitle="Ajoutez un contact a votre CRM prive."
      />
      <ContactForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/admin/crm')}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Creer le contact"
      />
    </div>
  );
}