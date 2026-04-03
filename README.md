# claudebuttons

Drop-in **"Run on Claude Code"** and **"Run on Cowork"** buttons for any website or framework. Built as framework-agnostic Web Components with zero dependencies.

<p align="center">
  <a href="https://claudebuttons.vercel.app/" title="Open interactive demo">
    <img src="https://img.shields.io/static/v1?style=for-the-badge&label=Run+on&message=Claude+Code&color=d4795c&labelColor=d4795c" alt="Try Run on Claude Code — live demo">
  </a>
  &nbsp;
  <a href="https://claudebuttons.vercel.app/" title="Open interactive demo">
    <img src="https://img.shields.io/static/v1?style=for-the-badge&label=Run+on&message=Cowork&color=d4795c&labelColor=ffffff" alt="Try Run on Cowork — live demo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/claudebuttons?color=%23D4795C&label=npm" alt="npm version">
  <img src="https://img.shields.io/bundlephobia/minzip/claudebuttons?color=%23D4795C" alt="bundle size">
  <img src="https://img.shields.io/npm/l/claudebuttons?color=%23D4795C" alt="license">
</p>

---

## Install

```bash
npm install claudebuttons
```

**Or use the CDN** (no build step):

```html
<script src="https://unpkg.com/claudebuttons"></script>
```

---

## Quick Start

```html
<claude-code-button command="/my-skill --flag" theme="branded"></claude-code-button>
<cowork-button command="/my-skill" skill-url="https://example.com/skill.zip"></cowork-button>
```

---

## Framework Integration

### Vanilla HTML / CDN

```html
<script src="https://unpkg.com/claudebuttons"></script>

<claude-code-button command="/deploy --prod" theme="branded"></claude-code-button>
<cowork-button command="/review" theme="dark"></cowork-button>

<script>
  document.querySelector('claude-code-button')
    .addEventListener('cb-copy', (e) => console.log('Copied:', e.detail.command));
</script>
```

### React / Next.js

Use the dedicated React wrappers (handles SSR, hydration, and prop forwarding):

```tsx
import { ClaudeCodeButton, CoworkButton } from 'claudebuttons/react';

function App() {
  return (
    <>
      <ClaudeCodeButton
        command="/my-skill --flag"
        theme="branded"
        onCopy={(cmd) => console.log('Copied:', cmd)}
        onCbCopy={(e) => console.log('Event:', e.detail.command)}
      />
      <CoworkButton
        command="/code-review"
        skillUrl="https://example.com/skill.zip"
        theme="dark"
      />
    </>
  );
}
```

The React wrapper:
- Includes `'use client'` for Next.js App Router
- Handles SSR/hydration with `suppressHydrationWarning`
- Lazy-loads the Web Components to avoid SSR crashes
- Forwards both property callbacks (`onCopy`) and CustomEvent listeners (`onCbCopy`)

### Vue / Nuxt

**Option A: Vue Plugin (recommended)**

```ts
// main.ts
import { createApp } from 'vue';
import { ClaudeButtonsPlugin } from 'claudebuttons/vue';
import App from './App.vue';

const app = createApp(App);
app.use(ClaudeButtonsPlugin); // auto-configures isCustomElement
app.mount('#app');
```

```vue
<template>
  <claude-code-button
    command="/my-skill"
    theme="branded"
    @cb-copy="onCopy"
  />
  <cowork-button
    command="/review"
    theme="dark"
    @cb-download="onDownload"
  />
</template>

<script setup>
function onCopy(e) {
  console.log('Copied:', e.detail.command);
}
function onDownload(e) {
  console.log('Downloaded:', e.detail.url);
}
</script>
```

**Option B: Manual setup**

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            ['claude-code-button', 'cowork-button', 'claude-popup-dialog'].includes(tag),
        },
      },
    }),
  ],
};
```

```vue
<script setup>
import 'claudebuttons';
</script>

<template>
  <claude-code-button command="/my-skill" theme="branded" @cb-copy="onCopy" />
</template>
```

### Svelte / SvelteKit

```svelte
<script>
  import 'claudebuttons';

  function handleCopy(e) {
    console.log('Copied:', e.detail.command);
  }
</script>

<claude-code-button
  command="/my-skill"
  theme="branded"
  on:cb-copy={handleCopy}
/>
<cowork-button command="/review" theme="dark" />
```

### Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import 'claudebuttons';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}
```

```html
<!-- component.html -->
<claude-code-button
  command="/my-skill"
  theme="branded"
  (cb-copy)="onCopy($event)"
></claude-code-button>

<cowork-button
  command="/review"
  skill-url="https://example.com/skill.zip"
  theme="dark"
  (cb-download)="onDownload($event)"
></cowork-button>
```

