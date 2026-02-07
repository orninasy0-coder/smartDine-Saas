/**
 * Section component - Page section wrapper
 */

import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  title,
  description,
}) => {
  return (
    <section className={`py-12 ${className}`}>
      {(title || description) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          {description && <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};
