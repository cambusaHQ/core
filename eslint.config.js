import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021, // Enable ES6/ES7+ syntax
      sourceType: 'module', // Use ES modules (import/export)
    },
  },
  pluginJs.configs.recommended, // ESLint recommended rules
  prettier, // Disable ESLint rules that conflict with Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Use single quotes
          semi: true, // Use semicolons at the end of lines
          arrowParens: 'always', // Use parentheses around arrow function arguments
        },
      ],
      'no-unused-vars': 'warn', // Warn for unused variables
      'no-console': 'off', // Allow console statements
    },
  },
];
