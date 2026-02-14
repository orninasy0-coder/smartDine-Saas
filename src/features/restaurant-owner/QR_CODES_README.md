# QR Codes Feature - Restaurant Owner Dashboard

## Overview

The QR Codes feature allows restaurant owners to generate, manage, and download QR codes for their tables. Customers can scan these QR codes to access the digital menu and place orders directly from their devices.

## Components

### QRGenerator Component

**Location:** `src/features/restaurant-owner/components/QRGenerator.tsx`

A comprehensive component for managing QR codes with the following features:

- **Display QR Codes Grid**: Shows all generated QR codes in a responsive grid layout
- **Generate New QR Code**: Dialog interface to create QR codes for new tables
- **Download QR Code**: Download individual QR codes as PNG files
- **Delete QR Code**: Remove QR codes that are no longer needed
- **Empty State**: User-friendly message when no QR codes exist

**Props:**

```typescript
interface QRGeneratorProps {
  qrCodes: QRCodeData[];
  onGenerate: (tableNumber: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownload: (qrCode: QRCodeData) => void;
  isLoading?: boolean;
}
```

**Usage:**

```tsx
import { QRGenerator } from '@/features/restaurant-owner';

<QRGenerator
  qrCodes={qrCodes}
  onGenerate={handleGenerate}
  onDelete={handleDelete}
  onDownload={handleDownload}
  isLoading={isLoading}
/>
```

## Pages

### QRCodes Page

**Location:** `src/features/restaurant-owner/pages/QRCodes.tsx`

Main page for QR code management that integrates the QRGenerator component with the QR code service.

**Features:**

- Load existing QR codes on mount
- Generate new QR codes for tables
- Delete QR codes with confirmation
- Download QR codes as PNG files
- Toast notifications for all actions
- Loading states during API calls

**Route:** `/dashboard/qr-codes`

## Services

### QR Code Service

**Location:** `src/features/restaurant-owner/services/qrCodeService.ts`

Handles all QR code operations including generation, storage, and management.

**Functions:**

#### `fetchQRCodes(restaurantId: string): Promise<QRCodeData[]>`

Fetches all QR codes for a restaurant.

```typescript
const qrCodes = await fetchQRCodes('restaurant-1');
```

#### `generateQRCode(restaurantId: string, tableNumber: string): Promise<QRCodeData>`

Generates a new QR code for a specific table.

```typescript
const newQRCode = await generateQRCode('restaurant-1', 'Table 5');
```

**Features:**

- Validates that table number doesn't already exist
- Generates menu URL with restaurant and table parameters
- Creates QR code image as data URL
- Returns complete QR code data object

#### `deleteQRCode(restaurantId: string, qrCodeId: string): Promise<void>`

Deletes a QR code.

```typescript
await deleteQRCode('restaurant-1', 'qr-123');
```

#### `downloadQRCode(qrCode: QRCodeData): void`

Downloads a QR code as a PNG file.

```typescript
downloadQRCode(qrCode);
```

**Features:**

- Creates temporary download link
- Formats filename based on table number
- Automatically triggers download
- Cleans up temporary elements

#### `regenerateQRCode(restaurantId: string, qrCodeId: string): Promise<QRCodeData>`

Regenerates a QR code (useful if URL format changes).

```typescript
const updatedQRCode = await regenerateQRCode('restaurant-1', 'qr-123');
```

#### `bulkGenerateQRCodes(restaurantId: string, tableNumbers: string[]): Promise<QRCodeData[]>`

Generates multiple QR codes at once.

```typescript
const qrCodes = await bulkGenerateQRCodes('restaurant-1', [
  'Table 1',
  'Table 2',
  'Table 3',
]);
```

## Types

### QRCodeData

```typescript
interface QRCodeData {
  id: string;
  restaurantId: string;
  tableNumber: string;
  qrCodeUrl: string; // Data URL or hosted URL of the QR code image
  createdAt: Date;
}
```

### QRCodeFormData

```typescript
interface QRCodeFormData {
  tableNumber: string;
}
```

## QR Code Generation

The QR code generation uses the `qrcode` library with the following configuration:

```typescript
{
  width: 400,           // 400x400 pixels
  margin: 2,            // 2 module margin
  color: {
    dark: '#0A1628',    // Navy color from theme
    light: '#FFFFFF',   // White background
  },
  errorCorrectionLevel: 'H', // High error correction (30% recovery)
}
```

### Menu URL Format

Generated QR codes link to:

```
{baseUrl}/menu?restaurant={restaurantId}&table={tableNumber}
```

Example: `https://smartdine.com/menu?restaurant=restaurant-1&table=Table%201`

## Features

### 1. QR Code Generation

- Generate QR codes for individual tables
- Unique QR code per table number
- Prevents duplicate table numbers
- High error correction level for reliability

### 2. QR Code Display

- Responsive grid layout (1-4 columns based on screen size)
- QR code preview image
- Table number label
- Creation date
- Action buttons (Download, Delete)

### 3. QR Code Download

- Download as PNG file
- Filename format: `QR-{TableNumber}.png`
- High-quality 400x400px image
- Suitable for printing

### 4. QR Code Management

