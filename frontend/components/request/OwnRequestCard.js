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

export default function OwnRequestCard({ request, onCancel, busy }) {
  const canCancel = request.status === 'PENDING';

  return (
    <div className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4">
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
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
        <span>Pays : {request.country}</span>
        {request.city ? <span>Ville : {request.city}</span> : null}
        <span>Niveau : {request.level}</span>
        <span>Deadline : {formatDate(request.deadline)}</span>
        <span>Creee le : {formatDate(request.createdAt)}</span>
      </div>

      {request.statusReason ? (
        <p className="text-xs text-state-warning">
          Motif : {request.statusReason}
        </p>
      ) : null}

      {request.status === 'APPROVED' && request.convertedOpportunityId ? (
        <p className="text-xs text-state-success">
          Cette demande a ete publiee comme opportunite.
        </p>
      ) : null}

      {canCancel ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => onCancel(request)}
          >
            Annuler la demande
          </Button>
        </div>
      ) : null}
    </div>
  );
}