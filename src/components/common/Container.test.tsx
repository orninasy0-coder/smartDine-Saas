import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('should render children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default container classes', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('container', 'mx-auto', 'px-4');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('container', 'mx-auto', 'px-4', 'custom-class');
  });

  it('should render multiple children', () => {
    render(
      <Container>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Container>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
});
