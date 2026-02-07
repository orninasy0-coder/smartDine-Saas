import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders the SmartDine brand name', () => {
    render(<Footer />);
    expect(screen.getByText('SmartDine')).toBeInTheDocument();
  });

  it('renders footer links sections', () => {
    render(<Footer />);
    
    // Check for section headings
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders About, Privacy, and Terms links', () => {
    render(<Footer />);
    
    // Check for legal links
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    // Check for social media links by aria-label
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  it('renders newsletter subscription form', () => {
    render(<Footer />);
    
    expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('handles newsletter form submission', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<Footer />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    // Fill in email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify console log was called (placeholder implementation)
    expect(consoleSpy).toHaveBeenCalledWith('Newsletter subscription:', 'test@example.com');
    
    consoleSpy.mockRestore();
  });

  it('renders copyright information with current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} SmartDine`))).toBeInTheDocument();
  });

  it('renders all footer link categories', () => {
    render(<Footer />);
    
    // Product links
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Demo')).toBeInTheDocument();
    
    // Company links
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    
    // Legal links
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    
    // Support links
    expect(screen.getByText('Help Center')).toBeInTheDocument();
  });

  it('social media links open in new tab', () => {
    render(<Footer />);
    
    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
