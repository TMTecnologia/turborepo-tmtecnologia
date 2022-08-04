module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'import',
    'prettier',
    'abcsize',
    'write-good-comments',
    'i18next',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@cspell/recommended',
    'plugin:abcsize/recommended',
    'plugin:i18next/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    complexity: ['error'],
    'no-console': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'write-good-comments/write-good-comments': 'warn',
    'prettier/prettier': ['error'],
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@|components)(/.*|$)', '@(acme|root|e2e)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.?(css)$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  overrides: [
    {
      files: ['*.md'],
      parser: 'eslint-plugin-markdownlint/parser',
      extends: ['plugin:markdownlint/recommended'],
      rules: {
        'markdownlint/md013': 'off',
        'prettier/prettier': 'off',
      },
    },
  ],
};
