import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, Loading } from './components/common';
import { AuthProvider } from './features/auth';
import { ProtectedRoute } from './components/auth';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

// Lazy load all page components for better code splitting
const Home = lazy(() => import('./pages/Home'));
const Landing = lazy(() => import('./pages/Landing'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Demo = lazy(() => import('./pages/Demo'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const TwoFactorSetup = lazy(() => import('./pages/TwoFactorSetup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const ErrorPagesDemo = lazy(() => import('./pages/ErrorPagesDemo'));
const LayoutDemo = lazy(() => import('./pages/LayoutDemo').then(m => ({ default: m.LayoutDemo })));
const ComponentShowcase = lazy(() => import('./design-system').then(m => ({ default: m.ComponentShowcase })));
const PublicHeaderDemo = lazy(() => import('./pages/PublicHeaderDemo'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const MenuBrowse = lazy(() => import('./pages/MenuBrowse').then(m => ({ default: m.MenuBrowse })));
const DishDetail = lazy(() => import('./pages/DishDetail').then(m => ({ default: m.DishDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const KitchenOrders = lazy(() => import('./pages/KitchenOrders').then(m => ({ default: m.KitchenOrders })));
const KitchenOrderDetail = lazy(() => import('./pages/KitchenOrderDetail').then(m => ({ default: m.KitchenOrderDetail })));
const KitchenDashboardDemo = lazy(() => import('./pages/KitchenDashboardDemo'));
const SEODemo = lazy(() => import('./pages/SEODemo'));
const StructuredDataDemo = lazy(() => import('./pages/StructuredDataDemo'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const TermsAcceptanceDemo = lazy(() => import('./pages/TermsAcceptanceDemo'));
const PerformanceMonitoringDemo = lazy(() => import('./pages/PerformanceMonitoringDemo'));
const SessionReplayDemo = lazy(() => import('./pages/SessionReplayDemo'));
const HeatmapDemo = lazy(() => import('./pages/HeatmapDemo'));

// Route-level loading fallback component
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loading size="lg" text="Loading page..." />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guide" element={<UserGuide />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/server-error" element={<ServerError />} />
            
            {/* Menu Routes */}
            <Route path="/:restaurantId/menu" element={<MenuBrowse />} />
            <Route path="/:restaurantId/menu/dish/:dishId" element={<DishDetail />} />
            <Route path="/:restaurantId/cart" element={<Cart />} />
            <Route path="/:restaurantId/order/:orderId" element={<OrderConfirmation />} />
            
            {/* Protected Routes */}
            <Route
              path="/2fa-setup"
              element={
                <ProtectedRoute>
                  <TwoFactorSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen/orders"
              element={
                <ProtectedRoute requiredRoles={['KITCHEN_STAFF']}>
                  <KitchenOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen/orders/:orderId"
              element={
                <ProtectedRoute requiredRoles={['KITCHEN_STAFF']}>
                  <KitchenOrderDetail />
                </ProtectedRoute>
              }
            />
            
            {/* Demo routes - can be protected or public based on requirements */}
            <Route path="/layout-demo" element={<LayoutDemo />} />
            <Route path="/design-system" element={<ComponentShowcase />} />
            <Route path="/public-header-demo" element={<PublicHeaderDemo />} />
            <Route path="/kitchen-demo" element={<KitchenDashboardDemo />} />
            <Route path="/error-pages-demo" element={<ErrorPagesDemo />} />
            <Route path="/seo-demo" element={<SEODemo />} />
            <Route path="/structured-data-demo" element={<StructuredDataDemo />} />
            <Route path="/terms-acceptance-demo" element={<TermsAcceptanceDemo />} />
            <Route path="/performance-demo" element={<PerformanceMonitoringDemo />} />
            <Route path="/session-replay-demo" element={<SessionReplayDemo />} />
            <Route path="/heatmap-demo" element={<HeatmapDemo />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Cookie Consent Banner - shown globally */}
        <CookieConsentBanner />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
