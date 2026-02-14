import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dish, DishFormData, DISH_CATEGORIES } from '../types';
import { FileUpload } from './FileUpload';

interface DishFormProps {
  dish?: Dish | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DishFormData) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
  onUploadModel?: (file: File) => Promise<string>;
}

export function DishForm({
  dish,
  open,
  onClose,
  onSubmit,
  onUploadImage,
  onUploadModel,
}: DishFormProps) {
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: 0,
    category: 'mains',
    imageUrl: '',
    modelUrl: '',
    ingredients: [],
    allergens: [],
    isAvailable: true,
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with dish data when editing
  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name,
        nameAr: dish.nameAr || '',
        description: dish.description,
        descriptionAr: dish.descriptionAr || '',
        price: dish.price,
        category: dish.category,
        imageUrl: dish.imageUrl || '',
        modelUrl: dish.modelUrl || '',
        ingredients: dish.ingredients,
        allergens: dish.allergens,
        isAvailable: dish.isAvailable,
      });
    } else {
      // Reset form for new dish
      setFormData({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        price: 0,
        category: 'mains',
        imageUrl: '',
        modelUrl: '',
        ingredients: [],
        allergens: [],
        isAvailable: true,
      });
    }
    setErrors({});
  }, [dish, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting dish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredientInput.trim()],
      });
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((i) => i !== ingredient),
    });
  };

  const addAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, allergenInput.trim()],
      });
      setAllergenInput('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((a) => a !== allergen),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dish ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
          <DialogDescription>
            {dish
              ? 'Update the dish information below'
              : 'Fill in the details to add a new dish to your menu'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (English) */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name (English) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Grilled Chicken"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Name (Arabic) */}
          <div className="space-y-2">
            <Label htmlFor="nameAr">Name (Arabic)</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              placeholder="e.g., دجاج مشوي"
              dir="rtl"
            />
          </div>

          {/* Description (English) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description (English) <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the dish..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Description (Arabic) */}
          <div className="space-y-2">
            <Label htmlFor="descriptionAr">Description (Arabic)</Label>
            <Textarea
              id="descriptionAr"
              value={formData.descriptionAr}
              onChange={(e) =>
                setFormData({ ...formData, descriptionAr: e.target.value })
              }
              placeholder="وصف الطبق..."
              rows={3}
              dir="rtl"
            />
          </div>

          {/* Price and Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DISH_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="model">3D Model</TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              {onUploadImage ? (
                <FileUpload
                  label="Dish Image"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  maxSize={5}
                  currentUrl={formData.imageUrl}
                  onUpload={async (file) => {
                    const url = await onUploadImage(file);
                    setFormData({ ...formData, imageUrl: url });
                    return url;
                  }}
                  onRemove={() => setFormData({ ...formData, imageUrl: '' })}
                  type="image"
                />
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max 5MB, formats: JPG, PNG, WebP
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              {onUploadModel ? (
                <FileUpload
                  label="3D Model (for AR)"
                  accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                  maxSize={10}
                  currentUrl={formData.modelUrl}
                  onUpload={async (file) => {
                    const url = await onUploadModel(file);
                    setFormData({ ...formData, modelUrl: url });
                    return url;
                  }}
                  onRemove={() => setFormData({ ...formData, modelUrl: '' })}
                  type="model"
                />
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="modelUrl">3D Model URL (for AR)</Label>
                  <Input
                    id="modelUrl"
                    value={formData.modelUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, modelUrl: e.target.value })
                    }
                    placeholder="https://example.com/model.glb"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max 10MB, formats: GLB, glTF
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="Add ingredient..."
              />
              <Button type="button" onClick={addIngredient} variant="secondary">
                Add
              </Button>
            </div>
            {formData.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary">
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Allergens */}
          <div className="space-y-2">
            <Label htmlFor="allergens">Allergens</Label>
            <div className="flex gap-2">
              <Input
                id="allergens"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergen();
                  }
                }}
                placeholder="Add allergen..."
              />
              <Button type="button" onClick={addAllergen} variant="secondary">
                Add
              </Button>
            </div>
            {formData.allergens.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allergens.map((allergen) => (
                  <Badge key={allergen} variant="destructive">
                    {allergen}
                    <button
                      type="button"
                      onClick={() => removeAllergen(allergen)}
                      className="ml-1 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">
              Available for ordering
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : dish ? 'Update Dish' : 'Add Dish'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
