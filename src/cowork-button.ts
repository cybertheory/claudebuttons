import type { CoworkButtonOptions, Theme, Size, Variant, Shape } from './types';
import { COWORK_ICON } from './icons';
import { resolveTheme, themeToCSS, SIZE_MAP, SHAPE_MAP, BRAND_COLOR, BRAND_COLOR_HOVER, BRAND_COLOR_ACTIVE } from './themes';
import { showPopup } from './popup-dialog';

const BUTTON_STYLES = `
  :host {
    display: inline-block;
    vertical-align: middle;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cb-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--cb-gap);
    height: var(--cb-height);
    min-height: 44px;
    padding: var(--cb-padding);
    border: 1.5px solid var(--cb-border);
    background: var(--cb-bg);
    color: var(--cb-text);
    font-family: inherit;
    font-size: var(--cb-font-size);
    font-weight: 600;
    line-height: 1;
    border-radius: var(--cb-radius);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    touch-action: manipulation;
    transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease, color 0.15s ease;
    text-decoration: none;
    -webkit-font-smoothing: antialiased;
  }

  @media (pointer: fine) {
    .cb-btn { min-height: unset; }
  }

  /* ─── FILLED ─── */

  :host([data-variant="filled"][data-theme="branded"]) .cb-btn,
  :host([data-variant="filled"][data-theme="branded-alt"]) .cb-btn {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  :host([data-variant="filled"][data-theme="branded"]) .cb-btn:hover {
    background: ${BRAND_COLOR_HOVER};
    box-shadow: 0 2px 8px rgba(212, 121, 92, 0.35);
  }
  :host([data-variant="filled"][data-theme="branded"]) .cb-btn:active {
    background: ${BRAND_COLOR_ACTIVE};
    transform: scale(0.98);
  }
  :host([data-variant="filled"][data-theme="branded-alt"]) .cb-btn:hover {
    background: #5A4BD6;
    box-shadow: 0 2px 8px rgba(107, 92, 231, 0.35);
  }
  :host([data-variant="filled"][data-theme="branded-alt"]) .cb-btn:active {
    background: #4F41C8;
    transform: scale(0.98);
  }

  :host([data-variant="filled"][data-theme="dark"]) .cb-btn {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  :host([data-variant="filled"][data-theme="dark"]) .cb-btn:hover {
    background: #292524;
    border-color: #57534E;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  :host([data-variant="filled"][data-theme="dark"]) .cb-btn:active {
    background: #1C1917;
    transform: scale(0.98);
  }

  :host([data-variant="filled"][data-theme="light"]) .cb-btn {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }
  :host([data-variant="filled"][data-theme="light"]) .cb-btn:hover {
    border-color: #D6D3D1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  :host([data-variant="filled"][data-theme="light"]) .cb-btn:active {
    background: #FAFAF9;
    transform: scale(0.98);
  }

  /* ─── OUTLINE ─── */

  :host([data-variant="outline"][data-theme="branded"]) .cb-btn {
    background: transparent;
    border-color: ${BRAND_COLOR};
    color: ${BRAND_COLOR};
  }
  :host([data-variant="outline"][data-theme="branded"]) .cb-btn:hover {
    background: rgba(212, 121, 92, 0.08);
    box-shadow: 0 2px 8px rgba(212, 121, 92, 0.15);
  }
  :host([data-variant="outline"][data-theme="branded"]) .cb-btn:active {
    background: rgba(212, 121, 92, 0.14);
    transform: scale(0.98);
  }

  :host([data-variant="outline"][data-theme="branded-alt"]) .cb-btn {
    background: transparent;
    border-color: #6B5CE7;
    color: #6B5CE7;
  }
  :host([data-variant="outline"][data-theme="branded-alt"]) .cb-btn:hover {
    background: rgba(107, 92, 231, 0.08);
    box-shadow: 0 2px 8px rgba(107, 92, 231, 0.15);
  }
  :host([data-variant="outline"][data-theme="branded-alt"]) .cb-btn:active {
    background: rgba(107, 92, 231, 0.14);
    transform: scale(0.98);
  }

  :host([data-variant="outline"][data-theme="dark"]) .cb-btn {
    background: transparent;
    border-color: #57534E;
    color: #F5F0EB;
  }
  :host([data-variant="outline"][data-theme="dark"]) .cb-btn:hover {
    border-color: ${BRAND_COLOR};
    background: rgba(212, 121, 92, 0.08);
  }
  :host([data-variant="outline"][data-theme="dark"]) .cb-btn:active {
    background: rgba(212, 121, 92, 0.14);
    transform: scale(0.98);
  }

  :host([data-variant="outline"][data-theme="light"]) .cb-btn {
    background: transparent;
    border-color: #D6D3D1;
    color: #1C1917;
  }
  :host([data-variant="outline"][data-theme="light"]) .cb-btn:hover {
    border-color: ${BRAND_COLOR};
    background: rgba(212, 121, 92, 0.05);
  }
  :host([data-variant="outline"][data-theme="light"]) .cb-btn:active {
    background: rgba(212, 121, 92, 0.1);
    transform: scale(0.98);
  }

  /* ─── GHOST ─── */

  :host([data-variant="ghost"]) .cb-btn {
    background: transparent;
    border-color: transparent;
  }

  :host([data-variant="ghost"][data-theme="branded"]) .cb-btn {
    color: ${BRAND_COLOR};
  }
  :host([data-variant="ghost"][data-theme="branded"]) .cb-btn:hover {
    background: rgba(212, 121, 92, 0.1);
  }
  :host([data-variant="ghost"][data-theme="branded"]) .cb-btn:active {
    background: rgba(212, 121, 92, 0.16);
    transform: scale(0.98);
  }

  :host([data-variant="ghost"][data-theme="branded-alt"]) .cb-btn {
    color: #6B5CE7;
  }
  :host([data-variant="ghost"][data-theme="branded-alt"]) .cb-btn:hover {
    background: rgba(107, 92, 231, 0.1);
  }
  :host([data-variant="ghost"][data-theme="branded-alt"]) .cb-btn:active {
    background: rgba(107, 92, 231, 0.16);
    transform: scale(0.98);
  }

  :host([data-variant="ghost"][data-theme="dark"]) .cb-btn {
    color: #F5F0EB;
  }
  :host([data-variant="ghost"][data-theme="dark"]) .cb-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  :host([data-variant="ghost"][data-theme="dark"]) .cb-btn:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.98);
  }

  :host([data-variant="ghost"][data-theme="light"]) .cb-btn {
    color: #1C1917;
  }
  :host([data-variant="ghost"][data-theme="light"]) .cb-btn:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  :host([data-variant="ghost"][data-theme="light"]) .cb-btn:active {
    background: rgba(0, 0, 0, 0.08);
    transform: scale(0.98);
  }

  /* ─── FOCUS ─── */

  .cb-btn:focus-visible {
    outline: 2px solid var(--cb-focus-color, ${BRAND_COLOR});
    outline-offset: 2px;
  }

  /* ─── ICON ─── */

  .cb-btn-icon {
    width: var(--cb-icon-size);
    height: var(--cb-icon-size);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cb-btn-icon svg { width: 100%; height: 100%; }

  :host([data-variant="filled"][data-theme="branded"]) .cb-btn-icon,
  :host([data-variant="filled"][data-theme="branded-alt"]) .cb-btn-icon {
    color: #FFFFFF;
    --cb-icon-accent: rgba(255,255,255,0.2);
  }
  :host([data-variant="filled"][data-theme="dark"]) .cb-btn-icon {
    color: var(--cb-accent-color, ${BRAND_COLOR});
    --cb-icon-accent: #1C1917;
  }
  :host([data-variant="filled"][data-theme="light"]) .cb-btn-icon {
    color: var(--cb-accent-color, ${BRAND_COLOR});
    --cb-icon-accent: #FFFFFF;
  }

  :host([data-variant="outline"]) .cb-btn-icon,
  :host([data-variant="ghost"]) .cb-btn-icon {
    color: var(--cb-accent-color, ${BRAND_COLOR});
  }

  /* ─── LABEL ─── */

  .cb-btn-label {
    letter-spacing: -0.01em;
  }
`;

