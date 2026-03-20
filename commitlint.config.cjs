module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 120],
    'header-max-length': [2, 'always', 160],
  },
}
