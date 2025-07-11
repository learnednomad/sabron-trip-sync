import { defineConfig } from 'eslint-define-config';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: ['@sabron/eslint-config/react'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
    ],
  },
]);