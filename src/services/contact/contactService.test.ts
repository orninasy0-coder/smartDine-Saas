import { describe, it, expect } from 'vitest';
import {
  submitContactForm,
  sanitizeContactForm,
  type ContactFormData,
} from './contactService';

describe('Contact Service', () => {
  describe('sanitizeContactForm', () => {
    it('should trim whitespace from all fields', () => {
      const data: ContactFormData = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        phone: '  +1234567890  ',
        subject: '  Test Subject  ',
        message: '  Test message  ',
      };

      const sanitized = sanitizeContactForm(data);

      expect(sanitized.name).toBe('John Doe');
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.phone).toBe('+1234567890');
      expect(sanitized.subject).toBe('Test Subject');
      expect(sanitized.message).toBe('Test message');
    });

    it('should convert email to lowercase', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        subject: 'Test',
        message: 'Test message',
      };

      const sanitized = sanitizeContactForm(data);

      expect(sanitized.email).toBe('john@example.com');
    });

    it('should handle optional phone field', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
      };

      const sanitized = sanitizeContactForm(data);

      expect(sanitized.phone).toBeUndefined();
    });
  });

  describe('submitContactForm', () => {
    it('should successfully submit valid contact form', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.',
      };

      const response = await submitContactForm(data);

      expect(response.success).toBe(true);
      expect(response.message).toBeTruthy();
      expect(response.ticketId).toBeTruthy();
    });

    it('should reject form with invalid name (too short)', async () => {
      const data: ContactFormData = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Name must be at least 2 characters long'
      );
    });

    it('should reject form with invalid name (too long)', async () => {
      const data: ContactFormData = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Name must not exceed 100 characters'
      );
    });

    it('should reject form with invalid email', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow('Invalid email address');
    });

    it('should reject form with invalid phone number', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: 'invalid-phone',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow('Invalid phone number');
    });

    it('should reject form with invalid subject (too short)', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Subject must be at least 5 characters long'
      );
    });

    it('should reject form with invalid subject (too long)', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'A'.repeat(201),
        message: 'This is a test message.',
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Subject must not exceed 200 characters'
      );
    });

    it('should reject form with invalid message (too short)', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short',
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Message must be at least 10 characters long'
      );
    });

    it('should reject form with invalid message (too long)', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'A'.repeat(1001),
      };

      await expect(submitContactForm(data)).rejects.toThrow(
        'Message must not exceed 1000 characters'
      );
    });

    it('should accept form without phone number', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.',
      };

      const response = await submitContactForm(data);

      expect(response.success).toBe(true);
    });

    it('should accept form with empty phone string', async () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.',
      };

      const response = await submitContactForm(data);

      expect(response.success).toBe(true);
    });
  });
});
