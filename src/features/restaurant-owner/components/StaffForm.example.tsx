/**
 * StaffForm Component Example
 * 
 * This example demonstrates how to use the StaffForm component
 * for both adding new staff and editing existing staff.
 */

import { useState } from 'react';
import { StaffForm } from './StaffForm';
import { Button } from '@/components/ui/button';
import type { StaffMember, StaffFormData } from '../types';

// Sample existing staff for edit mode
const sampleStaff: StaffMember = {
  id: 'staff-1',
  restaurantId: 'restaurant-1',
  name: 'Ahmed Hassan',
  email: 'ahmed.hassan@example.com',
  phone: '+966501234567',
  role: 'kitchen',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export function StaffFormExample() {
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const handleSubmit = async (data: StaffFormData) => {
    console.log('Form submitted:', data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (mode === 'add') {
      console.log('Creating new staff member...');
    } else {
      console.log('Updating staff member...');
    }
    
    alert('Staff saved successfully!');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Staff Form Examples</h2>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === 'add' ? 'default' : 'outline'}
          onClick={() => setMode('add')}
        >
          Add Mode
        </Button>
        <Button
          variant={mode === 'edit' ? 'default' : 'outline'}
          onClick={() => setMode('edit')}
        >
          Edit Mode
        </Button>
      </div>

      {/* Add New Staff Form */}
      {mode === 'add' && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Staff</h3>
          <StaffForm
            staff={null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Edit Existing Staff Form */}
      {mode === 'edit' && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Existing Staff</h3>
          <StaffForm
            staff={sampleStaff}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Form Validation Examples */}
      <div className="mt-8 bg-muted rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Validation Rules</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Name:</strong> Required, minimum 2 characters
          </li>
          <li>
            <strong>Email:</strong> Required, valid email format
          </li>
          <li>
            <strong>Phone:</strong> Required, 10-15 digits (with optional + prefix)
          </li>
          <li>
            <strong>Role:</strong> Required, must select Kitchen or Delivery
          </li>
          <li>
            <strong>Active Status:</strong> Optional, defaults to true
          </li>
        </ul>
      </div>

      {/* Usage Example Code */}
      <div className="mt-8 bg-muted rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Usage Example</h3>
        <pre className="text-xs overflow-x-auto">
          {`import { StaffForm } from '@/features/restaurant-owner';

// Add new staff
<StaffForm
  staff={null}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>

// Edit existing staff
<StaffForm
  staff={existingStaff}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>`}
        </pre>
      </div>
    </div>
  );
}