### Solid

```tsx
import 'claudebuttons';

function App() {
  return (
    <>
      <claude-code-button
        command="/my-skill"
        theme="branded"
        on:cb-copy={(e) => console.log(e.detail.command)}
      />
      <cowork-button command="/review" theme="dark" />
    </>
  );
}
```

### Astro

```astro
---
---
<script>
  import 'claudebuttons';
</script>

<claude-code-button command="/my-skill" theme="branded" />
<cowork-button command="/review" theme="dark" />

<script>
  document.querySelector('claude-code-button')
    ?.addEventListener('cb-copy', (e) => console.log(e.detail.command));
</script>
```

### Programmatic JavaScript API

```js
import { createClaudeCodeButton, createCoworkButton } from 'claudebuttons';

const btn = createClaudeCodeButton({
  command: '/deploy --prod',
  theme: 'branded',
  onCopy: (cmd) => console.log('Copied:', cmd),
});

document.getElementById('container').appendChild(btn);
```

---

## Themes

| Theme | Description |
|-------|-------------|
| `branded` | Terracotta primary (`#D4795C`), white text **(default)** |
| `dark` | Dark surface, light text, terracotta accents |
| `light` | White surface, dark text, terracotta accents |
| `system` | Auto-switches between `light`/`dark` based on `prefers-color-scheme` |

## Sizes

| Size | Height |
|------|--------|
| `sm` | 2rem (32px at default font size) |
| `md` | 2.5rem (40px) **(default)** |
| `lg` | 3rem (48px) |

Sizes use `rem` units and scale with the user's browser font preferences.

---

## Events

All buttons dispatch native `CustomEvent`s with `bubbles: true` and `composed: true` (crosses Shadow DOM).

| Event | Detail | Fired when |
|-------|--------|------------|
| `cb-copy` | `{ command: string }` | Command copied to clipboard |
| `cb-open` | `{ command: string }` | Button clicked / popup opens |
| `cb-close` | — | Popup closed |
| `cb-download` | `{ url: string }` | Skill package downloaded (Cowork only) |

```js
el.addEventListener('cb-copy', (e) => {
  console.log('Copied:', e.detail.command);
});
```

---

## API Reference

### `<claude-code-button>` Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `command` | `string` | — | The skill/command to run |
| `theme` | `'branded' \| 'dark' \| 'light' \| 'system'` | `'branded'` | Theme variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `popup` | `'true' \| 'false'` | `'true'` | Show popup dialog on click |
| `prompt-flag` | `'true' \| 'false'` | `'true'` | Prepend `claude -p` to command |
| `popup-title` | `string` | `'Run on Claude Code'` | Custom popup title |
| `popup-description` | `string` | — | Custom popup description |

### `<cowork-button>` Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `command` | `string` | — | The slash command to run |
| `skill-url` | `string` | — | URL to downloadable skill package |
| `theme` | `'branded' \| 'dark' \| 'light' \| 'system'` | `'branded'` | Theme variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `popup` | `'true' \| 'false'` | `'true'` | Show popup dialog on click |
| `popup-title` | `string` | `'Run on Cowork'` | Custom popup title |
| `popup-description` | `string` | — | Custom popup description |

### JavaScript Exports

```ts
// Web Components + factories
import {
  ClaudeCodeButton,       // Web Component class
  CoworkButton,           // Web Component class
  createClaudeCodeButton, // Factory function
  createCoworkButton,     // Factory function
  showPopup,              // Show popup programmatically
  register,               // Manually register all custom elements
  registerClaudeCodeButton, // Register only claude-code-button
  registerCoworkButton,     // Register only cowork-button
} from 'claudebuttons';

// React wrappers (SSR-safe, includes 'use client')
import { ClaudeCodeButton, CoworkButton } from 'claudebuttons/react';

// Vue plugin
import { ClaudeButtonsPlugin } from 'claudebuttons/vue';

// Raw SVG icons
import { CLAUDE_CODE_ICON, COWORK_ICON } from 'claudebuttons';
```

### Explicit Registration

Registration happens automatically on import. For frameworks that need timing control:

```ts
import { register } from 'claudebuttons';

// Call when you're ready to register the custom elements
register();
```

Or register individually with custom tag names:

```ts
import { registerClaudeCodeButton, registerCoworkButton } from 'claudebuttons';

registerClaudeCodeButton('my-claude-btn');
registerCoworkButton('my-cowork-btn');
```

---

## Browser Support

Works in all browsers that support [Custom Elements v1](https://caniuse.com/custom-elementsv1):

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT
