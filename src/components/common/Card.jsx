import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {title && (
        <div className={padding ? '-mx-6 -mt-6 mb-6 px-6 pt-6 pb-4 border-b border-gray-200' : 'mb-4'}>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};