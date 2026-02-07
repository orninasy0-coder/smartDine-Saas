/**
 * Header component - Main navigation header
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-navy-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">SmartDine</div>
          {/* Navigation items will be added later */}
        </nav>
      </div>
    </header>
  );
};
