module.exports = {
  root: true,
  env: {
    browser: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // fix unused var error for JSX custom tags
    'vue/jsx-uses-vars': 2,
    'no-throw-literal': 0,

    'semi': ['error', 'always'],
    'indent': ['error', 4, {SwitchCase: 1}],
    'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
    }],
    'brace-style': ['error', 'stroustrup'],
    'operator-linebreak': ['error', 'before'],
    'eol-last': 'error',
    'no-new': 0,
    'no-else-return': 0,
    'padded-blocks': 0,
    'no-fallthrough': 'off',
    'default-case': 'error',
    'object-curly-spacing': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
