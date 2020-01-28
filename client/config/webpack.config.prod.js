const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const {
  cssLoaderWithModules,
  cssLoaderWithoutModules,
  postcssLoader,
  stylusLoader,
  babelLoader,
} = require('./loaders');
const paths = require('./paths');

module.exports = {
  mode: 'production',
  entry: paths.appIndexJs,
  devtool: 'inline-source-map',
  output: {
    path: paths.appBuild,
    filename: 'index.bundle.js',
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
        use: [MiniCssExtractPlugin.loader, cssLoaderWithoutModules, postcssLoader],
      },
      {
        test: /\.cm\.styl$/,
        use: [MiniCssExtractPlugin.loader, cssLoaderWithModules, postcssLoader, stylusLoader],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            properties: true,
          },
        },
      }),
    ],
  },
  devServer: {
    contentBase: './build',
  },
};
