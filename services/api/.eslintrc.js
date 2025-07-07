module.exports = {
  extends: ['@sabron/eslint-config/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
