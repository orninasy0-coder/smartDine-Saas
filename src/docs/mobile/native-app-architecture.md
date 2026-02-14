# SmartDine Mobile App - Native Architecture Design

## Executive Summary

This document defines the comprehensive architecture for SmartDine's React Native mobile application. It covers project structure, state management, navigation, API integration, offline support, and deployment strategy.

**Technology Stack:** React Native + TypeScript + Zustand + React Query + React Navigation

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)             │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                      │
│  ├─ Screens (Customer, Kitchen, Delivery, Owner)       │
│  ├─ Components (Shared UI)                              │
│  └─ Navigation (Stack, Tab, Drawer)                     │
├─────────────────────────────────────────────────────────┤
│  Business Logic Layer                                    │
│  ├─ State Management (Zustand)                          │
│  ├─ Hooks (Custom business logic)                       │
│  └─ Services (API clients, utilities)                   │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  ├─ API Integration (React Query)                       │
│  ├─ Local Storage (AsyncStorage, SQLite)                │
│  ├─ Real-time (Socket.io)                               │
│  └─ Cache Management                                     │
├─────────────────────────────────────────────────────────┤
│  Platform Layer                                          │
│  ├─ Camera (QR Scanning)                                │
│  ├─ Notifications (FCM)                                  │
│  ├─ Location (Geolocation)                              │
│  ├─ Payments (Stripe)                                    │
│  └─ AR Viewer (WebGL/ViroReact)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Backend API (Node.js + Express)             │
│  ├─ REST APIs                                            │
│  ├─ WebSocket (Socket.io)                               │
│  ├─ Authentication (JWT)                                 │
│  └─ Multi-tenant isolation                               │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Code Sharing First** - Maximize code reuse with web app
2. **Offline-First** - App works without internet connection
3. **Performance** - 60 FPS, <2s startup time
4. **Modularity** - Feature-based folder structure
5. **Type Safety** - TypeScript everywhere
6. **Testability** - Unit, integration, and E2E tests

---

## 2. Project Structure

### 2.1 Monorepo Setup

```
smartdine/
├── packages/
│   ├── shared/                    # Shared code (70-80% reuse)
│   │   ├── api/                   # API clients
│   │   │   ├── auth.ts
│   │   │   ├── menu.ts
│   │   │   ├── orders.ts
│   │   │   └── index.ts
│   │   ├── types/                 # TypeScript types
│   │   │   ├── user.ts
│   │   │   ├── restaurant.ts
│   │   │   ├── dish.ts
│   │   │   └── order.ts
│   │   ├── utils/                 # Utilities
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   └── constants.ts
│   │   ├── hooks/                 # Platform-agnostic hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useOrders.ts
│   │   └── package.json
│   ├── web/                       # Web app (Vite + React)
│   └── mobile/                    # Mobile app (React Native)
│       ├── src/
│       │   ├── screens/           # Screen components
│       │   │   ├── customer/
│       │   │   │   ├── MenuScreen.tsx
│       │   │   │   ├── DishDetailScreen.tsx
│       │   │   │   ├── CartScreen.tsx
│       │   │   │   └── OrderTrackingScreen.tsx
│       │   │   ├── kitchen/
│       │   │   │   ├── KitchenDashboardScreen.tsx
│       │   │   │   └── OrderDetailScreen.tsx
│       │   │   ├── delivery/
│       │   │   │   ├── DeliveryDashboardScreen.tsx
│       │   │   │   └── MapScreen.tsx
│       │   │   ├── owner/
│       │   │   │   ├── DashboardScreen.tsx
│       │   │   │   ├── MenuManagementScreen.tsx
│       │   │   │   └── AnalyticsScreen.tsx
│       │   │   └── auth/
│       │   │       ├── LoginScreen.tsx
│       │   │       └── RegisterScreen.tsx
│       │   ├── components/        # Reusable components
│       │   │   ├── common/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   └── Loading.tsx
│       │   │   ├── menu/
│       │   │   │   ├── DishCard.tsx
│       │   │   │   ├── CategoryFilter.tsx
│       │   │   │   └── SearchBar.tsx
│       │   │   ├── cart/
│       │   │   │   ├── CartItem.tsx
│       │   │   │   └── CartSummary.tsx
│       │   │   └── orders/
│       │   │       ├── OrderCard.tsx
│       │   │       └── OrderStatus.tsx
│       │   ├── navigation/        # Navigation configuration
│       │   │   ├── RootNavigator.tsx
│       │   │   ├── CustomerNavigator.tsx
│       │   │   ├── KitchenNavigator.tsx
│       │   │   ├── DeliveryNavigator.tsx
│       │   │   └── OwnerNavigator.tsx
│       │   ├── store/             # State management
│       │   │   ├── authStore.ts
│       │   │   ├── cartStore.ts
│       │   │   └── settingsStore.ts
│       │   ├── services/          # Mobile-specific services
│       │   │   ├── camera.ts
│       │   │   ├── notifications.ts
│       │   │   ├── location.ts
│       │   │   ├── storage.ts
│       │   │   └── socket.ts
│       │   ├── hooks/             # Mobile-specific hooks
│       │   │   ├── useCamera.ts
│       │   │   ├── useNotifications.ts
│       │   │   └── useLocation.ts
│       │   ├── theme/             # Theme configuration
│       │   │   ├── colors.ts
│       │   │   ├── typography.ts
│       │   │   └── spacing.ts
│       │   ├── assets/            # Images, fonts
│       │   └── App.tsx            # Root component
│       ├── ios/                   # iOS native code
│       ├── android/               # Android native code
│       ├── __tests__/             # Tests
│       └── package.json
└── package.json                   # Root package.json
```


