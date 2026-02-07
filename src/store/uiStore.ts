import { create } from 'zustand';

/**
 * UI State Types
 */
interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  sidebarOpen: boolean;
  cartSidebarOpen: boolean;
  chatWidgetOpen: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCartSidebar: () => void;
  setCartSidebarOpen: (open: boolean) => void;
  toggleChatWidget: () => void;
  setChatWidgetOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

/**
 * UI Store
 * 
 * Manages global UI state like theme, language, sidebar visibility, etc.
 */
export const useUIStore = create<UIStore>((set) => ({
  // State
  theme: 'system',
  language: 'en',
  sidebarOpen: false,
  cartSidebarOpen: false,
  chatWidgetOpen: false,
  notifications: [],

  // Actions
  setTheme: (theme) =>
    set({
      theme,
    }),

  setLanguage: (language) =>
    set({
      language,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) =>
    set({
      sidebarOpen: open,
    }),

  toggleCartSidebar: () =>
    set((state) => ({
      cartSidebarOpen: !state.cartSidebarOpen,
    })),

  setCartSidebarOpen: (open) =>
    set({
      cartSidebarOpen: open,
    }),

  toggleChatWidget: () =>
    set((state) => ({
      chatWidgetOpen: !state.chatWidgetOpen,
    })),

  setChatWidgetOpen: (open) =>
    set({
      chatWidgetOpen: open,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `${Date.now()}-${Math.random()}`,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),
}));
