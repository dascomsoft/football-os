'use client';

import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

const STATUS_LABELS = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyee',
  VIEWED: 'Vue',
  INTERESTED: 'Interesse',
  DECLINED: 'Refusee',
  CLOSED: 'Fermee',
};

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export default function AdminProposalRow({ proposal, onAction, busy }) {
  const canSend = proposal.status === 'DRAFT';
  const canClose = ['DRAFT', 'SENT', 'VIEWED', 'INTERESTED', 'DECLINED'].includes(
    proposal.status
  );

  return (
    <div className="flex flex-col gap-3 rounded-md border border-surface-border bg-surface-raised p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs font-medium text-content-secondary">
            {proposal.reference}
          </span>
          <StatusBadge
            status={proposal.status}
            label={STATUS_LABELS[proposal.status]}
          />
          <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-xs text-content-secondary">
            {proposal.candidateType}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
          <span>Envoyee le : {formatDate(proposal.sentAt)}</span>
          {proposal.viewedAt ? (
            <span>Vue le : {formatDate(proposal.viewedAt)}</span>
          ) : null}
          {proposal.respondedAt ? (
            <span>Reponse le : {formatDate(proposal.respondedAt)}</span>
          ) : null}
        </div>

        {proposal.clubResponse ? (
          <p className="mt-2 text-xs text-content-secondary">
            Reponse du club : {proposal.clubResponse}
          </p>
        ) : null}

        {proposal.statusReason ? (
          <p className="mt-2 text-xs text-state-warning">
            Motif : {proposal.statusReason}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {canSend ? (
          <Button
            size="sm"
            variant="primary"
            disabled={busy}
            onClick={() => onAction(proposal, 'SEND')}
          >
            Envoyer
          </Button>
        ) : null}
        {canClose ? (
          <Button
            size="sm"
            variant="danger"
            disabled={busy}
            onClick={() => onAction(proposal, 'CLOSE')}
          >
            Fermer
          </Button>
        ) : null}
      </div>
    </div>
  );
}