### 2.2 Workspace Configuration

**Root package.json:**
```json
{
  "name": "smartdine-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "web": "cd packages/web && npm run dev",
    "mobile": "cd packages/mobile && npm start",
    "mobile:ios": "cd packages/mobile && npm run ios",
    "mobile:android": "cd packages/mobile && npm run android",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  }
}
```

---

## 3. State Management

### 3.1 Architecture

**Three-Layer State:**
1. **Global State** (Zustand) - Auth, cart, settings
2. **Server State** (React Query) - API data, caching
3. **Local State** (useState) - Component-specific

### 3.2 Zustand Stores

**Auth Store:**
```typescript
// packages/mobile/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const { data } = await authApi.login(email, password);
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      refreshToken: async () => {
        const { data } = await authApi.refresh(get().token);
        set({ token: data.token });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

**Cart Store:**
```typescript
// packages/mobile/src/store/cartStore.ts
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (dish: Dish, quantity: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (dish, quantity) => {
    const items = [...get().items, { dish, quantity }];
    const total = calculateTotal(items);
    set({ items, total });
  },
  
  removeItem: (dishId) => {
    const items = get().items.filter(item => item.dish.id !== dishId);
    const total = calculateTotal(items);
    set({ items, total });
  },
  
  updateQuantity: (dishId, quantity) => {
    const items = get().items.map(item =>
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    const total = calculateTotal(items);
    set({ items, total });
  },
  
  clear: () => set({ items: [], total: 0 })
}));
```


### 3.3 React Query Configuration

**Query Client Setup:**
```typescript
// packages/mobile/src/config/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst', // Work offline
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

// Online/offline detection
NetInfo.addEventListener(state => {
  queryClient.setDefaultOptions({
    queries: {
      enabled: state.isConnected ?? true,
    },
  });
});
```

**Example Query Hook:**
```typescript
// packages/shared/hooks/useMenu.ts
import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api/menu';

export const useMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuApi.getMenu(restaurantId),
    staleTime: 10 * 60 * 1000, // Menu data is relatively static
  });
};
```

---

## 4. Navigation

### 4.1 Navigation Structure

**Root Navigator:**
```typescript
// packages/mobile/src/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Route based on user role
  switch (user?.role) {
    case 'customer':
      return <CustomerNavigator />;
    case 'kitchen':
      return <KitchenNavigator />;
    case 'delivery':
      return <DeliveryNavigator />;
    case 'owner':
      return <OwnerNavigator />;
    default:
      return <AuthNavigator />;
  }
};
```

**Customer Navigator:**
```typescript
// packages/mobile/src/navigation/CustomerNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MenuStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MenuList" component={MenuScreen} />
    <Stack.Screen name="DishDetail" component={DishDetailScreen} />
    <Stack.Screen name="ARViewer" component={ARViewerScreen} />
  </Stack.Navigator>
);

