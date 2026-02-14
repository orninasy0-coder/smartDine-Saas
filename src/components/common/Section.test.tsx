import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('should render children correctly', () => {
    render(
      <Section>
        <div>Test Content</div>
      </Section>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default padding classes', () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-12');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Section className="bg-gray-100">
        <div>Content</div>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-12', 'bg-gray-100');
  });

  it('should render title when provided', () => {
    render(
      <Section title="Test Title">
        <div>Content</div>
      </Section>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <Section description="Test Description">
        <div>Content</div>
      </Section>
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render both title and description', () => {
    render(
      <Section title="Test Title" description="Test Description">
        <div>Content</div>
      </Section>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should apply correct styling to title', () => {
    render(
      <Section title="Test Title">
        <div>Content</div>
      </Section>
    );

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'dark:text-white');
  });

  it('should apply correct styling to description', () => {
    render(
      <Section description="Test Description">
        <div>Content</div>
      </Section>
    );

    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('mt-2', 'text-gray-600', 'dark:text-gray-400');
  });

  it('should center title and description', () => {
    const { container } = render(
      <Section title="Test Title" description="Test Description">
        <div>Content</div>
      </Section>
    );

    const headerDiv = container.querySelector('.text-center');
    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass('mb-8');
  });

  it('should not render header div when no title or description', () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );

    const headerDiv = container.querySelector('.text-center');
    expect(headerDiv).not.toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <Section>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Section>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
});
