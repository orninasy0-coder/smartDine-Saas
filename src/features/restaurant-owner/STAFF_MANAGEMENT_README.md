# Staff Management Feature

## Overview

The Staff Management feature allows restaurant owners to manage their kitchen and delivery staff members. This includes adding new staff, editing existing staff information, toggling active status, and removing staff members.

## Components

### StaffTable

A comprehensive table component that displays all staff members with their details and action buttons.

**Features:**
- Display staff information (name, email, phone, role, status)
- Role badges (Kitchen/Delivery)
- Status badges (Active/Inactive)
- Action buttons (Edit, Delete, Toggle Status)
- Loading states
- Empty state
- Confirmation dialogs for destructive actions

**Props:**
```typescript
interface StaffTableProps {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  onToggleStatus: (staffId: string, isActive: boolean) => void;
  isLoading?: boolean;
}
```

### StaffForm

A form component for adding new staff members or editing existing ones.

**Features:**
- Form validation (name, email, phone, role)
- Email format validation
- Phone number validation
- Role selection (Kitchen/Delivery)
- Active status toggle
- Error messages
- Loading states during submission

**Props:**
```typescript
interface StaffFormProps {
  staff?: StaffMember | null;
  onSubmit: (data: StaffFormData) => Promise<void>;
  onCancel: () => void;
}
```

**Validation Rules:**
- Name: Required, minimum 2 characters
- Email: Required, valid email format
- Phone: Required, 10-15 digits (with optional + prefix)
- Role: Required (kitchen or delivery)

### StaffManagement Page

The main page component that integrates all staff management functionality.

**Features:**
- Staff statistics (total, kitchen, delivery)
- Add new staff button
- Staff table with all operations
- Modal dialog for add/edit forms
- Toast notifications for success/error feedback
- Real-time updates after operations

## Service Layer

### staffService.ts

Provides all CRUD operations for staff management:

```typescript
// Fetch all staff for a restaurant
fetchStaff(restaurantId: string): Promise<StaffMember[]>

// Fetch single staff member
fetchStaffMember(staffId: string): Promise<StaffMember | null>

// Create new staff member
createStaffMember(restaurantId: string, data: StaffFormData): Promise<StaffMember>

// Update existing staff member
updateStaffMember(staffId: string, data: Partial<StaffFormData>): Promise<StaffMember>

// Delete staff member
deleteStaffMember(staffId: string): Promise<void>

// Toggle staff active status
toggleStaffStatus(staffId: string, isActive: boolean): Promise<StaffMember>
```

**Note:** Current implementation uses mock data. Replace with actual API calls using InsForge SDK or your backend API.

## Types

### StaffMember
```typescript
interface StaffMember {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  phone: string;
  role: 'kitchen' | 'delivery';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### StaffFormData
```typescript
interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: 'kitchen' | 'delivery';
  isActive: boolean;
}
```

## Usage

### Basic Implementation

```typescript
import { StaffManagement } from '@/features/restaurant-owner';

function App() {
  return <StaffManagement />;
}
```

### Routing Setup

```typescript
import { StaffManagement } from '@/features/restaurant-owner';

// In your router configuration
{
  path: '/dashboard/staff',
  element: (
    <ProtectedRoute requiredRoles={['restaurant_owner']}>
      <StaffManagement />
    </ProtectedRoute>
  ),
}
```

## User Flow

1. **View Staff List**
   - Restaurant owner navigates to `/dashboard/staff`
   - Sees statistics and list of all staff members
   - Can filter view by role using the stats cards

2. **Add New Staff**
   - Clicks "إضافة موظف" (Add Staff) button
   - Modal opens with empty form
   - Fills in staff details (name, email, phone, role)
   - Submits form
   - Success toast appears
   - Staff list refreshes with new member

3. **Edit Staff**
   - Clicks edit icon (pencil) on staff row
   - Modal opens with pre-filled form
   - Updates staff information
   - Submits form
   - Success toast appears
   - Staff list refreshes with updated data

4. **Toggle Status**
   - Clicks status toggle icon (UserCheck/UserX)
   - Staff status changes immediately
   - Success toast appears
   - Badge updates to reflect new status

5. **Delete Staff**
   - Clicks delete icon (trash)
   - Confirmation dialog appears
   - Confirms deletion
   - Success toast appears
   - Staff removed from list

## Integration with Backend

### Using InsForge SDK

Replace mock implementations in `staffService.ts` with actual API calls:

```typescript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: process.env.VITE_INSFORGE_URL,
  anonKey: process.env.VITE_INSFORGE_ANON_KEY,
});

export async function fetchStaff(restaurantId: string): Promise<StaffMember[]> {
  const { data, error } = await client
    .from('staff')
    .select('*')
    .eq('restaurantId', restaurantId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createStaffMember(
  restaurantId: string,
  data: StaffFormData
): Promise<StaffMember> {
  const { data: newStaff, error } = await client
    .from('staff')
    .insert([{ ...data, restaurantId }])
    .select()
    .single();

  if (error) throw error;
  return newStaff;
}

// Similar implementations for update, delete, etc.
```

### Database Schema

Ensure your database has a `staff` table with the following structure:

```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('kitchen', 'delivery')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_staff_restaurant ON staff(restaurant_id);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_active ON staff(is_active);
```

## Styling

The feature uses:
- Tailwind CSS for styling
- shadcn/ui components (Button, Input, Label, Select, Dialog, Badge)
- Lucide icons (UserPlus, Pencil, Trash2, UserCheck, UserX, Users)
- RTL support for Arabic text
- Responsive design (mobile-first)

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly
- Color contrast compliance
- Loading states with spinners

## Error Handling

- Form validation with inline error messages
- Toast notifications for operation feedback
- Confirmation dialogs for destructive actions
- Loading states during async operations
- Error boundaries for component failures

## Future Enhancements

1. **Search and Filter**
   - Search staff by name or email
   - Filter by role (kitchen/delivery)
   - Filter by status (active/inactive)

2. **Bulk Operations**
   - Select multiple staff members
   - Bulk status toggle
   - Bulk delete

3. **Staff Permissions**
   - Granular permission management
   - Custom role creation
   - Access control per feature

4. **Staff Schedule**
   - Work schedule management
   - Shift assignments
   - Availability tracking

5. **Performance Metrics**
   - Orders handled per staff
   - Average preparation time
   - Delivery completion rate

6. **Export/Import**
   - Export staff list to CSV
   - Import staff from CSV
   - Bulk staff creation

## Testing

To test the staff management feature:

1. Navigate to `/dashboard/staff`
2. Verify staff list loads correctly
3. Test adding a new staff member
4. Test editing existing staff
5. Test toggling staff status
6. Test deleting staff
7. Verify form validation
8. Check responsive design on mobile

## Requirements Validated

✅ **Requirement 9.5**: Restaurant owner can manage staff accounts for kitchen and delivery personnel
✅ **Task 10.4.1**: Staff Table Component implemented
✅ **Task 10.4.2**: Add/Edit/Delete staff functionality implemented

## Related Features

- Dashboard Home (10.1)
- Menu Management (10.2)
- Analytics (10.3)
- Settings (10.5)
- QR Code Generation (10.6)
