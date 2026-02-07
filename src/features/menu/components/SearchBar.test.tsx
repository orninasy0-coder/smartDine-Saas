/**
 * SearchBar Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnChange = vi.fn();

  it('renders with placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Search dishes..." />);
    expect(screen.getByPlaceholderText('Search dishes...')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<SearchBar value="pizza" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('pizza')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'burger');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('shows clear button when value is not empty', () => {
    render(<SearchBar value="pizza" onChange={mockOnChange} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('clears value when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="pizza" onChange={mockOnChange} />);

    await user.click(screen.getByLabelText('Clear search'));
    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});