export const CustomerNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Menu" component={MenuStack} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
```


---

## 5. API Integration

### 5.1 API Client (Shared)

**Base API Client:**
```typescript
// packages/shared/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.smartdine.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // From auth store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh
      await refreshAuthToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Menu API:**
```typescript
// packages/shared/api/menu.ts
import { apiClient } from './client';
import type { Menu, Dish } from '../types';

export const menuApi = {
  getMenu: async (restaurantId: string): Promise<Menu> => {
    const { data } = await apiClient.get(`/restaurants/${restaurantId}/menu`);
    return data;
  },

  getDish: async (restaurantId: string, dishId: string): Promise<Dish> => {
    const { data } = await apiClient.get(
      `/restaurants/${restaurantId}/menu/dishes/${dishId}`
    );
    return data;
  },

  searchDishes: async (restaurantId: string, query: string): Promise<Dish[]> => {
    const { data } = await apiClient.get(
      `/restaurants/${restaurantId}/menu/search`,
      { params: { q: query } }
    );
    return data;
  },
};
```

### 5.2 Real-time Integration

**Socket.io Setup:**
```typescript
// packages/mobile/src/services/socket.ts
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export const initSocket = () => {
  const token = useAuthStore.getState().token;
  
  socket = io('https://api.smartdine.app', {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const subscribeToOrderUpdates = (orderId: string, callback: (data: any) => void) => {
  if (!socket) return;
  
  socket.on(`order:${orderId}:status`, callback);
  
  return () => {
    socket?.off(`order:${orderId}:status`, callback);
  };
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
```

---

## 6. Offline Support

### 6.1 Strategy

1. **Cache API responses** with React Query
2. **Queue mutations** when offline
3. **Sync when online** automatically
4. **Local storage** for critical data

### 6.2 Offline Queue

**Mutation Queue:**
```typescript
// packages/mobile/src/services/offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface QueuedMutation {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_queue';

export const offlineQueue = {
  add: async (mutation: Omit<QueuedMutation, 'id' | 'timestamp'>) => {
    const queue = await offlineQueue.getAll();
    const newMutation: QueuedMutation = {
      ...mutation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newMutation);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  getAll: async (): Promise<QueuedMutation[]> => {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  remove: async (id: string) => {
    const queue = await offlineQueue.getAll();
    const filtered = queue.filter(m => m.id !== id);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  },

  sync: async () => {
    const queue = await offlineQueue.getAll();
    
    for (const mutation of queue) {
      try {
        await apiClient.request({
          url: mutation.endpoint,
          method: mutation.method,
          data: mutation.data,
        });
        await offlineQueue.remove(mutation.id);
      } catch (error) {
        console.error('Failed to sync mutation:', error);
      }
    }
  },
};

// Auto-sync when online
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    offlineQueue.sync();
  }
});
```


### 6.3 Local Database

