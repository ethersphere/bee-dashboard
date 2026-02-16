// eslint-disable-next-line @typescript-eslint/no-var-requires
const Path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

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
      fallback: {
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        fs: require.resolve('browserify-fs'),
      },
    },
    devtool: 'source-map',
    externals: {
      // Use external version of React
      // react: 'root React',
      react: 'react',
      'react-dom': 'react-dom',
    },
    target: 'web',
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
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
          test: /\.scss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: ['base64-inline-loader'],
          type: 'javascript/auto',
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
