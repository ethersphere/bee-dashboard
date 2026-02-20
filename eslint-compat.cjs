const js = require('@eslint/js')
const ts = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const prettier = require('eslint-config-prettier')
const importPlugin = require('eslint-plugin-import')
const pluginJest = require('eslint-plugin-jest')
const prettierPlugin = require('eslint-plugin-prettier')
const simpleImportSort = require('eslint-plugin-simple-import-sort')
const react = require('eslint-plugin-react')

module.exports = {
  js,
  ts,
  tsParser,
  prettier,
  importPlugin,
  pluginJest,
  prettierPlugin,
  simpleImportSort,
  react,
}