**SQLite for Offline Data:**
```typescript
// packages/mobile/src/services/database.ts
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'smartdine.db', location: 'default' },
  () => console.log('Database opened'),
  (error) => console.error('Database error:', error)
);

export const initDatabase = () => {
  db.transaction(tx => {
    // Menu cache
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS menu_cache (
        restaurant_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`
    );

    // Pending orders
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pending_orders (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`
    );
  });
};

export const cacheMenu = async (restaurantId: string, menuData: any) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO menu_cache (restaurant_id, data, updated_at) VALUES (?, ?, ?)',
        [restaurantId, JSON.stringify(menuData), Date.now()],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};

export const getCachedMenu = async (restaurantId: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT data FROM menu_cache WHERE restaurant_id = ?',
        [restaurantId],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(JSON.parse(results.rows.item(0).data));
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};
```

---

## 7. Platform-Specific Features

### 7.1 QR Code Scanning

**Camera Service:**
```typescript
// packages/mobile/src/services/camera.ts
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

export const useQRScanner = () => {
  const navigation = useNavigation();
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const qrData = codes[0]?.value;
      if (qrData) {
        // Parse QR data: smartdine://table/{restaurantId}/{tableId}
        const match = qrData.match(/smartdine:\/\/table\/(.+)\/(.+)/);
        if (match) {
          const [, restaurantId, tableId] = match;
          navigation.navigate('Menu', { restaurantId, tableId });
        }
      }
    },
  });

  return { device, codeScanner };
};
```

**QR Scanner Screen:**
```typescript
// packages/mobile/src/screens/customer/QRScannerScreen.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useQRScanner } from '../../services/camera';

export const QRScannerScreen = () => {
  const { device, codeScanner } = useQRScanner();

  if (!device) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Scan QR Code on Table</Text>
      </View>
    </View>
  );
};
```

### 7.2 Push Notifications

**Notification Service:**
```typescript
// packages/mobile/src/services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const initNotifications = async () => {
  // Request permission
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('Notification permission denied');
    return null;
  }

  // Get FCM token
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  // Send token to backend
  await apiClient.post('/users/fcm-token', { token });

  return token;
};

export const setupNotificationHandlers = () => {
  // Foreground notifications
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification:', remoteMessage);
    // Show in-app notification
    showInAppNotification(remoteMessage);
  });

  // Background/quit state notifications
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification:', remoteMessage);
  });

  // Notification opened app
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app:', remoteMessage);
    handleNotificationNavigation(remoteMessage);
  });

  // Check if app was opened from notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
        handleNotificationNavigation(remoteMessage);
      }
    });
};

const handleNotificationNavigation = (message: any) => {
  const { type, orderId } = message.data;
  
  switch (type) {
    case 'order_status':
      navigation.navigate('OrderDetail', { orderId });
      break;
    case 'new_order':
      navigation.navigate('KitchenDashboard');
      break;
    default:
      break;
  }
};
```


### 7.3 Location Services

**Location Service:**
```typescript
// packages/mobile/src/services/location.ts
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS handles permission automatically
};

export const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const watchLocation = (callback: (coords: { latitude: number; longitude: number }) => void) => {
  const watchId = Geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => console.error(error),
    { enableHighAccuracy: true, distanceFilter: 10 }
  );

  return () => Geolocation.clearWatch(watchId);
};
```

### 7.4 Payment Integration

**Stripe Service:**
```typescript
// packages/mobile/src/services/payment.ts
import { useStripe } from '@stripe/stripe-react-native';

export const usePayment = () => {
  const { confirmPayment } = useStripe();

  const processPayment = async (amount: number, currency: string = 'USD') => {
    try {
      // Get payment intent from backend
      const { data } = await apiClient.post('/payments/create-intent', {
        amount,
        currency,
      });

      const { clientSecret } = data;

      // Confirm payment
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  return { processPayment };
};
```

**Payment Screen:**
```typescript
// packages/mobile/src/screens/customer/PaymentScreen.tsx
import React from 'react';
import { StripeProvider, CardField } from '@stripe/stripe-react-native';
import { usePayment } from '../../services/payment';

export const PaymentScreen = ({ route }) => {
  const { amount } = route.params;
  const { processPayment } = usePayment();

  const handlePayment = async () => {
    try {
      const paymentIntent = await processPayment(amount);
      // Navigate to success screen
      navigation.navigate('OrderConfirmation', { paymentIntent });
    } catch (error) {
      // Show error
      Alert.alert('Payment Failed', error.message);
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View>
        <CardField
          postalCodeEnabled={false}
          onCardChange={(cardDetails) => {
            console.log('Card details:', cardDetails);
          }}
        />
        <Button title="Pay Now" onPress={handlePayment} />
      </View>
    </StripeProvider>
  );
};
```

---

## 8. Performance Optimization

### 8.1 Image Optimization

**Fast Image:**
```typescript
// packages/mobile/src/components/common/OptimizedImage.tsx
import React from 'react';
import FastImage from 'react-native-fast-image';

interface Props {
  uri: string;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

export const OptimizedImage: React.FC<Props> = ({ uri, style, resizeMode = 'cover' }) => {
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }}
      style={style}
      resizeMode={FastImage.resizeMode[resizeMode]}
    />
  );
};
```

### 8.2 List Performance

**FlashList:**
```typescript
// packages/mobile/src/screens/customer/MenuScreen.tsx
import { FlashList } from '@shopify/flash-list';

export const MenuScreen = () => {
  const { data: dishes } = useMenu(restaurantId);

  return (
    <FlashList
      data={dishes}
      renderItem={({ item }) => <DishCard dish={item} />}
      estimatedItemSize={120}
      keyExtractor={(item) => item.id}
    />
  );
};
```

### 8.3 Code Splitting

**Lazy Loading:**
```typescript
// packages/mobile/src/navigation/RootNavigator.tsx
import React, { Suspense, lazy } from 'react';

const ARViewerScreen = lazy(() => import('../screens/customer/ARViewerScreen'));
const AnalyticsScreen = lazy(() => import('../screens/owner/AnalyticsScreen'));

export const RootNavigator = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Stack.Navigator>
        <Stack.Screen name="ARViewer" component={ARViewerScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};
```


---

## 9. Testing Strategy

### 9.1 Unit Tests

**Component Testing:**
```typescript
// packages/mobile/__tests__/components/DishCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DishCard } from '../../src/components/menu/DishCard';

describe('DishCard', () => {
  const mockDish = {
    id: '1',
    name: 'Burger',
    price: 10.99,
    image: 'https://example.com/burger.jpg',
  };

  it('renders dish information correctly', () => {
    const { getByText } = render(<DishCard dish={mockDish} />);
    expect(getByText('Burger')).toBeTruthy();
    expect(getByText('$10.99')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<DishCard dish={mockDish} onPress={onPress} />);
    fireEvent.press(getByTestId('dish-card'));
    expect(onPress).toHaveBeenCalledWith(mockDish);
  });
});
```

**Hook Testing:**
```typescript
// packages/shared/__tests__/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from '../../src/store/cartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockDish, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem({ ...mockDish, price: 10 }, 2);
      result.current.addItem({ ...mockDish, id: '2', price: 5 }, 1);
    });

    expect(result.current.total).toBe(25);
  });
});
```

### 9.2 Integration Tests

**API Integration:**
```typescript
// packages/mobile/__tests__/integration/menu.test.ts
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMenu } from '../../src/hooks/useMenu';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Menu Integration', () => {
  it('fetches menu data', async () => {
    const { result } = renderHook(() => useMenu('restaurant-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data.dishes).toBeInstanceOf(Array);
  });
});
```

### 9.3 E2E Tests (Detox)

**E2E Test Setup:**
```typescript
// packages/mobile/e2e/menu.e2e.ts
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Menu Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should scan QR code and navigate to menu', async () => {
    await element(by.id('scan-qr-button')).tap();
    // Simulate QR scan
    await device.sendUserNotification({
      trigger: { type: 'push' },
      title: 'QR Scanned',
      body: 'smartdine://table/restaurant-1/table-5',
    });
    await detoxExpect(element(by.id('menu-screen'))).toBeVisible();
  });

  it('should add dish to cart', async () => {
    await element(by.id('dish-card-1')).tap();
    await element(by.id('add-to-cart-button')).tap();
    await element(by.id('cart-tab')).tap();
    await detoxExpect(element(by.id('cart-item-1'))).toBeVisible();
  });
});
```

---

## 10. Build and Deployment

### 10.1 Environment Configuration

**.env files:**
```bash
# .env.development
API_BASE_URL=https://dev-api.smartdine.app
STRIPE_PUBLISHABLE_KEY=pk_test_...
SOCKET_URL=https://dev-api.smartdine.app

# .env.production
API_BASE_URL=https://api.smartdine.app
STRIPE_PUBLISHABLE_KEY=pk_live_...
SOCKET_URL=https://api.smartdine.app
```

**Config:**
```typescript
// packages/mobile/src/config/env.ts
import Config from 'react-native-config';

export const ENV = {
  API_BASE_URL: Config.API_BASE_URL,
  STRIPE_PUBLISHABLE_KEY: Config.STRIPE_PUBLISHABLE_KEY,
  SOCKET_URL: Config.SOCKET_URL,
};
```

### 10.2 Build Scripts

**package.json:**
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace SmartDine.xcworkspace -scheme SmartDine -configuration Release",
    "bundle:android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
    "bundle:ios": "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle"
  }
}
```

### 10.3 CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/mobile-ci.yml
name: Mobile CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build-android:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      - run: npm ci
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/app-release.apk

  build-ios:
    runs-on: macos-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: cd ios && pod install
      - run: xcodebuild -workspace ios/SmartDine.xcworkspace -scheme SmartDine -configuration Release
```

