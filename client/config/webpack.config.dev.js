const {
  styleLoader,
  cssLoader,
  postcssLoader,
  stylusLoader,
  babelLoader,
} = require('./loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  entry: {
    index: paths.appIndexJs,
  },
  devtool: 'inline-source-map',
  output: {
    path: paths.appBuild,
    filename: '[name].bundle.js',
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
        use: [styleLoader, cssLoader, postcssLoader],
      },
      {
        test: /\.cm\.styl$/,
        use: [styleLoader, cssLoader, postcssLoader, stylusLoader],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello React',
      template: paths.appHtml,
    }),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
    },
  },
};
