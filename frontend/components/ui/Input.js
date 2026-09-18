'use client';

import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-content-secondary"
        >
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={`h-10 rounded-md border bg-surface-raised px-3 text-sm text-content-primary placeholder:text-content-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-state-danger' : 'border-surface-border'
        } ${className}`}
        {...rest}
      />

      {error ? (
        <span className="text-xs text-state-danger">{error}</span>
      ) : null}

      {!error && hint ? (
        <span className="text-xs text-content-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;