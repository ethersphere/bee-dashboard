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
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'BeeDashboard',
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: 'source-map',
    externals: ['react'],
    target: 'web',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jp(e*)g|svg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(ts|js|tsx|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/typescript', '@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.ttf$/,
          use: [
            {
              loader: 'ttf-loader',
              options: {
                name: './font/[hash].[ext]',
              },
            },
          ],
        },
      ],
    },
  }
}
