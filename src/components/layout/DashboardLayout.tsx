/**
 * DashboardLayout component - Layout for dashboard pages
 */

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: 'owner' | 'kitchen' | 'delivery' | 'admin';
  showSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role = 'owner',
  showSidebar = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="authenticated" />
      <div className="flex flex-1">
        {showSidebar && <Sidebar role={role} />}
        <main className="flex-1 p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
};
