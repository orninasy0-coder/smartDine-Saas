import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MenuEditor } from '../components/MenuEditor';
import { DishForm } from '../components/DishForm';
import type { Dish, DishFormData } from '../types';
import {
  fetchDishes,
  createDish,
  updateDish,
  deleteDish,
  uploadDishImage,
  upload3DModel,
} from '../services/dishService';

export function MenuManagement() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // TODO: Get actual restaurant ID from auth context
  const restaurantId = 'restaurant-1';

  // Load dishes on mount
  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDishes(restaurantId);
      setDishes(data);
    } catch (error) {
      console.error('Error loading dishes:', error);
      toast.error('Failed to load dishes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDish = () => {
    setSelectedDish(null);
    setIsFormOpen(true);
  };

  const handleEditDish = (dish: Dish) => {
    setSelectedDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) {
      return;
    }

    try {
      await deleteDish(dishId);
      setDishes(dishes.filter((d) => d.id !== dishId));
      toast.success('Dish deleted successfully');
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    }
  };

  const handleSubmitDish = async (data: DishFormData) => {
    try {
      if (selectedDish) {
        // Update existing dish
        const updatedDish = await updateDish(selectedDish.id, data);
        setDishes(dishes.map((d) => (d.id === updatedDish.id ? updatedDish : d)));
        toast.success('Dish updated successfully');
      } else {
        // Create new dish
        const newDish = await createDish(restaurantId, data);
        setDishes([newDish, ...dishes]);
        toast.success('Dish added successfully');
      }
      setIsFormOpen(false);
      setSelectedDish(null);
    } catch (error) {
      console.error('Error saving dish:', error);
      toast.error('Failed to save dish');
      throw error; // Re-throw to keep form open
    }
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const url = await uploadDishImage(file);
      toast.success('Image uploaded successfully');
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const handleUploadModel = async (file: File): Promise<string> => {
    try {
      const url = await upload3DModel(file);
      toast.success('3D model uploaded successfully');
      return url;
    } catch (error) {
      console.error('Error uploading model:', error);
      toast.error('Failed to upload 3D model');
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <MenuEditor
        dishes={dishes}
        onAddDish={handleAddDish}
        onEditDish={handleEditDish}
        onDeleteDish={handleDeleteDish}
        isLoading={isLoading}
      />

      <DishForm
        dish={selectedDish}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDish(null);
        }}
        onSubmit={handleSubmitDish}
        onUploadImage={handleUploadImage}
        onUploadModel={handleUploadModel}
      />
    </div>
  );
}
