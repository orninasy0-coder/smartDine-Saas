/**
 * DashboardLayout component - Layout for dashboard pages
 */

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-navy-950">{children}</main>
      </div>
    </div>
  );
};
