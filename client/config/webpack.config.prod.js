import {
  styleLoader,
  cssLoader,
  postcssLoader,
  stylusLoader,
  babelLoader,
} from './loaders';
const paths = require('./paths');

module.exports = {
  mode: 'production',
  entry: paths.appIndexJs,
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
  ],
  devServer: {
    contentBase: './build',
  },
};
