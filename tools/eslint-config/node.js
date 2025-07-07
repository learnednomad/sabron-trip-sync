module.exports = {
  extends: ['./index.js'],
  env: {
    node: true,
    browser: false
  },
  rules: {
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-top-level-await': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
};
