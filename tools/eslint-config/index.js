module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' }
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type'
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-await-in-loop': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../../../*']
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json']
      }
    }
  },
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.turbo',
    '*.config.js',
    '*.config.ts',
    '.eslintrc.js',
    '**/*.d.ts'
  ]
};