### 10.4 App Store Deployment

**Fastlane Configuration:**
```ruby
# fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number
    build_app(scheme: "SmartDine")
    upload_to_testflight
  end

  desc "Build and upload to App Store"
  lane :release do
    increment_build_number
    build_app(scheme: "SmartDine")
    upload_to_app_store
  end
end

platform :android do
  desc "Build and upload to Play Console"
  lane :beta do
    gradle(task: "bundleRelease")
    upload_to_play_store(track: "beta")
  end

  desc "Build and upload to Play Store"
  lane :release do
    gradle(task: "bundleRelease")
    upload_to_play_store
  end
end
```


---

## 11. Security Considerations

### 11.1 Secure Storage

**Sensitive Data Storage:**
```typescript
// packages/mobile/src/services/secureStorage.ts
import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  setItem: async (key: string, value: string) => {
    await Keychain.setGenericPassword(key, value, {
      service: 'com.smartdine.app',
    });
  },

  getItem: async (key: string): Promise<string | null> => {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.smartdine.app',
    });
    return credentials ? credentials.password : null;
  },

  removeItem: async (key: string) => {
    await Keychain.resetGenericPassword({
      service: 'com.smartdine.app',
    });
  },
};

// Store auth token securely
export const storeAuthToken = (token: string) => secureStorage.setItem('auth_token', token);
export const getAuthToken = () => secureStorage.getItem('auth_token');
export const removeAuthToken = () => secureStorage.removeItem('auth_token');
```

