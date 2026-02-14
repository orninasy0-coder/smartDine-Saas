import { WorkingHoursForm } from './WorkingHoursForm';
import type { DaySchedule } from '../types';

/**
 * Example: Working Hours Form
 * 
 * Demonstrates the working hours form component
 */

const mockWorkingHours: DaySchedule[] = [
  {
    day: 'Sunday',
    dayAr: 'الأحد',
    dayOfWeek: 0,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Monday',
    dayAr: 'الإثنين',
    dayOfWeek: 1,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Tuesday',
    dayAr: 'الثلاثاء',
    dayOfWeek: 2,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Wednesday',
    dayAr: 'الأربعاء',
    dayOfWeek: 3,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Thursday',
    dayAr: 'الخميس',
    dayOfWeek: 4,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Friday',
    dayAr: 'الجمعة',
    dayOfWeek: 5,
    isOpen: true,
    openTime: '13:00',
    closeTime: '00:00',
  },
  {
    day: 'Saturday',
    dayAr: 'السبت',
    dayOfWeek: 6,
    isOpen: false,
    openTime: '12:00',
    closeTime: '23:00',
  },
];

export function WorkingHoursFormExample() {
  const handleSubmit = async (schedule: DaySchedule[]) => {
    console.log('Submitting working hours:', schedule);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Working hours updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Working Hours Form</h1>
        <p className="text-muted-foreground">
          Example of the working hours form component
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <WorkingHoursForm
          workingHours={mockWorkingHours}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default WorkingHoursFormExample;
