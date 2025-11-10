import React from 'react';
import clsx from 'clsx';

export const Select = ({
  label,
  options = [],
  error,
  helpText,
  className = '',
  required = false,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random()}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${selectId}` : undefined}
        {...props}
      >
        <option value="">-- Sélectionner une option --</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`error-${selectId}`} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};