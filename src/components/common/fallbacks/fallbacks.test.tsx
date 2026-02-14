import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageLoadingFallback } from './PageLoadingFallback';
import { CardSkeleton } from './CardSkeleton';
import { TableSkeleton } from './TableSkeleton';
import { ChartSkeleton } from './ChartSkeleton';
import { ListSkeleton } from './ListSkeleton';
import { FormSkeleton } from './FormSkeleton';

describe('Fallback Components', () => {
  describe('PageLoadingFallback', () => {
    it('renders with default message', () => {
      render(<PageLoadingFallback />);
      expect(screen.getByText('Loading page...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<PageLoadingFallback message="Loading dashboard..." />);
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('shows branding when enabled', () => {
      render(<PageLoadingFallback showBranding />);
      expect(screen.getByText('SmartDine')).toBeInTheDocument();
    });
  });

  describe('CardSkeleton', () => {
    it('renders single card by default', () => {
      const { container } = render(<CardSkeleton />);
      const cards = container.querySelectorAll('.animate-pulse');
      expect(cards).toHaveLength(1);
    });

    it('renders multiple cards', () => {
      const { container } = render(<CardSkeleton count={3} />);
      const cards = container.querySelectorAll('.animate-pulse');
      expect(cards).toHaveLength(3);
    });

    it('shows image placeholder by default', () => {
      const { container } = render(<CardSkeleton />);
      const images = container.querySelectorAll('.bg-gray-200');
      expect(images.length).toBeGreaterThan(0);
    });

    it('hides image when showImage is false', () => {
      const { container } = render(<CardSkeleton showImage={false} />);
      // Should have fewer skeleton elements without image
      const skeletonElements = container.querySelectorAll('.bg-gray-200');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  describe('TableSkeleton', () => {
    it('renders with default rows and columns', () => {
      const { container } = render(<TableSkeleton />);
      const rows = container.querySelectorAll('.divide-y > div');
      expect(rows).toHaveLength(5); // default 5 rows
    });

    it('renders custom number of rows', () => {
      const { container } = render(<TableSkeleton rows={10} />);
      const rows = container.querySelectorAll('.divide-y > div');
      expect(rows).toHaveLength(10);
    });

    it('shows header by default', () => {
      const { container } = render(<TableSkeleton />);
      const header = container.querySelector('.bg-muted');
      expect(header).toBeInTheDocument();
    });

    it('hides header when showHeader is false', () => {
      const { container } = render(<TableSkeleton showHeader={false} />);
      const header = container.querySelector('.bg-muted');
      expect(header).not.toBeInTheDocument();
    });
  });

  describe('ChartSkeleton', () => {
    it('renders with default bar type', () => {
      const { container } = render(<ChartSkeleton />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders different chart types', () => {
      const { container: barContainer } = render(<ChartSkeleton type="bar" />);
      expect(barContainer.querySelector('.animate-pulse')).toBeInTheDocument();

      const { container: lineContainer } = render(<ChartSkeleton type="line" />);
      expect(lineContainer.querySelector('svg')).toBeInTheDocument();

      const { container: pieContainer } = render(<ChartSkeleton type="pie" />);
      expect(pieContainer.querySelector('.rounded-full')).toBeInTheDocument();
    });

    it('shows title by default', () => {
      const { container } = render(<ChartSkeleton />);
      const titleElements = container.querySelectorAll('.h-6');
      expect(titleElements.length).toBeGreaterThan(0);
    });

    it('shows legend by default', () => {
      const { container } = render(<ChartSkeleton />);
      const legend = container.querySelector('.flex.gap-4.justify-center');
      expect(legend).toBeInTheDocument();
    });

    it('hides legend when showLegend is false', () => {
      const { container } = render(<ChartSkeleton showLegend={false} />);
      const legend = container.querySelector('.flex.gap-4.justify-center');
      expect(legend).not.toBeInTheDocument();
    });
  });

  describe('ListSkeleton', () => {
    it('renders default number of items', () => {
      const { container } = render(<ListSkeleton />);
      const items = container.querySelectorAll('.flex.items-center.gap-4');
      expect(items).toHaveLength(5);
    });

    it('renders custom number of items', () => {
      const { container } = render(<ListSkeleton count={8} />);
      const items = container.querySelectorAll('.flex.items-center.gap-4');
      expect(items).toHaveLength(8);
    });

    it('shows avatar by default', () => {
      const { container } = render(<ListSkeleton />);
      const avatars = container.querySelectorAll('.rounded-full');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('hides avatar when showAvatar is false', () => {
      const { container } = render(<ListSkeleton showAvatar={false} />);
      const avatars = container.querySelectorAll('.rounded-full');
      expect(avatars).toHaveLength(0);
    });

    it('shows action button when enabled', () => {
      const { container } = render(<ListSkeleton showAction />);
      const actions = container.querySelectorAll('.w-20.h-8');
      expect(actions.length).toBeGreaterThan(0);
    });
  });

  describe('FormSkeleton', () => {
    it('renders default number of fields', () => {
      const { container } = render(<FormSkeleton />);
      const fields = container.querySelectorAll('.space-y-2');
      expect(fields).toHaveLength(4);
    });

    it('renders custom number of fields', () => {
      const { container } = render(<FormSkeleton fields={6} />);
      const fields = container.querySelectorAll('.space-y-2');
      expect(fields).toHaveLength(6);
    });

    it('shows title by default', () => {
      const { container } = render(<FormSkeleton />);
      const title = container.querySelector('.h-8');
      expect(title).toBeInTheDocument();
    });

    it('hides title when showTitle is false', () => {
      const { container } = render(<FormSkeleton showTitle={false} />);
      const title = container.querySelector('.h-8');
      expect(title).not.toBeInTheDocument();
    });

    it('shows submit button by default', () => {
      const { container } = render(<FormSkeleton />);
      const submitArea = container.querySelector('.flex.gap-3.pt-4');
      expect(submitArea).toBeInTheDocument();
    });

    it('hides submit button when showSubmit is false', () => {
      const { container } = render(<FormSkeleton showSubmit={false} />);
      const submitArea = container.querySelector('.flex.gap-3.pt-4');
      expect(submitArea).not.toBeInTheDocument();
    });
  });
});
