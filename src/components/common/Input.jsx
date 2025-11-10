import React from 'react';
import clsx from 'clsx';

export const Input = ({
  label,
  error,
  helpText,
  className = '',
  required = false,
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || `input-${Math.random()}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={clsx(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${inputId}` : undefined}
        {...props}
      />
      {error && (
        <p id={`error-${inputId}`} className="text-sm text-red-600 mt-1">
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
