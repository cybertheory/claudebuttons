export type { Theme, Size, Variant, Shape, ClaudeCodeButtonOptions, CoworkButtonOptions, PopupOptions, ThemeTokens } from './types';

export {
  isDesktopAppLinkSupported,
  isRestrictedEmbeddedBrowser,
  isMobileOrTabletDevice,
} from './launch-capabilities';

export { ClaudeCodeButton, createClaudeCodeButton, registerClaudeCodeButton } from './claude-code-button';
export { CoworkButton, createCoworkButton, registerCoworkButton } from './cowork-button';
export { ClaudePopupDialog, showPopup } from './popup-dialog';

export { CLAUDE_CODE_ICON, COWORK_ICON } from './icons';
export { themes, resolveTheme, BRAND_COLOR, ALT_BRAND_COLOR } from './themes';

export type { ButtonMetadata } from './structured-data';
export { discoverButtons, generateStructuredData, injectStructuredData } from './structured-data';

import { registerClaudeCodeButton } from './claude-code-button';
import { registerCoworkButton } from './cowork-button';

/**
 * Manually register all custom elements.
 * Called automatically on import, but exposed for frameworks
 * that need explicit registration timing (Angular, micro-frontends).
 */
export function register() {
  registerClaudeCodeButton();
  registerCoworkButton();
}

export type {} from './jsx.d';
