import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-medium uppercase tracking-widest text-content-muted">
          Football OS
        </span>
        <h1 className="text-3xl font-semibold text-content-primary">
          Infrastructure professionnelle de recrutement football
        </h1>
        <p className="max-w-2xl text-base text-content-secondary">
          Football OS centralise la gestion des joueurs, des coachs, des clubs
          et des academies dans un processus de recrutement controle. Les mises
          en relation sont mediation par un administrateur professionnel.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-muted"
        >
          Acceder a la plateforme
        </Link>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-content-primary">
            Joueurs et coachs
          </h2>
          <p className="mt-1 text-sm text-content-secondary">
            Profils sportifs structures, verifies, presentes de maniere
            controlee.
          </p>
        </div>
        <div className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-content-primary">
            Clubs et academies
          </h2>
          <p className="mt-1 text-sm text-content-secondary">
            Demandes de recrutement, propositions, trials, entrevues,
            evaluations.
          </p>
        </div>
        <div className="rounded-md border border-surface-border bg-surface-raised p-4">
          <h2 className="text-sm font-medium text-content-primary">
            Relation mediee
          </h2>
          <p className="mt-1 text-sm text-content-secondary">
            Aucune coordonnee privee n&apos;est exposee. Chaque mise en relation
            passe par l&apos;administrateur.
          </p>
        </div>
      </div>
    </main>
  );
}