/**
 * Device Detection Utilities
 * Detects device capabilities for AR/3D rendering support
 */

export interface WebGLCapabilities {
  maxTextureSize: number;
  maxVertexAttributes: number;
  maxFragmentUniforms: number;
  renderer: string;
  vendor: string;
}

export interface DeviceSupport {
  webgl: boolean;
  webgl2: boolean;
  canRender3D: boolean;
  capabilities?: WebGLCapabilities;
  reason?: string;
}

/**
 * Check if WebGL is supported by the browser
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Check if WebGL2 is supported by the browser
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Get detailed WebGL capabilities
 * Returns information about the WebGL context capabilities
 */
export function getWebGLCapabilities(): WebGLCapabilities | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return null;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      renderer: debugInfo 
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
        : 'Unknown',
      vendor: debugInfo 
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
        : 'Unknown',
    };
  } catch (e) {
    return null;
  }
}

/**
 * Comprehensive device capability detection
 * Returns detailed information about 3D rendering support
 */
export function detectDeviceSupport(): DeviceSupport {
  const webgl = isWebGLSupported();
  const webgl2 = isWebGL2Supported();

  // Device can render 3D if it has at least WebGL support
  const canRender3D = webgl;

  let reason: string | undefined;
  let capabilities: WebGLCapabilities | undefined;

  if (!webgl) {
    reason = 'WebGL is not supported on this device';
  } else {
    // Get detailed capabilities if WebGL is supported
    const caps = getWebGLCapabilities();
    if (caps) {
      capabilities = caps;
      
      // Check if capabilities meet minimum requirements for 3D rendering
      const minTextureSize = 1024;
      if (caps.maxTextureSize < minTextureSize) {
        reason = `Device texture size (${caps.maxTextureSize}) is below minimum requirement (${minTextureSize})`;
      }
    }
  }

  return {
    webgl,
    webgl2,
    canRender3D,
    capabilities,
    reason,
  };
}

/**
 * Check if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if the device is iOS
 */
export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if the device is Android
 */
export function isAndroidDevice(): boolean {
  return /Android/.test(navigator.userAgent);
}

/**
 * Get a user-friendly message about device support
 */
export function getDeviceSupportMessage(support: DeviceSupport): string {
  if (support.canRender3D) {
    return '3D rendering is supported on your device';
  }

  if (support.reason) {
    return support.reason;
  }

  return 'Your device does not support 3D rendering';
}
