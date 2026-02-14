import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isRTL,
  getDirectionalClass,
  toLogicalDirection,
  getMirrorTransform,
  shouldMirrorIcon,
  getIconRTLClass,
  formatNumber,
  getTextDirection,
  getFontClass,
} from './rtl';

describe('RTL Utilities', () => {
  let originalDir: string;

  beforeEach(() => {
    // Save original direction
    originalDir = document.documentElement.dir;
  });

  afterEach(() => {
    // Restore original direction
    document.documentElement.dir = originalDir;
  });

  describe('isRTL', () => {
    it('returns true when document direction is rtl', () => {
      document.documentElement.dir = 'rtl';
      expect(isRTL()).toBe(true);
    });

    it('returns false when document direction is ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(isRTL()).toBe(false);
    });

    it('returns false when document direction is not set', () => {
      document.documentElement.dir = '';
      expect(isRTL()).toBe(false);
    });
  });

  describe('getDirectionalClass', () => {
    it('returns ltr class when direction is ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(getDirectionalClass('ml-4', 'mr-4')).toBe('ml-4');
    });

    it('returns rtl class when direction is rtl', () => {
      document.documentElement.dir = 'rtl';
      expect(getDirectionalClass('ml-4', 'mr-4')).toBe('mr-4');
    });
  });

  describe('toLogicalDirection', () => {
    it('converts left to start in ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(toLogicalDirection('left')).toBe('start');
    });

    it('converts right to end in ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(toLogicalDirection('right')).toBe('end');
    });

    it('converts left to end in rtl', () => {
      document.documentElement.dir = 'rtl';
      expect(toLogicalDirection('left')).toBe('end');
    });

    it('converts right to start in rtl', () => {
      document.documentElement.dir = 'rtl';
      expect(toLogicalDirection('right')).toBe('start');
    });
  });

  describe('getMirrorTransform', () => {
    it('returns scaleX(-1) in rtl when shouldMirror is true', () => {
      document.documentElement.dir = 'rtl';
      expect(getMirrorTransform(true)).toBe('scaleX(-1)');
    });

    it('returns none in ltr when shouldMirror is true', () => {
      document.documentElement.dir = 'ltr';
      expect(getMirrorTransform(true)).toBe('none');
    });

    it('returns none when shouldMirror is false', () => {
      document.documentElement.dir = 'rtl';
      expect(getMirrorTransform(false)).toBe('none');
    });

    it('defaults to shouldMirror true', () => {
      document.documentElement.dir = 'rtl';
      expect(getMirrorTransform()).toBe('scaleX(-1)');
    });
  });

  describe('shouldMirrorIcon', () => {
    it('returns true for directional icons', () => {
      expect(shouldMirrorIcon('ChevronLeft')).toBe(true);
      expect(shouldMirrorIcon('ChevronRight')).toBe(true);
      expect(shouldMirrorIcon('ArrowLeft')).toBe(true);
      expect(shouldMirrorIcon('ArrowRight')).toBe(true);
    });

    it('returns false for non-directional icons', () => {
      expect(shouldMirrorIcon('Search')).toBe(false);
      expect(shouldMirrorIcon('Home')).toBe(false);
      expect(shouldMirrorIcon('Settings')).toBe(false);
    });
  });

  describe('getIconRTLClass', () => {
    it('returns rtl-mirror for directional icons', () => {
      expect(getIconRTLClass('ChevronRight')).toBe('rtl-mirror');
      expect(getIconRTLClass('ArrowLeft')).toBe('rtl-mirror');
    });

    it('returns empty string for non-directional icons', () => {
      expect(getIconRTLClass('Search')).toBe('');
      expect(getIconRTLClass('Home')).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('formats number with English locale in ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(formatNumber(1234)).toBe('1,234');
    });

    it('formats number with English locale when useArabicNumerals is false', () => {
      document.documentElement.dir = 'rtl';
      expect(formatNumber(1234, false)).toBe('1,234');
    });

    it('formats number with Arabic locale when useArabicNumerals is true and rtl', () => {
      document.documentElement.dir = 'rtl';
      const result = formatNumber(1234, true);
      // Arabic-Indic numerals: ١٬٢٣٤
      expect(result).toMatch(/[٠-٩]/);
    });
  });

  describe('getTextDirection', () => {
    it('returns rtl when document direction is rtl', () => {
      document.documentElement.dir = 'rtl';
      expect(getTextDirection()).toBe('rtl');
    });

    it('returns ltr when document direction is ltr', () => {
      document.documentElement.dir = 'ltr';
      expect(getTextDirection()).toBe('ltr');
    });
  });

  describe('getFontClass', () => {
    it('returns font-arabic for Arabic language', () => {
      expect(getFontClass('ar')).toBe('font-arabic');
    });

    it('returns font-sans for English language', () => {
      expect(getFontClass('en')).toBe('font-sans');
    });
  });
});
