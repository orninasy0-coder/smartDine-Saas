/**
 * Validation Utilities Property-Based Tests
 * 
 * Tests critical validation functions with property-based testing
 * to ensure they handle all possible inputs correctly.
 * 
 * **Validates: Requirements 2.1, 2.2, 3.5, 3.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isValidPhone,
  isValidPrice,
  isValidQuantity,
  isValidRating,
  isValidUrl,
  sanitizeString,
  isRequired,
  isValidLength,
} from './index';

describe('Validation Utilities - Property-Based Tests', () => {
  /**
   * Property: Email validation should reject invalid formats
   */
  describe('Email Validation Properties', () => {
    it('should accept valid email formats', () => {
      fc.assert(
        fc.property(
          fc.emailAddress(),
          (email) => {
            expect(isValidEmail(email)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject emails without @ symbol', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('@')),
          (invalidEmail) => {
            expect(isValidEmail(invalidEmail)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject emails without domain', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          (username) => {
            const invalidEmail = `${username}@`;
            expect(isValidEmail(invalidEmail)).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Password strength should be monotonic
   * (adding characters should never decrease strength)
   */
  describe('Password Strength Properties', () => {
    it('should return strength between 0 and 4', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 100 }),
          (password) => {
            const strength = getPasswordStrength(password);
            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(4);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should give higher strength to passwords with more character types', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8, maxLength: 20 }),
          (base) => {
            const simple = base.toLowerCase().replace(/[^a-z]/g, 'a');
            const complex = base + 'A1!';
            
            const simpleStrength = getPasswordStrength(simple);
            const complexStrength = getPasswordStrength(complex);
            
            expect(complexStrength).toBeGreaterThanOrEqual(simpleStrength);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should give strength 0 to empty passwords', () => {
      expect(getPasswordStrength('')).toBe(0);
    });
  });

  /**
   * Property: Price validation should only accept positive finite numbers
   */
  describe('Price Validation Properties', () => {
    it('should accept positive finite numbers', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
          (price) => {
            expect(isValidPrice(price)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject zero and negative prices', () => {
      fc.assert(
        fc.property(
          fc.float({ max: 0, noNaN: true }),
          (price) => {
            expect(isValidPrice(price)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject NaN and Infinity', () => {
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
      expect(isValidPrice(-Infinity)).toBe(false);
    });
  });

  /**
   * Property: Quantity validation should only accept positive integers
   */
  describe('Quantity Validation Properties', () => {
    it('should accept positive integers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          (quantity) => {
            expect(isValidQuantity(quantity)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject zero and negative quantities', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: 0 }),
          (quantity) => {
            expect(isValidQuantity(quantity)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject non-integer quantities', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter(n => !Number.isInteger(n)),
          (quantity) => {
            expect(isValidQuantity(quantity)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Rating validation should only accept integers 1-5
   */
  describe('Rating Validation Properties', () => {
    it('should accept ratings from 1 to 5', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (rating) => {
            expect(isValidRating(rating)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject ratings outside 1-5 range', () => {
      fc.assert(
        fc.property(
          fc.integer().filter(n => n < 1 || n > 5),
          (rating) => {
            expect(isValidRating(rating)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject non-integer ratings', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 1, max: 5, noNaN: true }).filter(n => !Number.isInteger(n)),
          (rating) => {
            expect(isValidRating(rating)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: URL validation should accept valid URLs
   */
  describe('URL Validation Properties', () => {
    it('should accept valid HTTP/HTTPS URLs', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (url) => {
            expect(isValidUrl(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid URL formats', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => {
            try {
              new URL(s);
              return false;
            } catch {
              return true;
            }
          }),
          (invalidUrl) => {
            expect(isValidUrl(invalidUrl)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: String sanitization should remove dangerous characters
   */
  describe('String Sanitization Properties', () => {
    it('should remove < and > characters', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 100 }),
          (input) => {
            const sanitized = sanitizeString(input);
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trim whitespace', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ maxLength: 10 }).filter(s => /^\s+$/.test(s) || s === ''),
          fc.string({ maxLength: 10 }).filter(s => /^\s+$/.test(s) || s === ''),
          (content, prefix, suffix) => {
            const input = prefix + content + suffix;
            const sanitized = sanitizeString(input);
            expect(sanitized).toBe(sanitized.trim());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve safe characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('<') && !s.includes('>')),
          (safeInput) => {
            const sanitized = sanitizeString(safeInput);
            expect(sanitized).toBe(safeInput.trim());
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Required field validation
   */
  describe('Required Field Validation Properties', () => {
    it('should reject null and undefined', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });

    it('should reject empty strings and whitespace-only strings', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => s.trim().length === 0),
          (emptyString) => {
            expect(isRequired(emptyString)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept non-empty strings', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          (nonEmptyString) => {
            expect(isRequired(nonEmptyString)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept non-null objects and numbers', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer(),
            fc.float({ noNaN: true }),
            fc.boolean(),
            fc.object()
          ),
          (value) => {
            expect(isRequired(value)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Length validation should respect min/max bounds
   */
  describe('Length Validation Properties', () => {
    it('should accept strings within length bounds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 0, max: 50 }),
          (len1, len2) => {
            const min = Math.min(len1, len2);
            const max = Math.max(len1, len2);
            
            // Skip if min === max === 0
            if (min === 0 && max === 0) return;
            
            fc.assert(
              fc.property(
                fc.string({ minLength: min, maxLength: max }).filter(s => s.trim().length >= min && s.trim().length <= max),
                (str) => {
                  expect(isValidLength(str, min, max)).toBe(true);
                }
              ),
              { numRuns: 10 }
            );
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should reject strings shorter than min length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 20 }),
          fc.string({ maxLength: 4 }),
          (minLength, shortString) => {
            expect(isValidLength(shortString, minLength, minLength + 10)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject strings longer than max length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.string({ minLength: 20, maxLength: 50 }),
          (maxLength, longString) => {
            expect(isValidLength(longString, 0, maxLength)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Phone validation should accept valid formats
   */
  describe('Phone Validation Properties', () => {
    it('should accept phone numbers with at least 10 digits', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 10, maxLength: 15 }),
          (digits) => {
            const phone = digits.join('');
            expect(isValidPhone(phone)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept phone numbers with formatting characters', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 10, maxLength: 15 }),
          (digits) => {
            const phone = `+${digits.slice(0, 2).join('')} (${digits.slice(2, 5).join('')}) ${digits.slice(5).join('')}`;
            expect(isValidPhone(phone)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject phone numbers with less than 10 digits', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { maxLength: 9 }),
          (digits) => {
            const phone = digits.join('');
            if (phone.length > 0) {
              expect(isValidPhone(phone)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
