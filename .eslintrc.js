module.exports = {
  root: true,
  extends: ['@react-native-community/eslint-config'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        prev: ['function', 'block', 'class', 'expression', 'const'],
        next: 'export',
      },
    ],
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 'error',
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': 0,
    'no-trailing-spaces': 1,
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx', '.tsx']}],
    'object-curly-spacing': 1,
    'object-curly-newline': 1,
    'arrow-parens': 1,
    'arrow-body-style': 1,
    'react/prop-types': 1,
  },
};
