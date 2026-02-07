/**
 * CartSidebar Component
 * Displays cart items in a sidebar with quantity controls and total calculation
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '../hooks/useCart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { cart, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (dishId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(dishId, newQuantity);
    }
  };

  const handleRemoveItem = (dishId: string) => {
    removeItem(dishId);
  };

  const handleViewCart = () => {
    onClose();
    navigate(`/${restaurantId}/cart`);
  };

  const handleCheckout = () => {
    onClose();
    navigate(`/${restaurantId}/cart`);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-lg font-semibold">سلة التسوق</h2>
                <span className="text-sm text-muted-foreground">
                  ({cart.items.length} {cart.items.length === 1 ? 'عنصر' : 'عناصر'})
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">سلة التسوق فارغة</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    أضف بعض الأطباق لتبدأ طلبك
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.dishId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="p-4">
                          <div className="flex gap-3">
                            {/* Item Image */}
                            {item.image && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.price.toFixed(2)} ر.س
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleQuantityChange(item.dishId, item.quantity, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>

                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleQuantityChange(item.dishId, item.quantity, 1)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveItem(item.dishId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Item Subtotal */}
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {(item.price * item.quantity).toFixed(2)} ر.س
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>الإجمالي:</span>
                  <span className="text-primary">{cart.total.toFixed(2)} ر.س</span>
                </div>

                {/* Checkout Button */}
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  إتمام الطلب
                </Button>

                {/* View Cart Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleViewCart}
                >
                  عرض السلة
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
