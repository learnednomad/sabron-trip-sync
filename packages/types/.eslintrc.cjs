module.exports = {
  extends: ['@sabron/eslint-config'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // Allow any in type definitions
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};