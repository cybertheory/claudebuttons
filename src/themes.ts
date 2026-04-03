import type { ThemeTokens, Theme } from './types';

export const BRAND_COLOR = '#D4795C';
export const BRAND_COLOR_HOVER = '#C06A4E';
export const BRAND_COLOR_ACTIVE = '#B35E43';

export const themes: Record<Exclude<Theme, 'system'>, ThemeTokens> = {
  branded: {
    bg: BRAND_COLOR,
    text: '#FFFFFF',
    border: 'transparent',
    surface: '#FFFFFF',
    surfaceText: '#1C1917',
    muted: '#78716C',
    primary: BRAND_COLOR,
    primaryText: '#FFFFFF',
    codeBg: '#1C1917',
    codeText: '#F5F0EB',
  },
  'branded-alt': {
    bg: '#6B5CE7',
    text: '#FFFFFF',
    border: 'transparent',
    surface: '#FFFFFF',
    surfaceText: '#1C1917',
    muted: '#78716C',
    primary: '#6B5CE7',
    primaryText: '#FFFFFF',
    codeBg: '#1C1917',
    codeText: '#F5F0EB',
  },
  dark: {
    bg: '#1C1917',
    text: '#F5F0EB',
    border: '#3D3530',
    surface: '#292524',
    surfaceText: '#F5F0EB',
    muted: '#A8A29E',
    primary: BRAND_COLOR,
    primaryText: '#FFFFFF',
    codeBg: '#0C0A09',
    codeText: '#F5F0EB',
  },
  light: {
    bg: '#FFFFFF',
    text: '#1C1917',
    border: '#E7E5E4',
    surface: '#FAFAF9',
    surfaceText: '#1C1917',
    muted: '#78716C',
    primary: BRAND_COLOR,
    primaryText: '#FFFFFF',
    codeBg: '#1C1917',
    codeText: '#F5F0EB',
  },
};

export function resolveTheme(theme: Theme): ThemeTokens {
  if (theme !== 'system') return themes[theme];
  if (typeof window === 'undefined') return themes.light;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? themes.dark
    : themes.light;
}

export function themeToCSS(tokens: ThemeTokens): string {
  return `
    --cb-bg: ${tokens.bg};
    --cb-text: ${tokens.text};
    --cb-border: ${tokens.border};
    --cb-surface: ${tokens.surface};
    --cb-surface-text: ${tokens.surfaceText};
    --cb-muted: ${tokens.muted};
    --cb-primary: ${tokens.primary};
    --cb-primary-text: ${tokens.primaryText};
    --cb-code-bg: ${tokens.codeBg};
    --cb-code-text: ${tokens.codeText};
  `;
}

export const ALT_BRAND_COLOR = '#6B5CE7';

export const SHAPE_MAP = {
  rounded: { sm: '0.375rem', md: '0.5rem', lg: '0.625rem' },
  pill:    { sm: '999px',    md: '999px',  lg: '999px' },
  square:  { sm: '0',        md: '0',      lg: '0' },
} as const;

export const SIZE_MAP = {
  sm: { height: '2rem', fontSize: '0.75rem', iconSize: '0.875rem', padding: '0 0.75rem', ccPadding: '0 0.5rem', gap: '0.375rem', radius: '0.375rem' },
  md: { height: '2.5rem', fontSize: '0.875rem', iconSize: '1.125rem', padding: '0 1rem', ccPadding: '0 0.75rem', gap: '0.5rem', radius: '0.5rem' },
  lg: { height: '3rem', fontSize: '1rem', iconSize: '1.375rem', padding: '0 1.25rem', ccPadding: '0 1rem', gap: '0.625rem', radius: '0.625rem' },
};
