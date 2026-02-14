import { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { Container } from '@/components/common';
import { QRGenerator } from '../components/QRGenerator';
import {
  fetchQRCodes,
  generateQRCode,
  deleteQRCode,
  downloadQRCode,
} from '../services/qrCodeService';
import type { QRCodeData } from '../types';
import { toast } from 'sonner';

export function QRCodes() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock restaurant ID - in production, get from auth context
  const restaurantId = 'restaurant-1';

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQRCodes(restaurantId);
      setQRCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('فشل تحميل رموز QR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (tableNumber: string) => {
    try {
      const newQRCode = await generateQRCode(restaurantId, tableNumber);
      setQRCodes((prev) => [...prev, newQRCode]);
      toast.success(`تم إنشاء رمز QR لـ ${tableNumber} بنجاح`);
    } catch (error) {
      console.error('Error generating QR code:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('فشل إنشاء رمز QR');
      }
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQRCode(restaurantId, id);
      setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
      toast.success('تم حذف رمز QR بنجاح');
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('فشل حذف رمز QR');
      throw error;
    }
  };

  const handleDownload = (qrCode: QRCodeData) => {
    try {
      downloadQRCode(qrCode);
      toast.success(`تم تحميل رمز QR لـ ${qrCode.tableNumber}`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('فشل تحميل رمز QR');
    }
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <QrCode className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">رموز QR</h1>
          </div>
          <p className="text-muted-foreground">
            قم بإنشاء وإدارة رموز QR للطاولات في مطعمك. يمكن للعملاء مسح هذه الرموز
            للوصول إلى القائمة الرقمية وتقديم الطلبات.
          </p>
        </div>

        {/* QR Generator Component */}
        <QRGenerator
          qrCodes={qrCodes}
          onGenerate={handleGenerate}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </div>
    </Container>
  );
}
