import { useState } from 'react';
import { Pencil, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { StaffMember } from '../types';

interface StaffTableProps {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  onToggleStatus: (staffId: string, isActive: boolean) => void;
  isLoading?: boolean;
}

export function StaffTable({
  staff,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: StaffTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (staffId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    setDeletingId(staffId);
    try {
      await onDelete(staffId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: boolean) => {
    setTogglingId(staffId);
    try {
      await onToggleStatus(staffId, !currentStatus);
    } finally {
      setTogglingId(null);
    }
  };

  const getRoleBadge = (role: StaffMember['role']) => {
    const roleConfig = {
      kitchen: { label: 'مطبخ', labelEn: 'Kitchen', variant: 'default' as const },
      delivery: { label: 'توصيل', labelEn: 'Delivery', variant: 'secondary' as const },
    };

    const config = roleConfig[role];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">لا يوجد موظفين</h3>
        <p className="text-muted-foreground">ابدأ بإضافة موظفين جدد لمطعمك</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-right py-3 px-4 font-semibold">الاسم</th>
            <th className="text-right py-3 px-4 font-semibold">البريد الإلكتروني</th>
            <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
            <th className="text-right py-3 px-4 font-semibold">الدور</th>
            <th className="text-right py-3 px-4 font-semibold">الحالة</th>
            <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium">{member.name}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-muted-foreground" dir="ltr">
                  {member.phone}
                </div>
              </td>
              <td className="py-3 px-4">{getRoleBadge(member.role)}</td>
              <td className="py-3 px-4">
                <Badge variant={member.isActive ? 'default' : 'secondary'}>
                  {member.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(member.id, member.isActive)}
                    disabled={togglingId === member.id}
                    title={member.isActive ? 'تعطيل' : 'تفعيل'}
                  >
                    {togglingId === member.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : member.isActive ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(member)}
                    title="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    disabled={deletingId === member.id}
                    className="text-destructive hover:text-destructive"
                    title="حذف"
                  >
                    {deletingId === member.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
