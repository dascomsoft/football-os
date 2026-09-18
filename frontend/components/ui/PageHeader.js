export default function PageHeader({ title, subtitle, action, className = '' }) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-content-primary">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-content-secondary">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}