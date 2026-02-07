/**
 * CategoryFilter Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from './CategoryFilter';

describe('CategoryFilter', () => {
  const categories = ['Appetizers', 'Main', 'Desserts'];
  const mockOnChange = vi.fn();

  it('renders all categories', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory={null}
        onCategoryChange={mockOnChange}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Desserts')).toBeInTheDocument();
  });

  it('calls onChange when category is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory={null}
        onCategoryChange={mockOnChange}
      />
    );

    await user.click(screen.getByText('Main'));
    expect(mockOnChange).toHaveBeenCalledWith('Main');
  });

  it('calls onChange with null when All is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="Main"
        onCategoryChange={mockOnChange}
      />
    );

    await user.click(screen.getByText('All'));
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });
});