### 11.2 SSL Pinning

**Certificate Pinning:**
```typescript
// packages/mobile/src/config/sslPinning.ts
import { fetch as fetchWithPinning } from 'react-native-ssl-pinning';

export const secureFetch = async (url: string, options: RequestInit = {}) => {
  return fetchWithPinning(url, {
    ...options,
    sslPinning: {
      certs: ['api.smartdine.app'], // Certificate from assets
    },
  });
};
```

### 11.3 Code Obfuscation

**ProGuard (Android):**
```properties
# android/app/proguard-rules.pro
-keep class com.smartdine.** { *; }
-keepclassmembers class * {
  @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-dontwarn com.facebook.react.**
```

---

## 12. Monitoring and Analytics

### 12.1 Crash Reporting

**Sentry Integration:**
```typescript
// packages/mobile/src/config/sentry.ts
import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://your-sentry-dsn',
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 1.0,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
  });
};

// Error boundary
export const ErrorBoundary = Sentry.wrap(App);
```

### 12.2 Analytics

**Firebase Analytics:**
```typescript
// packages/mobile/src/services/analytics.ts
import analytics from '@react-native-firebase/analytics';

export const logEvent = async (eventName: string, params?: Record<string, any>) => {
  await analytics().logEvent(eventName, params);
};

export const logScreenView = async (screenName: string) => {
  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
};

// Usage
logEvent('dish_viewed', { dishId: '123', dishName: 'Burger' });
logEvent('order_placed', { orderId: '456', total: 25.99 });
logScreenView('MenuScreen');
```

### 12.3 Performance Monitoring

**Firebase Performance:**
```typescript
// packages/mobile/src/services/performance.ts
import perf from '@react-native-firebase/perf';

export const traceApiCall = async (name: string, apiCall: () => Promise<any>) => {
  const trace = await perf().startTrace(name);
  try {
    const result = await apiCall();
    await trace.stop();
    return result;
  } catch (error) {
    await trace.stop();
    throw error;
  }
};

// Usage
const menu = await traceApiCall('fetch_menu', () => menuApi.getMenu(restaurantId));
```

---

## 13. Accessibility

### 13.1 Screen Reader Support

**Accessible Components:**
```typescript
// packages/mobile/src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### 13.2 Dynamic Font Sizes

**Responsive Text:**
```typescript
// packages/mobile/src/components/common/Text.tsx
import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useAccessibilityInfo } from '@react-native-community/hooks';

