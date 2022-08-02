// eslint-disable-next-line @typescript-eslint/no-var-requires
const Path = require('path')

// eslint-disable-next-line import/no-anonymous-default-export
module.exports = () => {
  const entry = Path.resolve(__dirname, 'src', 'App.tsx')

  return {
    mode: 'production',
    entry,
    output: {
      path: Path.resolve(__dirname, 'lib'),
      filename: 'App.js',
      library: 'beeDashboard',
      libraryTarget: 'umd',
    },
    resolve: {
      extensions: ['.css', '.png', '.svg', '.ttf', '.ts', '.tsx', '.js'],
    },
    devtool: 'source-map',
    externals: {
      // Use external version of React
      // react: 'root React',
      react: 'react',
      'react-dom': 'react-dom',
    },
    target: 'web',
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            use: ['base64-inline-loader'],
            type: 'javascript/auto'
        },
        {
          test: /\.(ts|js|tsx|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  }
}
