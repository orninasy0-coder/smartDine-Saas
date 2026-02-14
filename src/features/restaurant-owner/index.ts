/**
 * Restaurant Owner Feature Exports
 */

// Components
export { DashboardStats } from './components/DashboardStats';
export { MenuEditor } from './components/MenuEditor';
export { DishForm } from './components/DishForm';
export { FileUpload } from './components/FileUpload';
export { AnalyticsCharts } from './components/AnalyticsCharts';
export { RevenueChart } from './components/RevenueChart';
export { OrderVolumeChart } from './components/OrderVolumeChart';
export { TopDishesDisplay } from './components/TopDishesDisplay';
export { StaffTable } from './components/StaffTable';
export { StaffForm } from './components/StaffForm';
export { RestaurantInfoForm } from './components/RestaurantInfoForm';
export { WorkingHoursForm } from './components/WorkingHoursForm';
export { QRGenerator } from './components/QRGenerator';
export { FeedbackList } from './components/FeedbackList';

// Pages
export { DashboardHome } from './pages/DashboardHome';
export { MenuManagement } from './pages/MenuManagement';
export { Analytics } from './pages/Analytics';
export { StaffManagement } from './pages/StaffManagement';
export { Settings } from './pages/Settings';
export { QRCodes } from './pages/QRCodes';
export { FeedbackPage } from './pages/Feedback';

// Services
export {
  fetchDishes,
  fetchDish,
  createDish,
  updateDish,
  deleteDish,
  uploadDishImage,
  upload3DModel,
  searchDishes,
} from './services/dishService';

export {
  fetchStaff,
  fetchStaffMember,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  toggleStaffStatus,
} from './services/staffService';

export {
  fetchRestaurantInfo,
  updateRestaurantInfo,
  fetchWorkingHours,
  updateWorkingHours,
} from './services/settingsService';

export {
  fetchQRCodes,
  generateQRCode,
  deleteQRCode,
  downloadQRCode,
  regenerateQRCode,
  bulkGenerateQRCodes,
} from './services/qrCodeService';

// Types
export type { 
  DashboardStats as DashboardStatsType, 
  TopDish, 
  DashboardPeriod,
  RevenueData,
  OrderVolumeData,
  AnalyticsData,
  AnalyticsPeriodOption,
  Dish,
  DishFormData,
  DishCategory,
  StaffMember,
  StaffFormData,
  StaffRole,
  StaffRoleOption,
  RestaurantInfo,
  RestaurantInfoFormData,
  WorkingHours,
  WorkingHoursFormData,
  DaySchedule,
  QRCodeData,
  QRCodeFormData,
} from './types';

export { DISH_CATEGORIES, DAYS_OF_WEEK, CUISINE_TYPES, PRICE_RANGES } from './types';
