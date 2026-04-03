/**
 * Heuristics for whether launch shortcuts are likely to work in the current
 * browser/OS. Custom schemes are unreliable in embedded WebViews.
 */

/** In-app / embedded browsers where custom URL schemes often fail or are blocked. */
export function isRestrictedEmbeddedBrowser(): boolean {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent || '';
  if (!ua.trim()) return true;

  if (
    /\bFBAN\b|\bFBAV\b|FB_IAB|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|LinkedInApp|Pinterest/i.test(ua)
  ) {
    return true;
  }

  if (/Twitter for (iPhone|Android)/i.test(ua)) return true;

  // Android WebView (not standalone Chrome)
  if (/; wv\)/.test(ua)) return true;

  // Opera Mini / extreme proxies
  if (/Opera Mini|OPiOS/i.test(ua)) return true;

  return false;
}

/** Phones and tablets (including iPad with desktop UA). */
export function isMobileOrTabletDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const maxTouch = typeof navigator.maxTouchPoints === 'number' ? navigator.maxTouchPoints : 0;
  const platform = navigator.platform || '';

  if (/iPhone|iPod/i.test(ua)) return true;
  if (/iPad/i.test(ua)) return true;
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return true;
  if ((platform === 'MacIntel' || platform === 'MacARM') && maxTouch > 1) return true;

  if (/webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;

  return false;
}

/** Baseline APIs needed to show the dialog and trigger app links. */
export function hasLaunchBaselineApis(): boolean {
  return typeof window !== 'undefined'
    && typeof document !== 'undefined'
    && typeof document.createElement === 'function';
}

/**
 * "Open Claude Desktop" via claude:// — works in most standalone desktop & mobile browsers,
 * not in typical in-app WebViews.
 */
export function isDesktopAppLinkSupported(): boolean {
  if (!hasLaunchBaselineApis()) return false;
  if (isRestrictedEmbeddedBrowser()) return false;
  return true;
}
