/**
 * Error Pages Tests
 * Tests for NotFound (404) and ServerError (500) pages
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';
import ServerError from './ServerError';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/test-path' }),
  };
});

describe('NotFound Page (404)', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 404 error code', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays default error message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/The page you're looking for doesn't exist or has been moved/i)
    ).toBeInTheDocument();
  });

  it('displays custom error message when provided', () => {
    const customMessage = 'Custom 404 message';
    render(
      <BrowserRouter>
        <NotFound message={customMessage} />
      </BrowserRouter>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('displays the requested path', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('/test-path')).toBeInTheDocument();
  });

  it('has Go Back button that navigates back', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const goBackButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('has Go Home button that navigates to home', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const goHomeButton = screen.getByRole('button', { name: /go home/i });
    fireEvent.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows search button when showSearch is true', () => {
    render(
      <BrowserRouter>
        <NotFound showSearch={true} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('does not show search button by default', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.queryByRole('button', { name: /search/i })).not.toBeInTheDocument();
  });

  it('displays suggestions list', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Check the URL for typos/i)).toBeInTheDocument();
    expect(screen.getByText(/Go back to the previous page/i)).toBeInTheDocument();
    expect(screen.getByText(/Visit our home page/i)).toBeInTheDocument();
  });
});

describe('ServerError Page (500)', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  it('renders 500 error code', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });

  it('displays default error message', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Oops! Something went wrong on our end/i)
    ).toBeInTheDocument();
  });

  it('displays custom error message when provided', () => {
    const customMessage = 'Database connection failed';
    render(
      <BrowserRouter>
        <ServerError message={customMessage} />
      </BrowserRouter>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('displays error code when provided', () => {
    const errorCode = 'ERR-12345';
    render(
      <BrowserRouter>
        <ServerError errorCode={errorCode} />
      </BrowserRouter>
    );

    expect(screen.getByText(errorCode)).toBeInTheDocument();
    expect(screen.getByText('Error Reference')).toBeInTheDocument();
  });

  it('has Refresh button that reloads the page', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(reloadMock).toHaveBeenCalled();
  });

  it('has Go Home button that navigates to home', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    const goHomeButton = screen.getByRole('button', { name: /go home/i });
    fireEvent.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows Contact Support button by default', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /contact support/i })).toBeInTheDocument();
  });

  it('hides Contact Support button when showContactSupport is false', () => {
    render(
      <BrowserRouter>
        <ServerError showContactSupport={false} />
      </BrowserRouter>
    );

    expect(screen.queryByRole('button', { name: /contact support/i })).not.toBeInTheDocument();
  });

  it('Contact Support button navigates to contact page', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    const contactButton = screen.getByRole('button', { name: /contact support/i });
    fireEvent.click(contactButton);

    expect(mockNavigate).toHaveBeenCalledWith('/contact');
  });

  it('displays action suggestions', () => {
    render(
      <BrowserRouter>
        <ServerError />
      </BrowserRouter>
    );

    expect(screen.getByText(/What you can do:/i)).toBeInTheDocument();
    expect(screen.getByText(/Refresh the page/i)).toBeInTheDocument();
    expect(screen.getByText(/Try again in a few minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact support if the problem persists/i)).toBeInTheDocument();
  });

  it('displays help text about error reference', () => {
    render(
      <BrowserRouter>
        <ServerError errorCode="ERR-123" />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/If this issue continues, please include the error reference/i)
    ).toBeInTheDocument();
  });
});
