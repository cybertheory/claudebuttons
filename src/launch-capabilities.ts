/**
 * Heuristics for whether launch shortcuts are likely to work in the current
 * browser/OS. Custom schemes and clipboard APIs are unreliable in embedded
 * WebViews and on mobile for the terminal flow.
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

  // Opera Mini / extreme proxies — clipboard and schemes are unreliable
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
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return true; // tablet-style Android UA
  if ((platform === 'MacIntel' || platform === 'MacARM') && maxTouch > 1) return true; // iPadOS

  if (/webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;

  return false;
}

/** Laptop / desktop class OS (excludes phones & tablets). */
export function isDesktopComputerOs(): boolean {
  if (isMobileOrTabletDevice()) return false;
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const p = navigator.platform || '';

  if (/Win|Mac|Linux|X11|CrOS|FreeBSD|OpenBSD/i.test(p)) return true;
  if (/Windows NT|Macintosh|Linux|X11|CrOS|FreeBSD|OpenBSD/i.test(ua)) return true;

  return false;
}

/** Clipboard write likely to succeed from a user gesture (secure context API or legacy copy). */
export function canUseClipboardWithGesture(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return true;
  }

  try {
    if (typeof document !== 'undefined' && typeof document.queryCommandSupported === 'function') {
      return document.queryCommandSupported('copy') === true;
    }
  } catch {
    /* ignore */
  }

  return false;
}

/** Baseline APIs needed to show the dialog and attach an iframe for protocols. */
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

/**
 * Terminal shortcut: desktop OS + clipboard + non-embedded browser.
 * (iTerm / VS Code handoff is desktop-only.)
 */
export function isTerminalLaunchSupported(): boolean {
  if (!hasLaunchBaselineApis()) return false;
  if (isRestrictedEmbeddedBrowser()) return false;
  if (!isDesktopComputerOs()) return false;
  if (!canUseClipboardWithGesture()) return false;
  return true;
}
