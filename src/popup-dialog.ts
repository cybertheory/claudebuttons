import type { PopupOptions, ThemeTokens } from './types';
import {
  CLAUDE_CODE_ICON,
  COWORK_ICON,
  COPY_ICON,
  CHECK_ICON,
  CLOSE_ICON,
  DESKTOP_APP_ICON,
} from './icons';
import { resolveTheme, themeToCSS, BRAND_COLOR, BRAND_COLOR_HOVER } from './themes';
import { isDesktopAppLinkSupported } from './launch-capabilities';

const POPUP_STYLES = `
  :host {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cb-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: cb-fade-in 0.15s ease-out;
  }

  .cb-dialog {
    position: relative;
    width: 90%;
    max-width: 460px;
    background: var(--cb-surface);
    color: var(--cb-surface-text);
    border-radius: 16px;
    box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--cb-border);
    overflow: hidden;
    animation: cb-scale-in 0.2s ease-out;
  }

  .cb-dialog-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--cb-border);
  }

  .cb-dialog-header-icon {
    width: 36px;
    height: 36px;
    color: var(--cb-primary);
    flex-shrink: 0;
  }

  .cb-dialog-header-text {
    flex: 1;
    min-width: 0;
  }

  .cb-dialog-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--cb-surface-text);
  }

  .cb-dialog-description {
    font-size: 13px;
    color: var(--cb-muted);
    margin-top: 2px;
    line-height: 1.4;
  }

  .cb-dialog-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--cb-muted);
    cursor: pointer;
    border-radius: 8px;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }

  .cb-dialog-close:hover {
    background: var(--cb-border);
    color: var(--cb-surface-text);
  }

  .cb-dialog-close svg { width: 14px; height: 14px; }

  .cb-dialog-body { padding: 20px 24px; }

  .cb-step {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .cb-step:last-child { margin-bottom: 0; }

  .cb-step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--cb-primary);
    color: var(--cb-primary-text);
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cb-step-content {
    flex: 1;
    min-width: 0;
  }

  .cb-step-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--cb-surface-text);
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .cb-code-block {
    display: flex;
    align-items: center;
    background: var(--cb-code-bg);
    color: var(--cb-code-text);
    border-radius: 10px;
    padding: 2px 2px 2px 14px;
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 13px;
    line-height: 1.5;
    gap: 8px;
    overflow: hidden;
  }

  .cb-code-text {
    flex: 1;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px 0;
    scrollbar-width: none;
  }

  .cb-code-text::-webkit-scrollbar { display: none; }

  .cb-code-prefix {
    color: var(--cb-muted);
    user-select: none;
    margin-right: 6px;
  }

  .cb-copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    min-width: 36px;
    padding: 0 12px;
    border: none;
    background: var(--cb-primary);
    color: var(--cb-primary-text);
    cursor: pointer;
    border-radius: 8px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .cb-copy-btn:hover { background: ${BRAND_COLOR_HOVER}; }
  .cb-copy-btn:active { transform: scale(0.96); }
  .cb-copy-btn svg { width: 14px; height: 14px; }

  .cb-copy-btn[data-copied="true"] {
    background: #16a34a;
  }

  .cb-dialog-footer {
    padding: 16px 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cb-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 44px;
    border: none;
    background: var(--cb-primary);
    color: var(--cb-primary-text);
    cursor: pointer;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.15s, transform 0.1s;
  }

  .cb-action-btn:hover { background: ${BRAND_COLOR_HOVER}; }
  .cb-action-btn:active { transform: scale(0.98); }
  .cb-action-btn svg { width: 16px; height: 16px; }

  .cb-hint {
    font-size: 12px;
    color: var(--cb-muted);
    text-align: center;
    line-height: 1.4;
  }

  .cb-hint kbd {
    display: inline-block;
    padding: 1px 5px;
    font-family: inherit;
    font-size: 11px;
    background: var(--cb-border);
    border-radius: 4px;
    border: 1px solid var(--cb-border);
  }

  .cb-launch-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-height: 48px;
    padding: 12px 18px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-decoration: none;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.12s ease, background 0.2s ease, color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .cb-launch-btn:active:not(:disabled) { transform: scale(0.99); }

  .cb-launch-btn .cb-launch-svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .cb-launch-btn--desktop {
    color: var(--cb-surface-text);
    background: linear-gradient(
      165deg,
      color-mix(in srgb, var(--cb-primary) 14%, var(--cb-surface)) 0%,
      var(--cb-surface) 55%
    );
    border: 1.5px solid color-mix(in srgb, var(--cb-primary) 38%, var(--cb-border));
    box-shadow:
      0 1px 0 color-mix(in srgb, white 55%, transparent) inset,
      0 4px 14px -4px color-mix(in srgb, var(--cb-primary) 35%, transparent);
  }

  .cb-launch-btn--desktop:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--cb-primary) 72%, var(--cb-border));
    box-shadow:
      0 1px 0 color-mix(in srgb, white 45%, transparent) inset,
      0 8px 24px -6px color-mix(in srgb, var(--cb-primary) 45%, transparent);
  }

  .cb-launch-btn--desktop:focus-visible {
    outline: 2px solid var(--cb-primary);
    outline-offset: 2px;
  }

  .cb-launch-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: saturate(0.7);
    box-shadow: none;
  }

  .cb-launch-btn--desktop:disabled {
    background: var(--cb-border);
    border-color: var(--cb-border);
    color: var(--cb-muted);
  }

  .cb-launch-btn:disabled .cb-launch-svg {
    opacity: 0.75;
  }

  .cb-launch-sub {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 500;
    color: var(--cb-muted);
    line-height: 1.35;
    text-align: center;
  }

  @keyframes cb-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes cb-scale-in {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @media (max-width: 480px) {
    .cb-dialog {
      width: 96%;
      max-width: none;
      border-radius: 14px;
      max-height: 90dvh;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .cb-dialog-header { padding: 16px 16px 12px; gap: 10px; }
    .cb-dialog-header-icon { width: 28px; height: 28px; }
    .cb-dialog-body { padding: 16px; }
    .cb-dialog-footer { padding: 12px 16px 16px; }

    .cb-step { gap: 10px; margin-bottom: 14px; }
    .cb-step-num { width: 22px; height: 22px; font-size: 11px; }
    .cb-step-label { font-size: 12px; margin-bottom: 6px; }

    .cb-code-block { font-size: 12px; padding: 2px 2px 2px 10px; border-radius: 8px; }
    .cb-copy-btn { height: 32px; padding: 0 10px; font-size: 11px; border-radius: 6px; }
    .cb-action-btn { height: 40px; font-size: 13px; border-radius: 8px; }
    .cb-launch-btn { min-height: 46px; padding: 10px 14px; font-size: 13px; border-radius: 10px; }
    .cb-launch-btn .cb-launch-svg { width: 20px; height: 20px; }
    .cb-launch-sub { font-size: 10px; }
    .cb-hint { font-size: 11px; }
  }

  @media (max-width: 360px) {
    .cb-dialog { width: 100%; border-radius: 12px 12px 0 0; align-self: flex-end; }
    .cb-copy-btn span { display: none; }
    .cb-copy-btn { min-width: 32px; padding: 0 8px; }
  }

  @supports (padding: env(safe-area-inset-bottom)) {
    .cb-dialog-footer { padding-bottom: calc(20px + env(safe-area-inset-bottom)); }
  }
`;