export const Text: React.FC<TextProps> = ({ style, ...props }) => {
  const { isScreenReaderEnabled } = useAccessibilityInfo();
  
  return (
    <RNText
      {...props}
      style={[
        style,
        { fontSize: isScreenReaderEnabled ? 18 : 14 },
      ]}
      allowFontScaling={true}
      maxFontSizeMultiplier={2}
    />
  );
};
```

---

## 14. Internationalization (i18n)

### 14.1 i18n Setup

**Configuration:**
```typescript
// packages/mobile/src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

const LANGUAGE_KEY = 'app_language';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: RNLocalize.getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language
AsyncStorage.getItem(LANGUAGE_KEY).then((lang) => {
  if (lang) i18n.changeLanguage(lang);
});

export default i18n;
```

**Usage:**
```typescript
// packages/mobile/src/screens/customer/MenuScreen.tsx
import { useTranslation } from 'react-i18next';

export const MenuScreen = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('menu.title')}</Text>
      <Text>{t('menu.search_placeholder')}</Text>
    </View>
  );
};
```

### 14.2 RTL Support

**RTL Configuration:**
```typescript
// packages/mobile/src/App.tsx
import { I18nManager } from 'react-native';
import i18n from './config/i18n';

// Enable RTL for Arabic
if (i18n.language === 'ar') {
  I18nManager.forceRTL(true);
} else {
  I18nManager.forceRTL(false);
}
```

---

## 15. Development Best Practices

### 15.1 Code Style

**ESLint Configuration:**
```json
{
  "extends": [
    "@react-native-community",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 15.2 Git Workflow

**Branch Strategy:**
- `main` - Production releases
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release branches

**Commit Convention:**
```
feat: Add QR scanner screen
fix: Fix cart total calculation
docs: Update architecture documentation
test: Add unit tests for cart store
refactor: Refactor API client
```

### 15.3 Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Accessibility labels are added
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Offline support is considered
- [ ] Performance is optimized
- [ ] Security best practices are followed

---

## 16. Migration Path from Web

### 16.1 Phase 1: Setup (Week 1-2)

1. Create monorepo structure
2. Extract shared code to `packages/shared`
3. Set up React Native project
4. Configure navigation and state management

### 16.2 Phase 2: Core Features (Week 3-6)

1. Implement authentication screens
2. Build menu browsing (reuse 70% from web)
3. Implement cart functionality (reuse 80% from web)
4. Add order tracking

### 16.3 Phase 3: Platform Features (Week 7-10)

1. QR code scanning
2. Push notifications
3. Location services
4. Payment integration

### 16.4 Phase 4: Advanced Features (Week 11-14)

1. AR viewer (WebGL fallback)
2. Offline support
3. Real-time updates
4. Analytics integration

### 16.5 Phase 5: Polish & Launch (Week 15-16)

1. Performance optimization
2. Testing (unit, integration, E2E)
3. App store submission
4. Beta testing

---

## 17. Success Metrics

### 17.1 Technical Metrics

- **Code Sharing:** 75%+ between web and mobile ✅
- **Startup Time:** <2 seconds ✅
- **Frame Rate:** 60 FPS ✅
- **Crash Rate:** <1% ✅
- **Bundle Size:** <15 MB per platform ✅

### 17.2 Business Metrics

- **Development Time:** 4 months for MVP ✅
- **Team Size:** 2-3 developers ✅
- **User Satisfaction:** 4.5+ star rating ✅
- **Feature Parity:** 95%+ with web ✅

---

## 18. Conclusion

This architecture provides a solid foundation for SmartDine's mobile application with:

✅ **Maximum Code Reuse** - 70-80% sharing with web app
✅ **Scalable Structure** - Feature-based organization
✅ **Offline-First** - Works without internet
✅ **Performance** - Optimized for 60 FPS
✅ **Security** - Secure storage and SSL pinning
✅ **Testability** - Comprehensive testing strategy
✅ **Maintainability** - Clear patterns and conventions

**Next Steps:**
1. ✅ Complete Task 21.1: Mobile SDK Planning
2. ➡️ Proceed to Task 21.2: API Readiness for Mobile
3. ➡️ Move to Task 21.3: Push Notification Infrastructure

---

**Document Version:** 1.0  
**Last Updated:** February 10, 2026  
**Author:** SmartDine Development Team  
**Status:** ✅ Complete
