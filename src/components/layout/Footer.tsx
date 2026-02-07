/**
 * Footer component - Main footer
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-navy-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} SmartDine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
