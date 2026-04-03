import type { Theme, Size, Variant, Shape } from './types';

interface ClaudeCodeButtonAttributes {
  command?: string;
  theme?: Theme;
  size?: Size;
  variant?: Variant;
  shape?: Shape;
  popup?: string | boolean;
  'prompt-flag'?: string | boolean;
  'popup-title'?: string;
  'popup-description'?: string;
  'auto-launch'?: string | boolean;
  class?: string;
  style?: string | Record<string, string>;
}

interface CoworkButtonAttributes {
  command?: string;
  'skill-url'?: string;
  theme?: Theme;
  size?: Size;
  variant?: Variant;
  shape?: Shape;
  popup?: string | boolean;
  'popup-title'?: string;
  'popup-description'?: string;
  'auto-launch'?: string | boolean;
  class?: string;
  style?: string | Record<string, string>;
}

interface ClaudeButtonEvents {
  'cb-copy'?: (e: CustomEvent<{ command: string }>) => void;
  'cb-download'?: (e: CustomEvent<{ url: string }>) => void;
  'cb-open'?: (e: CustomEvent<{ command: string }>) => void;
  'cb-close'?: (e: CustomEvent) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'claude-code-button': ClaudeCodeButtonAttributes &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'cowork-button': CoworkButtonAttributes &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'claude-popup-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }

  interface HTMLElementTagNameMap {
    'claude-code-button': HTMLElement;
    'cowork-button': HTMLElement;
    'claude-popup-dialog': HTMLElement;
  }
}

declare module 'vue' {
  interface GlobalComponents {
    'claude-code-button': ClaudeCodeButtonAttributes;
    'cowork-button': CoworkButtonAttributes;
  }
}

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'claude-code-button': ClaudeCodeButtonAttributes;
      'cowork-button': CoworkButtonAttributes;
    }
  }
}

declare module 'svelte/elements' {
  interface SvelteHTMLElements {
    'claude-code-button': ClaudeCodeButtonAttributes & { [key: `on:${string}`]: (e: CustomEvent) => void };
    'cowork-button': CoworkButtonAttributes & { [key: `on:${string}`]: (e: CustomEvent) => void };
  }
}

export {};
