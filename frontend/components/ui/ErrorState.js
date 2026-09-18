export default function ErrorState({
  title = 'Une erreur est survenue',
  message,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`rounded-md border border-state-danger/30 bg-state-danger/10 p-4 ${className}`}
    >
      <p className="text-sm font-medium text-state-danger">{title}</p>
      {message ? (
        <p className="mt-1 text-sm text-content-secondary">{message}</p>
      ) : null}
    </div>
  );
}