'use client';

const VARIANT_CLASSES = {
  primary:
    'bg-accent text-white hover:bg-accent-muted disabled:bg-accent/40',
  secondary:
    'bg-surface-overlay text-content-primary border border-surface-border hover:bg-surface-raised disabled:opacity-50',
  danger:
    'bg-state-danger text-white hover:opacity-90 disabled:opacity-50',
  ghost:
    'bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-overlay disabled:opacity-50',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading;
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      <span>{children}</span>
    </button>
  );
}