- Delete individual QR codes
- Confirmation dialog before deletion
- Bulk generation support (future enhancement)
- Regeneration capability (future enhancement)

### 5. Empty State

- User-friendly message when no QR codes exist
- Call-to-action button to create first QR code
- Icon and descriptive text

## User Flow

1. **Navigate to QR Codes Page**
   - Click "رموز QR" in the dashboard sidebar

2. **Generate QR Code**
   - Click "إضافة رمز QR جديد" button
   - Enter table number in dialog
   - Click "إنشاء" to generate
   - QR code appears in grid

3. **Download QR Code**
   - Click "تحميل" button on QR code card
   - PNG file downloads automatically
   - Print and place on table

4. **Delete QR Code**
   - Click trash icon on QR code card
   - Confirm deletion in dialog
   - QR code removed from grid

## Integration with Menu System

When customers scan a QR code:

1. QR code contains URL with restaurant ID and table number
2. Customer's device opens the URL in browser
3. Menu page loads with restaurant context
4. Table number is stored for order tracking
5. Customer can browse menu and place order
6. Order is associated with the table number

## Styling

The QR code feature follows the SmartDine design system:

- **Colors**: Navy (#0A1628) and White (#FFFFFF)
- **Icons**: Lucide React icons
- **Components**: shadcn/ui components
- **Layout**: Responsive grid with Container
- **Typography**: Arabic-first with RTL support

## Future Enhancements

### Planned Features

1. **Bulk Generation**
   - Generate QR codes for multiple tables at once
   - Input range (e.g., Tables 1-20)
   - Progress indicator during generation

2. **QR Code Customization**
   - Add restaurant logo to QR code
   - Custom colors
   - Different sizes for different use cases

3. **Print Layout**
   - Print-optimized layout for multiple QR codes
   - Include table number labels
   - Multiple QR codes per page

4. **QR Code Analytics**
   - Track scan count per QR code
   - Most/least used tables
   - Peak scanning times

5. **QR Code Templates**
   - Pre-designed templates with branding
   - Different styles for different occasions
   - Seasonal designs

6. **Dynamic QR Codes**
   - Update menu URL without regenerating
   - Redirect to different pages based on time
   - A/B testing different menu layouts

## Testing

### Manual Testing Checklist

- [ ] Generate QR code for new table
- [ ] Verify QR code appears in grid
- [ ] Download QR code as PNG
- [ ] Scan QR code with mobile device
- [ ] Verify menu loads with correct parameters
- [ ] Delete QR code
- [ ] Verify deletion confirmation
- [ ] Try to generate duplicate table number
- [ ] Verify error message for duplicate
- [ ] Test empty state display
- [ ] Test responsive layout on mobile
- [ ] Test loading states

### Unit Tests

```typescript
// Test QR code generation
describe('generateQRCode', () => {
  it('should generate QR code with correct URL', async () => {
    const qrCode = await generateQRCode('restaurant-1', 'Table 1');
    expect(qrCode.tableNumber).toBe('Table 1');
    expect(qrCode.qrCodeUrl).toContain('data:image/png');
  });

  it('should throw error for duplicate table number', async () => {
    await generateQRCode('restaurant-1', 'Table 1');
    await expect(generateQRCode('restaurant-1', 'Table 1')).rejects.toThrow();
  });
});
```

## Accessibility

- Keyboard navigation support
- Screen reader labels for all actions
- High contrast QR codes for better scanning
- Clear error messages
- Confirmation dialogs for destructive actions

## Performance

- QR code generation is async to prevent UI blocking
- Images are data URLs (no external requests)
- Lazy loading for large QR code lists
- Optimized grid layout with CSS Grid

## Security

- Restaurant ID validation
- Table number sanitization
- No sensitive data in QR codes
- Secure URL generation
- CSRF protection on API endpoints

## Browser Support

- Modern browsers with Canvas API support
- Mobile browsers for QR scanning
- Progressive enhancement for older browsers
- Fallback for browsers without Canvas support

## Dependencies

- `qrcode`: QR code generation library
- `@types/qrcode`: TypeScript types for qrcode
- `lucide-react`: Icons
- `sonner`: Toast notifications
- `@radix-ui/react-dialog`: Dialog component

## API Integration (Production)

In production, replace mock data with actual API calls:

```typescript
// Fetch QR codes
const response = await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes`);
const qrCodes = await response.json();

// Generate QR code
const response = await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tableNumber }),
});
const newQRCode = await response.json();

// Delete QR code
await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes/${qrCodeId}`, {
  method: 'DELETE',
});
```

## Troubleshooting

### QR Code Not Scanning

- Ensure QR code is printed clearly
- Check lighting conditions
- Verify QR code size is adequate (minimum 2cm x 2cm)
- Test with multiple QR scanner apps

### Generation Fails

- Check browser console for errors
- Verify Canvas API support
- Check network connectivity
- Verify restaurant ID is valid

### Download Not Working

- Check browser download permissions
- Verify popup blocker settings
- Try different browser
- Check available disk space

## Support

For issues or questions:

- Check console logs for errors
- Review browser compatibility
- Test with different devices
- Contact development team
