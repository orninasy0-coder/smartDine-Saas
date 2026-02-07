import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/common';
import { AuthProvider } from './features/auth';
import { ProtectedRoute } from './components/auth';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import TwoFactorSetup from './pages/TwoFactorSetup';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import { LayoutDemo } from './pages/LayoutDemo';
import { ComponentShowcase } from './design-system';
import PublicHeaderDemo from './pages/PublicHeaderDemo';
import UserGuide from './pages/UserGuide';
import { MenuBrowse } from './pages/MenuBrowse';
import { DishDetail } from './pages/DishDetail';
import { Cart } from './pages/Cart';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Menu Routes */}
          <Route path="/:restaurantId/menu" element={<MenuBrowse />} />
          <Route path="/:restaurantId/menu/dish/:dishId" element={<DishDetail />} />
          <Route path="/:restaurantId/cart" element={<Cart />} />
          
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
          
          {/* Demo routes - can be protected or public based on requirements */}
          <Route path="/layout-demo" element={<LayoutDemo />} />
          <Route path="/design-system" element={<ComponentShowcase />} />
          <Route path="/public-header-demo" element={<PublicHeaderDemo />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
