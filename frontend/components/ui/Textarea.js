'use client';

import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className = '', id, ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-content-secondary"
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`rounded-md border bg-surface-raised px-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
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

export default Textarea;