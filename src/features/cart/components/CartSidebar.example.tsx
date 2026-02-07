/**
 * CartSidebar Usage Example
 * 
 * This example demonstrates how to integrate the CartSidebar component
 * into your application.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { CartSidebar } from './CartSidebar';
import { useCart } from '../hooks/useCart';

export const CartSidebarExample: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div>
      {/* Cart Button - typically in your header/navbar */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

/**
 * Usage in your main layout or page:
 * 
 * import { CartSidebarExample } from '@/features/cart/components/CartSidebar.example';
 * 
 * function Layout() {
 *   return (
 *     <div>
 *       <header>
 *         <CartSidebarExample />
 *       </header>
 *       <main>
 *         {/* Your content *\/}
 *       </main>
 *     </div>
 *   );
 * }
 */