export class ClaudePopupDialog extends HTMLElement {
  private _options!: PopupOptions;
  private _mqCleanup: (() => void) | null = null;
  /** Prevents auto-launch from firing on every theme re-render; reset when `options` is set. */
  private _autoLaunchConsumed = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set options(opts: PopupOptions) {
    this._autoLaunchConsumed = false;
    this._options = opts;
    this.render();
  }

  get options() {
    return this._options;
  }

  disconnectedCallback() {
    this._mqCleanup?.();
    this._mqCleanup = null;
  }

  private resolvePopupTokens(): ThemeTokens {
    const { theme } = this._options;

    if (theme === 'dark' || theme === 'light') return resolveTheme(theme);

    const prefersDark = typeof window !== 'undefined'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'system') {
      return prefersDark ? resolveTheme('dark') : resolveTheme('light');
    }

    const base = prefersDark ? resolveTheme('dark') : resolveTheme('light');
    const brand = resolveTheme(theme);
    return {
      ...base,
      primary: brand.primary,
      primaryText: brand.primaryText,
    };
  }

  private render() {
    if (!this.shadowRoot || !this._options) return;

    const { variant, title, description, command, fullCommand, desktopLaunchUrl, autoLaunch } = this._options;
    const tokens = this.resolvePopupTokens();
    const icon = variant === 'claude-code' ? CLAUDE_CODE_ICON : COWORK_ICON;

    const isClaudeCode = variant === 'claude-code';
    const displayCommand = fullCommand || command;
    const desktopHref = desktopLaunchUrl ?? 'claude://';
    const desktopLaunchOk = isDesktopAppLinkSupported();

    this.shadowRoot.innerHTML = `
      <style>${POPUP_STYLES}</style>
      <div style="${themeToCSS(tokens)}">
        <div class="cb-backdrop" data-action="close"></div>
        <div class="cb-dialog" role="dialog" aria-modal="true" aria-labelledby="cb-dialog-title">
          <div class="cb-dialog-header">
            <div class="cb-dialog-header-icon">${icon}</div>
            <div class="cb-dialog-header-text">
              <div class="cb-dialog-title" id="cb-dialog-title">${title}</div>
              ${description ? `<div class="cb-dialog-description">${description}</div>` : ''}
            </div>
            <button class="cb-dialog-close" data-action="close" aria-label="Close">${CLOSE_ICON}</button>
          </div>
          <div class="cb-dialog-body">
            ${isClaudeCode ? this.renderClaudeCodeBody(displayCommand) : this.renderCoworkBody(command)}
          </div>
          <div class="cb-dialog-footer">
            ${isClaudeCode
              ? this.renderClaudeCodeFooter()
              : this.renderCoworkFooter(this.escapeHref(desktopHref), desktopLaunchOk)}
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
    this.setupSystemThemeWatch();

    if (autoLaunch && !this._autoLaunchConsumed && variant === 'cowork' && desktopLaunchOk) {
      this._autoLaunchConsumed = true;
      this.openDesktopAppLink(desktopHref);
    }
  }

  /** Programmatic open (same as clicking the desktop launch control). */
  private openDesktopAppLink(href: string) {
    this.dispatchEvent(new CustomEvent('cb-launch-desktop', {
      bubbles: true,
      composed: true,
      detail: { href },
    }));
    if (typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = href;
    a.rel = 'noopener noreferrer';
    a.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => a.remove());
  }

  private renderClaudeCodeBody(command: string): string {
    return `
      <div class="cb-step">
        <div class="cb-step-num">1</div>
        <div class="cb-step-content">
          <div class="cb-step-label">Copy this command to your clipboard</div>
          <div class="cb-code-block">
            <div class="cb-code-text"><span class="cb-code-prefix">$</span>${this.escapeHtml(command)}</div>
            <button class="cb-copy-btn" data-action="copy" data-command="${this.escapeAttr(command)}">${COPY_ICON}<span>Copy</span></button>
          </div>
        </div>
      </div>
      <div class="cb-step">
        <div class="cb-step-num">2</div>
        <div class="cb-step-content">
          <div class="cb-step-label">Paste and run in your terminal</div>
        </div>
      </div>
    `;
  }

  private renderCoworkBody(command: string): string {
    return `
      <div class="cb-step">
        <div class="cb-step-num">1</div>
        <div class="cb-step-content">
          <div class="cb-step-label">Copy this command to your clipboard</div>
          <div class="cb-code-block">
            <div class="cb-code-text">${this.escapeHtml(command)}</div>
            <button class="cb-copy-btn" data-action="copy" data-command="${this.escapeAttr(command)}">${COPY_ICON}<span>Copy</span></button>
          </div>
        </div>
      </div>
      <div class="cb-step">
        <div class="cb-step-num">2</div>
        <div class="cb-step-content">
          <div class="cb-step-label">Paste and send in your Cowork session</div>
        </div>
      </div>
    `;
  }

  private renderCoworkFooter(desktopHrefEscaped: string, enabled: boolean): string {
    const disabledTitle = 'Open this page in Safari, Chrome, Firefox, or Edge. In-app browsers usually block opening apps.';
    const sub = enabled
      ? 'Opens the Claude app through your system link handler—then paste the prompt below into Cowork.'
      : 'App links aren’t supported in your current browser (common inside social or chat apps). Open this page in a full browser, or launch Claude Desktop manually and paste below.';

    const control = enabled
      ? `
      <a
        class="cb-launch-btn cb-launch-btn--desktop"
        href="${desktopHrefEscaped}"
        data-action="launch-desktop"
        rel="noopener noreferrer"
      >
        ${DESKTOP_APP_ICON}
        <span>Open Claude Desktop</span>
      </a>`
      : `
      <button
        type="button"
        class="cb-launch-btn cb-launch-btn--desktop"
        disabled
        aria-disabled="true"
        aria-label="Open Claude Desktop (unavailable in this browser)"
        title="${this.escapeAttr(disabledTitle)}"
      >
        ${DESKTOP_APP_ICON}
        <span>Open Claude Desktop</span>
      </button>`;

    return `
      ${control}
      <span class="cb-launch-sub">${this.escapeHtml(sub)}</span>
      <div class="cb-hint">Press <kbd>⌘</kbd>+<kbd>V</kbd> or <kbd>Ctrl</kbd>+<kbd>V</kbd> in your Cowork session to run</div>
    `;
  }

  private renderClaudeCodeFooter(): string {
    return `
      <div class="cb-hint">Press <kbd>⌘</kbd>+<kbd>V</kbd> or <kbd>Ctrl</kbd>+<kbd>V</kbd> in your terminal to run</div>
    `;
  }

  private escapeHref(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private setupListeners() {
    if (!this.shadowRoot) return;

    this.shadowRoot.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;

      const action = target.dataset.action;

      if (action === 'close') {
        this.close();
      } else if (action === 'copy') {
        const cmd = target.dataset.command || '';
        this.copyToClipboard(cmd, target);
      } else if (action === 'launch-desktop') {
        e.preventDefault();
        const raw = (target as HTMLAnchorElement).getAttribute('href') || '';
        this.openDesktopAppLink(raw || (target as HTMLAnchorElement).href);
      }
    });

    this.shadowRoot.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') this.close();
    });
  }

  private setupSystemThemeWatch() {
    this._mqCleanup?.();
    this._mqCleanup = null;

    const theme = this._options.theme;
    const needsWatch = theme === 'system' || theme === 'branded' || theme === 'branded-alt';
    if (!needsWatch || typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => this.render();
    mq.addEventListener('change', handler);
    this._mqCleanup = () => mq.removeEventListener('change', handler);
  }

  private async copyToClipboard(command: string, button: HTMLElement) {
    try {
      await navigator.clipboard.writeText(command);
      const label = button.querySelector('span');
      const iconContainer = button;
      const originalIcon = iconContainer.querySelector('.cb-icon-sm')?.outerHTML || '';

      button.setAttribute('data-copied', 'true');
      if (label) label.textContent = 'Copied!';
      iconContainer.innerHTML = `${CHECK_ICON}<span>Copied!</span>`;

      this._options.onCopy?.(command);

      setTimeout(() => {
        button.setAttribute('data-copied', 'false');
        iconContainer.innerHTML = `${COPY_ICON}<span>Copy</span>`;
      }, 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      this._options.onCopy?.(command);
    }
  }

  close() {
    const dialog = this.shadowRoot?.querySelector('.cb-dialog') as HTMLElement;
    const backdrop = this.shadowRoot?.querySelector('.cb-backdrop') as HTMLElement;

    if (dialog) {
      dialog.style.animation = 'cb-scale-in 0.15s ease-in reverse';
    }
    if (backdrop) {
      backdrop.style.animation = 'cb-fade-in 0.15s ease-in reverse';
    }

    setTimeout(() => {
      this._options.onClose?.();
      this.remove();
    }, 140);
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private escapeAttr(str: string): string {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('claude-popup-dialog')) {
  customElements.define('claude-popup-dialog', ClaudePopupDialog);
}

export function showPopup(options: PopupOptions): ClaudePopupDialog {
  const popup = document.createElement('claude-popup-dialog') as ClaudePopupDialog;
  popup.options = options;
  document.body.appendChild(popup);
  return popup;
}
