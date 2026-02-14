import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Container } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RestaurantInfoForm } from '../components/RestaurantInfoForm';
import { WorkingHoursForm } from '../components/WorkingHoursForm';
import {
  fetchRestaurantInfo,
  updateRestaurantInfo,
  fetchWorkingHours,
  updateWorkingHours,
} from '../services/settingsService';
import type {
  RestaurantInfo,
  RestaurantInfoFormData,
  DaySchedule,
} from '../types';
import { toast } from 'sonner';

export function Settings() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    null
  );
  const [workingHours, setWorkingHours] = useState<DaySchedule[]>([]);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isLoadingHours, setIsLoadingHours] = useState(true);

  // Mock restaurant ID - in production, get from auth context
  const restaurantId = 'restaurant-1';

  useEffect(() => {
    loadRestaurantInfo();
    loadWorkingHours();
  }, []);

  const loadRestaurantInfo = async () => {
    setIsLoadingInfo(true);
    try {
      const data = await fetchRestaurantInfo(restaurantId);
      setRestaurantInfo(data);
    } catch (error) {
      console.error('Error loading restaurant info:', error);
      toast.error('فشل تحميل معلومات المطعم');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const loadWorkingHours = async () => {
    setIsLoadingHours(true);
    try {
      const data = await fetchWorkingHours(restaurantId);
      setWorkingHours(data);
    } catch (error) {
      console.error('Error loading working hours:', error);
      toast.error('فشل تحميل ساعات العمل');
    } finally {
      setIsLoadingHours(false);
    }
  };

  const handleUpdateRestaurantInfo = async (data: RestaurantInfoFormData) => {
    try {
      const updated = await updateRestaurantInfo(restaurantId, data);
      setRestaurantInfo(updated);
      toast.success('تم تحديث معلومات المطعم بنجاح');
    } catch (error) {
      console.error('Error updating restaurant info:', error);
      toast.error('فشل تحديث معلومات المطعم');
      throw error;
    }
  };

  const handleUpdateWorkingHours = async (schedule: DaySchedule[]) => {
    try {
      const updated = await updateWorkingHours(restaurantId, schedule);
      setWorkingHours(updated);
      toast.success('تم تحديث ساعات العمل بنجاح');
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('فشل تحديث ساعات العمل');
      throw error;
    }
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">الإعدادات</h1>
          </div>
          <p className="text-muted-foreground">
            إدارة معلومات المطعم وساعات العمل
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="info">معلومات المطعم</TabsTrigger>
            <TabsTrigger value="hours">ساعات العمل</TabsTrigger>
          </TabsList>

          {/* Restaurant Info Tab */}
          <TabsContent value="info">
            <div className="bg-card rounded-lg border p-6">
              {isLoadingInfo ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <RestaurantInfoForm
                  restaurantInfo={restaurantInfo}
                  onSubmit={handleUpdateRestaurantInfo}
                  isLoading={isLoadingInfo}
                />
              )}
            </div>
          </TabsContent>

          {/* Working Hours Tab */}
          <TabsContent value="hours">
            <div className="bg-card rounded-lg border p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">ساعات العمل</h2>
                <p className="text-sm text-muted-foreground">
                  حدد ساعات عمل المطعم لكل يوم من أيام الأسبوع
                </p>
              </div>

              {isLoadingHours ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <WorkingHoursForm
                  workingHours={workingHours}
                  onSubmit={handleUpdateWorkingHours}
                  isLoading={isLoadingHours}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
