import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library
  {
    entry: {
      index: 'src/index.ts',
      'api/server': 'src/api/server.ts',
    },
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'node18',
    outDir: 'dist',
  },
  // CLI (with shebang)
  {
    entry: {
      'cli/index': 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'node18',
    outDir: 'dist',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
