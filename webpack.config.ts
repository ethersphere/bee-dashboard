import Path from 'path'
import { Configuration } from 'webpack'

// eslint-disable-next-line import/no-anonymous-default-export
export default (): Configuration => {
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
          test: /\.(png|jp(e*)g|svg|gif)$/,
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]',
          },
        },
        {
          test: /\.(ttf)$/,
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name].[ext]',
          },
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
