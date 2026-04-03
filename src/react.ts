'use client';

import {
  useRef,
  useEffect,
  useCallback,
  createElement,
  type FC,
} from 'react';
import type { ClaudeCodeButtonOptions, CoworkButtonOptions } from './types';

export type { ClaudeCodeButtonOptions, CoworkButtonOptions };

export interface ClaudeCodeButtonProps extends ClaudeCodeButtonOptions {
  className?: string;
  style?: React.CSSProperties;
  /** Fired when command is copied. Also available via onCopy prop. */
  onCbCopy?: (e: CustomEvent<{ command: string }>) => void;
  onCbOpen?: (e: CustomEvent<{ command: string; fullCommand: string }>) => void;
  onCbClose?: (e: CustomEvent) => void;
}

export interface CoworkButtonProps extends CoworkButtonOptions {
  className?: string;
  style?: React.CSSProperties;
  onCbCopy?: (e: CustomEvent<{ command: string }>) => void;
  onCbDownload?: (e: CustomEvent<{ url: string }>) => void;
  onCbOpen?: (e: CustomEvent<{ command: string }>) => void;
  onCbClose?: (e: CustomEvent) => void;
}

function useIsClient() {
  const ref = useRef(false);
  useEffect(() => { ref.current = true; }, []);
  return ref;
}

export const ClaudeCodeButton: FC<ClaudeCodeButtonProps> = ({
  command,
  theme = 'branded',
  size = 'md',
  variant = 'filled',
  shape = 'rounded',
  popup = true,
  promptFlag = true,
  autoLaunch,
  onCopy,
  popupTitle,
  popupDescription,
  className,
  style,
  onCbCopy,
  onCbOpen,
  onCbClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLElement | null>(null);
  const isClient = useIsClient();

  const cbCopyRef = useRef(onCbCopy);
  cbCopyRef.current = onCbCopy;
  const cbOpenRef = useRef(onCbOpen);
  cbOpenRef.current = onCbOpen;
  const cbCloseRef = useRef(onCbClose);
  cbCloseRef.current = onCbClose;

  useEffect(() => {
    if (!containerRef.current) return;

    import('./claude-code-button').then(({ ClaudeCodeButton: Cls }) => {
      if (!containerRef.current || elRef.current) return;

      const el = document.createElement('claude-code-button');
      elRef.current = el;

      el.addEventListener('cb-copy', ((e: Event) => cbCopyRef.current?.(e as CustomEvent)) as EventListener);
      el.addEventListener('cb-open', ((e: Event) => cbOpenRef.current?.(e as CustomEvent)) as EventListener);
      el.addEventListener('cb-close', ((e: Event) => cbCloseRef.current?.(e as CustomEvent)) as EventListener);

      containerRef.current.appendChild(el);
    });

    return () => {
      const el = elRef.current;
      const container = containerRef.current;
      if (el && container?.contains(el)) {
        container.removeChild(el);
      }
      elRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !('options' in el)) return;

    (el as any).options = {
      command,
      theme,
      size,
      variant,
      shape,
      popup,
      promptFlag,
      autoLaunch,
      onCopy,
      popupTitle,
      popupDescription,
    };
  }, [command, theme, size, variant, shape, popup, promptFlag, autoLaunch, onCopy, popupTitle, popupDescription]);

  return createElement('div', {
    ref: containerRef,
    className,
    style: { display: 'inline-block', ...style },
    suppressHydrationWarning: true,
  });
};

export const CoworkButton: FC<CoworkButtonProps> = ({
  command,
  skillUrl,
  theme = 'branded',
  size = 'md',
  variant = 'filled',
  shape = 'rounded',
  popup = true,
  autoLaunch,
  onCopy,
  onDownload,
  popupTitle,
  popupDescription,
  className,
  style,
  onCbCopy,
  onCbDownload,
  onCbOpen,
  onCbClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLElement | null>(null);

  const cbCopyRef = useRef(onCbCopy);
  cbCopyRef.current = onCbCopy;
  const cbDownloadRef = useRef(onCbDownload);
  cbDownloadRef.current = onCbDownload;
  const cbOpenRef = useRef(onCbOpen);
  cbOpenRef.current = onCbOpen;
  const cbCloseRef = useRef(onCbClose);
  cbCloseRef.current = onCbClose;

  useEffect(() => {
    if (!containerRef.current) return;

    import('./cowork-button').then(({ CoworkButton: Cls }) => {
      if (!containerRef.current || elRef.current) return;

      const el = document.createElement('cowork-button');
      elRef.current = el;

      el.addEventListener('cb-copy', ((e: Event) => cbCopyRef.current?.(e as CustomEvent)) as EventListener);
      el.addEventListener('cb-download', ((e: Event) => cbDownloadRef.current?.(e as CustomEvent)) as EventListener);
      el.addEventListener('cb-open', ((e: Event) => cbOpenRef.current?.(e as CustomEvent)) as EventListener);
      el.addEventListener('cb-close', ((e: Event) => cbCloseRef.current?.(e as CustomEvent)) as EventListener);

      containerRef.current.appendChild(el);
    });

    return () => {
      const el = elRef.current;
      const container = containerRef.current;
      if (el && container?.contains(el)) {
        container.removeChild(el);
      }
      elRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !('options' in el)) return;

    (el as any).options = {
      command,
      skillUrl,
      theme,
      size,
      variant,
      shape,
      popup,
      autoLaunch,
      onCopy,
      onDownload,
      popupTitle,
      popupDescription,
    };
  }, [command, skillUrl, theme, size, variant, shape, popup, autoLaunch, onCopy, onDownload, popupTitle, popupDescription]);

  return createElement('div', {
    ref: containerRef,
    className,
    style: { display: 'inline-block', ...style },
    suppressHydrationWarning: true,
  });
};
