module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': 'warn',
    'comma-dangle': 'warn',
    'space-before-function-paren': 'off',
    'object-shorthand': 'off'
  }
}
