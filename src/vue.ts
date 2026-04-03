import { registerClaudeCodeButton } from './claude-code-button';
import { registerCoworkButton } from './cowork-button';

export type { ClaudeCodeButtonOptions, CoworkButtonOptions, Theme, Size } from './types';

/**
 * Vue plugin — registers both custom elements and configures
 * the Vue compiler to treat them as custom elements.
 *
 * Usage:
 *   import { ClaudeButtonsPlugin } from 'claudebuttons/vue'
 *   app.use(ClaudeButtonsPlugin)
 */
export const ClaudeButtonsPlugin = {
  install(app: any) {
    registerClaudeCodeButton();
    registerCoworkButton();

    if (app.config?.compilerOptions) {
      const original = app.config.compilerOptions.isCustomElement;
      app.config.compilerOptions.isCustomElement = (tag: string) => {
        if (tag === 'claude-code-button' || tag === 'cowork-button' || tag === 'claude-popup-dialog') {
          return true;
        }
        return original?.(tag) ?? false;
      };
    }
  },
};

export default ClaudeButtonsPlugin;
