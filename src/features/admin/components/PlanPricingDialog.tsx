/**
 * Plan Pricing Dialog
 * Dialog for editing subscription plan pricing and features
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlanPricing } from '../types';

interface PlanPricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanPricing | null;
  onSave: (data: Partial<PlanPricing>) => Promise<void>;
}

export function PlanPricingDialog({
  open,
  onOpenChange,
  plan,
  onSave,
}: PlanPricingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxMenuItems: 0,
    maxTables: 0,
    hasAI: false,
    hasAR: false,
    isPopular: false,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice || 0,
        maxMenuItems: plan.maxMenuItems,
        maxTables: plan.maxTables,
        hasAI: plan.hasAI,
        hasAR: plan.hasAR,
        isPopular: plan.isPopular,
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        ...formData,
        yearlyPrice: formData.yearlyPrice || null,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {plan.plan} Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                <Input
                  id="yearlyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.yearlyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })
                  }
                  placeholder="Optional"
                />
                {formData.yearlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Save{' '}
                    {Math.round(
                      (1 - formData.yearlyPrice / (formData.monthlyPrice * 12)) * 100
                    )}
                    % compared to monthly
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxMenuItems">Max Menu Items</Label>
                <Input
                  id="maxMenuItems"
                  type="number"
                  min="-1"
                  value={formData.maxMenuItems}
                  onChange={(e) =>
                    setFormData({ ...formData, maxMenuItems: parseInt(e.target.value) })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Use -1 for unlimited</p>
              </div>
              <div>
                <Label htmlFor="maxTables">Max Tables</Label>
                <Input
                  id="maxTables"
                  type="number"
                  min="-1"
                  value={formData.maxTables}
                  onChange={(e) =>
                    setFormData({ ...formData, maxTables: parseInt(e.target.value) })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Use -1 for unlimited</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hasAI">AI Assistant</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable AI-powered menu recommendations
                  </p>
                </div>
                <Switch
                  id="hasAI"
                  checked={formData.hasAI}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasAI: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hasAR">AR 3D Models</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable augmented reality dish previews
                  </p>
                </div>
                <Switch
                  id="hasAR"
                  checked={formData.hasAR}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasAR: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                  <p className="text-xs text-muted-foreground">
                    Display "Most Popular" badge on pricing page
                  </p>
                </div>
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