export class CoworkButton extends HTMLElement {
  static observedAttributes = ['command', 'skill-url', 'theme', 'size', 'variant', 'shape', 'popup', 'popup-title', 'popup-description', 'auto-launch'];

  private _options: CoworkButtonOptions = {
    command: '',
    theme: 'branded',
    size: 'md',
    variant: 'filled',
    popup: true,
  };

  private _mqCleanup: (() => void) | null = null;
  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.syncFromAttributes();
    this.render();
    this.updateLightDOM();
  }

  disconnectedCallback() {
    this._mqCleanup?.();
    this._mqCleanup = null;
  }

  attributeChangedCallback() {
    if (!this._rendered) return;
    this.syncFromAttributes();
    this.render();
    this.updateLightDOM();
  }

  set options(opts: Partial<CoworkButtonOptions>) {
    this._options = { ...this._options, ...opts };
    this.render();
    this.updateLightDOM();
  }

  get options() {
    return this._options;
  }

  private syncFromAttributes() {
    const command = this.getAttribute('command');
    const skillUrl = this.getAttribute('skill-url');
    const theme = this.getAttribute('theme') as Theme | null;
    const size = this.getAttribute('size') as Size | null;
    const variant = this.getAttribute('variant') as Variant | null;
    const shape = this.getAttribute('shape') as Shape | null;
    const popup = this.getAttribute('popup');
    const popupTitle = this.getAttribute('popup-title');
    const popupDescription = this.getAttribute('popup-description');
    const autoLaunch = this.getAttribute('auto-launch');

    if (command !== null) this._options.command = command;
    if (skillUrl !== null) this._options.skillUrl = skillUrl;
    if (theme) this._options.theme = theme;
    if (size) this._options.size = size;
    if (variant) this._options.variant = variant;
    if (shape) this._options.shape = shape;
    if (popup !== null) this._options.popup = popup !== 'false';
    if (popupTitle !== null) this._options.popupTitle = popupTitle;
    if (popupDescription !== null) this._options.popupDescription = popupDescription;
    if (autoLaunch === null) {
      delete this._options.autoLaunch;
    } else {
      this._options.autoLaunch = autoLaunch !== 'false';
    }
  }

  private updateLightDOM() {
    const { command, skillUrl } = this._options;

    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-label', `Run on Cowork: ${command}`);
    if (this._options.popup !== false) {
      this.setAttribute('aria-haspopup', 'dialog');
    } else {
      this.removeAttribute('aria-haspopup');
    }

    let link = this.querySelector('a[data-cb-crawl]') as HTMLAnchorElement | null;
    if (!link) {
      link = document.createElement('a');
      link.setAttribute('data-cb-crawl', '');
      link.setAttribute('aria-hidden', 'true');
      link.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
      this.appendChild(link);
    }
    link.textContent = `Run on Cowork: ${command}`;
    link.setAttribute('data-platform', 'cowork');
    link.setAttribute('data-command', command);
    if (skillUrl) {
      link.href = skillUrl;
      link.setAttribute('data-skill-url', skillUrl);
    } else {
      link.href = `https://claude.ai/cowork?command=${encodeURIComponent(command)}`;
      link.removeAttribute('data-skill-url');
    }
  }

  private getResolvedTheme(): Theme {
    return this._options.theme || 'branded';
  }

  private render() {
    if (!this.shadowRoot) return;

    const theme = this.getResolvedTheme();
    const resolvedTheme = theme === 'system' ? (
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    ) : theme;
    const variant = this._options.variant || 'filled';

    const tokens = resolveTheme(theme);
    const size = this._options.size || 'md';
    const shape = this._options.shape || 'rounded';
    const sizeTokens = SIZE_MAP[size];
    const radius = SHAPE_MAP[shape][size];

    this.setAttribute('data-theme', resolvedTheme);
    this.setAttribute('data-variant', variant);

    const bgOverride = variant !== 'filled' ? 'transparent' : tokens.bg;
    const borderOverride = variant === 'ghost' ? 'transparent' :
      variant === 'outline' ? tokens.primary : tokens.border;
    const textOverride = variant !== 'filled' ? tokens.primary : tokens.text;

    this.shadowRoot.innerHTML = `
      <style>${BUTTON_STYLES}</style>
      <button
        class="cb-btn"
        type="button"
        style="
          ${themeToCSS(tokens)}
          --cb-bg: ${bgOverride};
          --cb-border: ${borderOverride};
          --cb-text: ${textOverride};
          --cb-accent-color: ${tokens.primary};
          --cb-focus-color: ${tokens.primary};
          --cb-height: ${sizeTokens.height};
          --cb-font-size: ${sizeTokens.fontSize};
          --cb-icon-size: ${sizeTokens.iconSize};
          --cb-padding: ${sizeTokens.padding};
          --cb-gap: ${sizeTokens.gap};
          --cb-radius: ${radius};
        "
        aria-label="Run on Cowork: ${this._options.command.replace(/"/g, '&quot;')}"
      >
        <span class="cb-btn-icon" aria-hidden="true">${COWORK_ICON}</span>
        <span class="cb-btn-label">Run on Cowork</span>
      </button>
    `;

    const btn = this.shadowRoot.querySelector('.cb-btn')!;
    btn.addEventListener('click', () => this.handleClick());
    btn.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    });
    this._rendered = true;
    this.setupSystemThemeWatch();
  }

  private handleClick() {
    const { popup, command, skillUrl, popupTitle, popupDescription, autoLaunch } = this._options;

    this.dispatchEvent(new CustomEvent('cb-open', {
      bubbles: true,
      composed: true,
      detail: { command },
    }));

    if (popup === false) {
      navigator.clipboard.writeText(command).then(() => {
        this._options.onCopy?.(command);
        this.dispatchEvent(new CustomEvent('cb-copy', {
          bubbles: true,
          composed: true,
          detail: { command },
        }));
      });
      return;
    }

    showPopup({
      variant: 'cowork',
      theme: this.getResolvedTheme(),
      title: popupTitle || 'Run on Cowork',
      description: popupDescription || 'Copy and paste into a Cowork session to get started.',
      command,
      skillUrl,
      autoLaunch: autoLaunch === true,
      onCopy: (cmd) => {
        this._options.onCopy?.(cmd);
        this.dispatchEvent(new CustomEvent('cb-copy', {
          bubbles: true,
          composed: true,
          detail: { command: cmd },
        }));
      },
      onClose: () => {
        this.dispatchEvent(new CustomEvent('cb-close', {
          bubbles: true,
          composed: true,
        }));
      },
    });
  }

  private setupSystemThemeWatch() {
    this._mqCleanup?.();
    this._mqCleanup = null;

    if (this.getResolvedTheme() !== 'system' || typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => this.render();
    mq.addEventListener('change', handler);
    this._mqCleanup = () => mq.removeEventListener('change', handler);
  }
}

export function registerCoworkButton(tagName = 'cowork-button') {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, CoworkButton);
  }
}

registerCoworkButton();

export function createCoworkButton(options: CoworkButtonOptions): CoworkButton {
  const el = document.createElement('cowork-button') as CoworkButton;
  el.options = options;
  return el;
}
