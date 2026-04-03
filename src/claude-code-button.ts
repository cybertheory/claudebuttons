import type { ClaudeCodeButtonOptions, Theme, Size } from './types';
import { CLAUDE_CODE_ICON } from './icons';
import { resolveTheme, themeToCSS, SIZE_MAP, BRAND_COLOR, BRAND_COLOR_HOVER, BRAND_COLOR_ACTIVE } from './themes';
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
    border: 1px solid var(--cb-border);
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
    transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
    text-decoration: none;
    -webkit-font-smoothing: antialiased;
  }

  @media (pointer: fine) {
    .cb-btn { min-height: unset; }
  }

  :host([data-theme="branded"]) .cb-btn {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  :host([data-theme="branded"]) .cb-btn:hover {
    background: ${BRAND_COLOR_HOVER};
    box-shadow: 0 2px 8px rgba(212, 121, 92, 0.35);
  }

  :host([data-theme="branded"]) .cb-btn:active {
    background: ${BRAND_COLOR_ACTIVE};
    transform: scale(0.98);
  }

  :host([data-theme="dark"]) .cb-btn {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  :host([data-theme="dark"]) .cb-btn:hover {
    background: #292524;
    border-color: #57534E;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  :host([data-theme="dark"]) .cb-btn:active {
    background: #1C1917;
    transform: scale(0.98);
  }

  :host([data-theme="light"]) .cb-btn {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  :host([data-theme="light"]) .cb-btn:hover {
    border-color: #D6D3D1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  :host([data-theme="light"]) .cb-btn:active {
    background: #FAFAF9;
    transform: scale(0.98);
  }

  .cb-btn:focus-visible {
    outline: 2px solid ${BRAND_COLOR};
    outline-offset: 2px;
  }

  .cb-btn-icon {
    width: var(--cb-icon-size);
    height: var(--cb-icon-size);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cb-btn-icon svg {
    width: 100%;
    height: 100%;
  }

  :host([data-theme="branded"]) .cb-btn-icon {
    color: #FFFFFF;
    --cb-icon-accent: rgba(255,255,255,0.2);
  }

  :host([data-theme="dark"]) .cb-btn-icon {
    color: ${BRAND_COLOR};
  }

  :host([data-theme="light"]) .cb-btn-icon {
    color: ${BRAND_COLOR};
  }

  .cb-btn-label {
    letter-spacing: -0.01em;
  }
`;

export class ClaudeCodeButton extends HTMLElement {
  static observedAttributes = ['command', 'theme', 'size', 'popup', 'prompt-flag', 'popup-title', 'popup-description'];

  private _options: ClaudeCodeButtonOptions = {
    command: '',
    theme: 'branded',
    size: 'md',
    popup: true,
    promptFlag: true,
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
  }

  disconnectedCallback() {
    this._mqCleanup?.();
    this._mqCleanup = null;
  }

  attributeChangedCallback() {
    if (!this._rendered) return;
    this.syncFromAttributes();
    this.render();
  }

  set options(opts: Partial<ClaudeCodeButtonOptions>) {
    this._options = { ...this._options, ...opts };
    this.render();
  }

  get options() {
    return this._options;
  }

  private syncFromAttributes() {
    const command = this.getAttribute('command');
    const theme = this.getAttribute('theme') as Theme | null;
    const size = this.getAttribute('size') as Size | null;
    const popup = this.getAttribute('popup');
    const promptFlag = this.getAttribute('prompt-flag');
    const popupTitle = this.getAttribute('popup-title');
    const popupDescription = this.getAttribute('popup-description');

    if (command !== null) this._options.command = command;
    if (theme) this._options.theme = theme;
    if (size) this._options.size = size;
    if (popup !== null) this._options.popup = popup !== 'false';
    if (promptFlag !== null) this._options.promptFlag = promptFlag !== 'false';
    if (popupTitle !== null) this._options.popupTitle = popupTitle;
    if (popupDescription !== null) this._options.popupDescription = popupDescription;
  }

  private getResolvedTheme(): Theme {
    return this._options.theme || 'branded';
  }

  private getFullCommand(): string {
    const { command, promptFlag } = this._options;
    if (promptFlag === false) return command;
    return `claude -p "${command}"`;
  }

  private render() {
    if (!this.shadowRoot) return;

    const theme = this.getResolvedTheme();
    const resolvedTheme = theme === 'system' ? (
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    ) : theme;

    const tokens = resolveTheme(theme);
    const sizeTokens = SIZE_MAP[this._options.size || 'md'];

    this.setAttribute('data-theme', resolvedTheme);

    this.shadowRoot.innerHTML = `
      <style>${BUTTON_STYLES}</style>
      <button
        class="cb-btn"
        type="button"
        style="
          ${themeToCSS(tokens)}
          --cb-height: ${sizeTokens.height};
          --cb-font-size: ${sizeTokens.fontSize};
          --cb-icon-size: ${sizeTokens.iconSize};
          --cb-padding: ${sizeTokens.padding};
          --cb-gap: ${sizeTokens.gap};
          --cb-radius: ${sizeTokens.radius};
        "
        aria-label="Run on Claude Code"
      >
        <span class="cb-btn-icon">${CLAUDE_CODE_ICON}</span>
        <span class="cb-btn-label">Run on Claude Code</span>
      </button>
    `;

    this.shadowRoot.querySelector('.cb-btn')?.addEventListener('click', () => this.handleClick());
    this._rendered = true;
    this.setupSystemThemeWatch();
  }

  private handleClick() {
    const { popup, command, popupTitle, popupDescription } = this._options;
    const fullCommand = this.getFullCommand();

    this.dispatchEvent(new CustomEvent('cb-open', {
      bubbles: true,
      composed: true,
      detail: { command, fullCommand },
    }));

    if (popup === false) {
      navigator.clipboard.writeText(fullCommand).then(() => {
        this._options.onCopy?.(fullCommand);
        this.dispatchEvent(new CustomEvent('cb-copy', {
          bubbles: true,
          composed: true,
          detail: { command: fullCommand },
        }));
      });
      return;
    }

    showPopup({
      variant: 'claude-code',
      theme: this.getResolvedTheme(),
      title: popupTitle || 'Run on Claude Code',
      description: popupDescription || 'Execute this command in your terminal to get started.',
      command,
      fullCommand,
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

export function registerClaudeCodeButton(tagName = 'claude-code-button') {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ClaudeCodeButton);
  }
}

registerClaudeCodeButton();

export function createClaudeCodeButton(options: ClaudeCodeButtonOptions): ClaudeCodeButton {
  const el = document.createElement('claude-code-button') as ClaudeCodeButton;
  el.options = options;
  return el;
}
