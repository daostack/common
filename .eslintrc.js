module.exports = {
  root: true,
  extends: ['@react-native-community/eslint-config'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': 1,
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': 0,
    'indent': ['error', 2],
    'no-trailing-spaces': 1,
    'react/jsx-filename-extension': [1,{ 'extensions': ['.js', '.jsx', '.tsx'] }],
    'object-curly-spacing': 1,
    'object-curly-newline': 1,
    'arrow-parens': 1,
    'arrow-body-style': 1,
	'react/prop-types': 1,
  },
};
