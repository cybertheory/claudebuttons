import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
  },
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'ClaudeButtons',
    outExtension: () => ({ js: '.global.js' }),
    minify: true,
    sourcemap: true,
  },
  {
    entry: ['src/react.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    minify: true,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  {
    entry: ['src/vue.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    minify: true,
    external: ['vue'],
  },
]);
