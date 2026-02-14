import { useState, useEffect } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { RestaurantInfo, RestaurantInfoFormData } from '../types';
import { CUISINE_TYPES, PRICE_RANGES } from '../types';

interface RestaurantInfoFormProps {
  restaurantInfo: RestaurantInfo | null;
  onSubmit: (data: RestaurantInfoFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RestaurantInfoForm({
  restaurantInfo,
  onSubmit,
  isLoading = false,
}: RestaurantInfoFormProps) {
  const [formData, setFormData] = useState<RestaurantInfoFormData>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    phone: '',
    email: '',
    address: '',
    addressAr: '',
    city: '',
    country: '',
    logoUrl: '',
    coverImageUrl: '',
    cuisineType: [],
    priceRange: 'moderate',
    capacity: 50,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RestaurantInfoFormData, string>>>({});
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (restaurantInfo) {
      setFormData({
        name: restaurantInfo.name,
        nameAr: restaurantInfo.nameAr || '',
        description: restaurantInfo.description,
        descriptionAr: restaurantInfo.descriptionAr || '',
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        addressAr: restaurantInfo.addressAr || '',
        city: restaurantInfo.city,
        country: restaurantInfo.country,
        logoUrl: restaurantInfo.logoUrl || '',
        coverImageUrl: restaurantInfo.coverImageUrl || '',
        cuisineType: restaurantInfo.cuisineType,
        priceRange: restaurantInfo.priceRange,
        capacity: restaurantInfo.capacity,
      });
    }
  }, [restaurantInfo]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RestaurantInfoFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المطعم مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'رقم هاتف غير صالح';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'بريد إلكتروني غير صالح';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'الدولة مطلوبة';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'السعة يجب أن تكون أكبر من صفر';
    }

    if (formData.cuisineType.length === 0) {
      newErrors.cuisineType = 'يجب اختيار نوع مطبخ واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof RestaurantInfoFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddCuisine = () => {
    if (selectedCuisine && !formData.cuisineType.includes(selectedCuisine)) {
      handleChange('cuisineType', [...formData.cuisineType, selectedCuisine]);
      setSelectedCuisine('');
    }
  };

  const handleRemoveCuisine = (cuisine: string) => {
    handleChange(
      'cuisineType',
      formData.cuisineType.filter((c) => c !== cuisine)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المطعم (English) *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Restaurant Name"
              disabled={isSaving || isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameAr">اسم المطعم (العربية)</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleChange('nameAr', e.target.value)}
              placeholder="اسم المطعم"
              disabled={isSaving || isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">الوصف (English) *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Restaurant description"
              rows={3}
              disabled={isSaving || isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptionAr">الوصف (العربية)</Label>
            <Textarea
              id="descriptionAr"
              value={formData.descriptionAr}
              onChange={(e) => handleChange('descriptionAr', e.target.value)}
              placeholder="وصف المطعم"
              rows={3}
              disabled={isSaving || isLoading}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+966 50 123 4567"
              disabled={isSaving || isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="restaurant@example.com"
              disabled={isSaving || isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">الموقع</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">العنوان (English) *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street"
              disabled={isSaving || isLoading}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressAr">العنوان (العربية)</Label>
            <Input
              id="addressAr"
              value={formData.addressAr}
              onChange={(e) => handleChange('addressAr', e.target.value)}
              placeholder="شارع الملك فهد"
              disabled={isSaving || isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">المدينة *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Riyadh"
              disabled={isSaving || isLoading}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">الدولة *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="Saudi Arabia"
              disabled={isSaving || isLoading}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">تفاصيل المطعم</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceRange">الفئة السعرية *</Label>
            <Select
              value={formData.priceRange}
              onValueChange={(value: any) => handleChange('priceRange', value)}
              disabled={isSaving || isLoading}
            >
              <SelectTrigger id="priceRange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.labelAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">السعة (عدد المقاعد) *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
              disabled={isSaving || isLoading}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">{errors.capacity}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>نوع المطبخ *</Label>
          <div className="flex gap-2">
            <Select
              value={selectedCuisine}
              onValueChange={setSelectedCuisine}
              disabled={isSaving || isLoading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="اختر نوع المطبخ" />
              </SelectTrigger>
              <SelectContent>
                {CUISINE_TYPES.filter(
                  (type) => !formData.cuisineType.includes(type)
                ).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddCuisine}
              disabled={!selectedCuisine || isSaving || isLoading}
            >
              إضافة
            </Button>
          </div>
          
          {formData.cuisineType.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.cuisineType.map((cuisine) => (
                <Badge key={cuisine} variant="secondary" className="gap-1">
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => handleRemoveCuisine(cuisine)}
                    className="ml-1 hover:text-destructive"
                    disabled={isSaving || isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          {errors.cuisineType && (
            <p className="text-sm text-destructive">{errors.cuisineType}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">الصور</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">رابط الشعار</Label>
            <div className="flex gap-2">
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                disabled={isSaving || isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSaving || isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.logoUrl && (
              <img
                src={formData.logoUrl}
                alt="Logo preview"
                className="w-24 h-24 object-cover rounded border"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">رابط صورة الغلاف</Label>
            <div className="flex gap-2">
              <Input
                id="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                placeholder="https://example.com/cover.jpg"
                disabled={isSaving || isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSaving || isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.coverImageUrl && (
              <img
                src={formData.coverImageUrl}
                alt="Cover preview"
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSaving || isLoading}>
          <Save className="ml-2 h-4 w-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </form>
  );
}
