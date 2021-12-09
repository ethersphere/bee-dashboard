'use strict'

module.exports = function (api) {
  const targets = '>1% and not ie 11 and not dead'
  api.cache(true)
  api.cacheDirectory = true

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets,
          modules: false,
        }
      ],
      ['@babel/preset-react', {runtime: 'automatic' }]
    ],
    plugins: [
      [
        "babel-plugin-tsconfig-paths",
        {
          "relative": true,
          "extensions": [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".es",
            ".es6",
            ".mjs"
          ],
          "rootDir": ".",
          "tsconfig": "tsconfig.lib.json",
        }
      ],
      "syntax-dynamic-import",
      '@babel/plugin-proposal-class-properties',
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          regenerator: true
        }
      ]
    ]
  }
}
