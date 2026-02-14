import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('should render label correctly', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <FormField label="Email">
        <input type="email" data-testid="email-input" />
      </FormField>
    );

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('should show required asterisk when required is true', () => {
    render(
      <FormField label="Email" required={true}>
        <input type="email" />
      </FormField>
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500', 'ml-1');
  });

  it('should not show required asterisk when required is false', () => {
    render(
      <FormField label="Email" required={false}>
        <input type="email" />
      </FormField>
    );

    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('should not show required asterisk by default', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    render(
      <FormField label="Email" error="Email is required">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should not display error message when not provided', () => {
    const { container } = render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    const errorText = container.querySelector('.text-red-600');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should apply correct styling to error message', () => {
    render(
      <FormField label="Email" error="Email is required">
        <input type="email" />
      </FormField>
    );

    const errorMessage = screen.getByText('Email is required');
    expect(errorMessage).toHaveClass('mt-1', 'text-sm', 'text-red-600', 'dark:text-red-400');
  });

  it('should apply correct styling to label', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    const label = screen.getByText('Email');
    expect(label).toHaveClass(
      'block',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'dark:text-gray-300',
      'mb-1'
    );
  });

  it('should have correct container spacing', () => {
    const { container } = render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );

    const wrapper = container.querySelector('.mb-4');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render multiple form fields independently', () => {
    render(
      <>
        <FormField label="Email" required={true}>
          <input type="email" />
        </FormField>
        <FormField label="Password" error="Password is required">
          <input type="password" />
        </FormField>
      </>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should render complex children', () => {
    render(
      <FormField label="Options">
        <select data-testid="select-input">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </FormField>
    );

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
  });

  it('should handle both required and error states', () => {
    render(
      <FormField label="Email" required={true} error="Invalid email format">
        <input type="email" />
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });
});
