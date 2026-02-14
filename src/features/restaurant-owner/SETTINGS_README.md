# Settings Feature - Restaurant Owner Dashboard

## Overview

The Settings feature provides restaurant owners with comprehensive tools to manage their restaurant information and operating hours. This includes basic information, contact details, location, cuisine types, pricing, and a detailed weekly schedule.

## Components

### RestaurantInfoForm

A comprehensive form for managing restaurant information including:

**Basic Information:**
- Restaurant name (English & Arabic)
- Description (English & Arabic)

**Contact Information:**
- Phone number
- Email address

**Location:**
- Address (English & Arabic)
- City
- Country

**Restaurant Details:**
- Price range (Budget, Moderate, Fine Dining)
- Capacity (number of seats)
- Cuisine types (multiple selection)

**Images:**
- Logo URL
- Cover image URL

**Features:**
- Real-time validation
- Bilingual support (English/Arabic)
- Multi-cuisine type selection with badges
- Image preview
- Error handling with inline messages
- Loading states

**Usage:**
```tsx
import { RestaurantInfoForm } from '@/features/restaurant-owner';

<RestaurantInfoForm
  restaurantInfo={restaurantData}
  onSubmit={handleUpdateInfo}
  isLoading={false}
/>
```

**Props:**
- `restaurantInfo`: Current restaurant information (RestaurantInfo | null)
- `onSubmit`: Async function to handle form submission
- `isLoading`: Optional loading state

### WorkingHoursForm

A detailed weekly schedule manager for restaurant operating hours:

**Features:**
- Day-by-day schedule configuration
- Open/Closed toggle for each day
- Opening and closing times
- Optional break times
- "Copy to all days" functionality
- Time validation (close after open, break within hours)
- Visual day cards with Arabic/English labels

**Validation:**
- Ensures closing time is after opening time
- Validates break times are within operating hours
- Checks break end time is after break start time
- Requires both break times if one is provided

**Usage:**
```tsx
import { WorkingHoursForm } from '@/features/restaurant-owner';

<WorkingHoursForm
  workingHours={scheduleData}
  onSubmit={handleUpdateHours}
  isLoading={false}
/>
```

**Props:**
- `workingHours`: Array of day schedules (DaySchedule[])
- `onSubmit`: Async function to handle form submission
- `isLoading`: Optional loading state

## Pages

### Settings

The main settings page that combines both forms in a tabbed interface:

**Features:**
- Tab navigation between Restaurant Info and Working Hours
- Automatic data loading on mount
- Toast notifications for success/error
- Loading states for each tab
- Responsive layout

**Route:** `/settings` (or `/dashboard/settings`)

**Usage:**
```tsx
import { Settings } from '@/features/restaurant-owner';

<Route path="/settings" element={<Settings />} />
```

## Services

### settingsService.ts

Mock service for settings management. Replace with actual API calls when backend is ready.

**Functions:**

```typescript
// Fetch restaurant information
fetchRestaurantInfo(restaurantId: string): Promise<RestaurantInfo>

// Update restaurant information
updateRestaurantInfo(
  restaurantId: string, 
  data: RestaurantInfoFormData
): Promise<RestaurantInfo>

// Fetch working hours
fetchWorkingHours(restaurantId: string): Promise<DaySchedule[]>

// Update working hours
updateWorkingHours(
  restaurantId: string, 
  schedule: DaySchedule[]
): Promise<DaySchedule[]>
```

## Types

### RestaurantInfo
```typescript
interface RestaurantInfo {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  phone: string;
  email: string;
  address: string;
  addressAr?: string;
  city: string;
  country: string;
  logoUrl?: string;
  coverImageUrl?: string;
  cuisineType: string[];
  priceRange: 'budget' | 'moderate' | 'fine-dining';
  capacity: number;
  updatedAt: Date;
}
```

### DaySchedule
```typescript
interface DaySchedule {
  day: string;
  dayAr: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  isOpen: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  breakStartTime?: string;
  breakEndTime?: string;
}
```

### Constants

**DAYS_OF_WEEK:**
```typescript
const DAYS_OF_WEEK = [
  { day: 'Sunday', dayAr: 'الأحد', dayOfWeek: 0 },
  { day: 'Monday', dayAr: 'الإثنين', dayOfWeek: 1 },
  // ... etc
];
```

**CUISINE_TYPES:**
```typescript
const CUISINE_TYPES = [
  'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican',
  'Mediterranean', 'American', 'French', 'Thai', 'Arabic',
  'Fast Food', 'Seafood', 'Vegetarian', 'Vegan'
];
```

**PRICE_RANGES:**
```typescript
const PRICE_RANGES = [
  { value: 'budget', label: 'Budget', labelAr: 'اقتصادي' },
  { value: 'moderate', label: 'Moderate', labelAr: 'متوسط' },
  { value: 'fine-dining', label: 'Fine Dining', labelAr: 'فاخر' },
];
```

## Backend Integration

When integrating with the backend:

1. **Replace mock service calls** in `settingsService.ts` with actual API endpoints
2. **API Endpoints needed:**
   - `GET /api/v1/restaurants/:restaurantId` - Fetch restaurant info
   - `PUT /api/v1/restaurants/:restaurantId` - Update restaurant info
   - `GET /api/v1/restaurants/:restaurantId/working-hours` - Fetch hours
   - `PUT /api/v1/restaurants/:restaurantId/working-hours` - Update hours

3. **Example API integration:**
```typescript
export async function fetchRestaurantInfo(restaurantId: string) {
  const response = await fetch(`/api/v1/restaurants/${restaurantId}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurant info');
  }
  
  return response.json();
}
```

4. **Image Upload Integration:**
   - Integrate with FileUpload component for logo and cover images
   - Store uploaded image URLs in the database
   - Use CDN for image delivery

## Validation Rules

### Restaurant Info:
- Name (required, non-empty)
- Description (required, non-empty)
- Phone (required, valid phone format)
- Email (required, valid email format)
- Address (required, non-empty)
- City (required, non-empty)
- Country (required, non-empty)
- Capacity (required, > 0)
- Cuisine types (at least one required)

### Working Hours:
- If day is open, must have open and close times
- Close time must be after open time
- Break times must be within operating hours
- Break end must be after break start
- Both break times required if one is provided

## Styling

- Uses shadcn/ui components (Card, Input, Label, Select, Switch, Tabs, Button)
- Responsive grid layouts
- Arabic/English bilingual labels
- Loading spinners for async operations
- Toast notifications for feedback
- Error messages inline with form fields
- Badge components for cuisine types

## Examples

See example files:
- `RestaurantInfoForm.example.tsx` - Restaurant info form demo
- `WorkingHoursForm.example.tsx` - Working hours form demo

## Future Enhancements

1. **Image Upload UI**: Direct file upload instead of URL input
2. **Map Integration**: Location picker with Google Maps
3. **Timezone Support**: Handle different timezones for multi-location restaurants
4. **Holiday Schedule**: Special hours for holidays
5. **Seasonal Hours**: Different schedules for different seasons
6. **Notification Settings**: Email/SMS preferences
7. **Payment Settings**: Payment gateway configuration
8. **Tax Settings**: VAT/Tax configuration
9. **Delivery Settings**: Delivery radius and fees
10. **Social Media Links**: Instagram, Facebook, Twitter integration

## Task Status

- ✅ Task 10.5.1: Restaurant Information Form - COMPLETED
- ✅ Task 10.5.2: Working Hours Settings - COMPLETED
- ✅ Task 10.5: Settings Page - COMPLETED
