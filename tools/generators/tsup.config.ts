import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  target: 'es2022',
  external: ['commander', 'chalk', 'inquirer', 'handlebars', 'fs-extra', 'glob', 'prettier'],
});