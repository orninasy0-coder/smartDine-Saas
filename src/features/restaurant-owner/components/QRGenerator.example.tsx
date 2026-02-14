import { useState } from 'react';
import { QRGenerator } from './QRGenerator';
import type { QRCodeData } from '../types';

/**
 * QRGenerator Component Example
 * 
 * This example demonstrates how to use the QRGenerator component
 * with mock data and handlers.
 */

// Mock QR codes data
const mockQRCodes: QRCodeData[] = [
  {
    id: 'qr-1',
    restaurantId: 'restaurant-1',
    tableNumber: 'طاولة 1',
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'qr-2',
    restaurantId: 'restaurant-1',
    tableNumber: 'طاولة 2',
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'qr-3',
    restaurantId: 'restaurant-1',
    tableNumber: 'طاولة 3',
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: new Date('2024-01-16'),
  },
];

export function QRGeneratorExample() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(mockQRCodes);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (tableNumber: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for duplicate
    const exists = qrCodes.some((qr) => qr.tableNumber === tableNumber);
    if (exists) {
      throw new Error('QR code already exists for this table number');
    }

    // Create new QR code
    const newQRCode: QRCodeData = {
      id: `qr-${Date.now()}`,
      restaurantId: 'restaurant-1',
      tableNumber,
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      createdAt: new Date(),
    };

    setQRCodes((prev) => [...prev, newQRCode]);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
    setIsLoading(false);
  };

  const handleDownload = (qrCode: QRCodeData) => {
    console.log('Downloading QR code:', qrCode.tableNumber);
    // In real implementation, this would trigger a file download
    alert(`تحميل رمز QR لـ ${qrCode.tableNumber}`);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">QR Generator Example</h1>
        
        <QRGenerator
          qrCodes={qrCodes}
          onGenerate={handleGenerate}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

/**
 * Example: Empty State
 */
export function QRGeneratorEmptyExample() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);

  const handleGenerate = async (tableNumber: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newQRCode: QRCodeData = {
      id: `qr-${Date.now()}`,
      restaurantId: 'restaurant-1',
      tableNumber,
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      createdAt: new Date(),
    };

    setQRCodes([newQRCode]);
  };

  const handleDelete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const handleDownload = (qrCode: QRCodeData) => {
    console.log('Downloading:', qrCode.tableNumber);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">QR Generator - Empty State</h1>
        
        <QRGenerator
          qrCodes={qrCodes}
          onGenerate={handleGenerate}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={false}
        />
      </div>
    </div>
  );
}

/**
 * Example: Loading State
 */
export function QRGeneratorLoadingExample() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">QR Generator - Loading State</h1>
        
        <QRGenerator
          qrCodes={[]}
          onGenerate={async () => {}}
          onDelete={async () => {}}
          onDownload={() => {}}
          isLoading={true}
        />
      </div>
    </div>
  );
}

/**
 * Example: Many QR Codes
 */
export function QRGeneratorManyExample() {
  const manyQRCodes: QRCodeData[] = Array.from({ length: 20 }, (_, i) => ({
    id: `qr-${i + 1}`,
    restaurantId: 'restaurant-1',
    tableNumber: `طاولة ${i + 1}`,
    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: new Date(2024, 0, 15 + Math.floor(i / 5)),
  }));

  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(manyQRCodes);

  const handleGenerate = async (tableNumber: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newQRCode: QRCodeData = {
      id: `qr-${Date.now()}`,
      restaurantId: 'restaurant-1',
      tableNumber,
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      createdAt: new Date(),
    };

    setQRCodes((prev) => [...prev, newQRCode]);
  };

  const handleDelete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const handleDownload = (qrCode: QRCodeData) => {
    console.log('Downloading:', qrCode.tableNumber);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">QR Generator - Many QR Codes</h1>
        
        <QRGenerator
          qrCodes={qrCodes}
          onGenerate={handleGenerate}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={false}
        />
      </div>
    </div>
  );
}

export default QRGeneratorExample;
