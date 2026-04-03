export type Theme = 'branded' | 'branded-alt' | 'dark' | 'light' | 'system';
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'filled' | 'outline' | 'ghost';
export type Shape = 'rounded' | 'pill' | 'square';

export interface ClaudeCodeButtonOptions {
  /** The command or skill to run in Claude Code (e.g. "/my-skill --flag") */
  command: string;
  /** Theme variant. Default: 'branded' */
  theme?: Theme;
  /** Button size. Default: 'md' */
  size?: Size;
  /** Visual variant. Default: 'filled' */
  variant?: Variant;
  /** Border radius shape. Default: 'rounded' */
  shape?: Shape;
  /** Whether to show a popup dialog on click. Default: true */
  popup?: boolean;
  /** Custom prompt flag value (prepended as `claude -p`). Default: true */
  promptFlag?: boolean;
  /** Callback fired after the command is copied to clipboard */
  onCopy?: (command: string) => void;
  /** Custom popup title */
  popupTitle?: string;
  /** Custom popup description */
  popupDescription?: string;
  /**
   * When true (with popup), opening the dialog also triggers the launch shortcut once
   * in the same user gesture (Open Terminal / Open Claude Desktop) if supported.
   * Launch controls stay visible for manual retry.
   */
  autoLaunch?: boolean;
}

export interface CoworkButtonOptions {
  /** The slash command to run in Cowork (e.g. "/my-skill") */
  command: string;
  /** URL to a downloadable skill package (.zip, SKILL.md, or plugin.json) */
  skillUrl?: string;
  /** Theme variant. Default: 'branded' */
  theme?: Theme;
  /** Button size. Default: 'md' */
  size?: Size;
  /** Visual variant. Default: 'filled' */
  variant?: Variant;
  /** Border radius shape. Default: 'rounded' */
  shape?: Shape;
  /** Whether to show a popup dialog on click. Default: true */
  popup?: boolean;
  /** Callback fired after the command is copied */
  onCopy?: (command: string) => void;
  /** Callback fired when the skill package is downloaded */
  onDownload?: (url: string) => void;
  /** Custom popup title */
  popupTitle?: string;
  /** Custom popup description */
  popupDescription?: string;
  /**
   * When true (with popup), opening the dialog also triggers the launch shortcut once
   * in the same user gesture (Open Claude Desktop) if supported.
   */
  autoLaunch?: boolean;
}

export interface PopupOptions {
  variant: 'claude-code' | 'cowork';
  theme: Theme;
  title: string;
  description?: string;
  command: string;
  fullCommand?: string;
  skillUrl?: string;
  /** Custom URL to open Claude Desktop from the Cowork popup. Default: `claude://` */
  desktopLaunchUrl?: string;
  /**
   * When true, after the dialog opens, immediately triggers the same action as the
   * launch button once (if that environment supports it). Buttons remain for manual use.
   */
  autoLaunch?: boolean;
  onCopy?: (command: string) => void;
  onClose?: () => void;
}

export interface ThemeTokens {
  bg: string;
  text: string;
  border: string;
  surface: string;
  surfaceText: string;
  muted: string;
  primary: string;
  primaryText: string;
  codeBg: string;
  codeText: string;
}
