import { useState, useEffect } from 'react';
import { QrCode, Download, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import type { QRCodeData } from '../types';

interface QRGeneratorProps {
  qrCodes: QRCodeData[];
  onGenerate: (tableNumber: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownload: (qrCode: QRCodeData) => void;
  isLoading?: boolean;
}

export function QRGenerator({
  qrCodes,
  onGenerate,
  onDelete,
  onDownload,
  isLoading = false,
}: QRGeneratorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!tableNumber.trim()) return;

    setIsGenerating(true);
    try {
      await onGenerate(tableNumber.trim());
      setTableNumber('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف رمز QR هذا؟')) return;

    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">رموز QR للطاولات</h2>
          <p className="text-sm text-muted-foreground mt-1">
            قم بإنشاء وإدارة رموز QR للطاولات في مطعمك
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة رمز QR جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء رمز QR جديد</DialogTitle>
              <DialogDescription>
                أدخل رقم الطاولة لإنشاء رمز QR خاص بها
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">رقم الطاولة</Label>
                <Input
                  id="tableNumber"
                  placeholder="مثال: طاولة 1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerate();
                    }
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isGenerating}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!tableNumber.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    إنشاء
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Codes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : qrCodes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد رموز QR</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ابدأ بإنشاء رمز QR للطاولة الأولى
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة رمز QR
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {qrCodes.map((qrCode) => (
            <Card key={qrCode.id} className="p-6">
              <div className="space-y-4">
                {/* Table Number */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{qrCode.tableNumber}</h3>
                </div>

                {/* QR Code Image */}
                <div className="bg-white p-4 rounded-lg border">
                  <img
                    src={qrCode.qrCodeUrl}
                    alt={`QR Code for ${qrCode.tableNumber}`}
                    className="w-full h-auto"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDownload(qrCode)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تحميل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(qrCode.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Created Date */}
                <div className="text-xs text-muted-foreground text-center">
                  تم الإنشاء: {new Date(qrCode.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
