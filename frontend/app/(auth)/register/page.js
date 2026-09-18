'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';
import useAuth from '@/hooks/useAuth';
import RegisterTypeSelector from '@/components/auth/RegisterTypeSelector';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshMe } = useAuth();

  const [type, setType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function resetMessages() {
    setServerError('');
    setFieldErrors({});
  }

  function handleSelect(next) {
    resetMessages();
    setType(next);
  }

  function handleBack() {
    resetMessages();
    setType(null);
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    resetMessages();

    try {
      const data = await authService.register(payload);

      const { setToken, setUser } = await import('@/lib/auth');
      setToken(data.token);
      setUser(data.user);

      if (typeof refreshMe === 'function') {
        try {
          await refreshMe();
        } catch {
          // ignore
        }
      }

      router.push('/dashboard/pending');
    } catch (err) {
      const response = err.response?.data;

      if (response?.details && Array.isArray(response.details)) {
        const map = {};
        response.details.forEach((d) => {
          if (d.field) map[d.field] = d.message;
        });
        setFieldErrors(map);
      }

      setServerError(response?.message || 'Inscription impossible. Reessayez.');
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-content-muted">
            Football OS
          </span>
          <h1 className="text-2xl font-semibold text-content-primary">
            {type ? 'Creer votre compte' : 'Choisissez votre type de compte'}
          </h1>
          <p className="text-sm text-content-secondary">
            {type
              ? 'Renseignez les informations de votre organisation ou de votre profil.'
              : 'Chaque type de compte donne acces a des fonctionnalites adaptees.'}
          </p>
        </div>

        {!type ? (
          <RegisterTypeSelector selected={type} onSelect={handleSelect} />
        ) : (
          <RegisterForm
            type={type}
            submitting={submitting}
            serverError={serverError}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}

        <div className="mt-8 text-center text-sm text-content-secondary">
          Deja un compte ?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}