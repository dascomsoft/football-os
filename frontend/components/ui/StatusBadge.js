const STATUS_MAP = {
  PENDING: { label: 'En attente', tone: 'warning' },
  APPROVED: { label: 'Approuve', tone: 'success' },
  REJECTED: { label: 'Rejete', tone: 'danger' },
  REQUESTED_INFO: { label: 'Informations requises', tone: 'info' },
  SUSPENDED: { label: 'Suspendu', tone: 'warning' },
  BLOCKED: { label: 'Bloque', tone: 'danger' },
};

const TONE_CLASSES = {
  success: 'bg-state-success/15 text-state-success border-state-success/30',
  warning: 'bg-state-warning/15 text-state-warning border-state-warning/30',
  danger: 'bg-state-danger/15 text-state-danger border-state-danger/30',
  info: 'bg-state-info/15 text-state-info border-state-info/30',
  neutral: 'bg-surface-overlay text-content-secondary border-surface-border',
};

export default function StatusBadge({ status, label, tone, className = '' }) {
  const mapped = STATUS_MAP[status] || {
    label: status || 'Inconnu',
    tone: 'neutral',
  };

  const displayLabel = label || mapped.label;
  const displayTone = tone || mapped.tone;
  const toneClass = TONE_CLASSES[displayTone] || TONE_CLASSES.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass} ${className}`}
    >
      {displayLabel}
    </span>
  );
}