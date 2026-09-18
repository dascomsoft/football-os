'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorState from '@/components/ui/ErrorState';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Connexion impossible. Reessayez.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (

    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-content-muted">
            Football OS
          </span>
          <h1 className="text-2xl font-semibold text-content-primary">
            Connexion
          </h1>
          <p className="text-sm text-content-secondary">
            Accedez a votre espace professionnel.
          </p>
        </div>

        {error ? <ErrorState message={error} className="mb-6" /> : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Adresse email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
          />

          <Input
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
          />

          <Button type="submit" loading={submitting} className="mt-2 w-full">
            Se connecter
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-content-secondary">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Creer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}