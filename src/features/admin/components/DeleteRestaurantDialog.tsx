/**
 * Delete Restaurant Confirmation Dialog
 * Confirms deletion of a restaurant with warning message
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Restaurant } from '../types';

interface DeleteRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant | null;
  onConfirm: () => Promise<void>;
}

export function DeleteRestaurantDialog({
  open,
  onOpenChange,
  restaurant,
  onConfirm,
}: DeleteRestaurantDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!restaurant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle>Delete Restaurant</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <strong>{restaurant.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Restaurant account and settings</li>
              <li>All menu items and dishes</li>
              <li>Order history and analytics</li>
              <li>Staff accounts and permissions</li>
              <li>Customer feedback and ratings</li>
            </ul>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Restaurant:</span> {restaurant.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Slug:</span> {restaurant.slug}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Email:</span> {restaurant.email}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Restaurant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
