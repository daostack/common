module.exports = {
  root: true,
  extends: [
    '@react-native-community/eslint-config',
    'eslint-config-prettier',
  ],
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-undef': 'off',
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': 0,
  },
};
