import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-muted)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`bg-black/30 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-[var(--color-text-main)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
