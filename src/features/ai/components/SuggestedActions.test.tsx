/**
 * SuggestedActions Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestedActions, type SuggestedAction } from './SuggestedActions';

describe('SuggestedActions', () => {
  it('renders default actions', () => {
    const onActionClick = vi.fn();
    render(<SuggestedActions onActionClick={onActionClick} />);

    expect(screen.getByText('الأطباق المقترحة')).toBeInTheDocument();
    expect(screen.getByText('أطباق نباتية')).toBeInTheDocument();
    expect(screen.getByText('أطباق حارة')).toBeInTheDocument();
    expect(screen.getByText('الأكثر طلباً')).toBeInTheDocument();
    expect(screen.getByText('وجبات سريعة')).toBeInTheDocument();
    expect(screen.getByText('خيارات اقتصادية')).toBeInTheDocument();
  });

  it('calls onActionClick with correct query when action is clicked', () => {
    const onActionClick = vi.fn();
    render(<SuggestedActions onActionClick={onActionClick} />);

    const recommendationsButton = screen.getByText('الأطباق المقترحة');
    fireEvent.click(recommendationsButton);

    expect(onActionClick).toHaveBeenCalledWith('ما هي الأطباق المقترحة اليوم؟');
  });

  it('renders custom actions when provided', () => {
    const customActions: SuggestedAction[] = [
      {
        id: 'custom1',
        label: 'Custom Action 1',
        query: 'Custom query 1',
      },
      {
        id: 'custom2',
        label: 'Custom Action 2',
        query: 'Custom query 2',
      },
    ];

    const onActionClick = vi.fn();
    render(
      <SuggestedActions onActionClick={onActionClick} customActions={customActions} />
    );

    expect(screen.getByText('Custom Action 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Action 2')).toBeInTheDocument();
    expect(screen.queryByText('الأطباق المقترحة')).not.toBeInTheDocument();
  });

  it('disables all buttons when isLoading is true', () => {
    const onActionClick = vi.fn();
    render(<SuggestedActions onActionClick={onActionClick} isLoading={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('enables all buttons when isLoading is false', () => {
    const onActionClick = vi.fn();
    render(<SuggestedActions onActionClick={onActionClick} isLoading={false} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('calls onActionClick for each custom action', () => {
    const customActions: SuggestedAction[] = [
      {
        id: 'test1',
        label: 'Test 1',
        query: 'Query 1',
      },
      {
        id: 'test2',
        label: 'Test 2',
        query: 'Query 2',
      },
    ];

    const onActionClick = vi.fn();
    render(
      <SuggestedActions onActionClick={onActionClick} customActions={customActions} />
    );

    fireEvent.click(screen.getByText('Test 1'));
    expect(onActionClick).toHaveBeenCalledWith('Query 1');

    fireEvent.click(screen.getByText('Test 2'));
    expect(onActionClick).toHaveBeenCalledWith('Query 2');
  });
});
