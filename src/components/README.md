# Components Directory

This directory contains shared components used across the application.

## Structure

```
components/
├── ui/               # shadcn/ui components (Button, Input, Card, etc.)
├── layout/           # Layout components (Header, Footer, Sidebar)
├── common/           # Common reusable components (Loading, Error, Empty)
├── forms/            # Form-related components (FormField, etc.)
└── README.md
```

## Component Guidelines

### UI Components (shadcn/ui)

- Located in `ui/` directory
- Generated and managed by shadcn/ui CLI
- Follow shadcn/ui conventions
- Customizable via Tailwind CSS

### Layout Components

- Page structure components (Header, Footer, Sidebar)
- Layout wrappers (MainLayout, DashboardLayout)
- Responsive and theme-aware

### Common Components

- Reusable across features
- Generic and configurable
- Well-documented with TypeScript

### Form Components

- Form field wrappers
- Validation display
- Consistent styling

## Usage

```tsx
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout';
import { Loading } from '@/components/common';

function MyPage() {
  return (
    <MainLayout>
      <Loading />
      <Button>Click me</Button>
    </MainLayout>
  );
}
```
