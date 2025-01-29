module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'jsx-a11y', '@typescript-eslint'],
  rules: {
    'react/self-closing-comp': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 100,
        bracketSameLine: false,
        useTabs: false,
        arrowParens: 'always',
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img'],
        img: ['Image'],
      },
    ],
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    'react/display-name': 'off',
    'react/no-unknown-property': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-return': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      'babel-plugin-root-import': {
        paths: [
          {
            rootPathSuffix: 'src/@legacy',
            rootPathPrefix: '~/',
          },
          {
            rootPathSuffix: 'src/',
            rootPathPrefix: '@/',
          },
        ],
      },
    },
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'no-useless-catch': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'prettier/prettier': [
          'error',
          {
            trailingComma: 'es5',
            printWidth: 80,
            arrowParens: 'avoid',
            endOfLine: 'auto',
            tabWidth: 2,
            singleQuote: true,
            semi: true,
          },
        ],
      },
    },
  ],
};
