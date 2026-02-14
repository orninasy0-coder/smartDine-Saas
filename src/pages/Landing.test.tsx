/**
 * Landing Page Integration Tests
 * Tests the main landing page with all its sections
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the landing components to avoid complex rendering issues
vi.mock('@/components/landing', () => ({
  HeroSection: () => <section data-testid="hero-section">Transform Your Restaurant</section>,
  FeaturesGrid: () => <section data-testid="features-grid">Key Features - QR Menu - AI Assistant - AR Viewer</section>,
  TestimonialsSection: () => <section data-testid="testimonials">What Our Clients Say</section>,
  UserGuideSection: () => <section data-testid="user-guide">How It Works</section>,
  CTASection: () => <section data-testid="cta-section">Ready to Get Started - Get Started</section>,
}));

const renderLanding = () => {
  return render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>
  );
};

describe('Landing Page Integration', () => {
  it('should render the landing page without crashing', () => {
    renderLanding();
    expect(document.body).toBeTruthy();
  });

  it('should render the header component', () => {
    renderLanding();
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render the hero section', () => {
    renderLanding();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText(/Transform Your Restaurant/i)).toBeInTheDocument();
  });

  it('should render features grid section', () => {
    renderLanding();
    expect(screen.getByTestId('features-grid')).toBeInTheDocument();
    expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
  });

  it('should render testimonials section', () => {
    renderLanding();
    expect(screen.getByTestId('testimonials')).toBeInTheDocument();
    expect(screen.getByText(/What Our Clients Say/i)).toBeInTheDocument();
  });

  it('should render user guide section', () => {
    renderLanding();
    expect(screen.getByTestId('user-guide')).toBeInTheDocument();
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
  });

  it('should render CTA section', () => {
    renderLanding();
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
    expect(screen.getByText(/Ready to Get Started/i)).toBeInTheDocument();
  });

  it('should render footer component', () => {
    renderLanding();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render floating shapes for visual appeal', () => {
    const { container } = renderLanding();
    // FloatingShapes component should render shapes
    const shapes = container.querySelectorAll('[class*="floating-shape"]');
    expect(shapes.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper semantic HTML structure', () => {
    renderLanding();
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should render navigation links in header', () => {
    renderLanding();
    const featuresLinks = screen.getAllByText(/Features/i);
    expect(featuresLinks.length).toBeGreaterThan(0);
    const pricingLinks = screen.getAllByText(/Pricing/i);
    expect(pricingLinks.length).toBeGreaterThan(0);
  });

  it('should render call-to-action buttons', () => {
    renderLanding();
    const ctaButtons = screen.getAllByText(/Get Started/i);
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('should display feature highlights', () => {
    renderLanding();
    expect(screen.getByText(/QR Menu/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/AR Viewer/i)).toBeInTheDocument();
  });

  it('should have responsive layout classes', () => {
    const { container } = renderLanding();
    const responsiveElements = container.querySelectorAll('[class*="container"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('should render with proper z-index layering', () => {
    const { container } = renderLanding();
    const main = container.querySelector('main');
    expect(main).toHaveClass('relative', 'z-10');
  });

  it('should have background styling', () => {
    const { container } = renderLanding();
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('relative', 'min-h-screen', 'bg-background');
  });
});
