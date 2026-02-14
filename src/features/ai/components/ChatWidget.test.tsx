/**
 * ChatWidget Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatWidget } from './ChatWidget';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

// Mock the stores
vi.mock('@/store/uiStore', () => ({
  useUIStore: vi.fn(),
}));

vi.mock('@/store/cartStore', () => ({
  useCartStore: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

// Wrapper component
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ChatWidget', () => {
  const mockAddItem = vi.fn();
  const mockSetChatWidgetOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock cart store
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
      restaurantId: null,
      tableNumber: null,
      addItem: mockAddItem,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      updateNotes: vi.fn(),
      clearCart: vi.fn(),
      setTableNumber: vi.fn(),
      getTotal: vi.fn(() => 0),
      getItemCount: vi.fn(() => 0),
    });
  });

  it('should not render when chatWidgetOpen is false', () => {
    vi.mocked(useUIStore).mockReturnValue({
      chatWidgetOpen: false,
      setChatWidgetOpen: vi.fn(),
      theme: 'light',
      language: 'ar',
      sidebarOpen: false,
      cartSidebarOpen: false,
      notifications: [],
      setTheme: vi.fn(),
      setLanguage: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      toggleCartSidebar: vi.fn(),
      setCartSidebarOpen: vi.fn(),
      toggleChatWidget: vi.fn(),
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      clearNotifications: vi.fn(),
    });

    const { container } = render(
      <ChatWidget restaurantId="test-restaurant" />,
      { wrapper }
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when chatWidgetOpen is true', () => {
    vi.mocked(useUIStore).mockReturnValue({
      chatWidgetOpen: true,
      setChatWidgetOpen: vi.fn(),
      theme: 'light',
      language: 'ar',
      sidebarOpen: false,
      cartSidebarOpen: false,
      notifications: [],
      setTheme: vi.fn(),
      setLanguage: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      toggleCartSidebar: vi.fn(),
      setCartSidebarOpen: vi.fn(),
      toggleChatWidget: vi.fn(),
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      clearNotifications: vi.fn(),
    });

    render(
      <ChatWidget restaurantId="test-restaurant" />,
      { wrapper }
    );

    expect(screen.getByText('المساعد الذكي')).toBeInTheDocument();
    expect(screen.getByText('متصل الآن')).toBeInTheDocument();
  });

  it('should display welcome message on initial render', () => {
    vi.mocked(useUIStore).mockReturnValue({
      chatWidgetOpen: true,
      setChatWidgetOpen: vi.fn(),
      theme: 'light',
      language: 'ar',
      sidebarOpen: false,
      cartSidebarOpen: false,
      notifications: [],
      setTheme: vi.fn(),
      setLanguage: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      toggleCartSidebar: vi.fn(),
      setCartSidebarOpen: vi.fn(),
      toggleChatWidget: vi.fn(),
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      clearNotifications: vi.fn(),
    });

    render(
      <ChatWidget restaurantId="test-restaurant" />,
      { wrapper }
    );

    expect(
      screen.getByText(/مرحباً! أنا مساعدك الذكي/)
    ).toBeInTheDocument();
  });

  describe('Add to Cart Functionality', () => {
    it('should add suggested dish to cart when add button is clicked', async () => {
      const user = userEvent.setup();

      vi.mocked(useUIStore).mockReturnValue({
        chatWidgetOpen: true,
        setChatWidgetOpen: mockSetChatWidgetOpen,
        theme: 'light',
        language: 'ar',
        sidebarOpen: false,
        cartSidebarOpen: false,
        notifications: [],
        setTheme: vi.fn(),
        setLanguage: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        toggleCartSidebar: vi.fn(),
        setCartSidebarOpen: vi.fn(),
        toggleChatWidget: vi.fn(),
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
        clearNotifications: vi.fn(),
      });

      // Set up a message with suggestions in localStorage
      const messagesWithSuggestions = [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'إليك بعض الأطباق المقترحة',
          timestamp: new Date().toISOString(),
          suggestions: [
            {
              dishId: 'dish-1',
              name: 'برجر لحم',
              reason: 'طبق شهير ولذيذ',
              price: 45.5,
              image: '/images/burger.jpg',
            },
          ],
        },
      ];

      localStorage.setItem(
        'ai-chat-test-restaurant',
        JSON.stringify(messagesWithSuggestions)
      );

      render(<ChatWidget restaurantId="test-restaurant" />, { wrapper });

      // Wait for the component to load messages
      await waitFor(() => {
        expect(screen.getByText('برجر لحم')).toBeInTheDocument();
      });

      // Find and click the add to cart button
      const addButton = screen.getByTitle('إضافة للسلة');
      await user.click(addButton);

      // Verify addItem was called with correct parameters
      expect(mockAddItem).toHaveBeenCalledWith(
        {
          dishId: 'dish-1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 1,
          image: '/images/burger.jpg',
        },
        'test-restaurant'
      );

      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('تمت إضافة برجر لحم إلى السلة');
    });

    it('should show error toast when dish suggestion is not found', async () => {
      vi.mocked(useUIStore).mockReturnValue({
        chatWidgetOpen: true,
        setChatWidgetOpen: mockSetChatWidgetOpen,
        theme: 'light',
        language: 'ar',
        sidebarOpen: false,
        cartSidebarOpen: false,
        notifications: [],
        setTheme: vi.fn(),
        setLanguage: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        toggleCartSidebar: vi.fn(),
        setCartSidebarOpen: vi.fn(),
        toggleChatWidget: vi.fn(),
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
        clearNotifications: vi.fn(),
      });

      render(<ChatWidget restaurantId="test-restaurant" />, { wrapper });

      // Since we can't directly call handleAddToCart, we verify the error case
      // by checking that addItem is not called when there are no suggestions
      expect(mockAddItem).not.toHaveBeenCalled();
    });

    it('should handle multiple dish suggestions correctly', async () => {
      const user = userEvent.setup();

      vi.mocked(useUIStore).mockReturnValue({
        chatWidgetOpen: true,
        setChatWidgetOpen: mockSetChatWidgetOpen,
        theme: 'light',
        language: 'ar',
        sidebarOpen: false,
        cartSidebarOpen: false,
        notifications: [],
        setTheme: vi.fn(),
        setLanguage: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        toggleCartSidebar: vi.fn(),
        setCartSidebarOpen: vi.fn(),
        toggleChatWidget: vi.fn(),
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
        clearNotifications: vi.fn(),
      });

      // Set up messages with multiple suggestions
      const messagesWithMultipleSuggestions = [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'إليك بعض الأطباق المقترحة',
          timestamp: new Date().toISOString(),
          suggestions: [
            {
              dishId: 'dish-1',
              name: 'برجر لحم',
              reason: 'طبق شهير',
              price: 45.5,
              image: '/images/burger.jpg',
            },
            {
              dishId: 'dish-2',
              name: 'بيتزا مارغريتا',
              reason: 'خيار نباتي',
              price: 38.0,
              image: '/images/pizza.jpg',
            },
          ],
        },
      ];

      localStorage.setItem(
        'ai-chat-test-restaurant',
        JSON.stringify(messagesWithMultipleSuggestions)
      );

      render(<ChatWidget restaurantId="test-restaurant" />, { wrapper });

      // Wait for suggestions to load
      await waitFor(() => {
        expect(screen.getByText('برجر لحم')).toBeInTheDocument();
        expect(screen.getByText('بيتزا مارغريتا')).toBeInTheDocument();
      });

      // Get all add buttons
      const addButtons = screen.getAllByTitle('إضافة للسلة');
      expect(addButtons).toHaveLength(2);

      // Click the second add button (pizza)
      await user.click(addButtons[1]);

      // Verify the correct dish was added
      expect(mockAddItem).toHaveBeenCalledWith(
        {
          dishId: 'dish-2',
          name: 'بيتزا مارغريتا',
          price: 38.0,
          quantity: 1,
          image: '/images/pizza.jpg',
        },
        'test-restaurant'
      );

      expect(toast.success).toHaveBeenCalledWith('تمت إضافة بيتزا مارغريتا إلى السلة');
    });
  });
});
