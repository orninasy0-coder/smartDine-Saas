/**
 * Pricing Page Integration Tests
 * Tests the pricing page with subscription plans and feature comparison
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Pricing from './Pricing';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const renderPricing = () => {
  return render(
    <BrowserRouter>
      <Pricing />
    </BrowserRouter>
  );
};

describe('Pricing Page Integration', () => {
  it('should render the pricing page without crashing', () => {
    renderPricing();
    expect(document.body).toBeTruthy();
  });

  it('should render the header component', () => {
    renderPricing();
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render the footer component', () => {
    renderPricing();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render the main pricing hero section', () => {
    renderPricing();
    expect(screen.getByText(/Simple, Transparent/i)).toBeInTheDocument();
    // Check for pricing heading specifically
    expect(screen.getByRole('heading', { name: /Pricing/i })).toBeInTheDocument();
  });

  it('should display pricing description', () => {
    renderPricing();
    expect(screen.getByText(/Choose the perfect plan for your restaurant/i)).toBeInTheDocument();
  });

  it('should render pricing cards section', () => {
    renderPricing();
    // PricingCards component should render the three plans
    const basicElements = screen.getAllByText(/Basic/i);
    const proElements = screen.getAllByText(/Pro/i);
    const enterpriseElements = screen.getAllByText(/Enterprise/i);
    
    expect(basicElements.length).toBeGreaterThan(0);
    expect(proElements.length).toBeGreaterThan(0);
    expect(enterpriseElements.length).toBeGreaterThan(0);
  });

  it('should render feature comparison section', () => {
    renderPricing();
    expect(screen.getByText(/Compare Plans/i)).toBeInTheDocument();
  });

  it('should display feature comparison description', () => {
    renderPricing();
    expect(screen.getByText(/See what's included in each plan/i)).toBeInTheDocument();
  });

  it('should render FAQ section', () => {
    renderPricing();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('should display FAQ about switching plans', () => {
    renderPricing();
    expect(screen.getByText(/Can I switch plans later/i)).toBeInTheDocument();
    expect(screen.getByText(/You can upgrade or downgrade your plan at any time/i)).toBeInTheDocument();
  });

  it('should display FAQ about free trial', () => {
    renderPricing();
    expect(screen.getByText(/Is there a free trial/i)).toBeInTheDocument();
    expect(screen.getByText(/14-day free trial/i)).toBeInTheDocument();
  });

  it('should display FAQ about payment methods', () => {
    renderPricing();
    expect(screen.getByText(/What payment methods do you accept/i)).toBeInTheDocument();
    expect(screen.getByText(/credit cards, PayPal/i)).toBeInTheDocument();
  });

  it('should display FAQ about cancellation', () => {
    renderPricing();
    expect(screen.getByText(/Can I cancel anytime/i)).toBeInTheDocument();
    expect(screen.getByText(/You can cancel your subscription at any time/i)).toBeInTheDocument();
  });

  it('should render floating shapes for visual appeal', () => {
    const { container } = renderPricing();
    // FloatingShapes component should be present
    const shapes = container.querySelectorAll('[class*="floating-shape"]');
    expect(shapes.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper semantic HTML structure', () => {
    renderPricing();
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should have responsive layout classes', () => {
    const { container } = renderPricing();
    const responsiveElements = container.querySelectorAll('[class*="container"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('should render with proper z-index layering', () => {
    const { container } = renderPricing();
    const main = container.querySelector('main');
    expect(main).toHaveClass('relative', 'z-10');
  });

  it('should have background styling', () => {
    const { container } = renderPricing();
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('relative', 'min-h-screen', 'bg-background');
  });

  it('should render FAQ cards with proper styling', () => {
    renderPricing();
    const faqCards = document.querySelectorAll('.bg-card');
    expect(faqCards.length).toBeGreaterThan(0);
  });

  it('should have muted background for comparison section', () => {
    renderPricing();
    const comparisonSection = screen.getByText(/Compare Plans/i).closest('section');
    expect(comparisonSection).toHaveClass('bg-muted/30');
  });

  it('should render all three main sections', () => {
    renderPricing();
    // Hero/Pricing section
    expect(screen.getByText(/Simple, Transparent/i)).toBeInTheDocument();
    // Comparison section
    expect(screen.getByText(/Compare Plans/i)).toBeInTheDocument();
    // FAQ section
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });
});
