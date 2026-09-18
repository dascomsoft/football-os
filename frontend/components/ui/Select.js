'use client';

import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className = '', id, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-content-secondary"
        >
          {label}
        </label>
      ) : null}

      <select
        ref={ref}
        id={selectId}
        className={`h-10 rounded-md border bg-surface-raised px-3 text-sm text-content-primary focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-state-danger' : 'border-surface-border'
        } ${className}`}
        {...rest}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <span className="text-xs text-state-danger">{error}</span>
      ) : null}

      {!error && hint ? (
        <span className="text-xs text-content-muted">{hint}</span>
      ) : null}
    </div>
  );
});

export default Select;