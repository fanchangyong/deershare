const autoprefixer = require('autoprefixer');

exports.babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: false,
  },
};

exports.styleLoader = {
  loader: 'style-loader',
  options: {
  },
};

exports.cssLoaderWithModules = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    localsConvention: 'camelCase',
    sourceMap: true,
    modules: {
      mode: 'local',
      localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[path][name]---[local]---[hash:base64:5]',
    },
  },
};

exports.cssLoaderWithoutModules = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
  },
};

exports.postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  },
};

exports.stylusLoader = {
  loader: 'stylus-loader',
  options: {
    sourceMap: true,
  },
};
