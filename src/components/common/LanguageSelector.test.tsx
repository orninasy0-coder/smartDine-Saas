import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../../i18n';

// Mock the useTranslation hook
vi.mock('../../i18n', () => ({
  useTranslation: vi.fn(),
}));

describe('LanguageSelector', () => {
  const mockChangeLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({
      language: 'en',
      changeLanguage: mockChangeLanguage,
      t: (key: string) => key,
      i18n: { language: 'en' },
      isRTL: false,
    });
  });

  it('should render language selector button', () => {
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toBeInTheDocument();
  });

  it('should display globe icon', () => {
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should open dropdown menu on click', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    // Check if language options are displayed
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('should show checkmark for current language', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    // English should have a checkmark
    const englishOption = screen.getByText('English').closest('div');
    expect(englishOption?.textContent).toContain('✓');
  });

  it('should call changeLanguage when selecting a language', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const arabicOption = screen.getByText('العربية');
    await user.click(arabicOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });

  it('should highlight current language option', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const englishOption = screen.getByText('English').closest('div');
    expect(englishOption).toHaveClass('bg-accent');
  });

  it('should work with Arabic as current language', async () => {
    (useTranslation as any).mockReturnValue({
      language: 'ar',
      changeLanguage: mockChangeLanguage,
      t: (key: string) => key,
      i18n: { language: 'ar' },
      isRTL: true,
    });

    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    // Arabic should have a checkmark
    const arabicOption = screen.getByText('العربية').closest('div');
    expect(arabicOption?.textContent).toContain('✓');
  });

  it('should switch from English to Arabic', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const arabicOption = screen.getByText('العربية');
    await user.click(arabicOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  it('should switch from Arabic to English', async () => {
    (useTranslation as any).mockReturnValue({
      language: 'ar',
      changeLanguage: mockChangeLanguage,
      t: (key: string) => key,
      i18n: { language: 'ar' },
      isRTL: true,
    });

    const user = userEvent.setup();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const englishOption = screen.getByText('English');
    await user.click(englishOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });
});
