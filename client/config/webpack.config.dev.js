const {
  styleLoader,
  cssLoaderWithoutModules,
  cssLoaderWithModules,
  postcssLoader,
  stylusLoader,
  babelLoader,
} = require('./loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const publicPath = '/static/js';

module.exports = {
  mode: 'development',
  entry: {
    index: paths.appIndexJs,
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: [/\.(js|jsx|mjs)$/],
        include: paths.appSrc,
        use: [babelLoader],
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoaderWithoutModules, postcssLoader],
      },
      {
        test: /\.cm\.styl$/,
        use: [styleLoader, cssLoaderWithModules, postcssLoader, stylusLoader],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '小鹿快传',
      template: paths.appHtml,
    }),
  ],
  devServer: {
    index: '',
    publicPath,
    proxy: {
      '/': {
        target: 'http://localhost:3001',
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
};
