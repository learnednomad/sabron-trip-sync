module.exports = {
  extends: [
    './index.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:tailwindcss/recommended'
  ],
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'tailwindcss'
  ],
  rules: {
    // Security-critical React rules
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': ['error', { 
      allowReferrer: false,
      enforceDynamicLinks: 'always'
    }],
    'react/no-unsafe': 'error',
    'react/no-deprecated': 'error',
    
    // Standard React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/jsx-uses-react': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.jsx', '.tsx'] }
    ],
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'enforce',
        custom: 'ignore', // Allow spreading in custom components (UI library components)
        explicitSpread: 'ignore',
        exceptions: ['Component']
      }
    ],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' }
    ],
    'react/self-closing-comp': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton']
      }
    ],
    'tailwindcss/classnames-order': 'error',
    'tailwindcss/no-custom-classname': 'off'
    // 'unicorn/filename-case': [
    //   'error',
    //   {
    //     cases: {
    //       kebabCase: true,
    //       pascalCase: true,
    //       camelCase: true
    //     },
    //     ignore: ['^\\[.*\\]\\.(jsx?|tsx?)$']
    //   }
    // ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'jsx-a11y': {
      components: {
        Button: 'button',
        Link: 'a'
      }
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
};
