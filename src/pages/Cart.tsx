/**
 * Cart Page
 * Full page view of shopping cart with items, quantities, and checkout
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/features/cart/hooks/useCart';
import { Container } from '@/components/common/Container';

export const Cart: React.FC = () => {
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

  const handleContinueShopping = () => {
    navigate(`/${restaurantId}/menu`);
  };

  const handleCheckout = () => {
    // TODO: Navigate to checkout/order confirmation page
    console.log('Proceeding to checkout with cart:', cart);
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleContinueShopping}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة إلى القائمة
          </Button>

          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">سلة التسوق</h1>
              <p className="text-muted-foreground mt-1">
                {cart.items.length} {cart.items.length === 1 ? 'عنصر' : 'عناصر'} في السلة
              </p>
            </div>
          </div>
        </div>

        {/* Empty Cart State */}
        {cart.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="p-12 max-w-md mx-auto">
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-3">سلة التسوق فارغة</h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بإضافة أي أطباق بعد. تصفح القائمة واختر ما يعجبك!
              </p>
              <Button onClick={handleContinueShopping} size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                تصفح القائمة
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.dishId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-6">
                      <div className="flex gap-6">
                        {/* Item Image */}
                        {item.image && (
                          <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                              <p className="text-lg text-primary font-medium">
                                {item.price.toFixed(2)} ر.س
                              </p>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveItem(item.dishId)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-6">
                            <span className="text-sm text-muted-foreground">الكمية:</span>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(item.dishId, item.quantity, -1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>

                              <span className="w-12 text-center font-semibold text-lg">
                                {item.quantity}
                              </span>

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(item.dishId, item.quantity, 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="ml-auto">
                              <p className="text-sm text-muted-foreground mb-1">المجموع الفرعي</p>
                              <p className="text-xl font-bold text-primary">
                                {(item.price * item.quantity).toFixed(2)} ر.س
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-8"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">ملخص الطلب</h2>

                  <div className="space-y-4 mb-6">
                    {/* Items Count */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">عدد الأصناف</span>
                      <span className="font-medium">{cart.items.length}</span>
                    </div>

                    {/* Total Items */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">إجمالي القطع</span>
                      <span className="font-medium">
                        {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span className="font-medium">{cart.total.toFixed(2)} ر.س</span>
                    </div>

                    <div className="border-t pt-4">
                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">الإجمالي</span>
                        <span className="text-2xl font-bold text-primary">
                          {cart.total.toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    إتمام الطلب
                  </Button>

                  {/* Continue Shopping Link */}
                  <Button
                    variant="ghost"
                    className="w-full mt-3"
                    onClick={handleContinueShopping}
                  >
                    متابعة التسوق
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
