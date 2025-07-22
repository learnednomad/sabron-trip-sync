module.exports = {
  extends: ['@sabron/eslint-config'],
  ignorePatterns: ['src/types.ts'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};