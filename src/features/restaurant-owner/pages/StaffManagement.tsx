import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Container } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StaffTable } from '../components/StaffTable';
import { StaffForm } from '../components/StaffForm';
import {
  fetchStaff,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  toggleStaffStatus,
} from '../services/staffService';
import type { StaffMember, StaffFormData } from '../types';
import { toast } from 'sonner';

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Mock restaurant ID - in production, get from auth context
  const restaurantId = 'restaurant-1';

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStaff(restaurantId);
      setStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast.error('فشل تحميل قائمة الموظفين');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };

  const handleSubmitStaff = async (data: StaffFormData) => {
    try {
      if (editingStaff) {
        // Update existing staff
        await updateStaffMember(editingStaff.id, data);
        toast.success('تم تحديث بيانات الموظف بنجاح');
      } else {
        // Create new staff
        await createStaffMember(restaurantId, data);
        toast.success('تم إضافة الموظف بنجاح');
      }
      
      setIsDialogOpen(false);
      setEditingStaff(null);
      await loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('فشل حفظ بيانات الموظف');
      throw error;
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await deleteStaffMember(staffId);
      toast.success('تم حذف الموظف بنجاح');
      await loadStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('فشل حذف الموظف');
    }
  };

  const handleToggleStatus = async (staffId: string, isActive: boolean) => {
    try {
      await toggleStaffStatus(staffId, isActive);
      toast.success(isActive ? 'تم تفعيل الموظف' : 'تم تعطيل الموظف');
      await loadStaff();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      toast.error('فشل تحديث حالة الموظف');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStaff(null);
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الموظفين</h1>
            <p className="text-muted-foreground">
              إدارة موظفي المطبخ والتوصيل
            </p>
          </div>
          <Button onClick={handleAddStaff}>
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة موظف
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">إجمالي الموظفين</div>
            <div className="text-2xl font-bold">{staff.length}</div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">موظفي المطبخ</div>
            <div className="text-2xl font-bold">
              {staff.filter((s) => s.role === 'kitchen').length}
            </div>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <div className="text-sm text-muted-foreground mb-1">موظفي التوصيل</div>
            <div className="text-2xl font-bold">
              {staff.filter((s) => s.role === 'delivery').length}
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-card rounded-lg border">
          <StaffTable
            staff={staff}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
              </DialogTitle>
            </DialogHeader>
            <StaffForm
              staff={editingStaff}
              onSubmit={handleSubmitStaff}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}
