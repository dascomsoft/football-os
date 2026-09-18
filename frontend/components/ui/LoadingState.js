export default function LoadingState({ label = 'Chargement...', className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-content-secondary ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}