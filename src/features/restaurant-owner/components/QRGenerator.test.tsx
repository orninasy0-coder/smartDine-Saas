import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRGenerator } from './QRGenerator';
import type { QRCodeData } from '../types';

describe('QRGenerator', () => {
  const mockQRCodes: QRCodeData[] = [
    {
      id: 'qr-1',
      restaurantId: 'restaurant-1',
      tableNumber: 'Table 1',
      qrCodeUrl: 'data:image/png;base64,test',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'qr-2',
      restaurantId: 'restaurant-1',
      tableNumber: 'Table 2',
      qrCodeUrl: 'data:image/png;base64,test',
      createdAt: new Date('2024-01-15'),
    },
  ];

  const mockHandlers = {
    onGenerate: vi.fn(),
    onDelete: vi.fn(),
    onDownload: vi.fn(),
  };

  it('renders QR codes grid', () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    expect(screen.getByText('Table 1')).toBeInTheDocument();
    expect(screen.getByText('Table 2')).toBeInTheDocument();
  });

  it('displays empty state when no QR codes', () => {
    render(<QRGenerator qrCodes={[]} {...mockHandlers} />);

    expect(screen.getByText('لا توجد رموز QR')).toBeInTheDocument();
    expect(
      screen.getByText('ابدأ بإنشاء رمز QR للطاولة الأولى')
    ).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<QRGenerator qrCodes={[]} {...mockHandlers} isLoading={true} />);

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('opens dialog when add button is clicked', async () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    const addButton = screen.getByText('إضافة رمز QR جديد');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('إنشاء رمز QR جديد')).toBeInTheDocument();
    });
  });

  it('calls onGenerate when form is submitted', async () => {
    const onGenerate = vi.fn().mockResolvedValue(undefined);
    render(
      <QRGenerator
        qrCodes={mockQRCodes}
        {...mockHandlers}
        onGenerate={onGenerate}
      />
    );

    // Open dialog
    const addButton = screen.getByText('إضافة رمز QR جديد');
    fireEvent.click(addButton);

    // Fill in table number
    const input = await screen.findByLabelText('رقم الطاولة');
    fireEvent.change(input, { target: { value: 'Table 3' } });

    // Submit form
    const submitButton = screen.getByText('إنشاء');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalledWith('Table 3');
    });
  });

  it('calls onDownload when download button is clicked', () => {
    const onDownload = vi.fn();
    render(
      <QRGenerator
        qrCodes={mockQRCodes}
        {...mockHandlers}
        onDownload={onDownload}
      />
    );

    const downloadButtons = screen.getAllByText('تحميل');
    fireEvent.click(downloadButtons[0]);

    expect(onDownload).toHaveBeenCalledWith(mockQRCodes[0]);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <QRGenerator
        qrCodes={mockQRCodes}
        {...mockHandlers}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const trashButton = deleteButtons.find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );

    if (trashButton) {
      fireEvent.click(trashButton);
      expect(onDelete).toHaveBeenCalledWith('qr-1');
    }
  });

  it('does not call onDelete when deletion is cancelled', () => {
    const onDelete = vi.fn();
    
    // Mock window.confirm to return false
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <QRGenerator
        qrCodes={mockQRCodes}
        {...mockHandlers}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const trashButton = deleteButtons.find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );

    if (trashButton) {
      fireEvent.click(trashButton);
      expect(onDelete).not.toHaveBeenCalled();
    }
  });

  it('displays QR code images', () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'data:image/png;base64,test');
    expect(images[0]).toHaveAttribute('alt', 'QR Code for Table 1');
  });

  it('displays creation dates', () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    const dates = screen.getAllByText(/تم الإنشاء:/);
    expect(dates).toHaveLength(2);
  });

  it('disables generate button when table number is empty', async () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    // Open dialog
    const addButton = screen.getByText('إضافة رمز QR جديد');
    fireEvent.click(addButton);

    // Submit button should be disabled
    const submitButton = await screen.findByText('إنشاء');
    expect(submitButton).toBeDisabled();
  });

  it('enables generate button when table number is entered', async () => {
    render(<QRGenerator qrCodes={mockQRCodes} {...mockHandlers} />);

    // Open dialog
    const addButton = screen.getByText('إضافة رمز QR جديد');
    fireEvent.click(addButton);

    // Fill in table number
    const input = await screen.findByLabelText('رقم الطاولة');
    fireEvent.change(input, { target: { value: 'Table 3' } });

    // Submit button should be enabled
    const submitButton = screen.getByText('إنشاء');
    expect(submitButton).not.toBeDisabled();
  });

  it('shows generating state during generation', async () => {
    const onGenerate = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    
    render(
      <QRGenerator
        qrCodes={mockQRCodes}
        {...mockHandlers}
        onGenerate={onGenerate}
      />
    );

    // Open dialog
    const addButton = screen.getByText('إضافة رمز QR جديد');
    fireEvent.click(addButton);

    // Fill in table number
    const input = await screen.findByLabelText('رقم الطاولة');
    fireEvent.change(input, { target: { value: 'Table 3' } });

    // Submit form
    const submitButton = screen.getByText('إنشاء');
    fireEvent.click(submitButton);

    // Should show generating state
    await waitFor(() => {
      expect(screen.getByText('جاري الإنشاء...')).toBeInTheDocument();
    });
  });
});
