export default function EmptyState({
  title = 'Aucun element',
  message,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-surface-border bg-surface-raised px-6 py-10 text-center ${className}`}
    >
      <p className="text-sm font-medium text-content-primary">{title}</p>
      {message ? (
        <p className="max-w-md text-sm text-content-secondary">{message}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}