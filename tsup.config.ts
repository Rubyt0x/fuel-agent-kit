import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  outDir: 'dist',
  clean: true,
  esbuildOptions(options) {
    options.banner = {
      js: `"use strict";` // Ensures compatibility
    };
  },
});
