import Link from 'next/link';

const TYPE_LABELS = {
  PLAYER: 'Joueur',
  COACH: 'Coach',
};

const LEVEL_LABELS = {
  AMATEUR: 'Amateur',
  SEMI_PRO: 'Semi-professionnel',
  PROFESSIONAL: 'Professionnel',
  ELITE: 'Elite',
};

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export default function OpportunityCard({ opportunity }) {
  return (
    <Link
      href={`/dashboard/opportunities/${opportunity._id}`}
      className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4 transition-colors hover:border-accent/40 hover:bg-surface-overlay"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs font-medium text-content-secondary">
          {opportunity.reference}
        </span>
        <span className="text-sm font-medium text-content-primary">
          {opportunity.title}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
        <span>Type : {TYPE_LABELS[opportunity.type] || opportunity.type}</span>
        <span>Pays : {opportunity.country}</span>
        {opportunity.city ? <span>Ville : {opportunity.city}</span> : null}
        <span>Niveau : {LEVEL_LABELS[opportunity.level] || opportunity.level}</span>
        {opportunity.deadline ? (
          <span>Deadline : {formatDate(opportunity.deadline)}</span>
        ) : null}
      </div>

      {opportunity.description ? (
        <p className="line-clamp-2 text-xs text-content-secondary">
          {opportunity.description}
        </p>
      ) : null}
    </Link>
  );
}