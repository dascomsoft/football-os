'use client';

import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export default function ProfileRow({ profile, onAction, busy }) {
  const title =
    profile.name ||
    `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
    'Sans nom';

  const subtitleParts = [];
  if (profile.country) subtitleParts.push(profile.country);
  if (profile.city) subtitleParts.push(profile.city);
  if (profile.primaryRole) subtitleParts.push(profile.primaryRole);
  if (profile.competition) subtitleParts.push(profile.competition);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-content-primary">
            {title}
          </span>
          <StatusBadge status={profile.status} />
        </div>

        {subtitleParts.length > 0 ? (
          <p className="mt-1 text-xs text-content-secondary">
            {subtitleParts.join(' - ')}
          </p>
        ) : null}

        <p className="mt-1 text-xs text-content-muted">
          Cree le {formatDate(profile.createdAt)}
        </p>

        {profile.statusReason ? (
          <p className="mt-2 text-xs text-state-warning">
            Motif : {profile.statusReason}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={busy}
          onClick={() => onAction(profile, 'APPROVED')}
        >
          Approuver
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => onAction(profile, 'REQUESTED_INFO')}
        >
          Demander infos
        </Button>
        <Button
          size="sm"
          variant="danger"
          disabled={busy}
          onClick={() => onAction(profile, 'REJECTED')}
        >
          Rejeter
        </Button>
      </div>
    </div>
  );
}