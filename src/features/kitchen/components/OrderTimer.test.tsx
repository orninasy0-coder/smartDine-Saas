/**
 * OrderTimer Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderTimer } from './OrderTimer';

describe('OrderTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders timer with initial elapsed time', () => {
    const createdAt = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
    render(<OrderTimer createdAt={createdAt} />);

    // Should show approximately 5:00
    expect(screen.getByText(/5:0\d/)).toBeInTheDocument();
  });

  it('displays green color for orders less than 10 minutes old', () => {
    const createdAt = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
    const { container } = render(<OrderTimer createdAt={createdAt} />);

    const timer = container.querySelector('.text-green-600');
    expect(timer).toBeInTheDocument();
  });

  it('displays yellow color for orders between 10-20 minutes old', () => {
    const createdAt = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 minutes ago
    const { container } = render(<OrderTimer createdAt={createdAt} />);

    const timer = container.querySelector('.text-yellow-600');
    expect(timer).toBeInTheDocument();
  });

  it('displays red color for orders over 20 minutes old', () => {
    const createdAt = new Date(Date.now() - 25 * 60 * 1000).toISOString(); // 25 minutes ago
    const { container } = render(<OrderTimer createdAt={createdAt} />);

    const timer = container.querySelector('.text-red-600');
    expect(timer).toBeInTheDocument();
  });

  it('formats time correctly for hours', () => {
    const createdAt = new Date(Date.now() - 90 * 60 * 1000).toISOString(); // 90 minutes ago
    render(<OrderTimer createdAt={createdAt} />);

    // Should show 1:30:00 format
    expect(screen.getByText(/1:30:0\d/)).toBeInTheDocument();
  });

  it('updates every second', async () => {
    const { act } = await import('@testing-library/react');
    const createdAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    render(<OrderTimer createdAt={createdAt} />);

    const initialText = screen.getByText(/5:0\d/).textContent;

    // Advance time by 2 seconds to ensure visible change
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    const updatedText = screen.getByText(/5:0\d/).textContent;
    expect(updatedText).not.toBe(initialText);
  });
});
