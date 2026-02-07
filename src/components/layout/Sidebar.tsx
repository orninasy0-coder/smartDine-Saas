/**
 * Sidebar component - Navigation sidebar for dashboards
 */

import React from 'react';

interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="w-64 bg-white dark:bg-navy-900 shadow-lg">
      <div className="p-4">{children}</div>
    </aside>
  );
};
