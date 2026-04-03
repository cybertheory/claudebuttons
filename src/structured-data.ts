/**
 * Generates JSON-LD structured data for all claudebuttons on the page.
 *
 * Crawlers and AI agents can use this to discover skills and commands
 * without executing JavaScript — call this after buttons are rendered
 * and inject the result into a <script type="application/ld+json"> tag.
 */
export interface ButtonMetadata {
  platform: 'claude-code' | 'cowork';
  command: string;
  fullCommand?: string;
}

export function discoverButtons(): ButtonMetadata[] {
  if (typeof document === 'undefined') return [];

  const results: ButtonMetadata[] = [];

  document.querySelectorAll('claude-code-button').forEach((el) => {
    const command = el.getAttribute('command') || '';
    const promptFlag = el.getAttribute('prompt-flag');
    const usePrompt = promptFlag !== 'false';
    const fullCommand = usePrompt ? `claude -p "${command}"` : command;

    results.push({
      platform: 'claude-code',
      command,
      fullCommand,
    });
  });

  document.querySelectorAll('cowork-button').forEach((el) => {
    const command = el.getAttribute('command') || '';

    results.push({
      platform: 'cowork',
      command,
    });
  });

  return results;
}

export function generateStructuredData(): object {
  const buttons = discoverButtons();
  if (buttons.length === 0) return {};

  const actions = buttons.map((btn) => {
    if (btn.platform === 'claude-code') {
      return {
        '@type': 'Action',
        name: `Run on Claude Code: ${btn.command}`,
        description: btn.command,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://claude.ai/code?command=${encodeURIComponent(btn.fullCommand || btn.command)}`,
          actionPlatform: 'https://claude.ai/code',
        },
        object: {
          '@type': 'SoftwareSourceCode',
          runtimePlatform: 'Claude Code',
          text: btn.fullCommand || btn.command,
        },
      };
    }

    const entry: Record<string, unknown> = {
      '@type': 'EntryPoint',
      actionPlatform: 'https://claude.ai/cowork',
      urlTemplate: `https://claude.ai/cowork?command=${encodeURIComponent(btn.command)}`,
    };

    return {
      '@type': 'Action',
      name: `Run on Cowork: ${btn.command}`,
      description: btn.command,
      target: entry,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    potentialAction: actions,
  };
}

/**
 * Injects a <script type="application/ld+json"> tag into the document head
 * with structured data for all claudebuttons on the page.
 *
 * Call after all buttons have been rendered to the DOM.
 */
export function injectStructuredData(): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector('script[data-claudebuttons-jsonld]');
  if (existing) existing.remove();

  const data = generateStructuredData();
  if (!data || !('potentialAction' in data)) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-claudebuttons-jsonld', '');
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}
