/**
 * StaffTable Component Example
 * 
 * This example demonstrates how to use the StaffTable component
 * with sample data and event handlers.
 */

import { StaffTable } from './StaffTable';
import type { StaffMember } from '../types';

// Sample staff data
const sampleStaff: StaffMember[] = [
  {
    id: 'staff-1',
    restaurantId: 'restaurant-1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+966501234567',
    role: 'kitchen',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'staff-2',
    restaurantId: 'restaurant-1',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@example.com',
    phone: '+966507654321',
    role: 'delivery',
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'staff-3',
    restaurantId: 'restaurant-1',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    phone: '+966509876543',
    role: 'kitchen',
    isActive: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

export function StaffTableExample() {
  const handleEdit = (staff: StaffMember) => {
    console.log('Edit staff:', staff);
    // Open edit modal with staff data
  };

  const handleDelete = async (staffId: string) => {
    console.log('Delete staff:', staffId);
    // Call delete API
  };

  const handleToggleStatus = async (staffId: string, isActive: boolean) => {
    console.log('Toggle status:', staffId, isActive);
    // Call toggle status API
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Staff Table Example</h2>
      
      <div className="bg-card rounded-lg border">
        <StaffTable
          staff={sampleStaff}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isLoading={false}
        />
      </div>

      {/* Loading State Example */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Loading State</h3>
        <div className="bg-card rounded-lg border">
          <StaffTable
            staff={[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={true}
          />
        </div>
      </div>

      {/* Empty State Example */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Empty State</h3>
        <div className="bg-card rounded-lg border">
          <StaffTable
            staff={[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}
