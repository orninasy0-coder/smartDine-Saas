/**
 * RTL (Right-to-Left) Utility Functions
 * 
 * Provides helper functions for handling RTL layout and styling
 */

/**
 * Check if the current document direction is RTL
 */
export function isRTL(): boolean {
  return document.documentElement.dir === 'rtl';
}

/**
 * Get the appropriate margin/padding class based on direction
 * @param ltrClass - Class to use in LTR mode (e.g., 'ml-4')
 * @param rtlClass - Class to use in RTL mode (e.g., 'mr-4')
 */
export function getDirectionalClass(ltrClass: string, rtlClass: string): string {
  return isRTL() ? rtlClass : ltrClass;
}

/**
 * Get logical property class (start/end instead of left/right)
 * These classes work automatically in both LTR and RTL
 */
export const logicalClasses = {
  // Margin
  ms: (size: string) => `ms-${size}`, // margin-inline-start
  me: (size: string) => `me-${size}`, // margin-inline-end
  
  // Padding
  ps: (size: string) => `ps-${size}`, // padding-inline-start
  pe: (size: string) => `pe-${size}`, // padding-inline-end
  
  // Text alignment
  textStart: 'text-start',
  textEnd: 'text-end',
  
  // Float
  floatStart: 'float-start',
  floatEnd: 'float-end',
  
  // Border
  borderS: 'border-s',
  borderE: 'border-e',
  
  // Rounded corners
  roundedS: 'rounded-s',
  roundedE: 'rounded-e',
} as const;

/**
 * Convert physical direction to logical direction
 * @param direction - 'left' or 'right'
 * @returns 'start' or 'end' based on current direction
 */
export function toLogicalDirection(direction: 'left' | 'right'): 'start' | 'end' {
  const rtl = isRTL();
  
  if (direction === 'left') {
    return rtl ? 'end' : 'start';
  }
  return rtl ? 'start' : 'end';
}

/**
 * Get transform value for mirroring icons/images in RTL
 * @param shouldMirror - Whether the element should be mirrored in RTL
 */
export function getMirrorTransform(shouldMirror: boolean = true): string {
  return shouldMirror && isRTL() ? 'scaleX(-1)' : 'none';
}

/**
 * Icons that should be mirrored in RTL
 * (directional icons like arrows, chevrons, etc.)
 */
export const MIRROR_ICONS = [
  'ChevronLeft',
  'ChevronRight',
  'ArrowLeft',
  'ArrowRight',
  'ArrowBigLeft',
  'ArrowBigRight',
  'ChevronsLeft',
  'ChevronsRight',
  'MoveLeft',
  'MoveRight',
  'CornerDownLeft',
  'CornerDownRight',
  'CornerUpLeft',
  'CornerUpRight',
  'CornerLeftDown',
  'CornerLeftUp',
  'CornerRightDown',
  'CornerRightUp',
] as const;

/**
 * Check if an icon should be mirrored in RTL
 */
export function shouldMirrorIcon(iconName: string): boolean {
  return MIRROR_ICONS.includes(iconName as any);
}

/**
 * Get CSS class for RTL-aware icon
 */
export function getIconRTLClass(iconName: string): string {
  return shouldMirrorIcon(iconName) ? 'rtl-mirror' : '';
}

/**
 * Format number for RTL (Arabic numerals vs Western numerals)
 * @param num - Number to format
 * @param useArabicNumerals - Whether to use Arabic-Indic numerals (٠-٩)
 */
export function formatNumber(num: number, useArabicNumerals: boolean = false): string {
  if (!useArabicNumerals || !isRTL()) {
    return num.toLocaleString('en-US');
  }
  
  // Convert to Arabic-Indic numerals
  return num.toLocaleString('ar-SA');
}

/**
 * Get text direction attribute
 */
export function getTextDirection(): 'ltr' | 'rtl' {
  return isRTL() ? 'rtl' : 'ltr';
}

/**
 * Get language-specific font class
 */
export function getFontClass(language: 'en' | 'ar'): string {
  return language === 'ar' ? 'font-arabic' : 'font-sans';
}
