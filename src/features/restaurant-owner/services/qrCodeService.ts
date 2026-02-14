import QRCode from 'qrcode';
import type { QRCodeData } from '../types';

/**
 * QR Code Service
 * Handles QR code generation and management for restaurant tables
 */

// Mock data for development
const mockQRCodes: QRCodeData[] = [];

/**
 * Generate QR code URL for a table
 * In production, this would generate a URL to the restaurant's menu with table info
 */
function generateMenuUrl(restaurantId: string, tableNumber: string): string {
  // In production, this would be something like:
  // https://restaurant-slug.smartdine.com/menu?table=1
  const baseUrl = window.location.origin;
  return `${baseUrl}/menu?restaurant=${restaurantId}&table=${encodeURIComponent(tableNumber)}`;
}

/**
 * Generate QR code image as data URL
 */
async function generateQRCodeImage(url: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0A1628', // Navy color from theme
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Fetch all QR codes for a restaurant
 */
export async function fetchQRCodes(restaurantId: string): Promise<QRCodeData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, this would be an API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes`);
  // return response.json();

  return mockQRCodes.filter((qr) => qr.restaurantId === restaurantId);
}

/**
 * Generate a new QR code for a table
 */
export async function generateQRCode(
  restaurantId: string,
  tableNumber: string
): Promise<QRCodeData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if QR code already exists for this table
  const existingQRCode = mockQRCodes.find(
    (qr) => qr.restaurantId === restaurantId && qr.tableNumber === tableNumber
  );

  if (existingQRCode) {
    throw new Error('QR code already exists for this table number');
  }

  // Generate menu URL
  const menuUrl = generateMenuUrl(restaurantId, tableNumber);

  // Generate QR code image
  const qrCodeUrl = await generateQRCodeImage(menuUrl);

  // Create new QR code record
  const newQRCode: QRCodeData = {
    id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    restaurantId,
    tableNumber,
    qrCodeUrl,
    createdAt: new Date(),
  };

  // In production, this would be an API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ tableNumber }),
  // });
  // return response.json();

  mockQRCodes.push(newQRCode);
  return newQRCode;
}

/**
 * Delete a QR code
 */
export async function deleteQRCode(
  restaurantId: string,
  qrCodeId: string
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, this would be an API call:
  // await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes/${qrCodeId}`, {
  //   method: 'DELETE',
  // });

  const index = mockQRCodes.findIndex(
    (qr) => qr.id === qrCodeId && qr.restaurantId === restaurantId
  );

  if (index !== -1) {
    mockQRCodes.splice(index, 1);
  }
}

/**
 * Download QR code as PNG file
 */
export function downloadQRCode(qrCode: QRCodeData): void {
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = qrCode.qrCodeUrl;
  link.download = `QR-${qrCode.tableNumber.replace(/\s+/g, '-')}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Regenerate QR code (useful if URL format changes)
 */
export async function regenerateQRCode(
  restaurantId: string,
  qrCodeId: string
): Promise<QRCodeData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const qrCode = mockQRCodes.find(
    (qr) => qr.id === qrCodeId && qr.restaurantId === restaurantId
  );

  if (!qrCode) {
    throw new Error('QR code not found');
  }

  // Generate new QR code image
  const menuUrl = generateMenuUrl(restaurantId, qrCode.tableNumber);
  const qrCodeUrl = await generateQRCodeImage(menuUrl);

  // Update QR code
  qrCode.qrCodeUrl = qrCodeUrl;

  // In production, this would be an API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}/qr-codes/${qrCodeId}/regenerate`, {
  //   method: 'POST',
  // });
  // return response.json();

  return qrCode;
}

/**
 * Bulk generate QR codes for multiple tables
 */
export async function bulkGenerateQRCodes(
  restaurantId: string,
  tableNumbers: string[]
): Promise<QRCodeData[]> {
  const results: QRCodeData[] = [];

  for (const tableNumber of tableNumbers) {
    try {
      const qrCode = await generateQRCode(restaurantId, tableNumber);
      results.push(qrCode);
    } catch (error) {
      console.error(`Failed to generate QR code for ${tableNumber}:`, error);
      // Continue with other tables even if one fails
    }
  }

  return results;
}
