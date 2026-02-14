/**
 * Admin Home Page Example
 * Demonstrates the Platform Admin Dashboard with sample data
 */

import { AdminHome } from './AdminHome';

export default function AdminHomeExample() {
  return (
    <div className="min-h-screen">
      <AdminHome />
    </div>
  );
}

// Storybook-style metadata
AdminHomeExample.displayName = 'AdminHome Example';
AdminHomeExample.description = 'Platform admin dashboard home page with statistics and monitoring';
