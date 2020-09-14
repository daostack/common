module.exports = {
  root: true,
  extends: ['@react-native-community/eslint-config'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-shadow': 2,
    'indent': ['error', 2],
    'no-trailing-spaces': 2,
    'react/jsx-filename-extension': [2,{ 'extensions': ['.js', '.jsx', '.tsx'] }],
    'object-curly-spacing': 2,
    'object-curly-newline': 2,
    'arrow-parens': 2,
    'arrow-body-style': 2,
	  'react/prop-types': 2,
    'no-unused-vars': 2,
    'comma-dangle': 2,
    'no-undef': 2,
    'react/state-in-constructor': 2,
    'no-restricted-syntax': 2,
    'no-dupe-keys': 2,
    'quotes': 2,
    'semi': 2,
    'eol-last': 2,
    'no-template-curly-in-string': 2,
    'no-restricted-globals': 2,
    
    ///// rules that cause warning (warning # to the right)
    'space-before-blocks': 0, // ~1
    'react/prefer-stateless-function': 0, // ~1
    'vars-on-top': 0, // ~1
    'no-useless-concat': 0, // ~1
    'key-spacing': 0, // ~1
    'react/jsx-props-no-multi-spaces': 0, // ~1
    'prefer-arrow-callback': 0, // ~1
    'rest-spread-spacing': 0, // ~1
    'no-empty': 0, // ~1
    'no-multiple-empty-lines': 0, // ~2
    'max-classes-per-file': 0, // ~ 2
     'no-plusplus': 0, // ~2
    'no-useless-catch': 0, // ~ 2
    'array-callback-return': 0, // ~3
    'arrow-spacing': 0, // ~3
    'no-unneeded-ternary': 0, // ~3
    'react/jsx-first-prop-new-line': 0, // ~3
    'default-case': 0, // ~3
    'no-continue': 0, // ~3
    'no-lonely-if': 0, // ~3
    'react/display-name': 0, // ~4
    'react/jsx-key': 0, // ~4
    'no-param-reassign': 0, //~ 5
    'no-empty-function': 0, // ~5
    'react/no-unescaped-entities': 0, // ~5
    'guard-for-in': 0, // ~5
    'no-var': 0, // ~5
    'react/jsx-wrap-multilines': 0, // ~6
    'react/sort-comp': 0, // ~7
    'no-useless-constructor': 0, // ~7
    'no-else-return': 0, // ~8
    'react/jsx-curly-spacing': 0, // ~8
    'block-spacing': 0, // ~11
    'no-multi-spaces': 0, // ~11
    'no-return-await': 0, // ~11
    'no-nested-ternary': 0, // ~12
    'no-throw-literal': 0, // ~12
    'react/no-array-index-key': 0, // ~12
    'react/jsx-equals-spacing': 0, // ~13
    'no-underscore-dangle': 0, // ~14
    'space-in-parens': 0, // ~15
    'react/static-property-placement': 0, // ~15
    'operator-linebreak': 0, // ~16
    'react-hooks/exhaustive-deps': 0, // ~16
    'implicit-arrow-linebreak': 0, // ~16
    'comma-spacing': 0, // ~18
    'prefer-destructuring': 0, // ~18
    'react/jsx-curly-newline': 0, // ~19
    'brace-style': 0, // ~19
    'react/no-unused-state': 0, // ~20
    'prefer-template': 0, // ~20
    'no-unused-expressions': 0, // ~24
    'react/jsx-curly-brace-presence': 0, // ~25
    'consistent-return': 0, // 26
    'react/jsx-tag-spacing': 0, // 28
    'react/jsx-closing-tag-location': 0, // ~29
    'global-require': 0, // ~30
    'class-methods-use-this': 0, // ~36
    'array-bracket-spacing': 0, // ~38
    'object-shorthand': 0, // ~47
    'spaced-comment': 0, // ~49
    'prefer-const': 0, // ~53
    'lines-between-class-members': 0, // ~57
    'function-paren-newline': 0, // ~99
    'react/jsx-boolean-value': 0, // ~110
    'react/destructuring-assignment': 0, // ~143
    'react/forbid-prop-types': 0, // 151
    'import/prefer-default-export': 0, // ~161
    'import/no-named-as-default-member': 0, // ~161
    'react/jsx-one-expression-per-line': 0, // ~281
    'object-property-newline': 0, // ~295
    'react/require-default-props': 0, // 337
    'max-len': 0, // ~382
    'react/jsx-closing-bracket-location': 0, // ~258 
    'no-use-before-define': 0, // ~633
     'react/jsx-indent-props': 0, // ~1547
    'react/jsx-indent': 0, // ~1698
    'prettier/prettier': 0, // ~1851
    'padded-blocks': 0, // ~2330
    'quote-props': 0, // ~4911
    'no-await-in-loop': 0,

    'no-return-assign': 0, // ~1
    'react/no-unused-prop-types': 0, // ~1
    'new-cap': 0, // ~1
    'operator-assignment': 0, // ~1
    'import/no-named-as-default': 0, // ~1
    'react/forbid-foreign-prop-types': 0, // ~1
    'react/no-typos': 0, // ~2
    'no-empty-pattern': 0, // ~3
    'import/no-useless-path-segments': 0, // ~3
    'func-names': 0, // ~3
    'no-console': 0, // ~8
    'import/no-duplicates': 0, // ~8
    'react/jsx-props-no-spreading': 0, // ~13
    /*
    airbnb & it's plugins specific
    'import/no-cycle': 0, // ~161    
    'import/first': 0, // ~5
    'import/named': 0, // ~5
    'import/no-useless-path-segments': 0, // ~3
    'import/newline-after-import': 0, // ~25
    'import/no-extraneous-dependencies': 0, // ~110
    'import/order': 0, // ~222
    'import/extensions': 0, // ~355
    'import/no-unresolved': 0, // ~379
    */
    
    
    
    
    
    
    

    
    
    
  },
};
