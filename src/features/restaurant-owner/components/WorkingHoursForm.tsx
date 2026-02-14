import { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import type { DaySchedule } from '../types';
import { DAYS_OF_WEEK } from '../types';

interface WorkingHoursFormProps {
  workingHours: DaySchedule[];
  onSubmit: (data: DaySchedule[]) => Promise<void>;
  isLoading?: boolean;
}

export function WorkingHoursForm({
  workingHours,
  onSubmit,
  isLoading = false,
}: WorkingHoursFormProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialize schedule with provided data or defaults
    if (workingHours.length > 0) {
      setSchedule(workingHours);
    } else {
      // Create default schedule
      const defaultSchedule = DAYS_OF_WEEK.map((day) => ({
        ...day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '22:00',
        breakStartTime: '',
        breakEndTime: '',
      }));
      setSchedule(defaultSchedule);
    }
  }, [workingHours]);

  const validateSchedule = (): boolean => {
    const newErrors: Record<number, string> = {};

    schedule.forEach((day) => {
      if (day.isOpen) {
        // Validate open and close times
        if (!day.openTime || !day.closeTime) {
          newErrors[day.dayOfWeek] = 'يجب تحديد وقت الفتح والإغلاق';
          return;
        }

        // Check if close time is after open time
        const openMinutes = timeToMinutes(day.openTime);
        const closeMinutes = timeToMinutes(day.closeTime);

        if (closeMinutes <= openMinutes) {
          newErrors[day.dayOfWeek] = 'وقت الإغلاق يجب أن يكون بعد وقت الفتح';
          return;
        }

        // Validate break times if provided
        if (day.breakStartTime && day.breakEndTime) {
          const breakStartMinutes = timeToMinutes(day.breakStartTime);
          const breakEndMinutes = timeToMinutes(day.breakEndTime);

          if (breakStartMinutes < openMinutes || breakEndMinutes > closeMinutes) {
            newErrors[day.dayOfWeek] = 'وقت الاستراحة يجب أن يكون ضمن ساعات العمل';
            return;
          }

          if (breakEndMinutes <= breakStartMinutes) {
            newErrors[day.dayOfWeek] = 'وقت نهاية الاستراحة يجب أن يكون بعد وقت البداية';
            return;
          }
        } else if (day.breakStartTime || day.breakEndTime) {
          newErrors[day.dayOfWeek] = 'يجب تحديد وقت بداية ونهاية الاستراحة معاً';
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSchedule()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(schedule);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDay = (dayOfWeek: number, isOpen: boolean) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, isOpen } : day
      )
    );
    // Clear error when toggling
    if (errors[dayOfWeek]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[dayOfWeek];
        return newErrors;
      });
    }
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'openTime' | 'closeTime' | 'breakStartTime' | 'breakEndTime',
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
      )
    );
    // Clear error when user changes time
    if (errors[dayOfWeek]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[dayOfWeek];
        return newErrors;
      });
    }
  };

  const handleCopyToAll = (dayOfWeek: number) => {
    const sourceDay = schedule.find((d) => d.dayOfWeek === dayOfWeek);
    if (!sourceDay) return;

    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        isOpen: sourceDay.isOpen,
        openTime: sourceDay.openTime,
        closeTime: sourceDay.closeTime,
        breakStartTime: sourceDay.breakStartTime,
        breakEndTime: sourceDay.breakEndTime,
      }))
    );
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {schedule.map((day) => (
          <Card key={day.dayOfWeek} className="p-4">
            <div className="space-y-4">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={day.isOpen}
                    onCheckedChange={(checked) =>
                      handleToggleDay(day.dayOfWeek, checked)
                    }
                    disabled={isSaving || isLoading}
                  />
                  <div>
                    <div className="font-semibold">{day.dayAr}</div>
                    <div className="text-sm text-muted-foreground">
                      {day.day}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToAll(day.dayOfWeek)}
                  disabled={isSaving || isLoading}
                >
                  نسخ لجميع الأيام
                </Button>
              </div>

              {/* Time Inputs */}
              {day.isOpen && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`open-${day.dayOfWeek}`}>
                        <Clock className="inline h-4 w-4 ml-1" />
                        وقت الفتح
                      </Label>
                      <Input
                        id={`open-${day.dayOfWeek}`}
                        type="time"
                        value={day.openTime}
                        onChange={(e) =>
                          handleTimeChange(
                            day.dayOfWeek,
                            'openTime',
                            e.target.value
                          )
                        }
                        disabled={isSaving || isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`close-${day.dayOfWeek}`}>
                        <Clock className="inline h-4 w-4 ml-1" />
                        وقت الإغلاق
                      </Label>
                      <Input
                        id={`close-${day.dayOfWeek}`}
                        type="time"
                        value={day.closeTime}
                        onChange={(e) =>
                          handleTimeChange(
                            day.dayOfWeek,
                            'closeTime',
                            e.target.value
                          )
                        }
                        disabled={isSaving || isLoading}
                      />
                    </div>
                  </div>

                  {/* Break Times */}
                  <div className="border-t pt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      وقت الاستراحة (اختياري)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`break-start-${day.dayOfWeek}`}>
                          بداية الاستراحة
                        </Label>
                        <Input
                          id={`break-start-${day.dayOfWeek}`}
                          type="time"
                          value={day.breakStartTime || ''}
                          onChange={(e) =>
                            handleTimeChange(
                              day.dayOfWeek,
                              'breakStartTime',
                              e.target.value
                            )
                          }
                          disabled={isSaving || isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`break-end-${day.dayOfWeek}`}>
                          نهاية الاستراحة
                        </Label>
                        <Input
                          id={`break-end-${day.dayOfWeek}`}
                          type="time"
                          value={day.breakEndTime || ''}
                          onChange={(e) =>
                            handleTimeChange(
                              day.dayOfWeek,
                              'breakEndTime',
                              e.target.value
                            )
                          }
                          disabled={isSaving || isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors[day.dayOfWeek] && (
                    <p className="text-sm text-destructive">
                      {errors[day.dayOfWeek]}
                    </p>
                  )}
                </div>
              )}

              {!day.isOpen && (
                <p className="text-sm text-muted-foreground">مغلق</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSaving || isLoading}>
          <Save className="ml-2 h-4 w-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ ساعات العمل'}
        </Button>
      </div>
    </form>
  );
}
