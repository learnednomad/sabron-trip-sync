module.exports = {
  extends: ['@sabron/eslint-config'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-useless-escape': 'off',
  },
  ignorePatterns: [
    'src/__tests__/**/*',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};