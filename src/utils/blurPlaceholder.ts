/**
 * Blur Placeholder Utilities
 * 
 * Generate Low Quality Image Placeholders (LQIP) for better perceived performance
 */

/**
 * Generate a simple blur data URL with a solid color
 */
export function generateSimpleBlurDataURL(color: string = '#e5e7eb'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect width="40" height="40" fill="${color}"/>
    </svg>
  `;
  
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a gradient blur data URL
 */
export function generateGradientBlurDataURL(
  color1: string = '#e5e7eb',
  color2: string = '#d1d5db'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" fill="url(#grad)"/>
    </svg>
  `;
  
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a shimmer effect blur data URL
 */
export function generateShimmerBlurDataURL(baseColor: string = '#e5e7eb'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${baseColor};stop-opacity:1">
            <animate attributeName="offset" values="-2; 1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.5">
            <animate attributeName="offset" values="-1; 2" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style="stop-color:${baseColor};stop-opacity:1">
            <animate attributeName="offset" values="0; 3" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#shimmer)"/>
    </svg>
  `;
  
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a canvas-based blur data URL
 */
export function generateCanvasBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e7eb'
): string {
  if (typeof window === 'undefined') {
    return generateSimpleBlurDataURL(color);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return generateSimpleBlurDataURL(color);
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  try {
    return canvas.toDataURL('image/jpeg', 0.1);
  } catch {
    return generateSimpleBlurDataURL(color);
  }
}

/**
 * Extract average color from image URL (requires CORS)
 */
export async function extractAverageColor(imageUrl: string): Promise<string> {
  if (typeof window === 'undefined') {
    return '#e5e7eb';
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve('#e5e7eb');
          return;
        }
        
        // Use small canvas for performance
        canvas.width = 1;
        canvas.height = 1;
        
        ctx.drawImage(img, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        
        const hex = `#${[pixel[0], pixel[1], pixel[2]]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')}`;
        
        resolve(hex);
      } catch {
        resolve('#e5e7eb');
      }
    };
    
    img.onerror = () => resolve('#e5e7eb');
    img.src = imageUrl;
  });
}

/**
 * Generate blur data URL from image (requires CORS)
 */
export async function generateBlurDataURLFromImage(
  imageUrl: string,
  quality: number = 0.1
): Promise<string> {
  if (typeof window === 'undefined') {
    return generateSimpleBlurDataURL();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(generateSimpleBlurDataURL());
          return;
        }
        
        // Create small version for blur effect
        const scale = 0.1;
        canvas.width = Math.max(1, Math.floor(img.width * scale));
        canvas.height = Math.max(1, Math.floor(img.height * scale));
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch {
        resolve(generateSimpleBlurDataURL());
      }
    };
    
    img.onerror = () => resolve(generateSimpleBlurDataURL());
    img.src = imageUrl;
  });
}

/**
 * Predefined blur placeholders for common use cases
 */
export const blurPlaceholders = {
  gray: generateSimpleBlurDataURL('#e5e7eb'),
  lightGray: generateSimpleBlurDataURL('#f3f4f6'),
  darkGray: generateSimpleBlurDataURL('#9ca3af'),
  primary: generateSimpleBlurDataURL('#3b82f6'),
  gradient: generateGradientBlurDataURL('#e5e7eb', '#d1d5db'),
  shimmer: generateShimmerBlurDataURL('#e5e7eb'),
};

/**
 * Get blur placeholder based on image category
 */
export function getBlurPlaceholderForCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    food: generateSimpleBlurDataURL('#fef3c7'),
    restaurant: generateSimpleBlurDataURL('#dbeafe'),
    user: generateSimpleBlurDataURL('#e0e7ff'),
    product: generateSimpleBlurDataURL('#fce7f3'),
    default: generateSimpleBlurDataURL('#e5e7eb'),
  };
  
  return categoryMap[category.toLowerCase()] || categoryMap.default;
}
