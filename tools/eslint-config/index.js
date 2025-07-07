module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended-legacy',
    'plugin:sonarjs/recommended-legacy',
    'plugin:unicorn/recommended',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'security',
    'sonarjs',
    'unicorn'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
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
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
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
    'security/detect-object-injection': 'off',
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
          camelCase: true
        }
      }
    ],
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-useless-undefined': 'off',
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
    sourceType: 'module',
    project: true,
    tsconfigRootDir: process.cwd()
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
