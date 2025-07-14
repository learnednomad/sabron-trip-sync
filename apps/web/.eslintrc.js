/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@sabron/eslint-config/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    'App.tsx',
    'vitest.config.puppeteer.ts',
    'src/test/**',
  ],
  rules: {
    'unicorn/filename-case': 'off',
    'no-console': 'warn',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};