# Layout Components

This directory contains the main layout components for the SmartDine SaaS platform.

## Components

### Header

The main navigation header component with the following features:

- **Logo and Navigation**: Brand logo with navigation links
- **Theme Toggle**: Switch between dark and light modes
- **Language Selector**: Toggle between English and Arabic
- **Authentication States**:
  - Public mode: Login/Register buttons
  - Authenticated mode: User profile dropdown with notifications
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Sticky Header**: Stays at the top with blur effect on scroll

#### Usage

```tsx
// Public header
<Header variant="public" />

// Authenticated header
<Header
  variant="authenticated"
  userName="John Doe"
  notificationCount={5}
  onLogout={handleLogout}
/>
```

#### Props

- `variant`: `'public' | 'authenticated'` - Determines the header style
- `userName`: `string` - User's display name (authenticated mode)
- `notificationCount`: `number` - Number of unread notifications
- `onLogout`: `() => void` - Logout handler function

---

### Footer

Comprehensive footer component with the following features:

- **Multi-column Layout**: Organized links by category
- **Newsletter Subscription**: Email input with subscribe button
- **Social Media Links**: Facebook, Twitter, Instagram, LinkedIn
- **Footer Categories**:
  - Product: Features, Pricing, Demo, FAQ
  - Company: About, Careers, Blog, Contact
  - Legal: Privacy, Terms, Cookies, GDPR
  - Support: Help Center, Documentation, API, Status
- **Copyright Information**: Dynamic year display

#### Usage

```tsx
<Footer />
```

---

### Sidebar

Navigation sidebar for dashboard pages with the following features:

- **Collapsible**: Toggle between expanded and collapsed states
- **Role-based Menus**: Different menu items for different user roles
- **Active State**: Highlights the current page
- **Badge Notifications**: Shows pending items count
- **Help Section**: Quick access to support resources

#### Usage

```tsx
// Restaurant owner sidebar
<Sidebar role="owner" />

// Kitchen staff sidebar
<Sidebar role="kitchen" />

// Delivery personnel sidebar
<Sidebar role="delivery" />

// Platform admin sidebar
<Sidebar role="admin" />

// With collapse control
<Sidebar
  role="owner"
  collapsed={isCollapsed}
  onCollapsedChange={setIsCollapsed}
/>
```

#### Props

- `role`: `'owner' | 'kitchen' | 'delivery' | 'admin'` - User role for menu items
- `collapsed`: `boolean` - Sidebar collapsed state
- `onCollapsedChange`: `(collapsed: boolean) => void` - Collapse state change handler
- `className`: `string` - Additional CSS classes

#### Role-specific Menu Items

**Owner**:

- Dashboard
- Orders (with badge)
- Menu
- Analytics
- Staff
- QR Codes
- Feedback
- Settings

**Kitchen**:

- Orders (with badge)
- Menu
- Settings

**Delivery**:

- Deliveries (with badge)
- Map
- Settings

**Admin**:

- Dashboard
- Restaurants
- Subscriptions
- Analytics
- System Health

---

### MainLayout

Basic layout wrapper for public pages.

#### Usage

```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```

---

### DashboardLayout

Layout wrapper for dashboard pages with header and sidebar.

#### Usage

```tsx
<DashboardLayout role="owner" showSidebar={true}>
  <YourDashboardContent />
</DashboardLayout>
```

#### Props

- `children`: `React.ReactNode` - Page content
- `role`: `'owner' | 'kitchen' | 'delivery' | 'admin'` - User role for sidebar
- `showSidebar`: `boolean` - Whether to show the sidebar

---

## Demo

To see all layout components in action, visit `/layout-demo` in your browser.

The demo page includes:

- Interactive header variant switching
- Sidebar role switching
- All layout features demonstrated
- Usage examples and documentation

---

## Design System

All layout components follow the SmartDine design system:

- **Colors**: Uses theme-aware colors (primary, secondary, muted, etc.)
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standard padding and margin scales
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support

---

## Theme Support

All components support both dark and light themes:

- Dark Mode: Navy background with white text (default)
- Light Mode: White background with navy text

Theme switching is handled by the `ThemeToggle` component in the header.

---

## Internationalization

Components are prepared for i18n support:

- Language selector in header
- RTL support for Arabic
- Text content ready for translation

---

## Best Practices

1. **Always use the layout components** for consistent UI across the platform
2. **Choose the appropriate variant** based on authentication state
3. **Pass required props** for authenticated features (userName, notifications)
4. **Use role-based sidebars** to show relevant navigation items
5. **Test responsive behavior** on different screen sizes
6. **Ensure accessibility** by maintaining ARIA labels and keyboard navigation

---

## Future Enhancements

- [ ] Add breadcrumb navigation
- [ ] Implement search in header
- [ ] Add quick actions menu
- [ ] Support for custom logo upload
- [ ] Advanced notification center
- [ ] User preferences panel
- [ ] Multi-level sidebar navigation
- [ ] Sidebar pinning/unpinning
