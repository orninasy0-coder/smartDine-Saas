import type { StaffMember, StaffFormData } from '../types';

/**
 * Staff Service
 * Handles CRUD operations for restaurant staff members
 * 
 * Note: This is a mock implementation. In production, replace with actual API calls
 * using InsForge SDK or your backend API.
 */

// Mock data store (replace with actual API calls)
let mockStaff: StaffMember[] = [];

/**
 * Fetch all staff members for a restaurant
 */
export async function fetchStaff(restaurantId: string): Promise<StaffMember[]> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data, error } = await client.from('staff')
  //   .select('*')
  //   .eq('restaurantId', restaurantId)
  //   .order('createdAt', { ascending: false });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStaff.filter((s) => s.restaurantId === restaurantId));
    }, 500);
  });
}

/**
 * Fetch a single staff member by ID
 */
export async function fetchStaffMember(staffId: string): Promise<StaffMember | null> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data, error } = await client.from('staff')
  //   .select('*')
  //   .eq('id', staffId)
  //   .single();
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const staff = mockStaff.find((s) => s.id === staffId);
      resolve(staff || null);
    }, 300);
  });
}

/**
 * Create a new staff member
 */
export async function createStaffMember(
  restaurantId: string,
  data: StaffFormData
): Promise<StaffMember> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data: newStaff, error } = await client.from('staff')
  //   .insert([{ ...data, restaurantId }])
  //   .select()
  //   .single();
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        restaurantId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStaff.push(newStaff);
      resolve(newStaff);
    }, 500);
  });
}

/**
 * Update an existing staff member
 */
export async function updateStaffMember(
  staffId: string,
  data: Partial<StaffFormData>
): Promise<StaffMember> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data: updatedStaff, error } = await client.from('staff')
  //   .update({ ...data, updatedAt: new Date() })
  //   .eq('id', staffId)
  //   .select()
  //   .single();
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStaff.findIndex((s) => s.id === staffId);
      if (index === -1) {
        reject(new Error('Staff member not found'));
        return;
      }
      
      mockStaff[index] = {
        ...mockStaff[index],
        ...data,
        updatedAt: new Date(),
      };
      resolve(mockStaff[index]);
    }, 500);
  });
}

/**
 * Delete a staff member
 */
export async function deleteStaffMember(staffId: string): Promise<void> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { error } = await client.from('staff')
  //   .delete()
  //   .eq('id', staffId);
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStaff.findIndex((s) => s.id === staffId);
      if (index === -1) {
        reject(new Error('Staff member not found'));
        return;
      }
      
      mockStaff.splice(index, 1);
      resolve();
    }, 500);
  });
}

/**
 * Toggle staff member active status
 */
export async function toggleStaffStatus(
  staffId: string,
  isActive: boolean
): Promise<StaffMember> {
  return updateStaffMember(staffId, { isActive });
}

// Initialize with some mock data for development
if (mockStaff.length === 0) {
  mockStaff = [
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
}
