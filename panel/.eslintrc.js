module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['@s256/eslint-config-vue', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-const': 'error',
  },
}
