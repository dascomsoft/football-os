'use client';

import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

const STATUS_LABELS = {
  PENDING: 'En attente',
  APPROVED: 'Approuvee',
  REJECTED: 'Rejetee',
  REQUESTED_INFO: 'Infos requises',
  CANCELLED: 'Annulee',
};

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

function roleLabel(role) {
  if (role === 'CLUB') return 'Club';
  if (role === 'COACH') return 'Coach';
  if (role === 'ACADEMY') return 'Academie';
  return role;
}

export default function RequestRow({ request, onAction, busy }) {
  const isPending =
    request.status === 'PENDING' || request.status === 'REQUESTED_INFO';

  return (
    <div className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-content-primary">
            {request.title}
          </span>
          <StatusBadge
            status={request.status}
            label={STATUS_LABELS[request.status]}
          />
          <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
            {request.type}
          </span>
          <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
            {roleLabel(request.issuerRole)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
          <span>Pays : {request.country}</span>
          {request.city ? <span>Ville : {request.city}</span> : null}
          <span>Niveau : {request.level}</span>
          <span>Deadline : {formatDate(request.deadline)}</span>
          <span>Creee le : {formatDate(request.createdAt)}</span>
        </div>

        {request.description ? (
          <p className="mt-2 text-xs text-content-secondary">
            {request.description}
          </p>
        ) : null}

        {request.statusReason ? (
          <p className="mt-2 text-xs text-state-warning">
            Motif : {request.statusReason}
          </p>
        ) : null}

        {request.convertedOpportunityId ? (
          <p className="mt-2 text-xs text-state-success">
            Opportunite creee (ID : {request.convertedOpportunityId})
          </p>
        ) : null}
      </div>

      {isPending ? (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            disabled={busy}
            onClick={() => onAction(request, 'APPROVED')}
          >
            Approuver
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => onAction(request, 'REQUESTED_INFO')}
          >
            Demander infos
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={busy}
            onClick={() => onAction(request, 'REJECTED')}
          >
            Rejeter
          </Button>
        </div>
      ) : null}
    </div>
  );
}